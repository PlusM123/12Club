import { DetailContainer } from '@/components/DetailContainer'
import { getResourceActions } from './actions'
import { ErrorComponent } from '@/components/common/Error'

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
      <DetailContainer id={id} introduce={introduce} coverData={coverData} />
    </div>
  )
}
