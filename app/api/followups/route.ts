import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendLeadMessage } from '@/lib/services/messageService'

// GET /api/followups - Get due & pending followups
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const agentId = searchParams.get('agentId')
    const status = searchParams.get('status') || 'pending'

    const where: any = { status }
    if (agentId && agentId !== 'all') where.agentId = agentId

    const followups = await prisma.followup.findMany({
      where,
      include: {
        lead: {
          select: { id: true, fullName: true, phone: true, preferredLocation: true, propertyType: true, temperature: true, source: true },
        },
        agent: {
          select: { id: true, name: true },
        },
      },
      orderBy: { dueDate: 'asc' },
    })

    return NextResponse.json({ success: true, followups })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/followups - Schedule a follow-up or send 1-click follow-up message
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.leadId || !body.note) {
      return NextResponse.json({ error: 'leadId and note are required' }, { status: 400 })
    }

    const lead = await prisma.lead.findUnique({ where: { id: body.leadId } })
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const agentId = body.agentId || lead.assignedAgentId || 'user-admin'
    const dueDate = body.dueDate ? new Date(body.dueDate) : new Date(Date.now() + 24 * 60 * 60 * 1000)

    const followup = await prisma.followup.create({
      data: {
        organizationId: lead.organizationId,
        leadId: lead.id,
        agentId,
        type: body.type || 'whatsapp',
        note: body.note,
        dueDate,
        status: 'pending',
      },
      include: { lead: true, agent: true },
    })

    // If requested, send immediate 1-click message
    let sendResult = null
    if (body.sendNow) {
      sendResult = await sendLeadMessage({
        organizationId: lead.organizationId,
        leadId: lead.id,
        senderUserId: agentId,
        type: body.type === 'sms' ? 'sms' : 'whatsapp',
        templateText: body.note,
      })
    }

    return NextResponse.json({ success: true, followup, sendResult })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH /api/followups - Complete or Snooze Followup
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const existing = await prisma.followup.findUnique({ where: { id: body.id } })
    if (!existing) {
      return NextResponse.json({ error: 'Followup not found' }, { status: 404 })
    }

    let updated = null
    if (body.action === 'complete') {
      updated = await prisma.followup.update({
        where: { id: body.id },
        data: { status: 'completed', completedAt: new Date() },
      })
      await prisma.activity.create({
        data: {
          leadId: existing.leadId,
          userId: existing.agentId,
          type: 'note',
          title: `Completed Follow-up`,
          details: existing.note,
        },
      })
    } else if (body.action === 'snooze') {
      const newDueDate = new Date(Date.now() + (body.snoozeDays || 1) * 24 * 60 * 60 * 1000)
      updated = await prisma.followup.update({
        where: { id: body.id },
        data: { status: 'pending', dueDate: newDueDate },
      })
    }

    return NextResponse.json({ success: true, followup: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
