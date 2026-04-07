import { NextRequest, NextResponse } from 'next/server'

import { withAdminAuth } from '@/lib/withAdminAuth'
import { ParsePostBody, ParseDeleteQuery } from '@/utils/parseQuery'
import {
  adminAddSeriesToResourceSchema,
  adminRemoveSeriesFromResourceSchema
} from '@/validations/admin'

import { addResourcesToSeries } from './add'
import { removeResourcesFromSeries } from './remove'

export async function POST(req: NextRequest) {
  const input = await ParsePostBody(req, adminAddSeriesToResourceSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  return withAdminAuth(req, async (_payload) => {
    const res = await addResourcesToSeries(input)

    return NextResponse.json(res)
  })
}

export async function DELETE(req: NextRequest) {
  const input = ParseDeleteQuery(req, adminRemoveSeriesFromResourceSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  return withAdminAuth(req, async (_payload) => {
    const res = await removeResourcesFromSeries(input)

    return NextResponse.json(res)
  })
}
