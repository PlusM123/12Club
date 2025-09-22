'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSearchStore } from '@/store/searchStore'
import { useDebounce } from 'use-debounce'
import { Input } from '@heroui/react'
import { Pagination } from '@heroui/react'
import { Search } from 'lucide-react'
import { FetchPost } from '@/utils/fetch'
import { SearchHistory } from './SearchHistory'
import { Loading } from '../common/Loading'
import { Null } from '../common/Null'
import type { SearchData } from '@/types/api/search'
import { cn } from '@/lib/utils'
import FadeContent from '@/components/ui/FadeContent'
import { CoverCard } from '../common/CoverCard'
import { SearchOption } from '@/components/searchContainer/SearchOption'
import { FilterBar } from '@/components/searchContainer/FilterBar'

const MAX_HISTORY_ITEMS = 10

export const SearchContainer = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page') || '1')
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [debouncedQuery] = useDebounce(query, 500)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchContainerData, setSearchContainerData] = useState<SearchData[]>([])
  const [total, setTotal] = useState(0)

  const [page, setPage] = useState(currentPage)

  const [showHistory, setShowHistory] = useState(false)

  const searchData = useSearchStore((state) => state.data)
  const setSearchData = useSearchStore((state) => state.setData)

  useEffect(() => {
    if (debouncedQuery) {
      setPage(1)
      handleSearch(1)
    } else {
      setSearchContainerData([])
      setTotal(0)
      setHasSearched(false)
    }
  }, [
    debouncedQuery,
    searchData.searchInAlias,
    searchData.searchInIntroduction,
    searchData.searchInComic,
    searchData.searchInAnime,
    searchData.searchInGame,
    searchData.searchInNovel,
    searchData.selectedType,
    searchData.sortField,
    searchData.sortOrder,
    searchData.selectedLanguage
  ])

  const addToHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      return
    }

    const newHistory = [
      searchQuery,
      ...searchData.searchHistory.filter((item) => item !== searchQuery)
    ].slice(0, MAX_HISTORY_ITEMS)

    setSearchData({ ...searchData, searchHistory: newHistory })
  }

  const removeFromHistory = (index: number) => {
    if (index < 0 || index >= searchData.searchHistory.length) {
      return
    }

    const newHistory = searchData.searchHistory.filter(
      (_, idx) => idx !== index
    )

    setSearchData({ ...searchData, searchHistory: newHistory })
  }

  const [loading, setLoading] = useState(false)
  const handleSearch = async (currentPage = page) => {
    if (!query.trim()) {
      return
    }

    setLoading(true)
    addToHistory(query)
    setShowHistory(false)

    const { _data, total } = await FetchPost<{
      _data: SearchData[]
      total: number
    }>('/search', {
      query: query.split(' ').filter((term) => term.length > 0),
      page: currentPage,
      limit: 10,
      searchOption: {
        searchInIntroduction: searchData.searchInIntroduction,
        searchInAlias: searchData.searchInAlias,
        searchInAnime: searchData.searchInAnime,
        searchInComic: searchData.searchInComic,
        searchInGame: searchData.searchInGame,
        searchInNovel: searchData.searchInNovel,
        selectedType: searchData.selectedType,
        sortField: searchData.sortField,
        sortOrder: searchData.sortOrder,
        selectedLanguage: searchData.selectedLanguage
      }
    })

    setSearchContainerData(_data)
    setTotal(total)
    setHasSearched(true)

    const params = new URLSearchParams()
    params.set('q', query)
    params.set('page', currentPage.toString())
    router.push(`/search?${params.toString()}`)

    setLoading(false)
  }

  return (
    <div className="container my-4">
      <div className="mb-8 space-y-4 relative">
        <div className="flex items-center gap-2">
          <Input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowHistory(true)
            }}
            onFocus={() => setShowHistory(true)}
            onBlur={async () => {
              await new Promise((resolve) => {
                setTimeout(resolve, 100)
              })
              setShowHistory(false)
            }}
            placeholder="使用空格分隔关键词，支持使用dbId搜索"
            size="lg"
            radius="lg"
            variant="bordered"
            color="primary"
            startContent={
              <Search
                className={cn('text-default-400', showHistory && 'text-primary')}
              />
            }
          />
          <SearchOption />
        </div>

        <FilterBar />

        <SearchHistory
          showHistory={showHistory}
          setShowHistory={setShowHistory}
          setQuery={setQuery}
          removeFromHistory={removeFromHistory}
        />
      </div>

      {loading ? (
        <Loading hint="正在搜索中..." />
      ) : (
        <>
          {searchContainerData?.length ? (
            <div className="grid gap-4 grid-cols-2 xl:grid-cols-3 4xl:grid-cols-4 scrollbar-hide pt-20">
              {searchContainerData?.map((data, index) => (
                <FadeContent
                  key={index}
                  blur={false}
                  duration={800}
                  easing="ease-in-out"
                  initialOpacity={0}
                >
                  <CoverCard data={{ ...data, favorite_by: data._count.favorite_by }} />
                </FadeContent>
              ))}
            </div>
          ) : null}

          {total > 10 && (
            <div className="flex justify-center mt-6">
              <Pagination
                total={Math.ceil(total / 10)}
                page={page}
                onChange={(page) => {
                  setPage(page)
                  handleSearch(page)
                }}
                showControls
                size="lg"
                radius="lg"
                classNames={{
                  wrapper: 'gap-2',
                  item: 'w-10 h-10'
                }}
              />
            </div>
          )}
        </>
      )}

      {hasSearched && searchContainerData?.length === 0 && (
        <Null message="未找到相关内容, 请尝试换个关键词吧~" />
      )}
    </div>
  )
}
