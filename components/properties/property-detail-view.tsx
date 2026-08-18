'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Building2,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Share2,
  RefreshCw,
  Check,
  Calendar,
} from 'lucide-react'

interface PropertyDetailViewProps {
  propertyId: string
  onOpenShareModal: (leadId?: string, propertyId?: string) => void
}

export default function PropertyDetailView({ propertyId, onOpenShareModal }: PropertyDetailViewProps) {
  const router = useRouter()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchProperty = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/properties/${propertyId}`)
      const data = await res.json()
      if (data.property) {
        setProperty(data.property)
      } else if (data.id || data.title) {
        setProperty(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperty()
  }, [propertyId])

  if (loading || !property) {
    return (
      <div className="py-20 text-center text-xs text-zinc-400 flex flex-col items-center gap-2">
        <RefreshCw className="w-6 h-6 animate-spin text-zinc-900" />
        Loading Property Listing Details...
      </div>
    )
  }

  const formatPrice = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`
    return `₹${amount.toLocaleString()}`
  }

  const images = property.images?.length > 0 ? property.images : [
    { id: '1', pathname: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200' },
    { id: '2', pathname: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200' },
  ]

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/properties')}
          className="flex items-center gap-1 text-xs font-bold text-zinc-600 hover:text-zinc-950 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </button>
        <span className="text-[10px] text-zinc-400 font-mono">ID: {property.id}</span>
      </div>

      {/* Property Title & Price Card */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-zinc-900 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-zinc-900">
                {property.propertyType}
              </span>
              <span className="bg-emerald-50 text-emerald-900 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-emerald-200">
                {property.status}
              </span>
            </div>
            <h1 className="text-lg font-black text-zinc-950">{property.title}</h1>
            <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-700" /> {property.address}, {property.city}, {property.state}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-2xl font-black text-zinc-950 font-mono block">{formatPrice(property.price)}</span>
            <span className="text-[10px] text-zinc-500 font-medium">{property.developer || 'DLF Developers'}</span>
          </div>
        </div>

        {/* Specs Ribbon */}
        <div className="flex items-center gap-4 bg-zinc-50 p-3 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-900">
          <div className="flex items-center gap-1.5">
            <BedDouble className="w-4 h-4 text-zinc-700" /> {property.bedrooms} Bedrooms
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-zinc-700" /> {property.bathrooms} Bathrooms
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize className="w-4 h-4 text-zinc-700" /> {property.sqft} sq.ft
          </div>
        </div>
      </div>

      {/* Property Photo Gallery */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-zinc-950 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-zinc-900" /> Photo Gallery ({images.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {images.map((img: any) => (
            <img
              key={img.id}
              src={img.pathname}
              alt={property.title}
              className="w-full h-48 object-cover rounded-xl border border-zinc-200 shadow-xs"
            />
          ))}
        </div>
      </div>

      {/* Description & Features */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-zinc-950">Description & Key Highlights</h3>
        <p className="text-xs text-zinc-700 leading-relaxed font-medium">
          {property.description || 'Luxury residence featuring premium wooden flooring, floor-to-ceiling double-glazed windows, modular Italian kitchen, and scenic skyline views.'}
        </p>

        <div className="pt-2 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-800 font-medium">
            <Check className="w-3.5 h-3.5 text-emerald-600" /> Italian Marble Flooring
          </div>
          <div className="flex items-center gap-1.5 text-zinc-800 font-medium">
            <Check className="w-3.5 h-3.5 text-emerald-600" /> 24x7 Power Backup
          </div>
          <div className="flex items-center gap-1.5 text-zinc-800 font-medium">
            <Check className="w-3.5 h-3.5 text-emerald-600" /> Clubhouse & Pool
          </div>
          <div className="flex items-center gap-1.5 text-zinc-800 font-medium">
            <Check className="w-3.5 h-3.5 text-emerald-600" /> 3 Dedicated Car Parks
          </div>
          <div className="flex items-center gap-1.5 text-zinc-800 font-medium">
            <Check className="w-3.5 h-3.5 text-emerald-600" /> Gated 3-Tier Security
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onOpenShareModal(undefined, property.id)}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs active:scale-95 transition"
        >
          <Share2 className="w-4 h-4" /> 1-Click Share Brochure & Photos
        </button>
      </div>
    </div>
  )
}
