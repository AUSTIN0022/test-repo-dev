import { db } from '@/lib/db'
import { brokerProfiles } from '@/lib/property-schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const [profile] = await db.select().from(brokerProfiles).limit(1)
    if (!profile) {
      const now = new Date()
      const newProfile = {
        id: 'default-broker',
        fullName: 'Alex Morgan',
        agencyName: 'Haven Real Estate Group',
        email: 'alex@havenrealestate.com',
        phone: '+1 (555) 234-5678',
        bio: 'Premier real estate advisor specializing in luxury modern properties and residential homes.',
        licenseNumber: 'RE-987654321',
        avatarUrl: null,
        logoUrl: null,
        createdAt: now,
        updatedAt: now,
      }
      await db.insert(brokerProfiles).values(newProfile)
      return NextResponse.json(newProfile)
    }
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error getting broker profile:', error)
    return NextResponse.json({ error: 'Failed to load broker profile.' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const [existing] = await db.select().from(brokerProfiles).limit(1)
    const now = new Date()
    
    if (existing) {
      const [updated] = await db.update(brokerProfiles).set({
        fullName: body.fullName ?? existing.fullName,
        agencyName: body.agencyName ?? existing.agencyName,
        email: body.email ?? existing.email,
        phone: body.phone ?? existing.phone,
        bio: body.bio ?? existing.bio,
        licenseNumber: body.licenseNumber ?? existing.licenseNumber,
        avatarUrl: body.avatarUrl ?? existing.avatarUrl,
        logoUrl: body.logoUrl ?? existing.logoUrl,
        updatedAt: now,
      }).where(eq(brokerProfiles.id, existing.id)).returning()
      return NextResponse.json(updated)
    } else {
      const [created] = await db.insert(brokerProfiles).values({
        id: crypto.randomUUID(),
        fullName: body.fullName || 'Alex Morgan',
        agencyName: body.agencyName || 'Haven Real Estate Group',
        email: body.email || 'alex@havenrealestate.com',
        phone: body.phone || '+1 (555) 234-5678',
        bio: body.bio || '',
        licenseNumber: body.licenseNumber || '',
        avatarUrl: body.avatarUrl || null,
        logoUrl: body.logoUrl || null,
        createdAt: now,
        updatedAt: now,
      }).returning()
      return NextResponse.json(created)
    }
  } catch (error) {
    console.error('Error updating broker profile:', error)
    return NextResponse.json({ error: 'Failed to update broker profile.' }, { status: 500 })
  }
}
