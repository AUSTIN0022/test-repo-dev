'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import MoreMenuView from '@/components/more/more-menu-view'
import { useApp } from '@/components/layout/app-layout-wrapper'

export default function MorePage() {
  const router = useRouter()
  const { currentUser } = useApp()

  return (
    <MoreMenuView
      onNavigateTab={(tab) => router.push(`/${tab}`)}
      currentUser={currentUser}
    />
  )
}
