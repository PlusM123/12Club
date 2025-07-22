import { z } from 'zod'
import { prisma } from '@/prisma/prisma'
import { resourceCommentCreateSchema } from '@/validations/comment'
import { processComments } from '@/utils/processComments'

export const createResourceComment = async (
  input: z.infer<typeof resourceCommentCreateSchema>,
  uid: number
) => {
  try {
    // 查找资源详情
    const detail = await prisma.resource.findUnique({
      where: { db_id: input.id },
      select: { id: true }
    })

    if (!detail) {
      return '资源不存在'
    }

    // 创建新评论
    const newComment = await prisma.resourceComment.create({
      data: {
        content: input?.content,
        parent_id: input?.parentId,
        user_id: uid,
        resource_id: detail.id
      },
      select: {
        id: true,
        parent_id: true,
        resource_id: true,
        content: true,
        created: true
      }
    })

    // 获取所有相关评论
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

    // 处理评论结构
    const processedComments = processComments(comments)

    return { comment: processedComments, newCommentId: newComment }
  } catch (error) {
    console.error('创建评论失败:', error)
    return error instanceof Error ? error.message : '创建评论时发生未知错误'
  }
}
