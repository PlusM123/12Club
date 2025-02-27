'use client'

import { PageContainer } from '@/components/common/page-container'

export default function Home() {
  return (
    <div className="container py-6 mx-auto">
      {/* <AnimatedList
        showGradients={false}
        enableArrowNavigation={false}
        displayScrollbar={false}
        items={Array.from({ length: 20 }, (_, index) => `Item ${index + 1}`)}
      /> */}
      <PageContainer />
    </div>
  )
}
