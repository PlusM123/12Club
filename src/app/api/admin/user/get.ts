import { z } from 'zod'
import { adminPaginationSchema } from '@/validations/admin'
import type { AdminUser } from '@/types/api/admin'
import { prisma } from '../../../../../prisma'

export const getUserInfo = async (
  input: z.infer<typeof adminPaginationSchema>
) => {
  const { page, limit, search } = input
  const offset = (page - 1) * limit

  try {
    // 构建查询条件 - 支持搜索用户名或邮箱
    const whereCondition = search 
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {}

    // 获取用户数据
    const [usersData, total] = await Promise.all([
      prisma.user.findMany({
        where: whereCondition,
        skip: offset,
        take: limit,
        orderBy: { created: 'desc' },
        include: {
          _count: {
            select: {
              resource_patches: true,
              resources: true
            }
          }
        }
      }),
      prisma.user.count({
        where: whereCondition
      })
    ])

    // 数据格式转换
    const users: AdminUser[] = usersData.map((user) => ({
      id: user.id,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      role: user.role,
      email: user.email,
      created: user.created.toISOString(),
      status: user.status,
      _count: {
        resource_patch: user._count.resource_patches,
        resource: user._count.resources
      }
    }))

    return { users, total }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    throw error
  }
}
