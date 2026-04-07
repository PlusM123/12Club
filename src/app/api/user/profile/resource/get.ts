import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { getUserInfoSchema } from '@/validations/user'

import type { UserResource } from '@/types/api/user'

export const getUserPatchResource = async (
  input: z.infer<typeof getUserInfoSchema>
) => {
  const { uid, page, limit } = input
  const offset = (page - 1) * limit

  const [data, total] = await Promise.all([
    prisma.resourcePatch.findMany({
      where: { user_id: uid },
      include: {
        resource: true
      },
      orderBy: { created: 'desc' },
      skip: offset,
      take: limit
    }),
    prisma.resourcePatch.count({
      where: { user_id: uid }
    })
  ])

  const resources: UserResource[] = data.map((res) => ({
    id: res.id,
    patchUniqueId: res.resource.db_id,
    patchId: res.id,
    patchName: res.name,
    patchBanner: res.resource.image_url,
    size: res.size,
    type: res.resource.type,
    language: res.language,
    platform: [], // ResourcePatch模型中没有platform字段，设为空数组
    created: String(res.created),
    content: res.content
  }))

  return { resources, total }
}
