import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateAICaption } from '@/lib/services/aiService'

// POST /api/social/ai-caption - Generate AI real estate social media caption
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let org = await prisma.organization.findFirst()

    const caption = await generateAICaption({
      organizationId: org?.id || 'org-apex-gurgaon',
      propertyTitle: body.propertyTitle,
      location: body.location,
      price: body.price,
      platform: body.platform,
      topic: body.topic,
    })

    return NextResponse.json({ success: true, caption })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
