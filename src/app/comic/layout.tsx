interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: Readonly<LayoutProps>) {
  return <div className="w-full h-full flex flex-col">{children}</div>
}
