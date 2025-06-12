import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'MIC ASAS - MALIKI EXAMINATION RESULTS | Official Result Portal',
    template: '%s | MIC ASAS Results'
  },
  description: 'Official Result Management System for MIC ASAS (Maliki Islamic College). Check exam results, student performance, marksheets, and academic records. Access NIHAYA and ASAS MALIKI examination results online.',
  applicationName: 'MIC ASAS Results Portal',
  
  // Enhanced keywords with long-tail and local SEO
  keywords: [
    // Primary keywords
    'MIC ASAS',
    'ASAS Results',
    'Maliki Islamic College',
    'MIC Results',
    'ASAS MALIKI',
    'NIHAYA Results',
    
    // Academic terms
    'Islamic Education Results',
    'Madrasa Results',
    'Islamic College Kerala',
    'Arabic Education Results',
    'Islamic Studies Results',
    'Dars Nizami Results',
    
    // Location-based
    'Thrissur Islamic College',
    'Kerala Islamic Education',
    'Malappuram Islamic College',
    'Kerala Madrasa Results',
    
    // Functional keywords
    'Online Result Portal',
    'Student Marksheet',
    'Academic Performance',
    'Examination Results',
    'Result Management System',
    'Student Portal',
    'Grade Report',
    'Academic Records',
    
    // Specific searches
    'MIC ASAS Thrissur',
    'ASAS Results Check',
    'Islamic College Results Online',
    'Maliki Education Results',
    'MIC Online Results',
    'ASAS Student Portal'
  ],
  
  authors: [
    { name: 'Salman MP', url: 'https://salmanmp.me' },
    { name: 'DigiBayt Development Team' }
  ],
  creator: 'Salman MP',
  publisher: 'DigiBayt Development Team',
  
  // Comprehensive Open Graph
  openGraph: {
    title: 'MIC ASAS - MALIKI EXAMINATION RESULTS | Official Result Portal',
    description: 'Official Result Management System for MIC ASAS (Maliki Islamic College). Check exam results, student performance, and academic records online.',
    url: 'https://results.miconline.org/',
    siteName: 'MIC ASAS Results Portal',
    images: [
      {
        url: 'https://results.miconline.org/images/logo.webp',
        width: 1200,
        height: 630,
        alt: 'MIC ASAS - Maliki Islamic College Results Portal Logo',
        type: 'image/webp',
      },
      {
        url: 'https://results.miconline.org/images/logo.webp',
        width: 512,
        height: 512,
        alt: 'MIC ASAS Logo',
        type: 'image/webp',
      },
    ],
    locale: 'en_US',
    type: 'website',
    countryName: 'India',
    emails: ['info@miconline.org'],
  },
  
  // Enhanced Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'MIC ASAS - MALIKI EXAMINATION RESULTS | Official Result Portal',
    description: 'Official Result Management System for MIC ASAS. Check exam results, student performance, and academic records online.',
    images: ['https://results.miconline.org/images/logo.webp'],
    site: '@asas_mic',
    creator: '@asas_mic',
  },
  
  // Enhanced robots configuration
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Additional SEO enhancements
  alternates: {
    canonical: 'https://results.miconline.org/',
    languages: {
      'en-US': 'https://results.miconline.org/',
      'en': 'https://results.miconline.org/',
    },
  },
  
  // App-specific metadata
  appleWebApp: {
    capable: true,
    title: 'MIC ASAS Results',
    statusBarStyle: 'default',
  },
  
  // Verification tags (add your actual verification codes)
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
    },
  },
  
  // Category and classification
  category: 'Education',
  classification: 'Educational Institution Result Portal',
  
  // Structured data hints
  other: {
    'og:site_name': 'MIC ASAS Results Portal',
    'og:locale:alternate': 'en_GB',
    'article:publisher': 'https://www.facebook.com/asasmic',
    'fb:app_id': 'your-facebook-app-id', // Add if you have one
  },
  
  icons: {
    icon: [
      { url: '/images/logo.webp', sizes: '32x32', type: 'image/webp' },
      { url: '/images/logo.webp', sizes: '16x16', type: 'image/webp' },
    ],
    shortcut: '/images/logo.webp',
    apple: [
      { url: '/images/logo.webp', sizes: '180x180', type: 'image/webp' },
      { url: '/images/logo.webp', sizes: '152x152', type: 'image/webp' },
      { url: '/images/logo.webp', sizes: '144x144', type: 'image/webp' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/images/logo.webp',
      },
    ],
  },
  
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Enhanced favicon and icons */}
        <link rel="icon" href="/images/logo.webp" type="image/webp" sizes="32x32" />
        <link rel="icon" href="/images/logo.webp" type="image/webp" sizes="16x16" />
        <link rel="apple-touch-icon" href="/images/logo.webp" sizes="180x180" />
        <link rel="apple-touch-icon" href="/images/logo.webp" sizes="152x152" />
        <link rel="apple-touch-icon" href="/images/logo.webp" sizes="144x144" />
        <link rel="apple-touch-icon-precomposed" href="/images/logo.webp" />
        
        {/* Theme and mobile optimization */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-TileImage" content="/images/logo.webp" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Enhanced viewport and mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://results.miconline.org/" />
        
        {/* Organization Schema - Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "MIC ASAS - Maliki Islamic College",
              "alternateName": ["MIC ASAS", "ASAS MALIKI", "Maliki Islamic College"],
              "description": "Official Result Management System for MIC ASAS (Maliki Islamic College). Islamic education institution providing quality education in Kerala, India.",
              "url": "https://miconline.org/",
              "logo": "https://results.miconline.org/images/logo.webp",
              "image": "https://results.miconline.org/images/logo.webp",
              "sameAs": [
                "https://www.instagram.com/micasasthrissur/",
                "https://www.youtube.com/@MICASASMEDIA",
                "https://www.facebook.com/asasmic",
                "https://twitter.com/asas_mic"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Thrissur",
                "addressRegion": "Kerala",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "availableLanguage": ["English", "Malayalam", "Arabic"]
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Educational Services",
                "itemListElement": [{
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Course",
                    "name": "Islamic Studies",
                    "description": "Comprehensive Islamic education programs"
                  }
                }]
              }
            })
          }}
        />
        
        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "MIC ASAS Results Portal",
              "description": "Official Result Management System for MIC ASAS",
              "url": "https://results.miconline.org/",
              "publisher": {
                "@type": "Organization",
                "name": "MIC ASAS - Maliki Islamic College",
                "logo": "https://results.miconline.org/images/logo.webp"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://results.miconline.org/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://miconline.org/"
              }, {
                "@type": "ListItem",
                "position": 2,
                "name": "Results Portal",
                "item": "https://results.miconline.org/"
              }]
            })
          }}
        />
        
        {/* Additional meta tags for local SEO */}
        <meta name="geo.region" content="IN-KL" />
        <meta name="geo.placename" content="Thrissur, Kerala" />
        <meta name="geo.position" content="10.5276;76.2144" />
        <meta name="ICBM" content="10.5276, 76.2144" />
        
        {/* Language and content meta */}
        <meta httpEquiv="content-language" content="en-us" />
        <meta name="content-type" content="text/html; charset=utf-8" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Performance hints */}
        <link rel="dns-prefetch" href="//results.miconline.org" />
        <link rel="preload" href="/images/logo.webp" as="image" type="image/webp" />
      </head>
      <body className="min-h-screen bg-gray-50">
        {/* Skip to main content for accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white px-4 py-2 z-50">
          Skip to main content
        </a>
        
        <main id="main-content">
          {children}
        </main>
        
        {/* Organization microdata for additional SEO */}
        <div itemScope itemType="https://schema.org/EducationalOrganization" style={{ display: 'none' }}>
          <span itemProp="name">MIC ASAS - Maliki Islamic College</span>
          <span itemProp="url">https://miconline.org/</span>
          <span itemProp="logo">https://results.miconline.org/images/logo.webp</span>
          <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            <span itemProp="addressLocality">Thrissur</span>
            <span itemProp="addressRegion">Kerala</span>
            <span itemProp="addressCountry">India</span>
          </div>
        </div>
      </body>
    </html>
  )
}