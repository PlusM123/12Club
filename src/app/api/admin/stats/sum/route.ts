import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { verifyHeaderCookie } from '@/middleware/verifyHeaderCookie'

import type { SumData } from '@/types/api/admin'

const getSumData = async (): Promise<SumData> => {
  const [userCount, resourceCount, resourcePatchCount, commentCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.resource.count(),
      prisma.resourcePatch.count(),
      prisma.resourceComment.count()
    ])

  return {
    userCount,
    resourceCount,
    resourcePatchCount,
    commentCount
  }
}

export const GET = async (req: NextRequest) => {
  const payload = await verifyHeaderCookie(req)
  if (!payload) {
    return NextResponse.json('用户未登录')
  }

  if (payload.role < 3) {
    return NextResponse.json('本页面仅管理员可访问')
  }

  const data = await getSumData()

  return NextResponse.json(data)
}
