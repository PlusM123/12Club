import { SearchContainer } from '@/components/search-container'
import { Suspense } from 'react'

export default function Search() {
  return (
    <Suspense>
      <SearchContainer />
    </Suspense>
  )
}
