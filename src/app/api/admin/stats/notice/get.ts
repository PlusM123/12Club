import { prisma } from '@/lib/prisma'

import type { AdminNotificationData } from '@/types/api/admin'

export const getAdminNotification =
  async (): Promise<AdminNotificationData> => {
    const [pendingResets, pendingFeedbacks, pendingReports] = await Promise.all(
      [
        // 未处理的密码重置请求
        prisma.passwordReset.count({
          where: { status: 0 }
        }),

        // 未处理的资源反馈
        prisma.userMessage.count({
          where: { type: 'feedback', sender_id: { not: null }, status: 0 }
        }),

        // 未处理的举报
        prisma.userMessage.count({
          where: { type: 'report', sender_id: { not: null }, status: 0 }
        })
      ]
    )

    return {
      passwordResets: pendingResets,
      feedbacks: pendingFeedbacks,
      reports: pendingReports,
      total: pendingResets + pendingFeedbacks + pendingReports
    }
  }
