'use server'

import { z } from 'zod'
import { cache } from 'react'
import { safeParseSchema } from '@/utils/actions/safeParseSchema'
import { FetchGet } from '@/utils/fetch'
import { verifyHeaderCookie } from '@/utils/actions/verifyHeaderCookie'
import {
  Introduction,
  Cover,
} from '@/types/common/detail-container'

const idSchema = z.object({
  id: z.string().min(7).max(7)
})

const _getResourceActions = async (params: z.infer<typeof idSchema>) => {
  const input = safeParseSchema(idSchema, params)
  if (typeof input === 'string') {
    return input
  }

  const payload = await verifyHeaderCookie()
  
  const response = await FetchGet<{
    introduce: Introduction
    coverData: Cover
  }>('/detail', {
    id: params.id,
    uid: payload?.uid ?? 0
  })

  if (typeof response === 'string') return response

  const { introduce, coverData } = response
  return { introduce, coverData }
}

// 使用 React cache 缓存函数调用结果
export const getResourceActions = cache(_getResourceActions)
