import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { verifyHeaderCookie } from '@/utils/actions/verifyHeaderCookie'
import { ParseGetQuery } from '@/utils/parseQuery'
import { getUserInfoSchema } from '@/validations/user'

const getUserFavorite = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _input: z.infer<typeof getUserInfoSchema>
) => {
  return { favorites: [], total: 0 }
}

export const GET = async (req: NextRequest) => {
  const input = ParseGetQuery(req, getUserInfoSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  const payload = await verifyHeaderCookie()
  if (!payload) {
    return NextResponse.json('用户登陆失效')
  }

  const response = await getUserFavorite(input)

  return NextResponse.json(response)
}
