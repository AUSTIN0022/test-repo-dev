import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/reports - Business Reports & Performance Analytics
export async function GET(req: NextRequest) {
  try {
    const totalLeads = await prisma.lead.count()
    const wonLeads = await prisma.lead.count({ where: { status: 'won' } })
    const lostLeads = await prisma.lead.count({ where: { status: 'lost' } })
    const hotLeads = await prisma.lead.count({ where: { temperature: 'hot' } })

    // Leads by Source
    const leadsBySourceGroup = await prisma.lead.groupBy({
      by: ['source'],
      _count: { id: true },
    })
    const leadsBySource = leadsBySourceGroup.map((g) => ({
      source: g.source,
      count: g._count.id,
    }))

    // Leads by Status
    const leadsByStatusGroup = await prisma.lead.groupBy({
      by: ['status'],
      _count: { id: true },
    })
    const leadsByStatus = leadsByStatusGroup.map((g) => ({
      status: g.status,
      count: g._count.id,
    }))

    // Agent Call Performance
    const agents = await prisma.user.findMany({
      where: { role: { in: ['sales_agent', 'sales_manager', 'admin'] } },
      select: {
        id: true,
        name: true,
        role: true,
        avatarUrl: true,
        _count: {
          select: {
            calls: true,
            assignedLeads: true,
            followups: true,
          },
        },
      },
    })

    // Total Calls Today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const callsToday = await prisma.call.count({
      where: { startedAt: { gte: today } },
    })

    // Follow-ups due today & completed
    const followupsDueToday = await prisma.followup.count({
      where: { dueDate: { gte: today }, status: 'pending' },
    })

    const followupsCompleted = await prisma.followup.count({
      where: { status: 'completed' },
    })

    // Property Share stats
    const totalShares = await prisma.propertyShare.count()

    // Attendance summary today
    const checkedInToday = await prisma.attendance.count({
      where: { checkInTime: { gte: today } },
    })

    return NextResponse.json({
      success: true,
      summary: {
        totalLeads,
        wonLeads,
        lostLeads,
        hotLeads,
        callsToday,
        followupsDueToday,
        followupsCompleted,
        totalShares,
        checkedInToday,
      },
      leadsBySource,
      leadsByStatus,
      agentPerformance: agents,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
