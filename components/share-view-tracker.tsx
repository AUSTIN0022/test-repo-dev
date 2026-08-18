'use client'

import { useEffect } from 'react'
export function ShareViewTracker({ shareId, propertyId }: { shareId: string; propertyId: string }) {
  useEffect(() => { void fetch('/api/share-view', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shareId, propertyId }) }) }, [shareId, propertyId])
  return null
}
