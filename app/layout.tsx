import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Asas Results - MIC ASAS',
  description: 'Created with Love by Salman MP',
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
