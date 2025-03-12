import { DetailContainer } from '@/components/detail-container'

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="container py-6 mx-auto space-y-6">
      <DetailContainer />
    </div>
  )
}
