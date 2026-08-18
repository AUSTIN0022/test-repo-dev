import { prisma } from '@/lib/prisma'

export interface CallBridgeRequest {
  organizationId: string
  leadId: string
  agentId: string
  initiatedByUserId?: string
}

export interface CallBridgeResult {
  success: boolean
  callId: string
  mode: 'dry_run' | 'production'
  message: string
  details?: {
    agentPhone?: string
    leadPhone?: string
    maxDurationSeconds?: number
    callSid?: string
    conferenceSid?: string
  }
}

/**
 * Initiates an instant agent-to-lead call bridge.
 * 
 * Flow:
 * 1. Look up assigned Agent and Lead phone numbers.
 * 2. Fetch Organization Integration Settings (for Twilio credentials & dry-run toggle).
 * 3. Enforce max call duration (default 120s / 2 mins) to safeguard Twilio trial balance.
 * 4. In Production Mode: Trigger Twilio Voice API to call the agent first.
 *    When agent answers, play TwiML message ("New real estate lead from {{source}}. Press any key to connect with {{leadName}}.").
 *    Once agent presses key (or answers), call lead and bridge into conference.
 * 5. In Dry-Run Mode: Simulate instant agent pickup, conference bridging, call duration, and log creation.
 */
export async function initiateAgentToLeadCallBridge(
  req: CallBridgeRequest
): Promise<CallBridgeResult> {
  const lead = await prisma.lead.findUnique({
    where: { id: req.leadId },
    include: { assignedAgent: true },
  })

  if (!lead) {
    throw new Error('Lead not found')
  }

  const agent = req.agentId
    ? await prisma.user.findUnique({ where: { id: req.agentId } })
    : lead.assignedAgent

  if (!agent || !agent.phone) {
    throw new Error('Assigned agent does not have a valid phone number')
  }

  const settings = await prisma.integrationSettings.findUnique({
    where: { organizationId: req.organizationId },
  })

  const isDryRun = settings ? settings.dryRunCall : true
  const maxDuration = settings?.maxCallDurationSeconds || 120 // Default 2 minutes safeguard

  // Create initial Call Record in DB
  const callRecord = await prisma.call.create({
    data: {
      organizationId: req.organizationId,
      leadId: lead.id,
      agentId: agent.id,
      status: isDryRun ? 'in_conference' : 'initiated',
      outcome: isDryRun ? 'Simulated Call Bridge Connected' : 'Call Dispatch Initiated',
      startedAt: new Date(),
    },
  })

  // Log activity on lead timeline
  await prisma.activity.create({
    data: {
      leadId: lead.id,
      userId: agent.id,
      type: 'call',
      title: `Instant Call Bridge ${isDryRun ? '(Dry-Run Simulated)' : 'Triggered'}`,
      details: `Agent ${agent.name} (${agent.phone}) bridging call with Lead ${lead.fullName} (${lead.phone}). Max Duration: ${maxDuration}s.`,
      metadata: JSON.stringify({
        callId: callRecord.id,
        isDryRun,
        maxDurationSeconds: maxDuration,
        source: lead.source,
      }),
    },
  })

  // Update lead's last contacted timestamp & status
  await prisma.lead.update({
    where: { id: lead.id },
    data: {
      lastContactedAt: new Date(),
      status: lead.status === 'new' ? 'contacted' : lead.status,
    },
  })

  if (isDryRun) {
    // Simulate call completion after a mock duration
    const mockDuration = Math.min(45, maxDuration)
    await prisma.call.update({
      where: { id: callRecord.id },
      data: {
        status: 'completed',
        duration: mockDuration,
        outcome: `Connected - Lead interested in ${lead.propertyType} (${lead.preferredLocation})`,
        recordingUrl: 'https://demo-recordings.estateflow.app/samples/call-bridge-102.mp3',
        endedAt: new Date(),
      },
    })

    return {
      success: true,
      callId: callRecord.id,
      mode: 'dry_run',
      message: `[DRY-RUN MODE] Call bridge simulated successfully between Agent ${agent.name} and Lead ${lead.fullName}. Max time limit enforced: ${maxDuration}s.`,
      details: {
        agentPhone: agent.phone,
        leadPhone: lead.phone,
        maxDurationSeconds: maxDuration,
        callSid: `DRYRUN_CALL_${callRecord.id.slice(0, 8)}`,
        conferenceSid: `DRYRUN_CONF_${callRecord.id.slice(0, 8)}`,
      },
    }
  }

  // Production Twilio Voice Execution
  try {
    const twilioAccountSid = settings?.twilioSid || process.env.TWILIO_ACCOUNT_SID
    const twilioAuthToken = settings?.twilioToken || process.env.TWILIO_AUTH_TOKEN
    const twilioPhone = settings?.twilioPhone || process.env.TWILIO_PHONE_NUMBER

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhone) {
      throw new Error('Twilio API credentials (Account SID, Auth Token, Phone Number) are missing in Settings.')
    }

    const authHeader = 'Basic ' + Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64')
    
    const appUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://real-estate-property-hub.v0.build'
    const twimlUrl = `${appUrl}/api/calls/twiml/agent?leadName=${encodeURIComponent(lead.fullName)}&source=${encodeURIComponent(lead.source)}&leadPhone=${encodeURIComponent(lead.phone)}&timeLimit=${maxDuration}&callId=${callRecord.id}`

    const params = new URLSearchParams()
    params.append('To', agent.phone)
    params.append('From', twilioPhone)
    params.append('Url', twimlUrl)
    params.append('TimeLimit', maxDuration.toString())
    params.append('Timeout', '20')

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Calls.json`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    const twilioData = await response.json()

    if (!response.ok) {
      throw new Error(twilioData.message || 'Twilio Voice call dispatch failed')
    }

    await prisma.call.update({
      where: { id: callRecord.id },
      data: {
        callSid: twilioData.sid,
        status: 'agent_ringing',
        outcome: 'Agent phone ringing...',
      },
    })

    return {
      success: true,
      callId: callRecord.id,
      mode: 'production',
      message: `Twilio Voice call placed to Agent ${agent.name}. Lead ${lead.fullName} will be bridged upon confirmation.`,
      details: {
        agentPhone: agent.phone,
        leadPhone: lead.phone,
        maxDurationSeconds: maxDuration,
        callSid: twilioData.sid,
      },
    }
  } catch (err: any) {
    await prisma.call.update({
      where: { id: callRecord.id },
      data: {
        status: 'failed',
        outcome: `Call Bridge Failed: ${err.message}`,
        endedAt: new Date(),
      },
    })

    throw err
  }
}
