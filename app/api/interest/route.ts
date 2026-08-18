import { db } from '@/lib/db'
import { propertyInterest } from '@/lib/share-schema'
import { and, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  if (!body.shareId || !body.propertyId || !['interested', 'maybe', 'not_for_me', 'not_interested'].includes(body.response)) return NextResponse.json({ error: 'Invalid response.' }, { status: 400 })
  const sessionId = request.cookies.get('haven_share_session')?.value || crypto.randomUUID()
  const now = new Date()
  const existing = await db.select().from(propertyInterest).where(and(eq(propertyInterest.shareId, body.shareId), eq(propertyInterest.propertyId, body.propertyId), eq(propertyInterest.sessionId, sessionId))).limit(1)
  if (existing[0]) await db.update(propertyInterest).set({ response: body.response, updatedAt: now }).where(eq(propertyInterest.id, existing[0].id))
  else await db.insert(propertyInterest).values({ id: crypto.randomUUID(), shareId: body.shareId, propertyId: body.propertyId, sessionId, response: body.response, createdAt: now, updatedAt: now })
  const response = NextResponse.json({ ok: true })
  response.cookies.set('haven_share_session', sessionId, { httpOnly: true, sameSite: 'lax', secure: true, maxAge: 60 * 60 * 24 * 90, path: '/' })
  return response
}
