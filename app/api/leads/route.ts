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

    const leads = await prisma.lead.findMany({
      where,
      include: {
        assignedAgent: {
          select: { id: true, name: true, phone: true, role: true, avatarUrl: true },
        },
        _count: {
          select: { calls: true, messages: true, activities: true, followups: true, shares: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, leads })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/leads - Add Lead Manually
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Request body must be a JSON object' }, { status: 400 })
    }

    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''

    if (!fullName || !phone) {
      return NextResponse.json({ error: 'fullName and phone are required' }, { status: 400 })
    }

    const budgetMin = body.budgetMin === undefined ? 5000000 : Number(body.budgetMin)
    const budgetMax = body.budgetMax === undefined ? 15000000 : Number(body.budgetMax)

    if (
      !Number.isSafeInteger(budgetMin) ||
      !Number.isSafeInteger(budgetMax) ||
      budgetMin < 0 ||
      budgetMax < 0 ||
      budgetMin > budgetMax
    ) {
      return NextResponse.json(
        { error: 'budgetMin and budgetMax must be non-negative integers with budgetMin <= budgetMax' },
        { status: 400 }
      )
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
        fullName,
        phone,
        email: body.email || null,
        source: body.source || 'Manual Entry',
        propertyType: body.propertyType || 'apartment',
        budgetMin,
        budgetMax,
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
    console.error('Manual lead creation error:', err)
    return NextResponse.json({ error: 'Unable to create lead' }, { status: 500 })
  }
}
