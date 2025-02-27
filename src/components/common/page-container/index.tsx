'use client'

import { useEffect, useState } from 'react'
import AnimatedList from './animated-list'
import { FilterBar } from './filter-bar'
import { useMounted } from '@/hooks/use-mounted'
import { useRouter, useSearchParams } from 'next/navigation'
import type { SortField, SortOrder } from './_sort'

export const PageContainer = () => {
  const router = useRouter()
  const isMounted = useMounted()
  const searchParams = useSearchParams()

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
        items={Array.from({ length: 20 }, (_, index) => `Item ${index + 1}`)}
      />
    </div>
  )
}
