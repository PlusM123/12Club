import { NextRequest, NextResponse } from 'next/server'

import { verifyHeaderCookie } from '@/middleware/verifyHeaderCookie'

import { getAdminNotification } from './get'

export const GET = async (req: NextRequest) => {
  const payload = await verifyHeaderCookie(req)
  if (!payload) {
    return NextResponse.json('用户未登录')
  }

  if (payload.role < 3) {
    return NextResponse.json('本页面仅管理员可访问')
  }

  const data = await getAdminNotification()

  return NextResponse.json(data)
}
