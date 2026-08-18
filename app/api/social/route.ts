import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createOrUpdateSocialPost } from '@/lib/services/socialPostService'

// GET /api/social - Fetch social media content calendar
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const postType = searchParams.get('type')

    const where: any = {}
    if (status && status !== 'all') where.status = status
    if (postType && postType !== 'all') where.postType = postType

    const posts = await prisma.socialPost.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, role: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, posts })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/social - Create or update social post draft
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.caption) {
      return NextResponse.json({ error: 'caption is required' }, { status: 400 })
    }

    let org = await prisma.organization.findFirst()

    const result = await createOrUpdateSocialPost({
      organizationId: org?.id || 'org-apex-gurgaon',
      authorId: body.authorId || 'user-social',
      postType: body.postType || 'instagram_post',
      caption: body.caption,
      mediaUrl: body.mediaUrl || null,
      status: body.status || 'draft',
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
      notes: body.notes || null,
    })

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
