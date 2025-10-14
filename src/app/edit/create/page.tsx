import { CreateContainer } from '@/components/edit/create'

export const dynamic = 'force-dynamic';

export default function Create() {
  return (
    <div className="flex flex-col w-full">
      <CreateContainer />
    </div>
  )
}
