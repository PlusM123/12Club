import { z } from 'zod'
import { prisma } from '../../../../../prisma'
import { processComments } from '@/utils/processComments'

const detailIdSchema = z.object({
  id: z.coerce.string().min(7).max(7)
})

export const getResourceComment = async (
  input?: z.infer<typeof detailIdSchema>,
  uid?: number
) => {
  try {
    const detail = await prisma.resource.findUnique({
      where: { db_id: input ? input.id : 'a312010' },
      select: { id: true }
    })

    if (!detail) {
      return '资源不存在'
    }

    const comments = await prisma.resourceComment.findMany({
      where: { resource_id: detail.id },
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
      }
    })

    const processedComments = processComments(comments)

    return { comment: processedComments }
  } catch (error) {
    console.error('获取评论失败:', error)
    return error instanceof Error ? error.message : '获取评论时发生未知错误'
  }
}
