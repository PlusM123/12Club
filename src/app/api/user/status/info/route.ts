import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { verifyHeaderCookie } from '@/middleware/_verifyHeaderCookie'
import { ParseGetQuery } from '@/utils/parseQuery'

import { getUserProfile } from './get'

const getProfileSchema = z.object({
  id: z.coerce.number().min(1).max(9999999)
})

export async function GET(req: NextRequest) {
  const input = ParseGetQuery(req, getProfileSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  const payload = await verifyHeaderCookie(req)

  const user = await getUserProfile(input, payload?.uid ?? 0)

  return NextResponse.json(user)
}
