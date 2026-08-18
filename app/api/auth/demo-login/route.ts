import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// POST /api/auth/demo-login - Role Switcher Login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const role = body.role || 'admin'

    const user = await prisma.user.findFirst({
      where: { role },
    })

    if (!user) {
      return NextResponse.json({ error: `No user found with role ${role}` }, { status: 404 })
    }

    const cookieStore = await cookies()
    cookieStore.set('estateflow_user_id', user.id, {
      path: '/',
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
