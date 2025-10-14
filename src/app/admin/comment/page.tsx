import { Comment } from '@/components/admin/comment/Container'
import { GetActions } from './actions'
import { ErrorComponent } from '@/components/common/Error'
import { Suspense } from 'react'



export const revalidate = 3


export default async function Kun() {
  const response = await GetActions({
    page: 1,
    limit: 30
  })
  if (typeof response === 'string') {
    return <ErrorComponent error={response} />
  }

  return (
    <Suspense>
      <Comment
        initialComments={response.comments}
        initialTotal={response.total}
      />
    </Suspense>
  )
}
