import { User } from '@/components/admin/user'
import { getActions } from './actions'
import { ErrorComponent } from '@/components/common/Error'
import { Suspense } from 'react'



export const revalidate = 3

export default async function Kun() {
  const response = await getActions({
    page: 1,
    limit: 30
  })
  if (typeof response === 'string') {
    return <ErrorComponent error={response} />
  }

  return (
    <Suspense>
      <User initialUsers={response.users} initialTotal={response.total} />
    </Suspense>
  )
}
