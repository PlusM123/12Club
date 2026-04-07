'use server'

import { z } from 'zod'

import { getAnnouncementInfo } from '@/app/api/admin/announcement/get'
import { safeParseSchema } from '@/utils/actions/safeParseSchema'
import { verifyHeaderCookie } from '@/utils/actions/verifyHeaderCookie'
import { adminPaginationSchema } from '@/validations/admin'

export const getActions = async (
  input: z.infer<typeof adminPaginationSchema>
) => {
  const parsed = safeParseSchema(adminPaginationSchema, input)
  if (typeof parsed === 'string') {
    return parsed
  }

  const payload = await verifyHeaderCookie()
  if (!payload) {
    return '用户登陆失效'
  }

  const response = await getAnnouncementInfo(parsed)
  if (typeof response === 'string') {
    return response
  }

  return {
    announcements: response.data,
    total: response.pagination.total
  }
}
