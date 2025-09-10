import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../prisma'
import { ParsePutBody } from '@/utils/parseQuery'
import { verifyHeaderCookie } from '@/middleware/_verifyHeaderCookie'
import { addToFavoriteSchema } from '@/validations/user'

export const togglePatchFavorite = async (
  input: z.infer<typeof addToFavoriteSchema>,
  uid: number
) => {
  console.log(input)
  const resource = await prisma.resource.findUnique({
    where: { db_id: input.dbId }
  })
  if (!resource) {
    return '未找到 Galgame'
  }

  const folder = await prisma.userResourceFavoriteFolder.findUnique({
    where: { id: input.folderId }
  })
  if (!folder) {
    return '未找到收藏文件夹'
  }
  if (folder.user_id !== uid) {
    return '这不是您的收藏夹'
  }

  const existing = await prisma.userResourceFavoriteFolderRelation.findUnique({
    where: {
      folder_id_db_id: {
        folder_id: input.folderId,
        db_id: resource.id
      }
    }
  })

  return await prisma.$transaction(async (prisma) => {
    if (existing) {
      await prisma.userResourceFavoriteFolderRelation.delete({
        where: {
          folder_id_db_id: {
            folder_id: input.folderId,
            db_id: resource.id
          }
        }
      })
      return { added: false }
    } else {
      await prisma.userResourceFavoriteFolderRelation.create({
        data: {
          folder_id: input.folderId,
          db_id: resource.id
        }
      })
      return { added: true }
    }
  })
}

export const PUT = async (req: NextRequest) => {
  const input = await ParsePutBody(req, addToFavoriteSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }
  const payload = await verifyHeaderCookie(req)
  if (!payload) {
    return NextResponse.json('用户未登录')
  }

  const response = await togglePatchFavorite(input, payload.uid)
  return NextResponse.json(response)
} 