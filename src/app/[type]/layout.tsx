import { redirect } from 'next/navigation'

interface LayoutProps {
  children: React.ReactNode
  params: {
    type: string
  }
}

export default function Layout({ children, params }: Readonly<LayoutProps>) {
  if (params.type !== 'comic' && params.type !== 'novel') {
    redirect('/')
  }

  return <div className="w-full h-full flex flex-col">{children}</div>
}
