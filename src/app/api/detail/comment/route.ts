import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { ParseGetQuery, ParsePutBody, ParsePostBody } from '@/utils/parse-query'
import { verifyHeaderCookie } from '@/middleware/_verifyHeaderCookie'
import { resourceCommentCreateSchema } from '@/validations/comment'
import { getResourceComment } from './get'
import { createResourceComment } from './create'

const detailIdSchema = z.object({
  id: z.coerce.string().min(7).max(7)
})

export const GET = async (req: NextRequest) => {
  const input = ParseGetQuery(req, detailIdSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }
  const payload = await verifyHeaderCookie(req)
  if (!payload) {
    return NextResponse.json('用户登陆失效')
  }

  const response = await getResourceComment(input)
  return NextResponse.json(response)
}

export const POST = async (req: NextRequest) => {
  const input = await ParsePostBody(req, resourceCommentCreateSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }
  const payload = await verifyHeaderCookie(req)
  if (!payload) {
    return NextResponse.json('用户未登录')
  }

  const response = await createResourceComment(input, payload.uid)
  return NextResponse.json(response)
}
