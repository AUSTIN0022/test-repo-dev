'use client'

import { useEffect, useState } from 'react'
import { Check, FileText, ImagePlus, Upload, X } from 'lucide-react'
import { PropertyDetail } from './property-detail-modal'

export function PropertyEditModal({
  property,
  isOpen,
  onClose,
  onUpdated,
}: {
  property: PropertyDetail | null
  isOpen: boolean
  onClose: () => void
  onUpdated: (updated: PropertyDetail) => void
}) {
  const [form, setForm] = useState({
    title: '',
    propertyType: 'Single family',
    listingType: 'For sale',
    status: 'published',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    latitude: '',
    longitude: '',
    publicLocationPrecision: 'approximate',
    price: '',
    currency: 'USD',
    bedrooms: '3',
    bathrooms: '2',
    sqft: '',
    lotSqft: '',
    yearBuilt: '',
    description: '',
    publicNotes: '',
    internalNotes: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    featuresText: '',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (property) {
      setForm({
        title: property.title || '',
        propertyType: property.propertyType || 'Single family',
        listingType: property.listingType || 'For sale',
        status: property.status || 'published',
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        postalCode: property.postalCode || '',
        latitude: property.latitude != null ? String(property.latitude) : '',
        longitude: property.longitude != null ? String(property.longitude) : '',
        publicLocationPrecision: (property as any).publicLocationPrecision || 'approximate',
        price: property.price ? String(property.price) : '',
        currency: (property as any).currency || 'USD',
        bedrooms: property.bedrooms ? String(property.bedrooms) : '3',
        bathrooms: property.bathrooms ? String(property.bathrooms) : '2',
        sqft: property.sqft ? String(property.sqft) : '',
        lotSqft: property.lotSqft ? String(property.lotSqft) : '',
        yearBuilt: property.yearBuilt ? String(property.yearBuilt) : '',
        description: property.description || '',
        publicNotes: property.publicNotes || '',
        internalNotes: property.internalNotes || '',
        contactName: (property as any).contactName || '',
        contactPhone: (property as any).contactPhone || '',
        contactEmail: (property as any).contactEmail || '',
        featuresText: property.features ? property.features.join(', ') : '',
      })
    }
  }, [property])

  if (!isOpen || !property) return null

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!property) return
    setSaving(true)
    setError('')

    try {
      const features = form.featuresText
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean)

      const res = await fetch(`/api/properties/${property.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          features,
        }),
      })

      const updated = await res.json()
      if (!res.ok) throw new Error(updated.error || 'Failed to update property')

      onUpdated(updated)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Error updating property')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-4 backdrop-blur-md">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold">Edit Property Details</h2>
            <p className="text-xs text-muted-foreground">Update listing attributes, pricing, and features.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-muted" aria-label="Close edit modal">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-destructive/10 p-3 text-xs font-semibold text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2 text-xs font-semibold text-muted-foreground">
              Property Title *
              <input
                required
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="text-xs font-semibold text-muted-foreground">
              Property Type
              <select
                value={form.propertyType}
                onChange={(e) => update('propertyType', e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
              >
                <option>Single family</option>
                <option>Condo</option>
                <option>Townhome</option>
                <option>Desert home</option>
                <option>Land</option>
                <option>Commercial</option>
              </select>
            </label>

            <label className="text-xs font-semibold text-muted-foreground">
              Listing Status
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="published">Active / Published</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </label>

            <label className="sm:col-span-2 text-xs font-semibold text-muted-foreground">
              Address *
              <input
                required
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="text-xs font-semibold text-muted-foreground">
              City *
              <input
                required
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="text-xs font-semibold text-muted-foreground">
              State *
              <input
                required
                value={form.state}
                onChange={(e) => update('state', e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="text-xs font-semibold text-muted-foreground">
              Price ($) *
              <input
                required
                type="number"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="text-xs font-semibold text-muted-foreground">
              Public Location Precision
              <select
                value={form.publicLocationPrecision}
                onChange={(e) => update('publicLocationPrecision', e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="exact">Exact Location</option>
                <option value="approximate">Approximate Area</option>
                <option value="hidden">Hidden</option>
              </select>
            </label>

            <label className="text-xs font-semibold text-muted-foreground">
              Bedrooms
              <input
                type="number"
                value={form.bedrooms}
                onChange={(e) => update('bedrooms', e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="text-xs font-semibold text-muted-foreground">
              Bathrooms
              <input
                type="number"
                step="0.5"
                value={form.bathrooms}
                onChange={(e) => update('bathrooms', e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="text-xs font-semibold text-muted-foreground">
              Latitude
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => update('latitude', e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="text-xs font-semibold text-muted-foreground">
              Longitude
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => update('longitude', e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="sm:col-span-2 text-xs font-semibold text-muted-foreground">
              Features (Comma Separated)
              <input
                value={form.featuresText}
                onChange={(e) => update('featuresText', e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="sm:col-span-2 text-xs font-semibold text-muted-foreground">
              Description
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="sm:col-span-2 text-xs font-semibold text-muted-foreground">
              Internal Team Notes (Private)
              <textarea
                rows={2}
                value={form.internalNotes}
                onChange={(e) => update('internalNotes', e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
              />
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-border py-3 text-sm font-semibold hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {saving ? 'Updating…' : <><Check size={16} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
