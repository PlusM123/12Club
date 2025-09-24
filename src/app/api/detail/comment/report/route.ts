import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { ParsePostBody } from '@/utils/parseQuery'
import { verifyHeaderCookie } from '@/middleware/_verifyHeaderCookie'
import { createResourceCommentReportSchema } from '@/validations/comment'
import { createMessage } from '@/utils/message'
import { getRouteByDbId } from '@/utils/router'
import { prisma } from '../../../../../../prisma'

export const createReport = async (
  input: z.infer<typeof createResourceCommentReportSchema>,
  uid: number
) => {
  const comment = await prisma.resourceComment.findUnique({
    where: { id: input.commentId }
  })
  const resource = await prisma.resource.findUnique({
    where: { id: input.resourceId }
  })
  const user = await prisma.user.findUnique({
    where: { id: uid }
  })

  const STATIC_CONTENT = `用户: ${user?.name} 举报了游戏 ${resource?.name} 下的评论\n\n评论内容: ${comment?.content.slice(0, 200)}\n\n举报原因: ${input.content}`

  await createMessage({
    type: 'report',
    content: STATIC_CONTENT,
    sender_id: uid,
    link: resource?.db_id ? getRouteByDbId(resource.db_id) : ''
  })

  return {}
}

export const POST = async (req: NextRequest) => {
  const input = await ParsePostBody(req, createResourceCommentReportSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }
  const payload = await verifyHeaderCookie(req)
  if (!payload) {
    return NextResponse.json('用户未登录')
  }

  const response = await createReport(input, payload.uid)
  return NextResponse.json(response)
}
