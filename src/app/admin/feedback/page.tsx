import { Feedback } from '@/components/admin/feedback'
import { getActions } from './actions'
import { ErrorComponent } from '@/components/common/Error'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic';

export const revalidate = 3

export default async function Page() {
  const response = await getActions({
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
