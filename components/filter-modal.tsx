'use client'

import { useState } from 'react'
import { RotateCcw, SlidersHorizontal, X } from 'lucide-react'

export type FilterOptions = {
  minPrice: string
  maxPrice: string
  bedrooms: string
  propertyType: string
  listingType: string
  status: string
}

export function FilterModal({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
}: {
  isOpen: boolean
  onClose: () => void
  filters: FilterOptions
  onApply: (filters: FilterOptions) => void
  onReset: () => void
}) {
  const [local, setLocal] = useState<FilterOptions>(filters)

  if (!isOpen) return null

  const update = (key: keyof FilterOptions, value: string) => {
    setLocal((prev) => ({ ...prev, [key]: value }))
  }

  function handleReset() {
    const empty: FilterOptions = {
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      propertyType: 'All',
      listingType: 'All',
      status: 'All',
    }
    setLocal(empty)
    onReset()
    onClose()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onApply(local)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <SlidersHorizontal size={20} />
            </span>
            <div>
              <h2 className="font-serif text-2xl font-semibold">Filter Properties</h2>
              <p className="text-xs text-muted-foreground">Narrow down your inventory by key attributes.</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-muted" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price Range ($)</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min price ($)"
                value={local.minPrice}
                onChange={(e) => update('minPrice', e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              />
              <input
                type="number"
                placeholder="Max price ($)"
                value={local.maxPrice}
                onChange={(e) => update('maxPrice', e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Minimum Bedrooms</label>
            <div className="flex gap-2">
              {['Any', '1', '2', '3', '4', '5+'].map((beds) => {
                const val = beds === 'Any' ? '' : beds.replace('+', '')
                const selected = local.bedrooms === val
                return (
                  <button
                    key={beds}
                    type="button"
                    onClick={() => update('bedrooms', val)}
                    className={`flex-1 rounded-xl border py-2 text-xs font-semibold transition ${
                      selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:bg-muted'
                    }`}
                  >
                    {beds}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Property Type</label>
              <select
                value={local.propertyType}
                onChange={(e) => update('propertyType', e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="All">All Types</option>
                <option value="Single family">Single Family</option>
                <option value="Condo">Condo</option>
                <option value="Townhome">Townhome</option>
                <option value="Desert home">Desert Home</option>
                <option value="Land">Land</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Listing Type</label>
              <select
                value={local.listingType}
                onChange={(e) => update('listingType', e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="All">All Listings</option>
                <option value="For sale">For Sale</option>
                <option value="For rent">For Rent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Listing Status</label>
            <select
              value={local.status}
              onChange={(e) => update('status', e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="All">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-4 py-3 text-xs font-semibold hover:bg-muted"
            >
              <RotateCcw size={14} /> Reset
            </button>
            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
