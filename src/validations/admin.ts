import { z } from 'zod'

export const adminPaginationSchema = z.object({
  page: z.coerce.number().min(1).max(9999999),
  limit: z.coerce.number().min(1).max(100),
  search: z.string().max(300, { message: '搜索内容最多 300 个字符' }).optional(),
  types: z.string().optional().transform((val) => {
    if (!val) return undefined
    return val.split(',').filter(type => ['a', 'c', 'g', 'n'].includes(type)) as ('a' | 'c' | 'g' | 'n')[]
  })
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
  dbId: z.string().trim().min(1, { message: '资源DBID不能为空' }),
  introduction: z.string().trim().min(1, { message: '资源介绍不能为空' }),
  released: z.string(),
  accordionTotal: z.coerce.number().optional(),
  language: z.string(),
  status: z.coerce.number().min(0).max(2),
  aliases: z.array(z.string()).optional(),
  author: z.string().trim().min(1, { message: '资源作者不能为空' }),
  translator: z.string().trim().optional()
})

export const adminDeleteResourceSchema = z.object({
  id: z.coerce.number().min(1).max(9999999)
})

// 公告相关验证模式
export const adminCreateAnnouncementSchema = z.object({
  title: z.string().trim().min(1, { message: '公告标题不能为空' }).max(255, { message: '公告标题不能超过 255 个字符' }),
  content: z.string().trim().min(1, { message: '公告内容不能为空' }).max(10000, { message: '公告内容不能超过 10000 个字符' })
})

export const adminUpdateAnnouncementSchema = z.object({
  id: z.coerce.number().min(1).max(9999999),
  title: z.string().trim().min(1, { message: '公告标题不能为空' }).max(255, { message: '公告标题不能超过 255 个字符' }),
  content: z.string().trim().min(1, { message: '公告内容不能为空' }).max(10000, { message: '公告内容不能超过 10000 个字符' })
})

export const adminDeleteAnnouncementSchema = z.object({
  id: z.coerce.number().min(1).max(9999999)
})

// 资源播放链接相关验证模式
export const adminCreateResourcePlayLinkSchema = z.object({
  resourceId: z.coerce.number().min(1).max(9999999),
  accordion: z.coerce.number().min(1).max(9999, { message: '集数不能超过 9999' }),
  showAccordion: z.string().trim().max(50, { message: '显示名称长度不能超过 50 个字符' }).optional(),
  link: z.string().trim().min(1, { message: '播放链接不能为空' }).max(2000, { message: '播放链接长度不能超过 2000 个字符' })
})

export const adminUpdateResourcePlayLinkSchema = z.object({
  id: z.coerce.number().min(1).max(9999999),
  accordion: z.coerce.number().min(1).max(9999, { message: '集数不能超过 9999' }),
  showAccordion: z.string().trim().max(50, { message: '显示名称长度不能超过 50 个字符' }).optional(),
  link: z.string().trim().min(1, { message: '播放链接不能为空' }).max(2000, { message: '播放链接长度不能超过 2000 个字符' })
})

export const adminDeleteResourcePlayLinkSchema = z.object({
  id: z.coerce.number().min(1).max(9999999)
})

// 播放链接查询参数验证模式
export const adminGetResourcePlayLinksSchema = z.object({
  resourceId: z.coerce.number().min(1).max(9999999)
})

export const adminDeleteResourcePlayLinkQuerySchema = z.object({
  id: z.coerce.number().min(1).max(9999999)
})

export const adminHandleFeedbackSchema = z.object({
  messageId: z.coerce.number().min(1).max(9999999),
  content: z
    .string()
    .trim()
    .max(5000, { message: '反馈回复不能超过 5000 个字符' })
})