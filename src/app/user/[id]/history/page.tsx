import { Suspense } from 'react'

import { ErrorComponent } from '@/components/common/Error'
import { UserPlayHistory } from '@/components/user/history/Container'

import { getActions } from './actions'

export const revalidate = 3

interface Props {
  params: Promise<{ id: string }>
}

export default async function PlayHistoryPage({ params }: Props) {
  const { id } = await params

  const response = await getActions({
    uid: Number(id),
    page: 1,
    limit: 10
  })
  if (typeof response === 'string') {
    return <ErrorComponent error={response} />
  }

  return (
    <Suspense>
      <UserPlayHistory
        history={response.history}
        total={response.total}
        uid={Number(id)}
      />
    </Suspense>
  )
}
