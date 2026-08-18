'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import FollowupView from '@/components/followups/followup-view'
import { useApp } from '@/components/layout/app-layout-wrapper'

export default function FollowupsPage() {
  const router = useRouter()
  const { handleTriggerCallBridge } = useApp()

  return (
    <FollowupView
      onSelectLead={(id) => router.push(`/leads/${id}`)}
      onTriggerCallBridge={handleTriggerCallBridge}
    />
  )
}
