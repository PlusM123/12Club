'use server'

import { z } from 'zod'

import { getPageData } from '@/app/api/page/get'
import { safeParseSchema } from '@/utils/actions/safeParseSchema'
import { pageSchema } from '@/validations/page'

export const getPageResourceActions = async (
  params: z.infer<typeof pageSchema>
) => {
  const input = safeParseSchema(pageSchema, params)
  if (typeof input === 'string') {
    return input
  }

  const response = await getPageData(input)

  return response
}
