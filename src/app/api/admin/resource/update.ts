import { z } from 'zod'
import { prisma } from '../../../../../prisma'
import { adminUpdateResourceSchema } from '@/validations/admin'

export const updateResource = async (
  input: z.infer<typeof adminUpdateResourceSchema>
) => {
  try {
    // 更新资源
    await prisma.resource.update({
      where: { id: input.id },
      data: {
        name: input.name,
        introduction: input.introduction,
        released: input.released,
        accordion_total: input.accordionTotal,
        language: [input.language], // 转换为数组格式存储
        status: input.status
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

    return { success: true }
  } catch (error) {
    console.error('更新资源失败:', error)
    return error instanceof Error ? error.message : '更新资源时发生未知错误'
  }
} 