import { ErrorComponent } from '@/components/common/error'
import { UserActivity } from '@/components/user/activity'
import { UserStats } from '@/components/user/status'
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
      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
        <UserProfile user={user} />

        <div className="space-y-6 2xl:col-span-2">
          <UserStats user={user} />
          <UserActivity id={user.id} />
          {children}
        </div>
      </div>
    </div>
  )
}
