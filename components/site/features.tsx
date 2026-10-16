'use client'

import { AudioLines, Cast, CalendarClock, Mic2, Waves } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { RevealGroup, RevealItem, SectionHeading } from '@/components/ui/reveal'
import { PipelineVisualizer } from '@/components/features/pipeline-visualizer'
import { LyricsCard } from '@/components/features/lyrics-card'
import { AutomixCard } from '@/components/features/automix-card'
import { PresenceCard } from '@/components/features/presence-card'
import { ReplayCard } from '@/components/features/replay-card'
import { cn } from '@/lib/utils'

export function Features() {
  return (
    <section id="features" className="relative scroll-mt-28 px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="The engine room"
          title={
            <>
              Built for people who can{' '}
              <span className="text-gradient">hear the difference</span>
            </>
          }
          description="Every feature below ships in the current build — not a roadmap. Poke at the cards; they're all live."
        />

        <RevealGroup className="mt-6 sm:mt-8 grid grid-cols-1 gap-3.5 lg:grid-cols-6" stagger={0.1}>
          {/* Card 1 — full width */}
          <RevealItem className="lg:col-span-6">
            <FeatureCard
              id="audio-engine"
              sideBySide
              icon={<AudioLines className="size-4 text-white/70" aria-hidden />}
              kicker="Adaptive stream pipeline"
              title="Starts instantly. Up to 320 kbps high fidelity."
              body="Playback checks local device storage and offline copies first, then resolves from direct JioSaavn or YouTube Music with fast start and promotion up to 320 kbps. Network-aware quality ceilings for Wi-Fi and mobile data keep you in control."
              className="lg:grid lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-8"
            >
              <PipelineVisualizer />
            </FeatureCard>
          </RevealItem>

          {/* Card 2 */}
          <RevealItem className="lg:col-span-3">
            <FeatureCard
              icon={<Mic2 className="size-4 text-white/70" aria-hidden />}
              kicker="LRCLib Synced Lyrics"
              title="Real-time synchronized lyrics"
              body="Powered by LRCLib — a free, open-source lyrics provider. Real-time timed line and character-level highlighting, held note sweeps, translation support, and tap-to-seek right to any phrase."
            >
              <LyricsCard />
            </FeatureCard>
          </RevealItem>

          {/* Card 3 */}
          <RevealItem className="lg:col-span-3">
            <FeatureCard
              icon={<Waves className="size-4 text-white/70" aria-hidden />}
              kicker="Audio Controls & Speed"
              title="Tailored to your listening flow"
              body="Fine-tune your playback speed, set sleep timers, and maintain smooth gapless queue transitions with native background playback powered by expo-audio."
            >
              <AutomixCard />
            </FeatureCard>
          </RevealItem>

          {/* Card 4 */}
          <RevealItem className="lg:col-span-3">
            <FeatureCard
              icon={<Cast className="size-4 text-white/70" aria-hidden />}
              kicker="Background Audio & Controls"
              title="Lock screen & media session"
              body="Native Android media notification with Previous, Next, Play/Pause, and seek bar controls that stay responsive even after the app is backgrounded or the screen is locked."
            >
              <PresenceCard />
            </FeatureCard>
          </RevealItem>

          {/* Card 5 */}
          <RevealItem className="lg:col-span-3">
            <FeatureCard
              icon={<CalendarClock className="size-4 text-white/70" aria-hidden />}
              kicker="Offline & Local Library"
              title="Your music, on and offline"
              body="Scan local MP3, FLAC, and AAC files directly from your phone storage, or download tracks for offline listening via Expo FileSystem into Harmonia's private app directory."
            >
              <ReplayCard />
            </FeatureCard>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  )
}

function FeatureCard({
  id,
  icon,
  kicker,
  title,
  body,
  children,
  className,
  sideBySide = false,
}: {
  id?: string
  icon: React.ReactNode
  kicker: string
  title: string
  body: string
  children: React.ReactNode
  className?: string
  sideBySide?: boolean
}) {
  return (
    <GlassCard className="h-full">
      <div id={id} className={cn('scroll-mt-28 p-5 sm:p-6', className)}>
        <div className={cn('flex flex-col', sideBySide && 'justify-between')}>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
                {icon}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                {kicker}
              </span>
            </div>

            <h3 className="mt-3 text-balance text-xl font-semibold tracking-[-0.025em] text-white sm:text-[1.35rem]">
              {title}
            </h3>

            <p className="mt-2 text-pretty text-[13.5px] leading-relaxed text-white/45">{body}</p>
          </div>

          {sideBySide ? (
            <div className="mt-4 hidden flex-wrap gap-1.5 lg:flex">
              <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-white/60">
                Direct JioSaavn & YTM
              </span>
              <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-white/60">
                Up to 320 kbps HQ
              </span>
              <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-white/60">
                Offline & Local First
              </span>
            </div>
          ) : null}
        </div>

        {/* Live demo component under or beside the prose */}
        <div className={cn(sideBySide ? 'mt-4 lg:mt-0' : 'mt-5')}>{children}</div>
      </div>
    </GlassCard>
  )
}
