'use client'

import { FC, useEffect, useState } from 'react'
import { StatsCard } from './StatsCard'
import { FetchGet } from '@/utils/fetch'
import { ErrorHandler } from '@/utils/errorHandler'
import { ADMIN_STATS_SUM_MAP } from '@/constants/admin'
import type { SumData } from '@/types/api/admin'

export const AdminSum: FC = () => {
  const [sum, setSum] = useState<SumData>({
    userCount: 0,
    resourceCount: 0,
    resourcePatchCount: 0,
    commentCount: 0
  })

  const fetchSummaryData = async () => {
    const res = await FetchGet<SumData>('/admin/stats/sum')
    ErrorHandler(res, setSum)
  }

  useEffect(() => {
    fetchSummaryData()
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">数据统计</h2>

      <div className="flex flex-wrap gap-4">
        {Object.entries(ADMIN_STATS_SUM_MAP).map(([key, title]) => (
          <StatsCard
            key={key}
            title={title}
            value={sum[key as keyof SumData]}
          />
        ))}
      </div>
    </div>
  )
}
