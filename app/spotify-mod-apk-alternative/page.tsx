import type { Metadata } from 'next'
import { ArrowDownToLine, Check, Info, ShieldAlert, X } from 'lucide-react'
import { Backdrop } from '@/components/site/backdrop'
import { Footer } from '@/components/site/footer'
import { Nav } from '@/components/site/nav'
import { getTelemetry, resolveDownload } from '@/lib/github'
import { SITE_URL } from '@/lib/site'

export const revalidate = 300

const PAGE_URL = `${SITE_URL}/spotify-mod-apk-alternative`

const FAQ = [
  {
    question: 'What is a Spotify mod APK?',
    answer:
      'A Spotify mod APK is a modified or cracked build of the official Spotify client. It typically claims to unlock paid features without paying, but it is not affiliated with or endorsed by Spotify — and installing third-party APKs carries real security and account risks.',
  },
  {
    question: 'Is Harmonia a Spotify mod APK?',
    answer:
      'No. Harmonia Mobile is an independent, source-available music player for Android. It is not a modified Spotify client, does not bundle Spotify code or accounts, and does not unlock paid Spotify features.',
  },
  {
    question: 'Is Harmonia affiliated with Spotify?',
    answer:
      'No. Harmonia is an independent project and is not affiliated with, endorsed by, or distributed by Spotify. Spotify is a trademark of Spotify AB.',
  },
  {
    question: 'Why is Harmonia a safer alternative to a Spotify mod APK?',
    answer:
      'Harmonia streams from free, publicly accessible providers such as JioSaavn and YouTube Music, includes synchronized LRCLib lyrics, offline downloads, local-library playback and native background controls, and ships as a signed release you can verify. It does not ask you to install a cracked or modified Spotify build.',
  },
  {
    question: 'What does Harmonia cost?',
    answer:
      'Harmonia is free to install and use. It is a personal, source-available project with no subscription, no ad-supported tier and no paid “premium” unlock.',
  },
] as const

export const metadata: Metadata = {
  title: 'Spotify Mod APK Alternative',
  description:
    'Looking for a Spotify mod APK? Harmonia Mobile is a free, legal, source-available Android music player — not a Spotify mod, crack, or modified APK. Free streaming from JioSaavn and YouTube Music, synced lyrics, offline downloads and background playback.',
  keywords: [
    'Spotify mod APK alternative',
    'Spotify mod APK',
    'Spotify APK alternative',
    'free Spotify alternative',
    'free music app like Spotify',
    'ad-free music app Android',
    'Spotify premium APK alternative',
    'JioSaavn streaming Android',
  ],
  alternates: { canonical: '/spotify-mod-apk-alternative' },
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
    title: 'Spotify Mod APK Alternative · Harmonia Mobile',
    description:
      'Harmonia Mobile is a free, legal alternative to a Spotify mod APK. It is not a Spotify mod, crack, or modified APK.',
    type: 'article',
    url: '/spotify-mod-apk-alternative',
  },
}

export default async function SpotifyModApkAlternativePage() {
  const telemetry = await getTelemetry().catch(() => null)
  const download = resolveDownload(telemetry?.latest ?? null)
  const tag = telemetry?.latest?.tag

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Backdrop />
      <Nav />

      <main id="top" className="relative overflow-hidden px-6 pb-20 pt-24 sm:pb-24 sm:pt-28">
        <span id="features" aria-hidden />
        <article className="mx-auto max-w-5xl">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/35">
            Spotify Mod APK Search
          </p>

          <h1 className="mt-4 max-w-4xl text-balance text-4xl font-extrabold leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
            Looking for a{' '}
            <span className="text-gradient">Spotify Mod APK alternative</span>?
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-[16.5px] leading-[1.7] text-white/55 sm:text-[18px]">
            Harmonia Mobile is a different kind of answer: an independent, source-available music
            player for Android. It is <strong className="text-white/85">not</strong> a Spotify mod APK,
            not a cracked Spotify client, and not affiliated with Spotify — but it is free, ad-free to
            install, and built for people who searched for that shortcut.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={download.url}
              download={download.fileName ?? 'Harmonia-mobile.apk'}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#F5F7F5] px-6 text-sm font-semibold text-[#050807] transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              aria-label={tag ? `Download Harmonia APK ${tag}` : 'Download Harmonia'}
            >
              <ArrowDownToLine className="size-4" aria-hidden />
              Download Harmonia{tag ? ` ${tag}` : ''}
              <span className="rounded-full bg-black/10 px-2 py-0.5 font-mono text-[10.5px] text-black/60">
                {download.size}
              </span>
            </a>
            <a
              href="#compare"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              Why not a modified APK?
            </a>
          </div>

          <aside className="mt-8 flex gap-3 rounded-2xl border border-amber-400/15 bg-amber-400/[0.05] p-4 text-[13px] leading-relaxed text-amber-100/75">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>
              Harmonia does not use Spotify’s servers, accounts or APKs. It plays publicly accessible
              JioSaavn and YouTube Music streams, local files, and LRCLib lyrics. There is no “
              Spotify premium unlocked” mode — because the goal is a free music app, not a modified
              one.
            </p>
          </aside>

          <section id="compare" className="mt-14">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
              Spotify Mod APK vs Harmonia
            </h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.08]">
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] bg-white/[0.04] font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 max-sm:grid-cols-1">
                <div className="border-r border-white/[0.07] p-4 max-sm:border-b max-sm:border-r-0">
                  Spotify mod APK
                </div>
                <div className="p-4 text-emerald-200/70">Harmonia</div>
              </div>
              {[
                ['Modified client', 'Independent source-available app'],
                ['Unlocks Spotify Premium’s paid features', 'No Spotify account or premium required'],
                ['Often ships unsigned or tampered code', 'Signed release build; APK integrity checked in app updater'],
                ['Relies on Spotify infrastructure', 'Direct JioSaavn and YouTube Music resolution'],
                ['Against Spotify Terms of Service', 'Built from free public providers; no Spotify keys'],
                ['Security and account-ban risk', 'No Spotify credentials or keys, ever'],
              ].map(([mod, harmonia]) => (
                <div
                  key={mod}
                  className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] border-t border-white/[0.07] max-sm:grid-cols-1"
                >
                  <div className="flex gap-2 border-r border-white/[0.07] p-4 text-[13.5px] leading-relaxed text-white/50 max-sm:border-b max-sm:border-r-0">
                    <X className="mt-0.5 size-3.5 shrink-0 text-red-300/70" aria-hidden />
                    {mod}
                  </div>
                  <div className="flex gap-2 p-4 text-[13.5px] leading-relaxed text-white/70">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-300/80" aria-hidden />
                    {harmonia}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-3 flex items-start gap-2 text-[11.5px] leading-relaxed text-white/30">
              <ShieldAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              Spotify is a trademark of Spotify AB. Harmonia is not affiliated with Spotify and does
              not claim that any Spotify service or Premium feature is available through a modded
              client.
            </p>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
              What Harmonia actually does
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                'Free streaming from JioSaavn and YouTube Music',
                'Synced LRCLib lyrics with line-by-line highlighting',
                'Offline downloads and local MP3/FLAC/AAC playback',
                'Native background playback and lock-screen controls',
                'Five-band equalizer and offline-first library',
                'Signed Android APK with in-app update verification',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 text-[14px] leading-6 text-white/70"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-300/80" aria-hidden />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
              Spotify mod APK questions
            </h2>
            <div className="mt-6 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {FAQ.map((item) => (
                <details key={item.question} className="group py-5">
                  <summary className="cursor-pointer list-none text-[16px] font-medium tracking-[-0.01em] text-white/85 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                    <span className="inline-flex items-center gap-3">
                      <span className="text-white/30 transition-transform group-open:rotate-45">+</span>
                      {item.question}
                    </span>
                  </summary>
                  <p className="ml-8 mt-3 max-w-3xl text-[14.5px] leading-relaxed text-white/55">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-14 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-emerald-500/[0.08] via-white/[0.02] to-transparent p-6 text-center sm:p-10">
            <h2 className="text-balance text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
              The answer to “Spotify mod APK” is usually a better music app.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-pretty text-[14.5px] leading-relaxed text-white/50">
              Install the signed APK, allow install-from-unknown-apps like any sideloaded build, and
              press play. No Spotify account, keys, subscriptions, or modified client.
            </p>
            <a
              href={download.url}
              download={download.fileName ?? 'Harmonia-mobile.apk'}
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#F5F7F5] px-7 text-sm font-semibold text-[#050807] transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <ArrowDownToLine className="size-4" aria-hidden />
              Download Harmonia{tag ? ` ${tag}` : ''} APK
            </a>
          </section>

          <p className="mt-8 text-center font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/25">
            {PAGE_URL}
          </p>
        </article>
      </main>

      <Footer />
    </>
  )
}
