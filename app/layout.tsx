import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MIC ASAS - MALIKI EXAMINATION RESULTS',
  description: 'Official Result Management System for MIC ASAS. Check exam results, student performance, and more.',
  icons: {
    icon: '/images/logo.webp',
    shortcut: '/images/logo.webp',
    apple: '/images/logo.webp',
  },
  openGraph: {
    title: 'MIC ASAS - MALIKI EXAMINATION RESULTS',
    description: 'Official Result Management System for MIC ASAS. Check exam results, student performance, and more.',
    url: 'https://results.miconline.org/',
    siteName: 'MIC ASAS - MALIKI EXAMINATION RESULTS',
    images: [
      {
        url: '/images/logo.webp',
        width: 512,
        height: 512,
        alt: 'Asas Results Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MIC ASAS - MALIKI EXAMINATION RESULTS',
    description: 'Official Result Management System for MIC ASAS. Check exam results, student performance, and more.',
    images: ['/images/logo.webp'],
    site: '@asas_mic',
  },
  keywords: [
    'MIC',
    'ASAS',
    'Result',
    'Results',
    'Maliki',
    'Exam',
    'Student',
    'Batch',
    'Marksheet',
    'Education',
    'Islamic',
    'College',
    'Kerala',
    'India',
    'NIHAYA',
    'ASAS MALIKI',
    'ASAS Results',
    'Result Management System',
  ],
  authors: [{ name: 'Salman MP', url: 'https://github.com/salmankavanur' }],
  creator: 'Salman MP',
  publisher: 'MIC ASAS',
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo.webp" type="image/webp" />
        <link rel="apple-touch-icon" href="/images/logo.webp" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body>{children}</body>
    </html>
  )
}
