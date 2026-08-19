import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

async function getOrganizationId() {
  const user = await getSessionUser()
  return user?.organizationId ?? null
}

// GET /api/settings - Fetch organization integration settings
export async function GET(req: NextRequest) {
  try {
    const organizationId = await getOrganizationId()
    if (!organizationId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    let org = await prisma.organization.findUnique({ where: { id: organizationId } })
    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    let settings = await prisma.integrationSettings.findUnique({
      where: { organizationId: org.id },
    })

    if (!settings) {
      settings = await prisma.integrationSettings.create({
        data: {
          organizationId: org.id,
          assignmentMode: 'round_robin',
          maxCallDurationSeconds: 120,
          dryRunCall: true,
          dryRunMessage: true,
          dryRunEmail: true,
        },
      })
    }

    return NextResponse.json({ success: true, settings })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/settings - Update integration settings & dry-run switches
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const organizationId = await getOrganizationId()
    if (!organizationId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const org = await prisma.organization.findUnique({ where: { id: organizationId } })

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    const assignmentMode = body.assignmentMode || 'round_robin'
    const maxCallDurationSeconds = body.maxCallDurationSeconds === undefined
      ? 120
      : Number(body.maxCallDurationSeconds)

    if (!['round_robin', 'least_busy', 'manual'].includes(assignmentMode)) {
      return NextResponse.json({ error: 'Invalid assignment mode' }, { status: 400 })
    }

    if (!Number.isSafeInteger(maxCallDurationSeconds) || maxCallDurationSeconds < 1 || maxCallDurationSeconds > 3600) {
      return NextResponse.json(
        { error: 'maxCallDurationSeconds must be an integer between 1 and 3600' },
        { status: 400 }
      )
    }

    const settings = await prisma.integrationSettings.upsert({
      where: { organizationId: org.id },
      update: {
        twilioSid: body.twilioSid !== undefined ? body.twilioSid : undefined,
        twilioToken: body.twilioToken !== undefined ? body.twilioToken : undefined,
        twilioPhone: body.twilioPhone !== undefined ? body.twilioPhone : undefined,
        whatsappNumber: body.whatsappNumber !== undefined ? body.whatsappNumber : undefined,
        resendApiKey: body.resendApiKey !== undefined ? body.resendApiKey : undefined,
        openaiApiKey: body.openaiApiKey !== undefined ? body.openaiApiKey : undefined,
        assignmentMode,
        maxCallDurationSeconds,
        dryRunCall: body.dryRunCall !== undefined ? Boolean(body.dryRunCall) : true,
        dryRunMessage: body.dryRunMessage !== undefined ? Boolean(body.dryRunMessage) : true,
        dryRunEmail: body.dryRunEmail !== undefined ? Boolean(body.dryRunEmail) : true,
      },
      create: {
        organizationId: org.id,
        twilioSid: body.twilioSid || null,
        twilioToken: body.twilioToken || null,
        twilioPhone: body.twilioPhone || null,
        whatsappNumber: body.whatsappNumber || null,
        resendApiKey: body.resendApiKey || null,
        openaiApiKey: body.openaiApiKey || null,
        assignmentMode,
        maxCallDurationSeconds,
        dryRunCall: body.dryRunCall !== undefined ? Boolean(body.dryRunCall) : true,
        dryRunMessage: body.dryRunMessage !== undefined ? Boolean(body.dryRunMessage) : true,
        dryRunEmail: body.dryRunEmail !== undefined ? Boolean(body.dryRunEmail) : true,
      },
    })

    return NextResponse.json({ success: true, settings })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
