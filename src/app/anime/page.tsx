import { Suspense } from 'react'
import { PageContainer } from '@/components/pageContainer'
import type { SortField, SortOrder } from '@/components/pageContainer/_sort'
import { getPageResourceActions } from './actions'
import { ErrorComponent } from '@/components/common/Error'

interface QueryParams {
  page?: number
  sortOrder: SortOrder
  sortField: SortField
  type: string
  language: string
}

interface Props {
  searchParams?: Promise<QueryParams>
}

export default async function Page({ searchParams }: Props) {
  const res = await searchParams
  const currentPage = res?.page ? res.page : 1
  const sortField = res?.sortField ? res.sortField : 'view'
  const sortOrder = res?.sortOrder ? res.sortOrder : 'desc'

  const selectedType = res?.type ? res.type : 'all'
  const selectedLanguage = res?.language ? res.language : 'all'
  const response = await getPageResourceActions({
    selectedType,
    selectedLanguage,
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
          initPageData={response._data}
          initTotal={response.total}
        />
      </div>
    </Suspense>
  )
}
