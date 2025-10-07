export const dynamic = 'force-dynamic'
export const revalidate = 0
import { Suspense } from 'react'
import { PageContainer } from '@/components/pageContainer'
import { getPageResourceActions } from './actions'
import { ErrorComponent } from '@/components/common/Error'
import type { QueryParams } from '@/types/common/page'

interface Props {
  searchParams?: Promise<QueryParams>
}

export default async function Page({ searchParams }: Props) {
  const res = await searchParams
  const currentPage = res?.page ? res.page : 1
  const sortField = res?.sortField ? res.sortField : 'updated'
  const sortOrder = res?.sortOrder ? res.sortOrder : 'desc'

  const selectedType = res?.type ? res.type : 'all'
  const selectedLanguage = res?.language ? res.language : 'all'
  const selectedStatus = res?.status ? res.status : 'all'
  const response = await getPageResourceActions({
    category: 'anime',
    selectedType,
    selectedLanguage,
    selectedStatus,
    sortField,
    sortOrder,
    page: currentPage,
    limit: 24
  })
  if (typeof response === 'string') {
    return <ErrorComponent error={response} />
  }

  return (
    <Suspense>
      <div className="container py-6 mx-auto">
        <PageContainer
          category="anime"
          initPageData={response._data}
          initTotal={response.total}
        />
      </div>
    </Suspense>
  )
}
