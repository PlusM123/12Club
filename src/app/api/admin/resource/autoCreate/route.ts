import { NextRequest, NextResponse } from 'next/server'
import { ParsePostBody } from '@/utils/parseQuery'
import { adminAutoCreateResourcePlayLinkSchema } from '@/validations/admin'
import { verifyHeaderCookie } from '@/utils/actions/verifyHeaderCookie'
import { autoCreateResourcePlayLinks } from './autoCreate'

export async function POST(req: NextRequest) {
    const input = await ParsePostBody(req, adminAutoCreateResourcePlayLinkSchema)
    if (typeof input === 'string') {
        return NextResponse.json({
            success: false,
            message: input
        })
    }

    const payload = await verifyHeaderCookie()
    if (!payload) {
        return NextResponse.json({
            success: false,
            message: '用户未登录'
        })
    }
    if (payload.role < 3) {
        return NextResponse.json({
            success: false,
            message: '本页面仅管理员可访问'
        })
    }

    const res = await autoCreateResourcePlayLinks(input, payload.uid)
    return NextResponse.json(res)
} 