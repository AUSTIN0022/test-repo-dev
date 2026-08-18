import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { brokerProfiles, properties, propertyDocuments, propertyFeatures, propertyImages } from '@/lib/property-schema'
import { propertyShares, shareProperties } from '@/lib/share-schema'
import { eq, inArray } from 'drizzle-orm'
import { ShareFeedback } from '@/components/share-feedback'
import { ShareViewTracker } from '@/components/share-view-tracker'
import { Building2, Download, FileText, Mail, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'

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

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params
  const [share] = await db.select().from(propertyShares).where(eq(propertyShares.token, token)).limit(1)

  if (!share) {
    return {
      title: 'Property Collection — haven',
      description: 'Curated real estate listing presentation.',
    }
  }

  const [broker] = await db.select().from(brokerProfiles).limit(1)
  const joins = await db.select().from(shareProperties).where(eq(shareProperties.shareId, share.id))
  const propertyIds = joins.map((j) => j.propertyId)

  let title = share.title || 'Curated Property Collection'
  let description = 'Review these selected properties and let your agent know which ones fit your preferences.'
  let imageUrl = fallbackPhotos[0]

  if (propertyIds.length > 0) {
    const listings = await db.select().from(properties).where(inArray(properties.id, propertyIds))
    const firstImages = await db.select().from(propertyImages).where(eq(propertyImages.propertyId, propertyIds[0])).limit(1)

    if (listings.length === 1) {
      const p = listings[0]
      title = `🏡 ${p.title} — ${formatMoney(p.price, p.currency)} | ${p.city}, ${p.state}`
      description = `${p.bedrooms} Beds · ${p.bathrooms} Baths · ${p.sqft.toLocaleString()} Sqft in ${p.city}, ${p.state}. ${p.description || ''}`
    } else if (listings.length > 1) {
      const p = listings[0]
      title = `🏡 ${share.title} (${listings.length} Properties)`
      description = `Featuring ${p.title} (${formatMoney(p.price, p.currency)}) and ${listings.length - 1} other curated properties. Presented by ${broker?.fullName || 'Haven Agent'}.`
    }

    if (firstImages.length > 0) {
      imageUrl = firstImages[0].pathname.startsWith('http') || firstImages[0].pathname.startsWith('/')
        ? firstImages[0].pathname
        : `/api/file?pathname=${encodeURIComponent(firstImages[0].pathname)}`
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const [share] = await db.select().from(propertyShares).where(eq(propertyShares.token, token)).limit(1)

  if (!share || share.revokedAt || (share.expiresAt && share.expiresAt < new Date())) {
    notFound()
  }

  const [broker] = await db.select().from(brokerProfiles).limit(1)

  const joins = await db.select().from(shareProperties).where(eq(shareProperties.shareId, share.id))
  const propertyIds = joins.map((j) => j.propertyId)

  let listings: any[] = []
  let imagesMap: Record<string, any[]> = {}
  let docsMap: Record<string, any[]> = {}
  let featsMap: Record<string, string[]> = {}

  if (propertyIds.length > 0) {
    listings = await db.select().from(properties).where(inArray(properties.id, propertyIds))
    
    const allImages = await db.select().from(propertyImages).where(inArray(propertyImages.propertyId, propertyIds))
    const allDocs = await db.select().from(propertyDocuments).where(inArray(propertyDocuments.propertyId, propertyIds))
    const allFeats = await db.select().from(propertyFeatures).where(inArray(propertyFeatures.propertyId, propertyIds))

    allImages.forEach((img) => {
      if (!imagesMap[img.propertyId]) imagesMap[img.propertyId] = []
      imagesMap[img.propertyId].push(img)
    })

    allDocs.forEach((doc) => {
      if (!docsMap[doc.propertyId]) docsMap[doc.propertyId] = []
      if (doc.isPublic) docsMap[doc.propertyId].push(doc)
    })

    allFeats.forEach((f) => {
      if (!featsMap[f.propertyId]) featsMap[f.propertyId] = []
      featsMap[f.propertyId].push(f.feature)
    })
  }

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      {listings[0] && <ShareViewTracker shareId={share.id} propertyId={listings[0].id} />}

      {/* Header Branding */}
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-serif font-bold text-lg">
              H
            </span>
            <span className="font-serif text-2xl font-semibold tracking-tight">haven</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-secondary px-3.5 py-1.5 text-xs font-semibold text-secondary-foreground">
              Private Collection
            </span>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">Curated Presentation</p>
            <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              {share.title || 'Curated Property Collection'}
            </h1>
            <p className="mt-3 max-w-xl text-base text-muted-foreground">
              Review these selected properties and let your agent know which ones fit your preferences.
            </p>
          </div>

          {broker && (
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm min-w-72">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg shrink-0">
                {broker.fullName.slice(0, 1)}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{broker.fullName}</p>
                <p className="text-xs text-muted-foreground truncate">{broker.agencyName}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{broker.phone}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Properties List */}
      <section className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-2">
        {listings.map((property, idx) => {
          const propImages = imagesMap[property.id] || []
          const propDocs = docsMap[property.id] || []
          const propFeats = featsMap[property.id] || []

          const coverImage = propImages.length > 0
            ? (propImages[0].pathname.startsWith('http') || propImages[0].pathname.startsWith('/')
                ? propImages[0].pathname
                : `/api/file?pathname=${encodeURIComponent(propImages[0].pathname)}`)
            : fallbackPhotos[idx % fallbackPhotos.length]

          return (
            <article key={property.id} className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:shadow-md">
              <div className="relative aspect-[1.4] w-full overflow-hidden bg-secondary">
                <img src={coverImage} alt={property.title} className="size-full object-cover" />
                <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground capitalize">
                  {property.propertyType}
                </span>
                <span className="absolute right-4 top-4 rounded-full bg-card/90 px-3.5 py-1 text-sm font-semibold text-foreground backdrop-blur-md">
                  {formatMoney(property.price, property.currency)}
                </span>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <MapPin size={13} /> {property.city}, {property.state}
                  </p>
                  <h2 className="mt-1 font-serif text-2xl font-semibold">{property.title}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{property.address}</p>
                </div>

                <div className="flex gap-4 border-y border-border py-3 text-xs font-medium text-muted-foreground">
                  <span><strong className="text-foreground">{property.bedrooms}</strong> beds</span>
                  <span><strong className="text-foreground">{property.bathrooms}</strong> baths</span>
                  <span><strong className="text-foreground">{property.sqft.toLocaleString()}</strong> sqft</span>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  {property.description || property.publicNotes || 'A thoughtfully considered home with room to make it your own.'}
                </p>

                {propFeats.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {propFeats.map((feat) => (
                      <span key={feat} className="flex items-center gap-1 rounded-full border border-border bg-secondary/40 px-2.5 py-1 text-[11px] font-medium text-foreground">
                        <Sparkles size={11} className="text-primary" /> {feat}
                      </span>
                    ))}
                  </div>
                )}

                {propDocs.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Property Documents</p>
                    {propDocs.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.pathname.startsWith('http') || doc.pathname.startsWith('/') ? doc.pathname : `/api/file?pathname=${encodeURIComponent(doc.pathname)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs hover:border-primary"
                      >
                        <span className="flex items-center gap-2 font-medium">
                          <FileText size={14} className="text-primary" /> {doc.filename}
                        </span>
                        <Download size={13} className="text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Recipient Feedback Options */}
                <ShareFeedback shareId={share.id} propertyId={property.id} />
              </div>
            </article>
          )
        })}
      </section>

      {/* Broker Footer */}
      {broker && (
        <section className="mx-auto max-w-4xl px-6 mt-16 pt-8 border-t border-border">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-serif font-bold text-xl shrink-0">
                {broker.fullName.slice(0, 1)}
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold">{broker.fullName}</h3>
                <p className="text-xs text-muted-foreground">{broker.agencyName} {broker.licenseNumber ? `· Lic #${broker.licenseNumber}` : ''}</p>
                <p className="text-xs text-muted-foreground mt-1">{broker.bio}</p>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-2 text-xs shrink-0 w-full sm:w-auto">
              <a href={`tel:${broker.phone}`} className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:opacity-90">
                <Phone size={14} /> Call Agent
              </a>
              <a href={`mailto:${broker.email}`} className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 font-semibold hover:bg-muted">
                <Mail size={14} /> Send Email
              </a>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
