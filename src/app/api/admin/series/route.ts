import { NextRequest, NextResponse } from 'next/server'

import { withAdminAuth } from '@/lib/withAdminAuth'
import { ParseGetQuery, ParsePostBody } from '@/utils/parseQuery'
import {
  adminGetSeriesSchema,
  adminCreateSeriesSchema
} from '@/validations/admin'

import { createSeries } from './create'
import { getSeries } from './get'

export async function GET(req: NextRequest) {
  const input = ParseGetQuery(req, adminGetSeriesSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  return withAdminAuth(req, async (_payload) => {
    const res = await getSeries(input)

    return NextResponse.json(res)
  })
}

export async function POST(req: NextRequest) {
  const input = await ParsePostBody(req, adminCreateSeriesSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  return withAdminAuth(req, async (payload) => {
    const res = await createSeries(input, payload.uid)

    return NextResponse.json(res)
  })
}
