import { db } from '@/lib/db'
import { shareViews } from '@/lib/share-schema'
import { and, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  if (!body.shareId || !body.propertyId) return NextResponse.json({ error: 'Missing share or property.' }, { status: 400 })
  const sessionId = request.cookies.get('haven_share_session')?.value || crypto.randomUUID()
  const existing = await db.select().from(shareViews).where(and(eq(shareViews.shareId, body.shareId), eq(shareViews.propertyId, body.propertyId), eq(shareViews.sessionId, sessionId))).limit(1)
  if (!existing.length) await db.insert(shareViews).values({ id: crypto.randomUUID(), shareId: body.shareId, propertyId: body.propertyId, sessionId, createdAt: new Date() })
  const response = NextResponse.json({ ok: true })
  response.cookies.set('haven_share_session', sessionId, { httpOnly: true, sameSite: 'lax', secure: true, maxAge: 60 * 60 * 24 * 90, path: '/' })
  return response
}
