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
        {/* Telegram WebApp SDK - КРИТИЧЕН для инициализации WebApp */}
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body className="bg-void-500 text-white overflow-x-hidden overflow-y-auto">
        {children}
        <div className="noise-overlay" />
      </body>
    </html>
  )
}
