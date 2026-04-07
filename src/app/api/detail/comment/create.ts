import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { processComments } from '@/utils/processComments'
import { resourceCommentCreateSchema } from '@/validations/comment'

const createCommentWithRetry = async (createData: any, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const newComment = await prisma.resourceComment.create({
        data: createData,
        select: {
          id: true,
          parent_id: true,
          resource_id: true,
          content: true,
          created: true
        }
      })

      return newComment
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Unique constraint failed') &&
        attempt < maxRetries
      ) {
        console.warn(`⚠️ 约束冲突，重试第 ${attempt} 次...`)

        // 等待一个随机的短时间后重试
        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 100 + 50)
        )
        continue
      }

      throw error
    }
  }

  throw new Error('创建评论失败：达到最大重试次数')
}

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

    // 准备创建数据，正确处理parentId
    const createData: {
      content: string
      user_id: number
      resource_id: number
      parent_id?: number
    } = {
      content: input.content,
      user_id: uid,
      resource_id: detail.id
    }

    // 只有当parentId存在且为有效数字时才添加parent_id字段
    if (input.parentId && input.parentId > 0) {
      createData.parent_id = input.parentId
    }

    // 使用重试机制创建新评论
    const newComment = await createCommentWithRetry(createData)

    // 获取所有相关评论
    const comments = await prisma.resourceComment.findMany({
      where: { resource_id: detail.id },
      select: {
        id: true,
        parent_id: true,
        resource_id: true,
        content: true,
        created: true,
        likes: {
          where: {
            user_id: uid
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    })

    // 处理评论结构
    const processedComments = processComments(comments)

    return { comment: processedComments, newCommentId: newComment.id }
  } catch (error) {
    console.error('❌ 创建评论失败:', error)

    // 如果是Prisma的唯一约束错误，提供更详细的信息
    if (
      error instanceof Error &&
      error.message.includes('Unique constraint failed')
    ) {
      console.error('🚨 ID约束冲突详情:', {
        resourceDbId: input.id,
        userId: uid,
        parentId: input.parentId,
        errorMessage: error.message
      })
      return '评论创建失败：数据库约束冲突，请稍后重试'
    }

    return error instanceof Error ? error.message : '创建评论时发生未知错误'
  }
}
