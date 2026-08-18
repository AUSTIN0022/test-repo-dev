import { prisma } from '@/lib/prisma'

export interface SendEmailOptions {
  organizationId: string
  leadId: string
  subject: string
  htmlBody: string
  senderUserId?: string
}

export async function sendLeadEmail(options: SendEmailOptions) {
  const lead = await prisma.lead.findUnique({
    where: { id: options.leadId },
  })

  if (!lead || !lead.email) {
    throw new Error('Lead does not have a valid email address')
  }

  const settings = await prisma.integrationSettings.findUnique({
    where: { organizationId: options.organizationId },
  })

  const isDryRun = settings ? settings.dryRunEmail : true

  // Record Message as Email in DB
  const msgRecord = await prisma.message.create({
    data: {
      organizationId: options.organizationId,
      leadId: lead.id,
      senderId: options.senderUserId,
      type: 'email',
      content: `Subject: ${options.subject}\n\n${options.htmlBody.replace(/<[^>]+>/g, '')}`,
      status: 'sent',
      sentAt: new Date(),
    },
  })

  await prisma.activity.create({
    data: {
      leadId: lead.id,
      userId: options.senderUserId,
      type: 'email',
      title: `Sent Email: ${options.subject}`,
      details: options.htmlBody,
      metadata: JSON.stringify({ messageId: msgRecord.id, isDryRun }),
    },
  })

  if (isDryRun) {
    return {
      success: true,
      mode: 'dry_run',
      message: `[DRY-RUN MODE] Email simulated to ${lead.email}. Subject: "${options.subject}"`,
    }
  }

  try {
    const resendApiKey = settings?.resendApiKey || process.env.RESEND_API_KEY
    if (!resendApiKey) {
      throw new Error('Resend API key missing in settings.')
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'EstateFlow CRM <onboarding@resend.dev>',
        to: [lead.email],
        subject: options.subject,
        html: options.htmlBody,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Failed to send email via Resend')
    }

    return {
      success: true,
      mode: 'production',
      message: `Email sent successfully to ${lead.email}`,
    }
  } catch (err: any) {
    await prisma.message.update({
      where: { id: msgRecord.id },
      data: { status: 'failed' },
    })
    throw err
  }
}
