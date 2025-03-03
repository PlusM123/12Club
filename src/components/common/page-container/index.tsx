'use client'

import { useEffect, useState } from 'react'
import AnimatedList from './animated-list'
import { FilterBar } from './filter-bar'
import { useMounted } from '@/hooks/use-mounted'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { SortField, SortOrder } from './_sort'
import { Pagination } from '@heroui/react'
import type { Data } from '@/types/api/page'
import { FetchGet } from '@/utils/fetch'

export const PageContainer = () => {
  const router = useRouter()
  const isMounted = useMounted()
  const searchParams = useSearchParams()

  const [total, setTotal] = useState(0)
  const [pageDatas, setPageDatas] = useState<Data[]>([])

  const [selectedType, setSelectedType] = useState<string>(
    searchParams.get('type') || 'all'
  )
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    searchParams.get('language') || 'all'
  )
  const [sortField, setSortField] = useState<SortField>(
    (searchParams.get('sortField') as SortField) || 'created'
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
    selectedType,
    selectedLanguage,
    sortField,
    sortOrder,
    page,
    isMounted,
    router
  ])

  const fetchPatches = async () => {
    const { datas, total } = await FetchGet<{
      datas: Data[]
      total: number
    }>('/page', {
      selectedType,
      selectedLanguage,
      sortField,
      sortOrder,
      page,
      limit: 24
    })

    setPageDatas(datas)
    setTotal(total)
  }

  useEffect(() => {
    if (!isMounted) {
      return
    }
    fetchPatches()
  }, [sortField, sortOrder, selectedType, selectedLanguage, page])

  useEffect(() => {
    fetchPatches()
  }, [])

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
      />

      <AnimatedList
        showGradients={false}
        enableArrowNavigation={false}
        displayScrollbar={false}
        items={pageDatas}
      />

      {total > 24 && (
        <div className="flex justify-center">
          <Pagination
            initialPage={1}
            loop
            showControls
            size="lg"
            total={Math.ceil(total / 24)}
            onChange={(page) => setPage(page)}
          />
        </div>
      )}
    </div>
  )
}
