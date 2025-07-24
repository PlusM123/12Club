'use client'

import { FC, useEffect, useState } from 'react'
import { Slider, Divider } from '@heroui/react'
import { useDebounce } from 'use-debounce'
import { AdminSum } from './AdminSum'
import { FetchGet } from '@/utils/fetch'
import { StatsCard } from './StatsCard'
import { ErrorHandler } from '@/utils/errorHandler'
import { ADMIN_STATS_MAP } from '@/constants/admin'
import type { OverviewData } from '@/types/api/admin'

export const AdminStatistic: FC = () => {
  const [overview, setOverview] = useState<OverviewData>({
    newUser: 0,
    newActiveUser: 0,
    newResource: 0,
    newResourcePatch: 0,
    newComment: 0
  })
  const [days, setDays] = useState(1)
  const [debouncedDays] = useDebounce(days, 300)

  const fetchOverview = async (days: number) => {
    const res = await FetchGet<OverviewData>('/admin/stats', {
      days
    })
    ErrorHandler(res, setOverview)
  }

  useEffect(() => {
    fetchOverview(debouncedDays)
  }, [debouncedDays])

  return (
    <div className="space-y-8">
      <AdminSum />

      <Divider />

      <div className="flex flex-col space-y-6">
        <h3 className="text-lg font-semibold whitespace-nowrap">{`${days} 天内数据统计`}</h3>

        <div className="flex flex-wrap gap-4">
          {Object.entries(ADMIN_STATS_MAP).map(([key, title]) => (
            <StatsCard
              key={key}
              title={title}
              value={overview[key as keyof OverviewData]}
            />
          ))}
        </div>

        <div className="flex-grow w-full">
          <Slider
            label="设置天数"
            step={1}
            minValue={1}
            maxValue={60}
            value={days}
            onChange={(value) => setDays(Number(value))}
          />
        </div>
      </div>
    </div>
  )
}
