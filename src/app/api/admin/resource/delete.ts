import { z } from 'zod'
import { prisma } from '../../../../../prisma'
import { adminDeleteResourceSchema } from '@/validations/admin'
import { getRouteByDbId } from '@/utils/router'
import { deleteFolderFromS3 } from '@/lib/s3'

export const deleteResource = async (
  input: z.infer<typeof adminDeleteResourceSchema>
) => {
  try {
    // 检查资源是否存在
    const existingResource = await prisma.resource.findUnique({
      where: { id: input.id },
      select: {
        id: true,
        name: true,
        db_id: true
      }
    })

    if (!existingResource) {
      return '资源不存在'
    }

    // 删除资源（级联删除会自动处理相关数据）
    await prisma.resource.delete({
      where: { id: input.id }
    })

    // 删除S3中的资源
    await deleteFolderFromS3(`resource${getRouteByDbId(existingResource.db_id)}`)

    return {
      success: true,
      message: `资源 "${existingResource.name}" 已成功删除`
    }
  } catch (error) {
    console.error('删除资源失败:', error)
    return error instanceof Error ? error.message : '删除资源时发生未知错误'
  }
} 