'use client'

import { AppProgressBar } from 'next-nprogress-bar'
import { HeroUIProvider } from "@heroui/react"
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next-nprogress-bar'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()

  return (
    <HeroUIProvider navigate={router.push}>
      <ThemeProvider attribute="class">{children}</ThemeProvider>
      <AppProgressBar
        height="4px"
        color="#006fee"
        options={{ showSpinner: false }}
      />
    </HeroUIProvider>
  )
}
