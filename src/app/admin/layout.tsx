import { Sidebar } from '@/components/admin/sidebar'
import { NotFoundComponent } from '@/components/common/not-found'
import { verifyHeaderCookie } from '@/utils/actions/verifyHeaderCookie'

interface Props {
  children: React.ReactNode
}

export default async function Layout({ children }: Props) {
  const payload = await verifyHeaderCookie()
  
  // 如果用户未登录或权限不足（role < 3），显示 404 页面
  if (!payload || payload.role < 3) {
    return <NotFoundComponent />
  }

  return (
    <div className="container flex mx-auto my-4">
      <Sidebar />
      <div className="flex w-full overflow-y-auto">
        <div className="w-full p-4">{children}</div>
      </div>
    </div>
  )
}
