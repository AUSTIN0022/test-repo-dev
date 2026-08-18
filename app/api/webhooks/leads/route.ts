import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { assignLeadToAvailableAgent } from '@/lib/services/leadAssignmentService'
import { initiateAgentToLeadCallBridge } from '@/lib/services/callService'

/**
 * POST /api/webhooks/leads
 * Accepts leads from external platforms like 36 Acre, MagicBricks, Housing, Facebook Ads, Zapier, etc.
 * 
 * Payload Example:
 * {
 *   "fullName": "Rahul Sharma",
 *   "phone": "+919999999999",
 *   "email": "rahul@example.com",
 *   "source": "36 Acre",
 *   "propertyType": "apartment",
 *   "budgetMin": 7500000,
 *   "budgetMax": 12000000,
 *   "preferredLocation": "Gurgaon",
 *   "notes": "Looking for 3BHK near Golf Course Road"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.fullName || !body.phone) {
      return NextResponse.json({ error: 'fullName and phone are required fields' }, { status: 400 })
    }

    // Default to the main organization
    let org = await prisma.organization.findFirst()
    if (!org) {
      org = await prisma.organization.create({
        data: {
          name: 'Apex Horizon Realty',
          city: 'Gurgaon',
          country: 'India',
        },
      })
    }

    // Get assigned agent via round-robin or least busy mode
    const settings = await prisma.integrationSettings.findUnique({
      where: { organizationId: org.id },
    })

    const assignedAgentId = await assignLeadToAvailableAgent({
      organizationId: org.id,
      preferredMode: (settings?.assignmentMode as any) || 'round_robin',
    })

    // Create lead in Database
    const lead = await prisma.lead.create({
      data: {
        organizationId: org.id,
        fullName: body.fullName,
        phone: body.phone,
        email: body.email || null,
        source: body.source || 'Webhook Intake',
        propertyType: (body.propertyType || 'apartment').toLowerCase(),
        budgetMin: body.budgetMin ? parseInt(body.budgetMin, 10) : 5000000,
        budgetMax: body.budgetMax ? parseInt(body.budgetMax, 10) : 15000000,
        preferredLocation: body.preferredLocation || 'Gurgaon',
        status: 'new',
        temperature: 'hot', // Webhook leads default to HOT!
        assignedAgentId,
        notes: body.notes || 'Ingested automatically via Webhook',
      },
      include: { assignedAgent: true },
    })

    // Log Activity
    await prisma.activity.create({
      data: {
        leadId: lead.id,
        userId: assignedAgentId,
        type: 'status_change',
        title: `Incoming Webhook Lead from ${lead.source}`,
        details: `Assigned to ${lead.assignedAgent?.name || 'Agent'}. Auto call bridge queued.`,
      },
    })

    // Create Notification for assigned agent
    if (assignedAgentId) {
      await prisma.notification.create({
        data: {
          organizationId: org.id,
          userId: assignedAgentId,
          title: `🔥 New Hot Lead: ${lead.fullName}`,
          message: `Lead from ${lead.source} interested in ${lead.propertyType} (${lead.preferredLocation}). Call bridge initiating...`,
          type: 'lead_assigned',
          link: `/leads/${lead.id}`,
        },
      })
    }

    // Trigger Instant Call Bridge Automation
    let callResult = null
    if (assignedAgentId) {
      try {
        callResult = await initiateAgentToLeadCallBridge({
          organizationId: org.id,
          leadId: lead.id,
          agentId: assignedAgentId,
        })
      } catch (callErr: any) {
        console.error('Auto Call Bridge Dispatch Error:', callErr.message)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Lead received and assigned successfully.',
      lead: {
        id: lead.id,
        fullName: lead.fullName,
        source: lead.source,
        assignedAgent: lead.assignedAgent?.name || 'Unassigned',
      },
      callBridge: callResult,
    })
  } catch (err: any) {
    console.error('Lead Webhook Error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
