import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { assignLeadToAvailableAgent } from '@/lib/services/leadAssignmentService'

// GET /api/leads - Filterable Lead Listing
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const source = searchParams.get('source')
    const agentId = searchParams.get('agentId')
    const temperature = searchParams.get('temperature')
    const search = searchParams.get('search')
    const page = Number(searchParams.get('page') || 1)
    const limit = Number(searchParams.get('limit') || 25)

    const where: any = {}

    if (status && status !== 'all') where.status = status
    if (source && source !== 'all') where.source = source
    if (agentId && agentId !== 'all') where.assignedAgentId = agentId
    if (temperature && temperature !== 'all') where.temperature = temperature

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { preferredLocation: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip: page * limit,
        take: limit,
        include: {
          assignedAgent: {
            select: { id: true, name: true, phone: true, role: true, avatarUrl: true },
          },
          _count: {
            select: { calls: true, messages: true, activities: true, followups: true, shares: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.lead.count({ where }),
    ])

    return NextResponse.json({ success: true, leads, pagination: { page, limit, total } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/leads - Add Lead Manually
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.fullName || !body.phone) {
      return NextResponse.json({ error: 'fullName and phone are required' }, { status: 400 })
    }

    let org = await prisma.organization.findFirst()
    if (!org) {
      org = await prisma.organization.create({
        data: { name: 'Apex Horizon Realty' },
      })
    }

    let assignedAgentId = body.assignedAgentId
    if (!assignedAgentId) {
      assignedAgentId = await assignLeadToAvailableAgent({ organizationId: org.id })
    }

    const lead = await prisma.lead.create({
      data: {
        organizationId: org.id,
        fullName: body.fullName,
        phone: body.phone,
        email: body.email || null,
        source: body.source || 'Manual Entry',
        propertyType: body.propertyType || 'apartment',
        budgetMin: body.budgetMin ? parseInt(body.budgetMin, 10) : 5000000,
        budgetMax: body.budgetMax ? parseInt(body.budgetMax, 10) : 15000000,
        preferredLocation: body.preferredLocation || 'Gurgaon',
        status: body.status || 'new',
        temperature: body.temperature || 'warm',
        assignedAgentId,
        notes: body.notes || null,
      },
      include: { assignedAgent: true },
    })

    await prisma.activity.create({
      data: {
        leadId: lead.id,
        userId: assignedAgentId,
        type: 'status_change',
        title: `Manual Lead Created`,
        details: `Source: ${lead.source}. Status: ${lead.status}`,
      },
    })

    return NextResponse.json({ success: true, lead })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
