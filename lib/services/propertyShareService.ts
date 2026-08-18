import { prisma } from '@/lib/prisma'
import { sendLeadMessage } from './messageService'

export interface SharePropertyOptions {
  organizationId: string
  leadId: string
  propertyIds: string[]
  senderUserId: string
  channel: 'whatsapp' | 'sms' | 'email'
  customNote?: string
}

export async function sharePropertiesWithLead(options: SharePropertyOptions) {
  const lead = await prisma.lead.findUnique({
    where: { id: options.leadId },
  })

  if (!lead) {
    throw new Error('Lead not found')
  }

  const properties = await prisma.property.findMany({
    where: { id: { in: options.propertyIds } },
    include: { images: true },
  })

  if (properties.length === 0) {
    throw new Error('No valid properties selected for sharing')
  }

  // Create PropertyShare token
  const token = `share_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`
  const shareTitle = properties.length === 1 
    ? properties[0].title 
    : `${properties.length} Featured Properties for ${lead.fullName}`

  const share = await prisma.propertyShare.create({
    data: {
      token,
      leadId: lead.id,
      organizationId: options.organizationId,
      title: shareTitle,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      shareProperties: {
        create: properties.map((p) => ({
          propertyId: p.id,
        })),
      },
    },
  })

  const appBaseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'https://real-estate-property-hub.v0.build'
  
  const shareLink = `${appBaseUrl}/share/${share.token}`

  const primaryProp = properties[0]
  const formattedPrice = `₹${(primaryProp.price / 100000).toFixed(1)} Lakhs`

  const template = options.customNote || 
    `Hi {{leadName}}, sharing details of {{propertyTitle}} in {{location}}. Price: {{price}}. Photos, floor plans & brochure: {{shareLink}}`

  const result = await sendLeadMessage({
    organizationId: options.organizationId,
    leadId: lead.id,
    senderUserId: options.senderUserId,
    type: options.channel === 'email' ? 'sms' : options.channel,
    templateText: template,
    placeholders: {
      propertyTitle: primaryProp.title,
      location: primaryProp.city,
      price: formattedPrice,
      shareLink: shareLink,
    },
  })

  // Log share activity
  await prisma.activity.create({
    data: {
      leadId: lead.id,
      userId: options.senderUserId,
      type: 'share',
      title: `Shared ${properties.length} Property Photo(s)/Details`,
      details: `Properties: ${properties.map((p) => p.title).join(', ')}. Share Link: ${shareLink}`,
      metadata: JSON.stringify({ shareId: share.id, token, shareLink }),
    },
  })

  return {
    success: true,
    shareToken: share.token,
    shareLink,
    propertiesSharedCount: properties.length,
    messageResult: result,
  }
}
