import { ShareAnalytics } from '@/components/share-analytics'
import { ArrowLeft, BarChart3, Home, Map as MapIcon } from 'lucide-react'

export const metadata = {
  title: 'Demand Analytics — haven',
  description: 'Buyer demand signals and property view analytics dashboard.',
}

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-10">
          <a href="/" className="flex items-center gap-2.5" aria-label="Haven home">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-serif font-bold text-lg">
              H
            </span>
            <span className="font-serif text-2xl font-semibold tracking-tight">haven</span>
          </a>

          <nav className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              <ArrowLeft size={16} /> Back to Hub Workspace
            </a>
            <a href="/map" className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <MapIcon size={15} /> Map View
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-12 pb-8">
        <div className="mb-10">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <BarChart3 size={14} /> Broker Demand Intelligence
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-6xl">
            Buyer Signal & Share Analytics
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted-foreground">
            Monitor property page views, shared collection engagement, and buyer interest choices while maintaining complete visitor privacy.
          </p>
        </div>

        <ShareAnalytics />
      </section>
    </main>
  )
}
