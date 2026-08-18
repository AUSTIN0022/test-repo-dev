'use client'

import React, { use } from 'react'
import { useRouter } from 'next/navigation'
import LeadDetailView from '@/components/leads/lead-detail-view'
import { useApp } from '@/components/layout/app-layout-wrapper'

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { handleTriggerCallBridge, openShareModalFor } = useApp()

  return (
    <LeadDetailView
      leadId={id}
      onBack={() => router.push('/leads')}
      onTriggerCallBridge={handleTriggerCallBridge}
      onOpenShareModal={openShareModalFor}
    />
  )
}
