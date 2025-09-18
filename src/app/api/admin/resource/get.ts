import { z } from 'zod'
import { prisma } from '../../../../../prisma'
import { adminPaginationSchema } from '@/validations/admin'
import type { AdminResource } from '@/types/api/admin'

export const getResource = async (
  input: z.infer<typeof adminPaginationSchema>,
) => {
  const { page, limit, search } = input
  const offset = (page - 1) * limit

  // 构建查询条件 - 支持搜索资源名称或别名
  const where = search
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive' as const
            }
          },
          {
            db_id: {
              contains: search,
              mode: 'insensitive' as const
            }
          },
          {
            aliases: {
              some: {
                name: {
                  contains: search,
                  mode: 'insensitive' as const
                }
              }
            }
          }
        ]
      }
    : {}

  try {
    const [data, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { created: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          aliases: {
            select: {
              id: true,
              name: true
            }
          },
          favorite_folders: {
            select: {
              id: true, 
            }
          }
        }
      }),
      prisma.resource.count({ where })
    ])

    const resources: AdminResource[] = data.map((resource) => ({
      id: resource.id,
      dbId: resource.db_id,
      name: resource.name,
      banner: resource.image_url,
      user: resource.user,
      created: resource.created,
      introduction: resource.introduction,
      released: resource.released,
      accordionTotal: resource.accordion_total,
      language: Array.isArray(resource.language) && resource.language.length > 0 
        ? resource.language[0] 
        : 'other', // 安全地取第一个语言作为主语言
      type: resource.type,
      status: resource.status,
      download: resource.download,
      view: resource.view,
      comment: resource.comment,
      favorite_by: resource.favorite_folders.length,
      aliases: resource.aliases?.map(alias => alias.name) || [] // 转换为字符串数组
    }))

    return { resources, total }
  } catch (error) {
    console.error('获取资源列表失败:', error)
    return error instanceof Error ? error.message : '获取资源列表时发生未知错误'
  }
} 