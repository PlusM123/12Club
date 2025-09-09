import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { ParseGetQuery } from '@/utils/parseQuery'
import { prisma } from '../../../../../../prisma'
import { getUserInfoSchema } from '@/validations/user'
import { verifyHeaderCookie } from '@/utils/actions/verifyHeaderCookie'

export const getUserFavorite = async (
  input: z.infer<typeof getUserInfoSchema>,
) => {
  const { uid, page, limit } = input
  const offset = (page - 1) * limit

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
