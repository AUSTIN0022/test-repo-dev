import { cookies } from 'next/headers'
import { db } from './db'
import { organizations, users, brokerProfiles } from './property-schema'
import { eq } from 'drizzle-orm'

export type SessionUser = {
  id: string
  email: string
  name: string
  role: string
  organizationId: string
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'haven_salt_2026')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computed = await hashPassword(password)
  return computed === hash
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionVal = cookieStore.get('haven_user_session')?.value
    if (!sessionVal) return null

    const [user] = await db.select().from(users).where(eq(users.id, sessionVal)).limit(1)
    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
    }
  } catch {
    return null
  }
}

export async function ensureDefaultOrgAndUser() {
  const existingOrgs = await db.select().from(organizations).limit(1)
  if (existingOrgs.length > 0) return existingOrgs[0]

  const now = new Date()
  const orgId = 'org-default'
  const [org] = await db
    .insert(organizations)
    .values({
      id: orgId,
      name: 'Haven Real Estate Group',
      type: 'agency',
      email: 'alex@havenrealestate.com',
      phone: '+1 (555) 234-5678',
      city: 'Austin',
      country: 'USA',
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  const passwordHash = await hashPassword('password123')
  const userId = 'user-alex'
  await db.insert(users).values({
    id: userId,
    organizationId: orgId,
    email: 'alex@havenrealestate.com',
    passwordHash,
    name: 'Alex Morgan',
    role: 'owner',
    createdAt: now,
    updatedAt: now,
  })

  return org
}
