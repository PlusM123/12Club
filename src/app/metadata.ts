import type { Metadata, Viewport } from 'next'

export const clubViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
  colorScheme: 'light dark'
}

export const clubMetadata: Metadata = {
  icons: {
    icon: '/favicon.ico'
  }
}
