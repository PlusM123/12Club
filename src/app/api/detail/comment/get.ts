import { z } from 'zod'
import { prisma } from '../../../../../prisma'
import { processComments } from '@/utils/processComments'

const detailIdSchema = z.object({
  id: z.coerce.string().min(7).max(7)
})

export const getResourceComment = async (uid?: number) => {
  try {
    // 获取所有评论，不限制特定资源
    const comments = await prisma.resourceComment.findMany({
      select: {
        id: true,
        parent_id: true,
        resource_id: true,
        content: true,
        created: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: {
        created: 'desc'
      }
    })

    const processedComments = processComments(comments)

    return { comment: processedComments }
  } catch (error) {
    console.error('获取评论失败:', error)
    return error instanceof Error ? error.message : '获取评论时发生未知错误'
  }
}
