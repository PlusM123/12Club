import { NextRequest, NextResponse } from 'next/server'

import { withAdminAuth } from '@/lib/withAdminAuth'
import { ParseGetQuery } from '@/utils/parseQuery'
import { adminGetSeriesDetailSchema } from '@/validations/admin'

import { getSeriesDetail } from './get'

export async function GET(req: NextRequest) {
  const input = ParseGetQuery(req, adminGetSeriesDetailSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return withAdminAuth(req, async (_payload) => {
    const res = await getSeriesDetail(input)

    return NextResponse.json(res)
  })
}
