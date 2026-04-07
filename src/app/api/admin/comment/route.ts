import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { withAdminAuth } from '@/lib/withAdminAuth'
import {
  ParseDeleteQuery,
  ParseGetQuery,
  ParsePutBody
} from '@/utils/parseQuery'
import { adminPaginationSchema } from '@/validations/admin'
import { patchCommentUpdateSchema } from '@/validations/patch'

import { deleteComment } from './delete'
import { getComment } from './get'
import { updateComment } from './update'

const commentIdSchema = z.object({
  commentId: z.coerce
    .number({ message: '评论 ID 必须为数字' })
    .min(1)
    .max(9999999)
})

export async function GET(req: NextRequest) {
  const input = ParseGetQuery(req, adminPaginationSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  return withAdminAuth(req, async (_payload) => {
    const res = await getComment(input)

    return NextResponse.json(res)
  })
}

export const PUT = async (req: NextRequest) => {
  const input = await ParsePutBody(req, patchCommentUpdateSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  return withAdminAuth(req, async (payload) => {
    const response = await updateComment(input, payload.uid)

    return NextResponse.json(response)
  })
}

export const DELETE = async (req: NextRequest) => {
  const input = ParseDeleteQuery(req, commentIdSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  return withAdminAuth(req, async (payload) => {
    const response = await deleteComment(input, payload.uid)

    return NextResponse.json(response)
  })
}
