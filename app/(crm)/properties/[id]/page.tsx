'use client'

import React, { use } from 'react'
import PropertyDetailView from '@/components/properties/property-detail-view'
import { useApp } from '@/components/layout/app-layout-wrapper'

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { openShareModalFor } = useApp()

  return <PropertyDetailView propertyId={id} onOpenShareModal={openShareModalFor} />
}
