import { prisma } from '@/lib/prisma'

export interface SendMessageOptions {
  organizationId: string
  leadId: string
  senderUserId?: string
  type: 'whatsapp' | 'sms'
  templateText: string
  placeholders?: Record<string, string>
}

export interface SendMessageResult {
  success: boolean
  messageId: string
  mode: 'dry_run' | 'production'
  formattedContent: string
  message: string
}

/**
 * Service adapter for WhatsApp & SMS messaging with 1-click template rendering.
 */
export async function sendLeadMessage(
  options: SendMessageOptions
): Promise<SendMessageResult> {
  const lead = await prisma.lead.findUnique({
    where: { id: options.leadId },
    include: { assignedAgent: true },
  })

  if (!lead) {
    throw new Error('Lead not found')
  }

  // Render template placeholders
  let content = options.templateText
  const replacements: Record<string, string> = {
    leadName: lead.fullName,
    leadPhone: lead.phone,
    source: lead.source,
    preferredLocation: lead.preferredLocation,
    propertyType: lead.propertyType,
    agentName: lead.assignedAgent?.name || 'EstateFlow Agent',
    agentPhone: lead.assignedAgent?.phone || '+919876543210',
    ...(options.placeholders || {}),
  }

  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value)
  }

  const settings = await prisma.integrationSettings.findUnique({
    where: { organizationId: options.organizationId },
  })

  const isDryRun = settings ? settings.dryRunMessage : true

  // Record Message in Database
  const msgRecord = await prisma.message.create({
    data: {
      organizationId: options.organizationId,
      leadId: lead.id,
      senderId: options.senderUserId || lead.assignedAgentId,
      type: options.type,
      content,
      status: isDryRun ? 'sent' : 'sent',
      sentAt: new Date(),
    },
  })

  // Create Activity log
  await prisma.activity.create({
    data: {
      leadId: lead.id,
      userId: options.senderUserId || lead.assignedAgentId,
      type: options.type,
      title: `Sent ${options.type.toUpperCase()} Follow-up`,
      details: content,
      metadata: JSON.stringify({ messageId: msgRecord.id, isDryRun }),
    },
  })

  // Update lead's last contacted timestamp
  await prisma.lead.update({
    where: { id: lead.id },
    data: { lastContactedAt: new Date() },
  })

  if (isDryRun) {
    return {
      success: true,
      messageId: msgRecord.id,
      mode: 'dry_run',
      formattedContent: content,
      message: `[DRY-RUN MODE] ${options.type.toUpperCase()} message simulated to ${lead.fullName} (${lead.phone}).`,
    }
  }

  // Production Twilio / WhatsApp Cloud API dispatch
  try {
    const twilioAccountSid = settings?.twilioSid || process.env.TWILIO_ACCOUNT_SID
    const twilioAuthToken = settings?.twilioToken || process.env.TWILIO_AUTH_TOKEN
    const whatsappSender = settings?.whatsappNumber || process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'

    if (!twilioAccountSid || !twilioAuthToken) {
      throw new Error('Twilio API credentials missing for live message dispatch.')
    }

    const authHeader = 'Basic ' + Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64')
    const params = new URLSearchParams()
    
    const recipientPhone = options.type === 'whatsapp' ? `whatsapp:${lead.phone}` : lead.phone
    const fromPhone = options.type === 'whatsapp' ? `whatsapp:${whatsappSender}` : settings?.twilioPhone || whatsappSender

    params.append('To', recipientPhone)
    params.append('From', fromPhone)
    params.append('Body', content)

    const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    if (!resp.ok) {
      const errData = await resp.json()
      throw new Error(errData.message || 'Twilio Message Dispatch Failed')
    }

    return {
      success: true,
      messageId: msgRecord.id,
      mode: 'production',
      formattedContent: content,
      message: `Live ${options.type.toUpperCase()} message sent to ${lead.fullName}.`,
    }
  } catch (err: any) {
    await prisma.message.update({
      where: { id: msgRecord.id },
      data: { status: 'failed' },
    })
    throw err
  }
}
