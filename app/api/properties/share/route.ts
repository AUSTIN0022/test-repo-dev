import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sharePropertiesWithLead } from '@/lib/services/propertyShareService'

// POST /api/properties/share - 1-Click Property Photo & Details Sharing
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.leadId || !body.propertyIds || body.propertyIds.length === 0) {
      return NextResponse.json({ error: 'leadId and propertyIds are required' }, { status: 400 })
    }

    const lead = await prisma.lead.findUnique({ where: { id: body.leadId } })
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const result = await sharePropertiesWithLead({
      organizationId: lead.organizationId,
      leadId: lead.id,
      propertyIds: body.propertyIds,
      senderUserId: body.senderUserId || lead.assignedAgentId || 'user-admin',
      channel: body.channel || 'whatsapp',
      customNote: body.customNote,
    })

    return NextResponse.json({ success: true, result })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
