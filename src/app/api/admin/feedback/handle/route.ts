import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { withAdminAuth } from '@/lib/withAdminAuth'
import { createMessage } from '@/utils/message'
import { ParsePostBody } from '@/utils/parseQuery'
import { adminHandleFeedbackSchema } from '@/validations/admin'

const handleFeedback = async (
  input: z.infer<typeof adminHandleFeedbackSchema>,
  userId: number
) => {
  const message = await prisma.userMessage.findUnique({
    where: { id: input.messageId }
  })
  if (message?.status) {
    return '该反馈已被处理'
  }

  const handleResult = input.content ? input.content : '无处理留言'
  const feedbackContent = `您的反馈已处理!\n${handleResult}`

  return prisma.$transaction(async (prisma) => {
    await prisma.userMessage.update({
      where: { id: input.messageId },

      // status: 0 - unread, 1 - read, 2 - approve, 3 - decline
      data: { status: { set: 1 } }
    })

    await createMessage({
      type: 'feedback_handle',
      content: feedbackContent,
      basic_id: message?.id ?? 0,
      sender_id: userId,
      recipient_id: message?.sender_id ?? 0,
      link: '/'
    })

    return {}
  })
}

export const POST = async (req: NextRequest) => {
  const input = await ParsePostBody(req, adminHandleFeedbackSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  return withAdminAuth(req, async (payload) => {
    const response = await handleFeedback(input, payload.uid)

    return NextResponse.json(response)
  })
}
