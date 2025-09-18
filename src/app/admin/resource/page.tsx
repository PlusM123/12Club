import { Resource } from '@/components/admin/resource/Container'
import { GetActions } from './actions'
import { ErrorComponent } from '@/components/common/Error'
import { Suspense } from 'react'

export const revalidate = 3

interface PageProps {
  searchParams: { query: string | undefined }
}

export default async function Page({ searchParams }: PageProps) {
  // 提取query参数
  const query = searchParams.query || ''

  const response = await GetActions({
    page: 1,
    limit: 30,
    ...(query && { search: query })
  })
  if (typeof response === 'string') {
    return <ErrorComponent error={response} />
  }

  return (
    <Suspense>
      <Resource
        initialResources={response.resources}
        initialTotal={response.total}
        initialQuery={query}
      />
    </Suspense>
  )
}
