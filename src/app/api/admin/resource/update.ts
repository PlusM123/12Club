import { z } from 'zod'
import { prisma } from '../../../../../prisma'
import { adminUpdateResourceSchema } from '@/validations/admin'
import { getRouteByDbId } from '@/utils/router'
import { getOpenlistToken } from '@/lib/openlist'

export const renameResource = async (
  dbId: string,
  newName: string
) => {
  const tokenResult = await getOpenlistToken()

  if (!tokenResult.success || !tokenResult.token) {
    return {
      success: false,
      message: tokenResult.message
    }
  }

  const openlistToken = tokenResult.token

  const path = `/resource${getRouteByDbId(dbId)}`

  const reName = await fetch(
    `${process.env.NEXT_OPENLIST_API_ADRESS}/fs/rename`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: openlistToken
      },
      body: JSON.stringify({
        path: path,
        name: newName
      })
    }
  )

  if (!reName.ok) {
    return {
      success: false,
      message: '重命名失败'
    }
  }

  return {
    success: true,
    message: '重命名成功'
  }
}

export const updateResource = async (
  input: z.infer<typeof adminUpdateResourceSchema>
) => {
  try {
    // 检查 dbId 是否与其他资源重复
    const existingResource = await prisma.resource.findFirst({
      where: {
        db_id: input.dbId,
        id: { not: input.id } // 排除当前正在更新的资源
      },
      select: {
        id: true,
        name: true
      }
    })

    if (existingResource) {
      return `${input.dbId} 已被资源${existingResource.name}使用，请使用其他 dbId`
    }

    const currentResource = await prisma.resource.findUnique({
      where: { id: input.id },
      select: {
        db_id: true,
        updated: true
      }
    })

    if (!currentResource) {
      return '资源不存在'
    }

    // 更新资源
    await prisma.resource.update({
      where: { id: input.id },
      data: {
        name: input.name,
        db_id: input.dbId,
        introduction: input.introduction,
        released: input.released,
        accordion_total: input.accordionTotal,
        language: [input.language], // 转换为数组格式存储
        status: input.status,
        author: input.author,
        image_url: `${process.env.IMAGE_BED_URL}/resource${getRouteByDbId(input.dbId)}/banner.avif`,
        translator: input.translator,
        updated: currentResource?.updated
      }
    })

    // 更新别名
    if (input.aliases) {
      // 删除旧别名
      await prisma.resourceAlias.deleteMany({
        where: { resource_id: input.id }
      })

      // 添加新别名
      if (input.aliases.length > 0) {
        await prisma.resourceAlias.createMany({
          data: input.aliases.map(name => ({
            name: name.trim(),
            resource_id: input.id
          }))
        })
      }
    }

    if (input.dbId !== currentResource?.db_id) {
      const res = await renameResource(currentResource.db_id, input.dbId)
      if (!res.success) {
        return res.message
      }
    }

    return { success: true }
  } catch (error) {
    console.error('更新资源失败:', error)
    return error instanceof Error ? error.message : '更新资源时发生未知错误'
  }
} 