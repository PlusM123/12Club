import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { ParseGetQuery } from '@/utils/parse-query'
import { prisma } from '@/prisma/prisma'
import { adminPaginationSchema } from '@/validations/admin'
import { verifyHeaderCookie } from '@/utils/actions/verifyHeaderCookie'
import type { AdminResource } from '@/types/api/admin'

export const getResource = async (
  input: z.infer<typeof adminPaginationSchema>,
) => {
  const { page, limit, search } = input
  const offset = (page - 1) * limit

  const where = search
    ? {
        name: {
          contains: search,
          mode: 'insensitive' as const
        }
      }
    : {}

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
        }
      }
    }),
    prisma.resource.count({ where })
  ])

  const resources: AdminResource[] = data.map((resource) => ({
    id: resource.id,
    uniqueId: resource.db_id,
    name: resource.name,
    banner: resource.image_url,
    user: resource.user,
    created: resource.created
  }))

  return { resources, total }
}

export async function GET(req: NextRequest) {
  const input = ParseGetQuery(req, adminPaginationSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }
  const payload = await verifyHeaderCookie()
  if (!payload) {
    return NextResponse.json('用户未登录')
  }
  if (payload.role < 3) {
    return NextResponse.json('本页面仅管理员可访问')
  }

  const res = await getResource(input)
  return NextResponse.json(res)
}
