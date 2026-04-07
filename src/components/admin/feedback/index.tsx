'use client'

import { useEffect, useState, useTransition } from 'react'

import { getActions } from '@/app/admin/feedback/actions'
import { Loading } from '@/components/common/Loading'
import { Null } from '@/components/common/Null'
import { SelfPagination } from '@/components/common/Pagination'

import { FeedbackCard } from './FeedbackCard'

import type { AdminFeedback } from '@/types/api/admin'

interface Props {
  initialFeedbacks: AdminFeedback[]
  total: number
}

export const Feedback = ({ initialFeedbacks, total }: Props) => {
  const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>(initialFeedbacks)
  const [page, setPage] = useState(1)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (page === 1) {
      return
    }

    startTransition(async () => {
      const response = await getActions({ page, limit: 30 })
      if (typeof response !== 'string') {
        setFeedbacks(response.feedbacks)
      }
    })
  }, [page])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">资源反馈管理</h1>

      <div className="space-y-4">
        {isPending ? (
          <Loading hint="正在获取反馈数据..." />
        ) : (
          <>
            {feedbacks.map((feedback) => (
              <FeedbackCard key={feedback.id} feedback={feedback} />
            ))}
          </>
        )}
      </div>

      {feedbacks.length === 0 && <Null message="暂无反馈数据" />}

      <div className="flex justify-center">
        {Math.ceil(total / 30) > 1 && (
          <SelfPagination
            total={Math.ceil(total / 30)}
            page={page}
            onPageChange={setPage}
            isLoading={isPending}
          />
        )}
      </div>
    </div>
  )
}
