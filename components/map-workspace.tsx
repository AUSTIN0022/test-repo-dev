'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Home, List, Map as MapIcon, RefreshCw, Search, SlidersHorizontal } from 'lucide-react'
import dynamic from 'next/dynamic'
import { FilterModal, FilterOptions } from './filter-modal'
import { PropertyDetail, PropertyDetailModal } from './property-detail-modal'

const PropertyMap = dynamic(() => import('./property-map').then((module) => module.PropertyMap), {
  ssr: false,
  loading: () => <div className="h-[580px] rounded-3xl border border-border bg-secondary/30 animate-pulse" />,
})

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

export default function MapWorkspace() {
  const [properties, setProperties] = useState<PropertyDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<'split' | 'map'>('split')
  const [selectedProperty, setSelectedProperty] = useState<PropertyDetail | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: 'All',
    listingType: 'All',
    status: 'All',
  })

  async function fetchMapListings() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query.trim()) params.set('q', query.trim())
      if (filters.minPrice) params.set('minPrice', filters.minPrice)
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
      if (filters.bedrooms) params.set('bedrooms', filters.bedrooms)
      if (filters.propertyType !== 'All') params.set('propertyType', filters.propertyType)
      if (filters.listingType !== 'All') params.set('listingType', filters.listingType)
      if (filters.status !== 'All') params.set('status', filters.status)

      const res = await fetch(`/api/properties?${params.toString()}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setProperties(data)
      }
    } catch {
      // error state fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMapListings()
    }, 300)
    return () => clearTimeout(timer)
  }, [query, filters])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-10">
          <a href="/" className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft size={16} /> Back to Hub Workspace
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold hover:border-primary"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>

            <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
              <button
                onClick={() => setMode('split')}
                className={`rounded-lg p-2 transition ${mode === 'split' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                aria-label="Show map and list split view"
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setMode('map')}
                className={`rounded-lg p-2 transition ${mode === 'map' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                aria-label="Show full map view"
              >
                <MapIcon size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Spatial Visualization</p>
            <h1 className="mt-1 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Map Inventory</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative min-w-72">
              <Search size={17} className="absolute left-3.5 top-3.5 text-muted-foreground" />
              <input
                aria-label="Search map listings"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city, address, or home"
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <button
              onClick={fetchMapListings}
              className="flex size-10 items-center justify-center rounded-xl border border-border bg-card hover:bg-muted"
              title="Refresh Map Data"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        <div className={`grid gap-6 ${mode === 'split' ? 'lg:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.4fr)]' : ''}`}>
          {/* Sidebar List View */}
          <aside className={`${mode === 'map' ? 'hidden' : 'space-y-3 max-h-[580px] overflow-y-auto pr-1'}`}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {properties.length} {properties.length === 1 ? 'Home' : 'Homes'} Found
              </p>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-muted-foreground">Loading listings…</div>
            ) : properties.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                <p className="font-serif text-lg font-semibold">No map listings match</p>
                <p className="mt-1 text-xs text-muted-foreground">Try clearing filters or searching another area.</p>
              </div>
            ) : (
              properties.map((property) => (
                <article
                  key={property.id}
                  onClick={() => setSelectedProperty(property)}
                  className="cursor-pointer rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-lg font-semibold">{property.title}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {property.city}, {property.state}
                      </p>
                    </div>
                    <Home size={17} className="text-primary shrink-0" />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                    <span className="font-semibold text-foreground">{formatMoney(property.price)}</span>
                    <span>{property.bedrooms} beds · {property.bathrooms} baths</span>
                    <span>{property.sqft.toLocaleString()} sqft</span>
                  </div>
                </article>
              ))
            )}
          </aside>

          {/* Interactive Leaflet Map */}
          <PropertyMap
            properties={properties}
            onSelect={(prop) => {
              const matched = properties.find((p) => p.id === prop.id)
              if (matched) setSelectedProperty(matched)
            }}
          />
        </div>
      </section>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApply={(updated) => setFilters(updated)}
        onReset={() => setFilters({ minPrice: '', maxPrice: '', bedrooms: '', propertyType: 'All', listingType: 'All', status: 'All' })}
      />
    </main>
  )
}
