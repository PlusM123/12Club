import { NextRequest, NextResponse } from 'next/server'

import { withAdminAuth } from '@/lib/withAdminAuth'
import { ParsePutBody, ParseDeleteQuery } from '@/utils/parseQuery'
import {
  adminUpdateSeriesSchema,
  adminDeleteSeriesSchema
} from '@/validations/admin'

import { deleteSeries } from './delete'
import { updateSeries } from './update'

export async function PUT(req: NextRequest) {
  const input = await ParsePutBody(req, adminUpdateSeriesSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  return withAdminAuth(req, async (_payload) => {
    const res = await updateSeries(input)

    return NextResponse.json(res)
  })
}

export async function DELETE(req: NextRequest) {
  const input = ParseDeleteQuery(req, adminDeleteSeriesSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  return withAdminAuth(req, async (_payload) => {
    const res = await deleteSeries(input)

    return NextResponse.json(res)
  })
}
