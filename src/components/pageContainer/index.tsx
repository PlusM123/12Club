'use client'

import { useEffect, useState } from 'react'
import FadeContent from '@/components/ui/FadeContent'
import { CoverCard } from '../common/CoverCard'
import { FilterBar } from './FilterBar'
import { useMounted } from '@/hooks/useMounted'
import { useRouter, useSearchParams } from 'next/navigation'
import type { SortField, SortOrder } from './_sort'
import { Pagination } from '@heroui/react'
import type { PageData } from '@/types/api/page'
import { FetchGet } from '@/utils/fetch'
import { scrollToTop } from '../common/BackToTop'

export const PageContainer = ({
  initPageData,
  initTotal,
  category
}: {
  initPageData: PageData[]
  initTotal: number
  category: string
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isMounted = useMounted()

  const [total, setTotal] = useState(initTotal)
  const [pageData, setPageData] = useState<PageData[]>(initPageData)

  const [selectedType, setSelectedType] = useState<string>(
    searchParams.get('type') || 'all'
  )
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    searchParams.get('language') || 'all'
  )
  const [sortField, setSortField] = useState<SortField>(
    (searchParams.get('sortField') as SortField) || 'updated'
  )
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    (searchParams.get('sortOrder') as SortOrder) || 'desc'
  )
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)

  useEffect(() => {
    if (!isMounted) {
      return
    }
    const params = new URLSearchParams()

    params.set('type', selectedType)
    params.set('language', selectedLanguage)
    params.set('sortField', sortField)
    params.set('sortOrder', sortOrder)
    params.set('page', page.toString())

    const queryString = params.toString()
    const url = queryString ? `?${queryString}` : ''

    router.push(url, { scroll: false })
  }, [
    category,
    selectedType,
    selectedLanguage,
    sortField,
    sortOrder,
    page,
    isMounted,
    router
  ])

  const fetchPageData = async () => {
    const { _data, total } = await FetchGet<{
      _data: PageData[]
      total: number
    }>('/page', {
      category,
      selectedType,
      selectedLanguage,
      sortField,
      sortOrder,
      page,
      limit: 24
    })

    setPageData(_data)
    setTotal(total)
  }

  useEffect(() => {
    if (!isMounted) {
      return
    }
    fetchPageData()
  }, [sortField, sortOrder, selectedType, selectedLanguage, page])

  return (
    <div className="container mx-auto my-4 space-y-6">
      <FilterBar
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        page={page}
        setPage={setPage}
      />

      <div className="grid gap-4 grid-cols-2 xl:grid-cols-3 4xl:grid-cols-4 scrollbar-hide">
        {pageData?.map((data, index) => (
          <FadeContent
            key={index}
            blur={false}
            duration={800}
            easing="ease-in-out"
            initialOpacity={0}
          >
            <CoverCard data={data} />
          </FadeContent>
        ))}
      </div>

      {total > 24 && (
        <div className="flex justify-center">
          <Pagination
            initialPage={1}
            loop
            showControls
            size="lg"
            total={Math.ceil(total / 24)}
            onChange={(page) => {
              setPage(page)
              scrollToTop()
            }}
          />
        </div>
      )}
    </div>
  )
}
