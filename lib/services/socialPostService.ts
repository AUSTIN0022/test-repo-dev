import { prisma } from '@/lib/prisma'

export interface CreateSocialPostOptions {
  organizationId: string
  authorId: string
  postType: string
  caption: string
  mediaUrl?: string
  status?: string
  scheduledAt?: Date
  notes?: string
}

export async function createOrUpdateSocialPost(options: CreateSocialPostOptions) {
  const post = await prisma.socialPost.create({
    data: {
      organizationId: options.organizationId,
      authorId: options.authorId,
      postType: options.postType,
      caption: options.caption,
      mediaUrl: options.mediaUrl,
      status: options.status || 'draft',
      scheduledAt: options.scheduledAt,
      notes: options.notes,
    },
  })

  return {
    success: true,
    postId: post.id,
    post,
  }
}
