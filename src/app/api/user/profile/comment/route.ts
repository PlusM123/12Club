import { NextRequest, NextResponse } from 'next/server'

import { verifyHeaderCookie } from '@/middleware/verifyHeaderCookie'
import { ParseGetQuery } from '@/utils/parseQuery'
import { getUserInfoSchema } from '@/validations/user'

import { getUserComment } from './get'

export const GET = async (req: NextRequest) => {
  const input = ParseGetQuery(req, getUserInfoSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  const payload = await verifyHeaderCookie(req)
  if (!payload) {
    return NextResponse.json('用户登陆失效')
  }

  const response = await getUserComment(input)

  return NextResponse.json(response)
}
