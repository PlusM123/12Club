'use client'
import { Suspense } from 'react'
import { PageContainer } from '@/components/page-container'

export default function Page() {
  return (
    <Suspense>
      <div className="container py-6 mx-auto">
        <PageContainer />
      </div>
    </Suspense>
  )
}
