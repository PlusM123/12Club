import { SearchContainer } from '@/components/common/search-container'
import { Suspense } from 'react'

export default function Search() {
  return (
    <Suspense>
      <SearchContainer />
    </Suspense>
  )
}
