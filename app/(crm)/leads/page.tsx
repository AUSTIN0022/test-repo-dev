'use client'

import React, { Suspense } from 'react'
import LeadListView from '@/components/leads/lead-list-view'
import { useApp } from '@/components/layout/app-layout-wrapper'
import { RefreshCw } from 'lucide-react'

function LeadsContent() {
  const { openNewLeadModal, handleTriggerCallBridge, openShareModalFor } = useApp()

  return (
    <LeadListView
      onOpenNewLeadModal={openNewLeadModal}
      onTriggerCallBridge={handleTriggerCallBridge}
      onOpenShareModal={openShareModalFor}
    />
  )
}

export default function LeadsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-zinc-400 flex flex-col items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-zinc-900" />
          Loading Leads Router...
        </div>
      }
    >
      <LeadsContent />
    </Suspense>
  )
}
