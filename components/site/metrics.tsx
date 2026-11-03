'use client'

import { Download, Package, ShieldCheck, Star } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { LiveMetric } from '@/components/ui/live-metric'
import { Skeleton } from '@/components/ui/skeleton'
import { RevealGroup, RevealItem } from '@/components/ui/reveal'
import { useTelemetry } from '@/components/telemetry-provider'
import { RELEASES_URL, REPO_URL } from '@/lib/github'

export function Metrics() {
  const { data } = useTelemetry()

  const stars = data?.repo?.stars ?? null
  const releases = data?.releaseCount ?? null
  const latest = data?.latest?.tag ?? null
  // Recompute the total from the release assets too: a stale telemetry snapshot
  // can carry totalDownloads: 0 while the per-release counts are non-zero, which
  // is what rendered "0 downloads" on the live site.
  const assetDownloads = data?.releases?.reduce(
    (sum, release) => sum + (release.apk?.downloadCount ?? 0),
    0,
  )
  const downloads = data ? Math.max(data.totalDownloads ?? 0, assetDownloads ?? 0) : null
  const license = data?.repo?.license ?? null

  return (
    <section aria-label="Live project metrics" className="relative px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <RevealGroup
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.09}
        >
          {/* Stars */}
          <RevealItem>
            <MetricTile
              href={`${REPO_URL}/stargazers`}
              icon={<Star className="size-4 text-white/70" aria-hidden />}
              value={<LiveMetric value={stars} digits={3} separator={false} />}
              label="Stargazers on GitHub"
              foot={
                <>
                  <span className="text-white/60">★</span> growing daily
                </>
              }
            />
          </RevealItem>

          {/* Releases */}
          <RevealItem>
            <MetricTile
              href={RELEASES_URL}
              icon={<Package className="size-4 text-white/70" aria-hidden />}
              value={<LiveMetric value={releases} digits={1} />}
              label="Production & Beta Releases"
              foot={
                latest === null ? (
                  <Skeleton className="h-2.5 w-28" />
                ) : (
                  <>
                    <span className="font-mono text-white/70">{latest}</span> currently shipping
                  </>
                )
              }
            />
          </RevealItem>

          {/* Downloads */}
          <RevealItem>
            <MetricTile
              href="https://github.com/shreeharsh-patil/Harmonia/releases"
              icon={<Download className="size-4 text-white/70" aria-hidden />}
              value={<LiveMetric value={downloads} digits={2} />}
              label="APK Downloads"
              foot={
                downloads === null ? (
                  <Skeleton className="h-2.5 w-28" />
                ) : (
                  <>
                    across{' '}
                    <span className="font-mono text-white/70">
                      {releases ?? '—'}
                    </span>{' '}
                    public releases
                  </>
                )
              }
            />
          </RevealItem>

          {/* Free / license — the one static tile, and deliberately so. */}
          <RevealItem>
            <MetricTile
              href={`${REPO_URL}/blob/main/LICENSE`}
              icon={<ShieldCheck className="size-4 text-white/70" aria-hidden />}
              value={<span className="tnum">100%</span>}
              label="Free — no ads, no subscriptions"
              foot={
                <span className="font-mono text-white/70">
                  {license ?? 'Source-Available'}
                </span>
              }
            />
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  )
}

function MetricTile({
  href,
  icon,
  value,
  label,
  foot,
}: {
  href: string
  icon: React.ReactNode
  value: React.ReactNode
  label: string
  foot: React.ReactNode
}) {
  return (
    <GlassCard className="h-full">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full flex-col gap-3 p-5"
      >
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
            {icon}
          </span>
        </div>

        <p className="text-[2.15rem] font-bold leading-none tracking-[-0.04em] text-white">
          {value}
        </p>

        <p className="text-[13px] leading-snug text-white/45">{label}</p>

        <p className="mt-auto pt-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-white/30">
          {foot}
        </p>
      </a>
    </GlassCard>
  )
}
