import { z } from 'zod'

export const adminPaginationSchema = z.object({
  page: z.coerce.number().min(1).max(9999999),
  limit: z.coerce.number().min(1).max(100),
  search: z.string().max(300, { message: '搜索内容最多 300 个字符' }).optional()
})

export const adminUpdateUserSchema = z.object({
  uid: z.coerce.number().min(1).max(9999999),
  name: z
    .string()
    .trim()
    .min(1, { message: '您的用户名最少需要 1 个字符' })
    .max(17, { message: '用户名长度不能超过 17 个字符' }),
  role: z.coerce.number().min(1).max(4),
  status: z.coerce.number().min(0).max(2),
  bio: z.string().trim().max(107, { message: '签名不能超过 107 个字符' })
})

export const adminUpdateResourceSchema = z.object({
  id: z.coerce.number().min(1).max(9999999),
  name: z.string().trim().min(1, { message: '资源名称不能为空' }),
  introduction: z.string().trim().min(1, { message: '资源介绍不能为空' }),
  released: z.string(),
  accordionTotal: z.coerce.number().min(1, { message: '总集数必须大于0' }),
  language: z.string(),
  status: z.coerce.number().min(0).max(2),
  aliases: z.array(z.string()).optional()
})

export const adminDeleteResourceSchema = z.object({
  id: z.coerce.number().min(1).max(9999999)
})
