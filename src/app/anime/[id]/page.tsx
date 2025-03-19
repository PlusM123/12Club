import { DetailContainer } from '@/components/detail-container'
import { getResourceActions } from './actions'
import { ErrorComponent } from '@/components/common/error'

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params
  const resource = await getResourceActions({
    id
  })
  if (typeof resource === 'string') {
    return <ErrorComponent error={resource} />
  }

  const { introduce, coverData } = resource
  return (
    <div className="container py-6 mx-auto space-y-6">
      <DetailContainer introduce={introduce} coverData={coverData} />
    </div>
  )
}
