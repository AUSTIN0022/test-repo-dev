import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/settings - Fetch organization integration settings
export async function GET(req: NextRequest) {
  try {
    let org = await prisma.organization.findFirst()
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
    let org = await prisma.organization.findFirst()

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
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
        assignmentMode: body.assignmentMode || 'round_robin',
        maxCallDurationSeconds: body.maxCallDurationSeconds ? parseInt(body.maxCallDurationSeconds, 10) : 120,
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
        assignmentMode: body.assignmentMode || 'round_robin',
        maxCallDurationSeconds: body.maxCallDurationSeconds ? parseInt(body.maxCallDurationSeconds, 10) : 120,
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
