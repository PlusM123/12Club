import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { verifyHeaderCookie } from '@/middleware/verifyHeaderCookie'
import { ParsePostBody } from '@/utils/parseQuery'

const proxyImageSchema = z.object({
  url: z.string().url()
})

export const POST = async (req: NextRequest) => {
  const input = await ParsePostBody(req, proxyImageSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  const payload = await verifyHeaderCookie(req)
  if (!payload) {
    return NextResponse.json('用户未登录')
  }

  try {
    const response = await fetch(input.url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      return NextResponse.json('图片拉取失败')
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const arrayBuffer = await response.arrayBuffer()

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      }
    })
  } catch {
    return NextResponse.json('图片拉取失败，请检查网络连接')
  }
}
