import { Suspense } from 'react'
import { getActions } from './actions'
import { UserComment } from '@/components/user/comment'
import { ErrorComponent } from '@/components/common/Error'

interface Props {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params

  const response = await getActions({
    uid: Number(id),
    page: 1,
    limit: 20
  })

  if (typeof response === 'string') {
    return <ErrorComponent error={response} />
  }

  return (
    <Suspense>
      <UserComment
        initComments={response.comments}
        total={response.total}
        uid={Number(id)}
      />
    </Suspense>
  )
}
