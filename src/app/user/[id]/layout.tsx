import { ErrorComponent } from '@/components/common/error'
import { UserProfile } from '@/components/user/profile'
import { getActions } from './actions'

interface Props {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default async function Layout({ params, children }: Props) {
  const { id } = await params
  if (isNaN(Number(1))) {
    return <ErrorComponent error={'提取页面参数错误'} />
  }

  const user = await getActions(Number(id))
  if (!user || typeof user === 'string') {
    return <ErrorComponent error={user} />
  }

  return (
    <div className="w-full py-8 mx-auto">
      <UserProfile user={user} />
    </div>
  )
}
