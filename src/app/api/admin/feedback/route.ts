import { NextRequest, NextResponse } from 'next/server'

import { withAdminAuth } from '@/lib/withAdminAuth'
import { ParseGetQuery } from '@/utils/parseQuery'
import { adminPaginationSchema } from '@/validations/admin'

import { getFeedback } from './get'

export const GET = async (req: NextRequest) => {
  const input = ParseGetQuery(req, adminPaginationSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  return withAdminAuth(req, async (_payload) => {
    const response = await getFeedback(input)

    return NextResponse.json(response)
  })
}
