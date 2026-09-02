import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/leads/[id] - Get Lead Detail with Full Timeline & Recommended Properties
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignedAgent: {
          select: { id: true, name: true, phone: true, email: true, role: true, avatarUrl: true },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
        calls: {
          orderBy: { startedAt: 'desc' },
          include: {
            agent: { select: { id: true, name: true } },
          },
        },
        messages: {
          orderBy: { sentAt: 'desc' },
        },
        followups: {
          orderBy: { dueDate: 'asc' },
          include: {
            agent: { select: { id: true, name: true } },
          },
        },
        shares: {
          orderBy: { createdAt: 'desc' },
          include: {
            shareProperties: {
              include: { property: { include: { images: true } } },
            },
          },
        },
      },
    })

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Recommended Properties auto-matching based on budget, propertyType, and preferredLocation
    const recommendedProperties = await prisma.property.findMany({
      where: {
        status: 'available',
        OR: [
          { propertyType: lead.propertyType },
          { city: { contains: lead.preferredLocation, mode: 'insensitive' } },
          { address: { contains: lead.preferredLocation, mode: 'insensitive' } },
          { price: { gte: Math.floor(lead.budgetMin * 0.7), lte: Math.ceil(lead.budgetMax * 1.3) } },
        ],
      },
      take: 12,
      include: { images: true },
    })

    return NextResponse.json({ success: true, lead, recommendedProperties })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH /api/leads/[id] - Update Lead (Status, Agent, Temperature, Notes, Follow-up)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const existingLead = await prisma.lead.findUnique({ where: { id } })
    if (!existingLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        status: body.status !== undefined ? body.status : existingLead.status,
        temperature: body.temperature !== undefined ? body.temperature : existingLead.temperature,
        assignedAgentId: body.assignedAgentId !== undefined ? body.assignedAgentId : existingLead.assignedAgentId,
        notes: body.notes !== undefined ? body.notes : existingLead.notes,
        nextFollowUpAt: body.nextFollowUpAt ? new Date(body.nextFollowUpAt) : existingLead.nextFollowUpAt,
        budgetMin: body.budgetMin !== undefined ? parseInt(body.budgetMin, 10) : existingLead.budgetMin,
        budgetMax: body.budgetMax !== undefined ? parseInt(body.budgetMax, 10) : existingLead.budgetMax,
        preferredLocation: body.preferredLocation !== undefined ? body.preferredLocation : existingLead.preferredLocation,
      },
      include: { assignedAgent: true },
    })

    // Create activity logs for notable changes
    if (body.status && body.status !== existingLead.status) {
      await prisma.activity.create({
        data: {
          leadId: id,
          type: 'status_change',
          title: `Status Changed to ${body.status.toUpperCase()}`,
          details: `Updated from ${existingLead.status} to ${body.status}`,
        },
      })
    }

    if (body.assignedAgentId && body.assignedAgentId !== existingLead.assignedAgentId) {
      await prisma.activity.create({
        data: {
          leadId: id,
          type: 'status_change',
          title: `Reassigned Lead Agent`,
          details: `Lead reassigned to ${updatedLead.assignedAgent?.name || 'New Agent'}`,
        },
      })
    }

    return NextResponse.json({ success: true, lead: updatedLead })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE /api/leads/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.lead.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Lead deleted' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
