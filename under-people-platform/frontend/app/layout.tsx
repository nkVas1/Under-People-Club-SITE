import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Under People Club - Cyberpunk Community',
  description: 'A dark cyberpunk community platform for students and enthusiasts',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#050505" />
      </head>
      <body className="bg-void-500 text-white overflow-hidden">
        {children}
        <div className="noise-overlay" />
      </body>
    </html>
  )
}
