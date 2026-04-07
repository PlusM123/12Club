import { NextRequest, NextResponse } from 'next/server'

import { withAdminAuth } from '@/lib/withAdminAuth'
import {
  ParseGetQuery,
  ParsePutBody,
  ParseDeleteQuery
} from '@/utils/parseQuery'
import {
  adminUpdateResourceSchema,
  adminDeleteResourceSchema,
  adminGetResourceSchema
} from '@/validations/admin'

import { deleteResource } from './delete'
import { getResource } from './get'
import { updateResource } from './update'

export async function GET(req: NextRequest) {
  const input = ParseGetQuery(req, adminGetResourceSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  return withAdminAuth(req, async (_payload) => {
    const res = await getResource(input)

    return NextResponse.json(res)
  })
}

export async function PUT(req: NextRequest) {
  const input = await ParsePutBody(req, adminUpdateResourceSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  return withAdminAuth(req, async (_payload) => {
    const res = await updateResource(input)

    return NextResponse.json(res)
  })
}

export async function DELETE(req: NextRequest) {
  const input = ParseDeleteQuery(req, adminDeleteResourceSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  return withAdminAuth(req, async (_payload) => {
    const res = await deleteResource(input)

    return NextResponse.json(res)
  })
}
