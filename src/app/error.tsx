'use client'

import { ErrorComponent } from '@/components/common/Error'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorComponent showReset={true} error={error.message} reset={reset} />
}
