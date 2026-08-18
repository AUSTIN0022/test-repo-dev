import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { brokerProfiles, organizations, users } from '@/lib/property-schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, agencyName, phone } = body

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required.' }, { status: 400 })
    }

    const [existing] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1)
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists.' }, { status: 400 })
    }

    const now = new Date()
    const orgId = crypto.randomUUID()
    const userId = crypto.randomUUID()
    const passwordHash = await hashPassword(password)

    // 1. Create Organization
    await db.insert(organizations).values({
      id: orgId,
      name: agencyName?.trim() || `${name}'s Realty`,
      type: 'agency',
      email: email.toLowerCase().trim(),
      phone: phone || '',
      createdAt: now,
      updatedAt: now,
    })

    // 2. Create User
    await db.insert(users).values({
      id: userId,
      organizationId: orgId,
      email: email.toLowerCase().trim(),
      passwordHash,
      name: name.trim(),
      phone: phone || '',
      role: 'owner',
      createdAt: now,
      updatedAt: now,
    })

    // 3. Create Broker Profile
    await db.insert(brokerProfiles).values({
      id: crypto.randomUUID(),
      organizationId: orgId,
      fullName: name.trim(),
      agencyName: agencyName?.trim() || `${name}'s Realty`,
      email: email.toLowerCase().trim(),
      phone: phone || '',
      bio: 'Professional real estate advisor.',
      licenseNumber: '',
      createdAt: now,
      updatedAt: now,
    })

    const response = NextResponse.json({ success: true, userId, organizationId: orgId })
    response.cookies.set('haven_user_session', userId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed.' }, { status: 500 })
  }
}
