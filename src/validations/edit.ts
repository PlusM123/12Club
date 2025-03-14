import { z } from 'zod'

export const resourceCreateSchema = z.object({
  banner: z.any(),
  name: z.string().trim().min(1, { message: '资源名称是必填项' }),
  dbId: z.string().max(10),
  introduction: z
    .string()
    .trim()
    .min(10, { message: '资源介绍是必填项, 最少 10 个字符' })
    .max(100007, { message: '资源介绍最多 100007 字' }),
  alias: z
    .string()
    .max(2333, { message: '别名字符串总长度不可超过 3000 个字符' }),
  released: z.string()
})
