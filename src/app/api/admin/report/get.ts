import { z } from 'zod'

import { MESSAGE_TYPE } from '@/constants/message'
import { prisma } from '@/lib/prisma'
import { adminPaginationSchema } from '@/validations/admin'

import type { Message } from '@/types/api/message'

export const getReport = async (
  input: z.infer<typeof adminPaginationSchema>
) => {
  const { page, limit } = input
  const offset = (page - 1) * limit

  const [data, total] = await Promise.all([
    prisma.userMessage.findMany({
      where: { type: 'report', sender_id: { not: null } },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        replies: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: { created: 'desc' },
      skip: offset,
      take: limit
    }),
    prisma.userMessage.count({
      where: { type: 'report', sender_id: { not: null } }
    })
  ])

  const reports: Message[] = data.map((msg) => ({
    id: msg.id,
    type: msg.type as (typeof MESSAGE_TYPE)[number],
    content: msg.content ?? '',
    status: msg.status,
    link: msg.link,
    created: msg.created,
    sender: msg.sender,
    replies: msg.replies?.map((reply) => ({
      id: reply.id,
      created: reply.created,
      content: reply.content ?? '',
      sender: reply.sender
    }))
  }))

  return { reports, total }
}
