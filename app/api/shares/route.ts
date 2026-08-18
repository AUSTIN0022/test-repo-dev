import { db } from '@/lib/db'
import { propertyShares, shareProperties } from '@/lib/share-schema'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const ids = Array.isArray(body.propertyIds) ? body.propertyIds.filter((id: unknown): id is string => typeof id === 'string') : []
  if (!ids.length) return NextResponse.json({ error: 'Select at least one property.' }, { status: 400 })
  const now = new Date()
  const id = crypto.randomUUID()
  const token = `${crypto.randomUUID().replaceAll('-', '')}${crypto.randomUUID().replaceAll('-', '')}`
  await db.insert(propertyShares).values({ id, token, title: String(body.title || 'A private collection from haven'), createdAt: now, expiresAt: null, revokedAt: null })
  await db.insert(shareProperties).values(ids.map((propertyId: string) => ({ id: crypto.randomUUID(), shareId: id, propertyId, createdAt: now })))
  return NextResponse.json({ id, token, url: `/share/${token}` }, { status: 201 })
}
