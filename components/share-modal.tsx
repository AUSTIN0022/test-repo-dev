'use client'

import { useState } from 'react'
import { Check, Copy, ExternalLink, MessageCircle, Send, Share2, Sparkles, X } from 'lucide-react'
import { PropertyDetail } from './property-detail-modal'
import { BrokerProfile } from './broker-profile-modal'

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

export function ShareModal({
  isOpen,
  onClose,
  shareUrl,
  shareTitle,
  selectedProperties = [],
  broker,
}: {
  isOpen: boolean
  onClose: () => void
  shareUrl: string
  shareTitle: string
  selectedProperties?: PropertyDetail[]
  broker?: BrokerProfile | null
}) {
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedCard, setCopiedCard] = useState(false)

  if (!isOpen || !shareUrl) return null

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${shareUrl}` : shareUrl

  // Construct Rich Message Card text
  let richMessageCard = `🏡 *${shareTitle || 'Curated Property Collection'}*\n\n`

  if (selectedProperties.length > 0) {
    selectedProperties.forEach((prop, idx) => {
      richMessageCard += `📍 *${prop.title}*\n`
      richMessageCard += `💰 Price: ${formatMoney(prop.price)}\n`
      richMessageCard += `🏢 Location: ${prop.city}, ${prop.state}\n`
      richMessageCard += `📐 Details: ${prop.bedrooms} Beds · ${prop.bathrooms} Baths · ${prop.sqft.toLocaleString()} Sqft (${prop.propertyType})\n`
      if (prop.features && prop.features.length > 0) {
        richMessageCard += `✨ Highlights: ${prop.features.slice(0, 3).join(', ')}\n`
      }
      if (idx < selectedProperties.length - 1) {
        richMessageCard += `-------------------\n`
      }
    })
  }

  if (broker) {
    richMessageCard += `\n👤 *Presented by:* ${broker.fullName} (${broker.agencyName})\n`
    richMessageCard += `📞 *Contact:* ${broker.phone} | ${broker.email}\n`
  }

  richMessageCard += `\n🔗 *View photos, full details & attached documents here:*\n${fullUrl}`

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    } catch {
      // fallback
    }
  }

  async function handleCopyCard() {
    try {
      await navigator.clipboard.writeText(richMessageCard)
      setCopiedCard(true)
      setTimeout(() => setCopiedCard(false), 2500)
    } catch {
      // fallback
    }
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle || 'Curated Property Presentation',
          text: richMessageCard,
          url: fullUrl,
        })
      } catch {
        // user cancelled
      }
    } else {
      handleCopyCard()
    }
  }

  const encodedRichMessage = encodeURIComponent(richMessageCard)
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedRichMessage}`
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(richMessageCard)}`
  const mailUrl = `mailto:?subject=${encodeURIComponent(shareTitle || 'Curated Property Collection')}&body=${encodedRichMessage}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-4 backdrop-blur-md">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Share2 size={20} />
            </span>
            <div>
              <h2 className="font-serif text-2xl font-semibold">Share Property Collection</h2>
              <p className="text-xs text-muted-foreground">Populated rich message card & URL generated.</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-muted" aria-label="Close share modal">
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {/* Rich Message Card Preview Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Populated WhatsApp / Message Card
              </label>
              <button
                onClick={handleCopyCard}
                className="text-xs font-semibold text-primary underline flex items-center gap-1"
              >
                {copiedCard ? <><Check size={13} /> Copied Card</> : <><Copy size={13} /> Copy Card Text</>}
              </button>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-xs font-mono whitespace-pre-wrap text-foreground max-h-48 overflow-y-auto leading-relaxed border-l-4 border-l-primary">
              {richMessageCard}
            </div>
          </div>

          {/* Shareable Link Box */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Public Share URL</label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={fullUrl}
                className="w-full min-w-0 rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-muted-foreground outline-none font-mono"
              />
              <button
                onClick={handleCopyLink}
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                {copiedLink ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy URL</>}
              </button>
            </div>
          </div>

          {/* Direct WhatsApp Sharing Button */}
          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Instant Messaging</p>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-3 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 shadow-sm"
              >
                <MessageCircle size={17} /> Share on WhatsApp
              </a>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-sky-500/40 bg-sky-500/10 py-3 text-xs font-bold text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 shadow-sm"
              >
                <Send size={17} /> Share on Telegram
              </a>
            </div>
          </div>

          {/* Native Web Share API button */}
          <button
            onClick={handleNativeShare}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary/80 py-3 text-xs font-semibold text-foreground hover:bg-secondary"
          >
            <Share2 size={15} /> Use Native Device Share Sheet
          </button>

          <div className="flex justify-between items-center pt-2 border-t border-border">
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-semibold text-primary underline"
            >
              Preview Public Web Page <ExternalLink size={12} />
            </a>
            <button
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
