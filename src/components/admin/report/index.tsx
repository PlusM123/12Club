'use client'

import { useEffect, useState, useTransition } from 'react'

import { getActions } from '@/app/admin/report/actions'
import { Loading } from '@/components/common/Loading'
import { SelfPagination } from '@/components/common/Pagination'

import { ReportCard } from './ReportCard'

import type { AdminReport } from '@/types/api/admin'

interface Props {
  initialReports: AdminReport[]
  total: number
}

export const Report = ({ initialReports, total }: Props) => {
  const [reports, setReports] = useState<AdminReport[]>(initialReports)
  const [page, setPage] = useState(1)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (page === 1) {
      return
    }

    startTransition(async () => {
      const response = await getActions({ page, limit: 30 })
      if (typeof response !== 'string') {
        setReports(response.reports)
      }
    })
  }, [page])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">评论举报管理</h1>

      <div className="space-y-4">
        {isPending ? (
          <Loading hint="正在获取举报数据..." />
        ) : (
          <>
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </>
        )}
      </div>

      {Math.ceil(total / 30) > 1 ? (
        <div className="flex justify-center">
          <SelfPagination
            total={Math.ceil(total / 30)}
            page={page}
            onPageChange={setPage}
            isLoading={isPending}
          />
        </div>
      ) : null}
    </div>
  )
}
