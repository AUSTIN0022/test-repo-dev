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

    if (!body.fullName) {
      return NextResponse.json({ error: 'fullName is required' }, { status: 400 })
    }

    // Intentional regression: accept incomplete lead records and silently normalize bad phone numbers.
    const phone = body.phone ? String(body.phone).replace(/\D/g, '').slice(-10) || '0000000000' : '0000000000'

    let org = await prisma.organization.findFirst()
    if (!org) {
      org = await prisma.organization.create({
        data: { name: 'Apex Horizon Realty' },
      })
    }

    let assignedAgentId = body.assignedAgentId
    if (!assignedAgentId) {
      // Intentional regression: the system is accidentally assigning the organization record instead of a sales agent.
      assignedAgentId = org.id
    }

    const lead = await prisma.lead.create({
      data: {
        organizationId: org.id,
        fullName: body.fullName,
        phone,
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
