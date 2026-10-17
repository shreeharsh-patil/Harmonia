'use client'

import { motion } from 'framer-motion'
import { ArrowDownToLine, ArrowUpRight, Github, History, Star } from 'lucide-react'
import { FaAndroid, FaApple, FaTv, FaWindows } from 'react-icons/fa'
import { AppDemo } from '@/components/ui/app-demo'
import { AmbientAudioWaves } from '@/components/site/ambient-audio-waves'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { LiveMetric } from '@/components/ui/live-metric'
import { Skeleton } from '@/components/ui/skeleton'
import { Reveal } from '@/components/ui/reveal'
import { useTelemetry } from '@/components/telemetry-provider'
import { RELEASES_URL, REPO_URL, resolveDownload } from '@/lib/github'
import { cn } from '@/lib/utils'

/**
 * Where Harmonia Mobile runs, and where it is going.
 */
const PLATFORMS = [
  { name: 'Android', status: 'Available now', shipped: true, icon: FaAndroid },
  { name: 'iOS', status: 'In development', shipped: false, icon: FaApple },
  { name: 'Android TV', status: 'Planned', shipped: false, icon: FaTv },
  { name: 'Windows', status: 'Planned', shipped: false, icon: FaWindows },
] as const

export function Hero() {
  const { data } = useTelemetry()

  const latest = data?.latest ?? null
  const tag = latest?.tag
  const releaseCount = data?.releaseCount ?? null
  const stars = data?.repo?.stars ?? null
  const download = resolveDownload(latest)

  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-20">
      {/*
        A film of noise, so the flat black has some tooth to it rather than
        reading as a dead void. The grid that used to sit here as well is gone:
        the page-wide one in <Backdrop /> now draws at the same strength, and
        two 64px grids stacked — one fixed, one scrolling with the section —
        slid past each other into a moiré.
      */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 noise opacity-[0.045]" />
      </div>

      {/* The demo column is sized to the video, not the other way round, so the
          video fills it with no side gap at either breakpoint. */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,330px)] lg:gap-14">
        {/* ------------------------------ copy ------------------------------ */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* Announcement pill */}
          <Reveal>
            <a
              href="#changelog"
              className="group inline-flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-[#0A110E]/80 backdrop-blur-md px-3.5 py-1.5 text-[12.5px] transition-all duration-300 hover:border-emerald-500/40 hover:bg-[#0A110E]"
            >
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inset-0 rounded-full bg-[#18C964]" />
                <span className="absolute inset-0 animate-ping rounded-full bg-[#18C964] opacity-40" />
              </span>
              {tag ? (
                <span className="shimmer-text font-mono font-medium">{tag} Released</span>
              ) : (
                <Skeleton className="h-3 w-24" />
              )}
              <ArrowUpRight
                className="size-3.5 shrink-0 text-[#929B96] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#F5F7F5]"
                aria-hidden
              />
            </a>
          </Reveal>

          {/* Display headline */}
          <Reveal delay={0.08}>
            <h1 className="mt-7 max-w-[18ch] text-balance text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[4.1rem]">
              <span className="text-[#F5F7F5]">Free Music.</span>
              <br />
              <span className="animate-headline-flow inline-block bg-gradient-to-r from-[#F5F7F5] via-[#D1D5DB] via-[#A7F3D0]/60 to-[#717A75] bg-clip-text text-transparent">
                Zero Subscriptions.
              </span>
            </h1>
          </Reveal>

          {/* Sub-headline */}
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-pretty text-[15px] leading-[1.7] text-[#929B96] sm:text-[16.5px]">
              The source-available music player for Android with free streaming from JioSaavn & YouTube Music, LRCLib synced lyrics, offline downloads, and native background playback.
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <MagneticButton
                href={download.url}
                download={download.fileName ?? 'Harmonia-mobile.apk'}
                className="!px-6 !py-3.5"
                aria-label={
                  download.isDirect
                    ? `Download Harmonia Mobile APK ${tag ?? 'latest'}, ${download.size}`
                    : 'View Harmonia Mobile releases'
                }
              >
                <ArrowDownToLine className="size-4 transition-transform duration-200 group-hover/btn:translate-y-0.5" aria-hidden />
                <span>Download Latest APK{tag ? ` (${tag})` : ''}</span>
                {download.isDirect ? (
                  <span className="ml-1 rounded-full bg-black/10 px-2 py-0.5 font-mono text-[10.5px] font-medium text-black/55">
                    {download.size}
                  </span>
                ) : null}
              </MagneticButton>

              <MagneticButton
                href="#changelog"
                variant="secondary"
                className="!px-5 !py-3.5"
              >
                <History className="size-4" aria-hidden />
                <span>
                  View Releases
                  {releaseCount !== null ? ` (${releaseCount} Builds)` : ''}
                </span>
              </MagneticButton>
            </div>
          </Reveal>

          {/* Tertiary CTA + trust line */}
          <Reveal delay={0.32}>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 lg:justify-start">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-[13.5px] text-white/55 transition-colors hover:text-white"
              >
                <Github className="size-4" aria-hidden />
                <span>Star on GitHub</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11.5px] text-white/75 transition-colors group-hover:border-[#18C964]/40 group-hover:text-[#18C964]">
                  <Star className="size-2.5 fill-current" aria-hidden />
                  <LiveMetric value={stars} digits={3} separator={false} />
                </span>
              </a>

              <span className="hidden h-3 w-px bg-white/10 sm:block" aria-hidden />

              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/30">
                Android 8.0+ · Free providers · No ads · No Spotify keys
              </p>
            </div>
          </Reveal>

          {/* Platform availability */}
          <Reveal delay={0.4} className="w-full">
            <ul className="mx-auto mt-8 grid w-full max-w-[520px] grid-cols-2 gap-2.5 lg:mx-0">
              {PLATFORMS.map(({ name, status, shipped, icon: Icon }) => (
                <li
                  key={name}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition-all duration-300',
                    shipped
                      ? 'border-[#18C964]/30 bg-[#0A110E]/90 hover:border-[#18C964]/60 hover:shadow-[0_0_20px_-6px_rgba(24,201,100,0.25)] hover:-translate-y-0.5'
                      : 'border-line bg-transparent hover:border-white/20',
                  )}
                >
                  <Icon
                    className={cn('size-6 shrink-0 transition-colors', shipped ? 'text-[#18C964]' : 'text-white/35')}
                    aria-hidden
                  />
                  <span className="flex min-w-0 flex-col leading-tight">
                    <span
                      className={cn(
                        'truncate text-[14.5px] font-semibold',
                        shipped ? 'text-white' : 'text-white/55',
                      )}
                    >
                      {name}
                    </span>
                    <span
                      className={cn(
                        'mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em]',
                        shipped ? 'text-[#18C964]' : 'text-white/35',
                      )}
                    >
                      {status}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* ----------------------------- showcase ---------------------------- */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 70, damping: 20, delay: 0.2 }}
        >
          {/* Subtle acoustic frequency trails & harmonic ribbon */}
          <AmbientAudioWaves />
          <AppDemo />
        </motion.div>
      </div>
    </section>
  )
}
