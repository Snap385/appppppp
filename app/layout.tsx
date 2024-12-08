import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TKM Service Authentication',
  description: 'Authentication screens for TKM Service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}

