'use client'

import { useEffect, useState } from 'react'
import { Eye, Flame, HelpCircle, Heart, Share2, ThumbsDown, TrendingUp } from 'lucide-react'

type PropertyAnalytics = {
  id: string
  title: string
  city: string
  state: string
  price: number
  views: number
  shares: number
  interested: number
  maybe: number
  notInterested: number
  totalResponses: number
}

type AnalyticsData = {
  totalViews: number
  totalResponses: number
  totalShares: number
  globalBreakdown: { response: string; total: number }[]
  properties: PropertyAnalytics[]
}

function formatMoney(val: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
}

export function ShareAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center text-sm text-muted-foreground animate-pulse">
        Loading buyer demand intelligence…
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-8">
      {/* Aggregate Overview */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Aggregate Performance</p>
            <h2 className="mt-1 font-serif text-3xl font-semibold">Demand Intelligence</h2>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
            Privacy-Preserved Session Tracking
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-secondary/40 p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Property Views</span>
              <Eye size={18} className="text-primary" />
            </div>
            <p className="mt-3 font-serif text-4xl font-semibold text-foreground">{data.totalViews}</p>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/40 p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Times Shared</span>
              <Share2 size={18} className="text-primary" />
            </div>
            <p className="mt-3 font-serif text-4xl font-semibold text-foreground">{data.totalShares}</p>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/40 p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Buyer Responses</span>
              <Heart size={18} className="text-primary" />
            </div>
            <p className="mt-3 font-serif text-4xl font-semibold text-foreground">{data.totalResponses}</p>
          </div>
        </div>
      </section>

      {/* Per-Property Demand Breakdown */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Per-Listing Breakdown</p>
            <h3 className="mt-1 font-serif text-2xl font-semibold">Property Buyer Signal</h3>
          </div>
        </div>

        {data.properties.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">No listings available for analytics yet.</div>
        ) : (
          <div className="space-y-4">
            {data.properties.map((prop) => {
              const interestRatio = prop.totalResponses > 0 ? Math.round((prop.interested / prop.totalResponses) * 100) : 0

              return (
                <div
                  key={prop.id}
                  className="rounded-2xl border border-border bg-background p-5 transition hover:border-primary"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-xl font-semibold">{prop.title}</h4>
                        {prop.totalResponses > 0 && interestRatio >= 50 && (
                          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            <Flame size={12} /> 🔥 High Interest ({interestRatio}%)
                          </span>
                        )}
                        {prop.totalResponses > 0 && interestRatio >= 25 && interestRatio < 50 && (
                          <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                            Moderate Interest ({interestRatio}%)
                          </span>
                        )}
                        {prop.totalResponses > 0 && interestRatio < 25 && (
                          <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-bold text-muted-foreground">
                            Low Interest ({interestRatio}%)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {prop.city}, {prop.state} · {formatMoney(prop.price)}
                      </p>
                    </div>

                    {/* Stats pills */}
                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                      <div className="flex items-center gap-1.5 rounded-xl border border-border bg-secondary/50 px-3 py-1.5">
                        <Eye size={14} className="text-muted-foreground" />
                        <span><strong>{prop.views}</strong> Views</span>
                      </div>

                      <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-700 dark:text-emerald-300">
                        <Heart size={14} />
                        <span><strong>{prop.interested}</strong> Interested</span>
                      </div>

                      <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-amber-700 dark:text-amber-300">
                        <HelpCircle size={14} />
                        <span><strong>{prop.maybe}</strong> Maybe</span>
                      </div>

                      <div className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-rose-700 dark:text-rose-300">
                        <ThumbsDown size={14} />
                        <span><strong>{prop.notInterested}</strong> Not Interested</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
