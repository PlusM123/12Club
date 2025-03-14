import { Sidebar } from '@/components/admin/sidebar'

interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="container flex mx-auto my-4">
      <Sidebar />
      <div className="flex w-full overflow-y-auto">
        <div className="w-full p-4">{children}</div>
      </div>
    </div>
  )
}
