import type { Metadata, Viewport } from 'next'
import { clubViewport } from './metadata'
import { headers } from 'next/headers'
import '@/styles/index.scss'

import { Providers } from './providers'
import { TopBar } from '@/components/top-bar/top-bar'

export const viewport: Viewport = clubViewport

export const metadata: Metadata = {
  title: '12Club',
  description: '欢迎来到12Club'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerList = await headers()
  const pathname = (await headerList).get('x-current-path')?.split('/')[1]

  return (
    <html lang="zh-Hans" suppressHydrationWarning>
      <body>
        <Providers>
          {pathname !== 'music' ? (
            <div className="relative flex flex-col items-center justify-center min-h-screen bg-radial">
              <TopBar />
              <div className="flex min-h-[calc(100dvh-256px)] w-full max-w-7xl grow px-3 sm:px-6">
                {children}
              </div>
            </div>
          ) : (
            <>{children}</>
          )}
        </Providers>
      </body>
    </html>
  )
}
