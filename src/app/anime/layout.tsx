interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: Readonly<LayoutProps>) {
  return <>{children}</>
}
