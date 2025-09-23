import { Feedback } from '@/components/admin/feedback'
import { kunGetActions } from './actions'
import { ErrorComponent } from '@/components/common/Error'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const revalidate = 3

export default async function Page() {
  const response = await kunGetActions({
    page: 1,
    limit: 30
  })
  if (typeof response === 'string') {
    return <ErrorComponent error={response} />
  }

  return (
    <Suspense>
      <Feedback initialFeedbacks={response.feedbacks} total={response.total} />
    </Suspense>
  )
}
