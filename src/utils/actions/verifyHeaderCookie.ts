'use server'

import { cookies } from 'next/headers'
import { verifyToken } from '@/utils/jwt'

export const verifyHeaderCookie = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('12club-token')
  const payload = await verifyToken(token?.value ?? '')

  return payload
}
