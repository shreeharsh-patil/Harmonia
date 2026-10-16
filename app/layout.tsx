import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { SITE_URL } from '@/lib/site'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono-jb',
})

const TITLE = 'Harmonia Mobile — Free Native Music Player for Android'
const DESCRIPTION =
  'Source-available Android music player powered by React Native and Expo. Free high-quality streaming from JioSaavn and YouTube Music, LRCLib synced lyrics, offline downloads, and native background playback with no subscriptions or Spotify keys.'

export const metadata: Metadata = {
  // Resolves every relative URL below — and the generated OG image — against
  // the deployed origin. Without it Next emits relative social tags, which
  // crawlers cannot follow.
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    // Any future route gets the brand appended rather than restating it.
    template: '%s · Harmonia Mobile',
  },
  description: DESCRIPTION,
  applicationName: 'Harmonia Mobile',
  category: 'music',
  keywords: [
    'Harmonia',
    'Harmonia Mobile',
    'Android music player',
    'open source music player',
    'JioSaavn streaming',
    'YouTube Music client',
    'synced lyrics',
    'LRCLib',
    'offline music player',
    'expo-audio',
    'APK download',
  ],
  authors: [{ name: 'Shreeharsh Patil', url: 'https://github.com/shreeharsh-patil' }],
  creator: 'shreeharsh-patil',
  publisher: 'shreeharsh-patil',
  // One page, one canonical. Stops preview deployments and any ?query variant
  // from competing with production in the index.
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    // The site itself, not the repository — this is what gets crawled and
    // unfurled, and pointing it at GitHub handed the link equity away.
    url: '/',
    siteName: 'Harmonia Mobile',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    creator: '@shreeharsh-patil',
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/harmonia-icon.png', type: 'image/png' },
    ],
    apple: [{ url: '/harmonia-icon.png' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
        <link rel="preconnect" href="https://avatars.githubusercontent.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <a
          href="#features"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
