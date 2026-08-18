'use client'

import { useState } from 'react'
import { Building2, Calendar, ChevronLeft, ChevronRight, Download, FileText, Lock, MapPin, Pencil, Share2, Sparkles, Trash2, X } from 'lucide-react'

export type PropertyDetail = {
  id: string
  title: string
  city: string
  state: string
  address: string
  postalCode: string
  price: number
  bedrooms: number
  bathrooms: string
  sqft: number
  lotSqft?: number | null
  yearBuilt?: number | null
  propertyType: string
  listingType: string
  status: string
  description?: string
  publicNotes?: string
  internalNotes?: string
  latitude?: number | null
  longitude?: number | null
  images?: { id: string; pathname: string; altText: string; isCover: boolean }[]
  documents?: { id: string; pathname: string; filename: string; documentType: string; isPublic: boolean }[]
  features?: string[]
}

const fallbackPhotos = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85',
]

function formatMoney(val: number, currency: string = 'INR') {
  const isINR = !currency || currency.toUpperCase() === 'INR'
  return new Intl.NumberFormat(isINR ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: isINR ? 'INR' : currency,
    maximumFractionDigits: 0,
  }).format(val)
}

export function PropertyDetailModal({
  property,
  onClose,
  onShare,
  onEdit,
  onDelete,
}: {
  property: PropertyDetail | null
  onClose: () => void
  onShare?: (property: PropertyDetail) => void
  onEdit?: (property: PropertyDetail) => void
  onDelete?: (id: string) => void
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  if (!property) return null

  const imageList = property.images && property.images.length > 0
    ? property.images.map((img) => img.pathname.startsWith('http') || img.pathname.startsWith('/') ? img.pathname : `/api/file?pathname=${encodeURIComponent(img.pathname)}`)
    : fallbackPhotos

  const currentImage = imageList[activeImageIndex] || imageList[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-4 backdrop-blur-md">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl">
        {/* Header Media Banner */}
        <div className="relative aspect-[1.7] w-full overflow-hidden bg-secondary">
          <img src={currentImage} alt={property.title} className="size-full object-cover" />
          
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur-md hover:bg-card"
            aria-label="Close detail modal"
          >
            <X size={18} />
          </button>

          {imageList.length > 1 && (
            <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
              <button
                onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : imageList.length - 1))}
                className="flex size-9 items-center justify-center rounded-full bg-card/80 text-foreground backdrop-blur-md hover:bg-card"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev < imageList.length - 1 ? prev + 1 : 0))}
                className="flex size-9 items-center justify-center rounded-full bg-card/80 text-foreground backdrop-blur-md hover:bg-card"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground capitalize">
              {property.status}
            </span>
            <span className="rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-md">
              {property.propertyType}
            </span>
          </div>

          {imageList.length > 1 && (
            <div className="absolute bottom-4 right-4 rounded-full bg-foreground/60 px-3 py-1 text-xs font-medium text-background backdrop-blur-md">
              {activeImageIndex + 1} / {imageList.length}
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                <MapPin size={14} /> {property.address}, {property.city}, {property.state} {property.postalCode}
              </p>
              <h2 className="mt-1 font-serif text-3xl font-semibold sm:text-4xl">{property.title}</h2>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-serif text-3xl font-semibold text-primary">{formatMoney(property.price, (property as any).currency)}</p>
              <p className="text-xs text-muted-foreground">{property.listingType}</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 rounded-2xl bg-secondary/60 p-4 text-center">
            <div>
              <span className="block text-xl font-bold text-foreground">{property.bedrooms}</span>
              <span className="text-xs text-muted-foreground">Bedrooms</span>
            </div>
            <div>
              <span className="block text-xl font-bold text-foreground">{property.bathrooms}</span>
              <span className="text-xs text-muted-foreground">Bathrooms</span>
            </div>
            <div>
              <span className="block text-xl font-bold text-foreground">{property.sqft.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">Sq. Feet</span>
            </div>
          </div>

          {/* Additional Meta */}
          {(property.lotSqft || property.yearBuilt || (property.latitude && property.longitude)) && (
            <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground border-b border-border pb-4">
              {property.lotSqft && <span>Lot: <strong className="text-foreground">{property.lotSqft.toLocaleString()} sqft</strong></span>}
              {property.yearBuilt && <span>Built: <strong className="text-foreground">{property.yearBuilt}</strong></span>}
              {property.latitude && property.longitude && (
                <span>Coordinates: <strong className="text-foreground">{property.latitude.toFixed(4)}, {property.longitude.toFixed(4)}</strong></span>
              )}
            </div>
          )}

          {/* Description */}
          {property.description && (
            <div>
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-muted-foreground">Property Overview</h3>
              <p className="text-sm leading-relaxed text-foreground/90">{property.description}</p>
            </div>
          )}

          {/* Features Tags */}
          {property.features && property.features.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">Features & Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feat) => (
                  <span key={feat} className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-3.5 py-1.5 text-xs font-semibold text-foreground">
                    <Sparkles size={12} className="text-primary" /> {feat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Internal Private Notes */}
          {property.internalNotes && (
            <div className="rounded-2xl border border-amber-200 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
                <Lock size={14} /> Private Team Notes (Internal Only)
              </div>
              <p className="text-xs leading-relaxed">{property.internalNotes}</p>
            </div>
          )}

          {/* Attached Documents */}
          {property.documents && property.documents.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">Attached Documents</h3>
              <div className="space-y-2">
                {property.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-sm">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-primary" />
                      <div>
                        <p className="font-semibold">{doc.filename}</p>
                        <span className="text-xs text-muted-foreground capitalize">{doc.documentType} · {doc.isPublic ? 'Public' : 'Private'}</span>
                      </div>
                    </div>
                    <a
                      href={doc.pathname.startsWith('http') || doc.pathname.startsWith('/') ? doc.pathname : `/api/file?pathname=${encodeURIComponent(doc.pathname)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:border-primary"
                    >
                      <Download size={14} /> View
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            {onShare && (
              <button
                onClick={() => onShare(property)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                <Share2 size={16} /> Share Property
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => {
                  onClose()
                  onEdit(property)
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-3 text-xs font-semibold hover:border-primary"
              >
                <Pencil size={16} /> Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete ${property.title}?`)) {
                    onDelete(property.id)
                    onClose()
                  }
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs font-semibold text-destructive hover:bg-destructive/20"
              >
                <Trash2 size={16} /> Delete
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-xl border border-border px-5 py-3 text-sm font-semibold hover:bg-muted"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
