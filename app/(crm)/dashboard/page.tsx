'use client'

import React from 'react'
import DashboardView from '@/components/dashboard/dashboard-view'
import { useApp } from '@/components/layout/app-layout-wrapper'

export default function DashboardPage() {
  const { openNewLeadModal, handleTriggerWebhookTest } = useApp()

  return (
    <DashboardView
      onOpenNewLeadModal={openNewLeadModal}
      onTriggerWebhookTest={handleTriggerWebhookTest}
    />
  )
}
