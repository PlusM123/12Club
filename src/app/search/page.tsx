import { SearchContainer } from '@/components/SearchContainer'
import { Suspense } from 'react'

export default function Search() {
  return (
    <Suspense>
      <SearchContainer />
    </Suspense>
  )
}
