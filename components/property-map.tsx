'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

type MapProperty = {
  id: string
  title: string
  city: string
  state: string
  price: number
  bedrooms: number
  bathrooms: string
  sqft: number
  latitude?: number | null
  longitude?: number | null
}

const icon = L.divIcon({
  className: 'haven-map-pin',
  html: '<span></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

function FitBounds({ properties }: { properties: MapProperty[] }) {
  const map = useMap()
  useEffect(() => {
    const points = properties
      .filter((property) => property.latitude != null && property.longitude != null)
      .map((property) => [property.latitude as number, property.longitude as number] as [number, number])

    if (points.length === 1) map.setView(points[0], 12)
    if (points.length > 1) map.fitBounds(points, { padding: [36, 36] })
  }, [map, properties])

  return null
}

export function PropertyMap({ properties, onSelect }: { properties: MapProperty[]; onSelect?: (property: MapProperty) => void }) {
  const located = properties.filter((property) => property.latitude != null && property.longitude != null)
  const center: [number, number] = located.length
    ? [located[0].latitude as number, located[0].longitude as number]
    : [34.0901, -118.291]

  return (
    <div className="relative h-[520px] overflow-hidden rounded-3xl border border-border bg-secondary/30">
      <MapContainer center={center} zoom={10} scrollWheelZoom className="z-0 size-full">
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds properties={located} />
        {located.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude as number, property.longitude as number]}
            icon={icon}
          >
            <Popup>
              <div className="min-w-44">
                <p className="font-serif text-lg font-semibold">{property.title}</p>
                <p className="text-xs text-muted-foreground">{property.city}, {property.state}</p>
                <p className="mt-2 font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(property.price)}</p>
                <button className="mt-3 text-xs font-semibold text-primary underline" onClick={() => onSelect?.(property)}>
                  View details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {located.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-6">
          <div className="rounded-2xl border border-border bg-card/95 px-5 py-4 text-center shadow-lg">
            <p className="font-serif text-xl font-semibold">Map coordinates coming soon</p>
            <p className="mt-1 text-sm text-muted-foreground">Add latitude and longitude to a listing to place it here.</p>
          </div>
        </div>
      )}
    </div>
  )
}
