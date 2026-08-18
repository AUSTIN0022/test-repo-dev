'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Building2,
  Search,
  Plus,
  Share2,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  RefreshCw,
  X,
  ChevronRight,
} from 'lucide-react'

interface PropertyInventoryViewProps {
  onOpenShareModal: (leadId?: string, propertyId?: string) => void
}

export default function PropertyInventoryView({ onOpenShareModal }: PropertyInventoryViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const search = searchParams.get('search') || ''
  const typeFilter = searchParams.get('type') || 'all'
  const statusFilter = searchParams.get('status') || 'all'

  const [showAddModal, setShowAddModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newType, setNewType] = useState('apartment')
  const [newAddress, setNewAddress] = useState('Golf Course Extension Road')
  const [newCity, setNewCity] = useState('Gurgaon')
  const [newBedrooms, setNewBedrooms] = useState('3')
  const [newSqft, setNewSqft] = useState('1850')

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/properties?${params.toString()}`)
  }

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (typeFilter !== 'all') params.append('type', typeFilter)
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const res = await fetch(`/api/properties?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        setProperties(data.properties)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [search, typeFilter, statusFilter])

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newPrice) return
    try {
      await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          price: parseInt(newPrice, 10),
          propertyType: newType,
          address: newAddress,
          city: newCity,
          bedrooms: parseInt(newBedrooms, 10),
          sqft: parseInt(newSqft, 10),
          imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
        }),
      })
      setShowAddModal(false)
      fetchProperties()
    } catch (err) {
      console.error(err)
    }
  }

  const formatPrice = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`
    return `₹${amount.toLocaleString()}`
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-zinc-950 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" /> Property Inventory
          </h2>
          <p className="text-xs text-zinc-500">Manage real estate listings & 1-click share with leads.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow-sm hover:shadow-md active:scale-95 transition-all duration-200"
        >
          <Plus className="w-4 h-4" /> Add Listing
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by title, location, developer..."
            value={search}
            onChange={(e) => updateFilters('search', e.target.value)}
            className="w-full bg-white/90 border border-zinc-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 shadow-xs focus:outline-none focus:border-zinc-950"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => updateFilters('type', e.target.value)}
          className="bg-white border border-zinc-200/90 rounded-xl px-3 py-2.5 text-xs text-zinc-800 font-semibold focus:outline-none focus:border-zinc-950 shadow-xs"
        >
          <option value="all">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
          <option value="rental">Rental</option>
        </select>
      </div>

      {/* Property Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-zinc-400 flex flex-col items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-zinc-950" />
          Loading Property Inventory...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="antigravity-card overflow-hidden group flex flex-col"
            >
              {/* Cover Image & Badges */}
              <div
                onClick={() => router.push(`/properties/${prop.id}`)}
                className="cursor-pointer relative h-48 w-full bg-zinc-100 overflow-hidden"
              >
                <img
                  src={prop.images?.[0]?.pathname || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200'}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="pastel-badge-blue text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                    {prop.propertyType}
                  </span>
                  <span className="pastel-badge-green text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                    {prop.status}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-zinc-200/90 font-mono text-zinc-950 font-black text-sm shadow-sm">
                  {formatPrice(prop.price)}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => router.push(`/properties/${prop.id}`)}
                    className="cursor-pointer font-black text-zinc-950 text-base group-hover:text-blue-700 transition-colors truncate"
                  >
                    {prop.title}
                  </h3>
                  <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-zinc-600" /> {prop.address}, {prop.city}
                  </p>
                </div>

                {/* Specs Pill */}
                <div className="flex items-center gap-3 text-xs text-zinc-800 bg-zinc-50/80 p-2.5 rounded-xl border border-zinc-200/80 font-semibold">
                  <div className="flex items-center gap-1">
                    <BedDouble className="w-3.5 h-3.5 text-blue-600" /> {prop.bedrooms} BHK
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5 text-emerald-600" /> {prop.bathrooms} Baths
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="w-3.5 h-3.5 text-purple-600" /> {prop.sqft} sq.ft
                  </div>
                </div>

                {/* Card Action */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                  <button
                    onClick={() => router.push(`/properties/${prop.id}`)}
                    className="text-xs font-bold text-zinc-900 hover:text-blue-700 flex items-center gap-1 transition-colors"
                  >
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenShareModal(undefined, prop.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold shadow-xs active:scale-95 transition-all duration-200"
                  >
                    <Share2 className="w-3.5 h-3.5 text-blue-400" /> 1-Click Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddProperty}
            className="bg-white border border-zinc-200/90 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-950">Add New Property Listing</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-zinc-900 text-xs">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-700 font-bold block mb-1">Property Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DLF Phase 5 Luxury Penthouse"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:border-zinc-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-700 font-bold block mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 25000000"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:border-zinc-950"
                  />
                </div>
                <div>
                  <label className="text-zinc-700 font-bold block mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:border-zinc-950"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="plot">Plot</option>
                    <option value="commercial">Commercial</option>
                    <option value="rental">Rental</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-700 font-bold block mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={newBedrooms}
                    onChange={(e) => setNewBedrooms(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:border-zinc-950"
                  />
                </div>
                <div>
                  <label className="text-zinc-700 font-bold block mb-1">Sq.Ft Area</label>
                  <input
                    type="number"
                    value={newSqft}
                    onChange={(e) => setNewSqft(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:border-zinc-950"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-bold hover:bg-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-zinc-950 text-white font-bold text-xs shadow-xs hover:bg-zinc-800"
              >
                Save Property
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

