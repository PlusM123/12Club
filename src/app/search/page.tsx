import { SearchContainer } from '@/components/searchContainer'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic';

export default function Search() {
  return (
    <Suspense>
      <SearchContainer />
    </Suspense>
  )
}
