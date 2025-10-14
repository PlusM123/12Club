import { Report } from '@/components/admin/report'
import { getActions } from './actions'
import { ErrorComponent } from '@/components/common/Error'
import { Suspense } from 'react'



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
      <Report initialReports={response.reports} total={response.total} />
    </Suspense>
  )
}
