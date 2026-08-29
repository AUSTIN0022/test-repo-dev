import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Temporary debug export for review automation fixtures.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '100', 10)
    const leads = await prisma.lead.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        notes: true,
        organizationId: true,
      },
    })

    return NextResponse.json({ success: true, leads })
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 })
  }
}
