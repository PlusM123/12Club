import { getActions } from './actions'
import { ErrorComponent } from '@/components/common/error'

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
  return <p>{response.total}</p>
}
