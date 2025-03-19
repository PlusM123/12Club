'use server'

import { z } from 'zod'
import { verifyHeaderCookie } from '@/utils/actions/verifyHeaderCookie'
import { safeParseSchema } from '@/utils/actions/safeParseSchema'
import { FetchGet } from '@/utils/fetch'
import { Introduction, Cover } from '@/types/common/detail-container'

const idSchema = z.object({
  id: z.string().min(7).max(7)
})

export const getResourceActions = async (params: z.infer<typeof idSchema>) => {
  const input = safeParseSchema(idSchema, params)
  if (typeof input === 'string') {
    return input
  }
  const payload = await verifyHeaderCookie()

  const data = await FetchGet<{
    introduce: Introduction
    coverData: Cover
  }>('/detail', {
    id: params.id
  })

  if (typeof data === 'string') return data

  const { introduce, coverData } = data
  return { introduce, coverData }
}
