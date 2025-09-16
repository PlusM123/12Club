import { prisma } from '../../../../../prisma'
import { processComments } from '@/utils/processComments'

export const getResourceComment = async (resourceId?: string) => {
  try {
    if (!resourceId) {
      return '资源ID不能为空'
    }

    // 首先查找资源获取其数据库ID
    const resource = await prisma.resource.findUnique({
      where: { db_id: resourceId },
      select: { id: true }
    })

    if (!resource) {
      return '资源不存在'
    }

    // 获取特定资源的评论
    const comments = await prisma.resourceComment.findMany({
      where: { resource_id: resource.id },
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
