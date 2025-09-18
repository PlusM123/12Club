import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { ParseGetQuery } from '@/utils/parseQuery'

import { getKv, setKv } from '@/lib/redis'

import {
  Introduction,
  Cover,
  PlayListItem
} from '@/types/common/detail-container'
import { prisma } from '../../../../prisma'
import { RESOURCE_CACHE_DURATION } from '@/config/cache'

const detailIdSchema = z.object({
  id: z.coerce.string().min(7).max(7),
  uid: z.coerce.number().optional()
})

const CACHE_KEY = 'resource'

const getDetailData = async (input: z.infer<typeof detailIdSchema>) => {
  const cachedResource = await getKv(`${CACHE_KEY}:${input.id}`)
  if (cachedResource) {
    return JSON.parse(cachedResource)
  }
  
  try {
    const detail = await prisma.resource.findUnique({
      where: { db_id: input.id },
      select: {
        id: true,
        introduction: true,
        created: true,
        updated: true,
        released: true,
        db_id: true,
        name: true,
        image_url: true,
        view: true,
        download: true,
        aliases: {
          select: { name: true }
        },
        play_links: {
          select: {
            accordion: true,
            link: true
          },
          orderBy: {
            accordion: 'asc'
          }
        },
        favorite_folders: {
          where: {
            folder: {
              user_id: input?.uid ?? 0
            }
          }
        },
        _count: {
          select: {
            comments: true,
            favorite_folders: true
          }
        }
      }
    })

    if (!detail) return '资源不存在'

    const playList: PlayListItem[] = detail.play_links

    const introduce: Introduction = {
      text: detail.introduction,
      created: detail.created.toISOString(),
      updated: (detail.updated || detail.created).toISOString(),
      released: detail.released,
      dbId: detail.db_id,
      alias: detail.aliases?.map((item) => item.name) as string[],
      playList,
      isFavorite: detail.favorite_folders?.length > 0,
      _count: {
        view: detail.view,
        download: detail.download,
        comment: detail._count.comments,
        favorited: detail._count.favorite_folders
      }
    }

    const coverData: Cover = {
      title: detail.name,
      author: '', // resource表中没有author字段，使用空字符串作为默认值
      image: detail.image_url
    }

    await setKv(
      `${CACHE_KEY}:${input.id}`,
      JSON.stringify({ introduce, coverData }),
      RESOURCE_CACHE_DURATION
    )

    // 更新浏览量
    await prisma.resource.update({
      where: { id: detail.id },
      data: { view: detail.view + 1 }
    })

    return { introduce, coverData }
  } catch (error) {
    console.error('获取资源详情失败:', error)
    return error instanceof Error ? error.message : '获取资源详情时发生未知错误'
  }
}

export const GET = async (req: NextRequest) => {
  const input = ParseGetQuery(req, detailIdSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }
  const response = await getDetailData(input)
  return NextResponse.json(response)
}
