import { ensureDefaultOrgAndUser, getSessionUser } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  await ensureDefaultOrgAndUser()
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({ authenticated: true, user })
}
