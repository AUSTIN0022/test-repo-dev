'use client'

import React, { Suspense } from 'react'
import PropertyInventoryView from '@/components/properties/property-inventory-view'
import { useApp } from '@/components/layout/app-layout-wrapper'
import { RefreshCw } from 'lucide-react'

function PropertiesContent() {
  const { openShareModalFor } = useApp()

  return <PropertyInventoryView onOpenShareModal={openShareModalFor} />
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-zinc-400 flex flex-col items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-zinc-900" />
          Loading Properties Router...
        </div>
      }
    >
      <PropertiesContent />
    </Suspense>
  )
}
