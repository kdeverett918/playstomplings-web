import type { Metadata, Viewport } from 'next'
import { Fredoka, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import { SITE } from '@/lib/site'
import './globals.css'

const fredoka = Fredoka({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-fredoka', display: 'swap' })
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
})
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-jetbrains', display: 'swap' })

const title = 'Stomplings: Make Room! — Clear the board. Make room for the Stomp.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: title, template: '%s · Stomplings: Make Room!' },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.studio }],
  creator: SITE.studio,
  publisher: SITE.studio,
  keywords: ['Stomplings', 'block puzzle', 'puzzle game', 'Dizzywalk', '9x9 block puzzle', 'iOS', 'Android'],
  alternates: { canonical: SITE.url },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  openGraph: {
    type: 'website',
    url: SITE.url,
    siteName: SITE.name,
    title,
    description: SITE.description,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Stomplings: Make Room! — a block puzzle with giant stomping friends' }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: SITE.description,
    images: ['/og-image.png'],
  },
  itunes: { appId: '6834582552' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#FAF5EA',
  width: 'device-width',
  initialScale: 1,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  applicationCategory: 'GameApplication',
  applicationSubCategory: 'Puzzle',
  operatingSystem: 'iOS, Android',
  image: `${SITE.url}/og-image.png`,
  author: { '@type': 'Organization', name: SITE.studio, email: SITE.supportEmail },
  publisher: { '@type': 'Organization', name: SITE.studio },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  downloadUrl: [SITE.appStore, SITE.googlePlay],
  sameAs: [SITE.appStore, SITE.googlePlay],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${jakarta.variable} ${mono.variable}`}>
      <body className="min-h-dvh bg-cream font-sans text-ink">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </body>
    </html>
  )
}
