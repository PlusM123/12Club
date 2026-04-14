import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { UserInfo } from '@/types/api/user'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getProfileSchema = z.object({
  id: z.coerce.number().min(1).max(9999999)
})

export const getUserProfile = async (
  input: z.infer<typeof getProfileSchema>,
  currentUserUid: number
) => {
  try {
    // 获取用户基本信息
    const user = await prisma.user.findUnique({
      where: { id: input.id }
    })

    if (!user) {
      return '未找到用户'
    }

    // 获取用户评论数量
    const commentCount = await prisma.resourceComment.count({
      where: { user_id: input.id }
    })

    const resourcePatchCount = await prisma.resourcePatch.count({
      where: { user_id: input.id }
    })

    // 获取播放历史数量（看过多少部番）
    let playHistoryCount = 0
    const visitor = await prisma.trackingVisitor.findFirst({
      where: { user_id: input.id }
    })
    if (visitor) {
      const events = await prisma.trackingEvent.findMany({
        where: {
          visitor_id: visitor.id,
          event_name: 'accordion-play',
          event_type: 'custom'
        },
        select: { extra_data: true },
        distinct: ['extra_data']
      })
      const dbIds = new Set<string>()
      for (const event of events) {
        const extra = event.extra_data as Record<string, unknown> | null
        if (extra?.['dbid']) dbIds.add(String(extra['dbid']))
      }
      playHistoryCount = dbIds.size
    }

    // 获取用户收藏资源数量
    const favoriteCount = await prisma.userResourceFavoriteFolderRelation.count(
      {
        where: {
          folder: {
            user_id: input.id
          }
        }
      }
    )

    const userInfo: UserInfo = {
      id: user.id,
      requestUserUid: currentUserUid,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      status: user.status,
      registerTime: user.register_time?.toISOString() || '',
      _count: {
        resource: 0,
        resource_patch: resourcePatchCount,
        play_history: playHistoryCount,
        resource_comment: commentCount,
        resource_favorite: favoriteCount
      }
    }

    return userInfo
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return error instanceof Error ? error.message : '获取用户信息时发生未知错误'
  }
}
