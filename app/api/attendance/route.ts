import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { processCheckIn, processCheckOut } from '@/lib/services/attendanceService'

// GET /api/attendance - List attendance history & today's status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const date = searchParams.get('date')

    const where: any = {}
    if (userId && userId !== 'all') where.userId = userId

    if (date) {
      const d = new Date(date)
      d.setHours(0, 0, 0, 0)
      const dNext = new Date(d)
      dNext.setDate(dNext.getDate() + 1)
      where.checkInTime = { gte: d, lt: dNext }
    }

    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, role: true, avatarUrl: true } },
      },
      orderBy: { checkInTime: 'desc' },
      take: 50,
    })

    // Currently checked in employees
    const currentlyCheckedIn = await prisma.attendance.findMany({
      where: { checkOutTime: null },
      include: {
        user: { select: { id: true, name: true, role: true, avatarUrl: true } },
      },
    })

    return NextResponse.json({ success: true, attendances, currentlyCheckedIn })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/attendance - Check-in / Check-out action
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, userId, latitude, longitude, locationName, notes, selfieUrl } = body

    if (!userId || !action) {
      return NextResponse.json({ error: 'userId and action (check_in | check_out) are required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (action === 'check_in') {
      const result = await processCheckIn({
        organizationId: user.organizationId,
        userId,
        latitude,
        longitude,
        locationName,
        notes,
        selfieUrl,
      })
      return NextResponse.json(result)
    } else if (action === 'check_out') {
      const result = await processCheckOut({
        organizationId: user.organizationId,
        userId,
        latitude,
        longitude,
        locationName,
        notes,
      })
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
