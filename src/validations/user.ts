import { z } from 'zod'

export const getUserInfoSchema = z.object({
  uid: z.coerce.number().min(1).max(9999999),
  page: z.coerce.number().min(1).max(9999999),
  limit: z.coerce.number().min(1).max(20)
})

export const createFavoriteFolderSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(false)
})

export const updateFavoriteFolderSchema = z.object({
  folderId: z.coerce.number().min(1).max(9999999),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(false)
})

export const getFavoriteFolderResourceSchema = z.object({
  folderId: z.coerce.number().min(1).max(9999999),
  page: z.coerce.number().min(1).max(9999999),
  limit: z.coerce.number().min(1).max(100)
})

export const addToFavoriteSchema = z.object({
  dbId: z.coerce.string().min(1).max(9999999),
  folderId: z.coerce
    .number({ message: '收藏文件夹 ID 必须为数字' })
    .min(1)
    .max(9999999)
})