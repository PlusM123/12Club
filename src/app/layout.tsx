import type { Metadata, Viewport } from 'next'
import { Toaster } from 'react-hot-toast'
import { ToastProvider } from '@heroui/toast'
import { clubViewport } from './metadata'
import '@/styles/index.scss'

import { ViewTransitions } from 'next-view-transitions'

import { Providers } from './providers'
import { TopBar } from '@/components/common/top-bar'
import { BackToTop } from '@/components/common/back-to-top'
import { Footer } from '@/components/common/footer'

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
  return (
    <ViewTransitions>
      <html lang="zh-Hans" suppressHydrationWarning>
        <body>
          <Providers>
            <div className="relative flex flex-col items-center justify-center min-h-screen bg-radial">
              <TopBar />
              <div className="flex min-h-[calc(100dvh-256px)] w-full max-w-7xl grow px-3 sm:px-6">
                {children}
                <Toaster />
                <ToastProvider placement="top-center" />
              </div>
              <BackToTop />
              <Footer />
            </div>
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  )
}
