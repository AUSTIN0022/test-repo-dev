import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { initiateAgentToLeadCallBridge } from '@/lib/services/callService'

// POST /api/calls/bridge - Trigger Agent-to-Lead Call Bridge
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 })
    }

    const lead = await prisma.lead.findUnique({
      where: { id: body.leadId },
    })

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const orgId = lead.organizationId
    const agentId = body.agentId || lead.assignedAgentId

    if (!agentId) {
      return NextResponse.json({ error: 'No agent assigned to lead for call bridging' }, { status: 400 })
    }

    const result = await initiateAgentToLeadCallBridge({
      organizationId: orgId,
      leadId: lead.id,
      agentId,
      initiatedByUserId: body.initiatedByUserId,
    })

    return NextResponse.json({ success: true, result })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
