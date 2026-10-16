'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Check, Pause, Play, Zap } from 'lucide-react'
import { cn, pct } from '@/lib/utils'

/** Fraction of the timeline where Harmonia hands off fast-start audio to high-quality stream. */
const HANDOFF = 0.42
/** Where a conventional player stalls to re-buffer, and for how long. */
const STALL_START = 0.6
const STALL_END = 0.74

const CYCLE_MS = 7500

/**
 * Side-by-side visualizer: a conventional lossy stream against Harmonia's
 * start-fast-then-upgrade adaptive pipeline.
 *
 * Runs on a 60 FPS requestAnimationFrame loop driven by elapsed time, ensuring
 * fluid playhead motion, glowing packet reveals, live bitrate climbing, and
 * active stall simulation.
 */
export function PipelineVisualizer() {
  const [progress, setProgress] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)

  // IntersectionObserver: only animate when in viewport
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry?.isIntersecting ?? false)
      },
      { threshold: 0.1 },
    )
    io.observe(el)

    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!playing || !isVisible) return

    let animId: number
    let lastTime = performance.now()
    let lastRenderTime = 0

    const loop = (now: number) => {
      const delta = now - lastTime
      lastTime = now

      progressRef.current = (progressRef.current + delta / CYCLE_MS) % 1

      // Throttle React renders to ~30 FPS (32ms) to save CPU/battery while CSS transitions keep visual motion at 60 FPS
      if (now - lastRenderTime >= 32) {
        lastRenderTime = now
        setProgress(progressRef.current)
      }

      animId = requestAnimationFrame(loop)
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId)
      } else {
        lastTime = performance.now()
        animId = requestAnimationFrame(loop)
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    animId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animId)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [playing, isVisible])

  const upgraded = progress >= HANDOFF
  const stalling = progress >= STALL_START && progress < STALL_END

  // Bitrate readout: 160 kbps fast-start before handoff, 320 kbps JioSaavn HQ after,
  // with a smooth ramp as it crosses the upgrade threshold.
  const ramp = Math.min(1, Math.max(0, (progress - HANDOFF) / 0.05))
  const bitrate = Math.round(160 + ramp * (320 - 160))

  return (
    <div ref={containerRef} className="flex flex-col gap-3.5">
      {/* Controls + live readout */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPlaying((v) => !v)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/70 transition-colors hover:border-white/20 hover:bg-white/[0.1] hover:text-white active:scale-95"
            aria-label={playing ? 'Pause visualizer' : 'Play visualizer'}
          >
            {playing ? (
              <Pause className="size-3 text-[#18C964]" aria-hidden />
            ) : (
              <Play className="size-3 text-white/80" aria-hidden />
            )}
            <span>{playing ? 'Pause' : 'Play'}</span>
          </button>

          <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.14em] text-white/40">
            t = {(progress * 100).toFixed(0).padStart(2, '0')}%
          </span>
        </div>

        {/* Live bitrate badge */}
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 backdrop-blur-md">
          <span
            className={cn(
              'size-1.5 rounded-full transition-all duration-300',
              upgraded
                ? 'bg-[#18C964] shadow-[0_0_10px_2px_rgba(24,201,100,0.8)]'
                : 'bg-white/40',
            )}
          />
          <span
            className={cn(
              'font-mono text-[11px] font-semibold tabular-nums transition-colors duration-200',
              upgraded ? 'text-[#18C964]' : 'text-white/80',
            )}
          >
            {bitrate.toLocaleString('en-US')} kbps
          </span>
          <span className="font-mono text-[9.5px] uppercase tracking-wider text-white/40">
            {upgraded ? 'JioSaavn HQ' : 'Fast Start'}
          </span>
        </div>
      </div>

      {/* ---------------------------- Lane 1: Conventional player ---------------------------- */}
      <Lane
        title="Conventional player"
        subtitle="One stream, one quality. Re-buffers when the pipe narrows."
        tone="warn"
        progress={stalling ? STALL_START + (progress - STALL_START) * 0.2 : progress}
        badge={
          <span className="inline-flex items-center gap-1 rounded-md border border-line bg-white/[0.04] px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-white/45">
            128 kbps · locked
          </span>
        }
        packets={(i, x) => {
          const inStall = x >= STALL_START && x < STALL_END
          return {
            opacity: inStall ? 0 : 0.9,
            color: 'rgba(255,255,255,0.35)',
            height: inStall ? 3 : 8 + (i % 3) * 3,
          }
        }}
        marker={
          <div
            className={cn(
              'absolute inset-y-0 flex items-center justify-center border-x border-dashed transition-colors duration-200',
              stalling
                ? 'border-amber-400/50 bg-amber-500/[0.12]'
                : 'border-white/20 bg-white/[0.03]',
            )}
            style={{ left: pct(STALL_START), width: pct(STALL_END - STALL_START) }}
          >
            <span
              className={cn(
                'whitespace-nowrap font-mono text-[8.5px] font-medium uppercase tracking-wider transition-colors duration-200',
                stalling ? 'text-amber-300' : 'text-white/40',
              )}
            >
              re-buffer
            </span>
          </div>
        }
        status={
          stalling ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-amber-400">
              <AlertTriangle className="size-3 shrink-0 animate-bounce" aria-hidden />
              Stalled — audible gap & playback freeze
            </span>
          ) : (
            <span className="text-white/35">Streaming lossy</span>
          )
        }
      />

      {/* ---------------------------- Lane 2: Harmonia adaptive pipeline ---------------------------- */}
      <Lane
        title="Harmonia adaptive pipeline"
        subtitle="Checks local/offline storage, then resolves direct JioSaavn or YouTube Music with fast start."
        tone="good"
        progress={progress}
        badge={
          <motion.span
            key={upgraded ? 'hq' : 'fast'}
            initial={{ opacity: 0, y: -3, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className={cn(
              'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-wider transition-all duration-300',
              upgraded
                ? 'border-[#18C964]/50 bg-[#18C964]/15 text-[#18C964] shadow-[0_0_12px_rgba(24,201,100,0.2)]'
                : 'border-line bg-white/[0.04] text-white/55',
            )}
          >
            {upgraded ? '320 kbps · JioSaavn HQ' : '160 kbps · Fast Start'}
          </motion.span>
        }
        packets={(i, x) => ({
          opacity: x >= HANDOFF ? 1 : 0.85,
          color: x >= HANDOFF ? '#18C964' : 'rgba(167, 243, 208, 0.65)',
          height: x >= HANDOFF ? 14 + (i % 3) * 4 : 8 + (i % 3) * 3,
        })}
        marker={
          <div
            className="absolute inset-y-0 flex items-center"
            style={{ left: pct(HANDOFF) }}
          >
            {/* Glowing vertical upgrade handoff laser line */}
            <span className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-[#18C964] shadow-[0_0_12px_2px_rgba(24,201,100,0.85)]" />

            {/* Prominent glowing Upgrade Pill Badge */}
            <div
              className={cn(
                'ml-2 flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider transition-all duration-300',
                upgraded
                  ? 'border border-[#18C964] bg-[#18C964] text-black shadow-[0_0_18px_rgba(24,201,100,0.95)] scale-105'
                  : 'border border-[#18C964]/70 bg-[#0A110E]/95 text-[#18C964] shadow-[0_0_10px_rgba(24,201,100,0.4)] backdrop-blur-sm',
              )}
            >
              <Zap
                className={cn(
                  'size-2.5 shrink-0 transition-transform duration-300',
                  upgraded ? 'fill-black text-black scale-110' : 'fill-[#18C964] text-[#18C964] animate-pulse',
                )}
                aria-hidden
              />
              <span>Upgrade</span>
              <span className="text-[8px] font-semibold opacity-80 hidden sm:inline">&bull; 320k</span>
            </div>
          </div>
        }
        status={
          upgraded ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-[#18C964]">
              <Check className="size-3 shrink-0 text-[#18C964]" aria-hidden />
              Promoted to 320 kbps — high fidelity
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[#A7F3D0]">
              <Zap className="size-3 shrink-0 text-[#18C964] animate-pulse" aria-hidden />
              Instant playback in ~180 ms &bull; Upgrades to 320 kbps
            </span>
          )
        }
      />
    </div>
  )
}

/**
 * Lane component representing an individual audio pipeline track.
 */
function Lane({
  title,
  subtitle,
  tone,
  progress,
  badge,
  packets,
  marker,
  status,
}: {
  title: string
  subtitle: string
  tone: 'warn' | 'good'
  progress: number
  badge: React.ReactNode
  packets: (i: number, x: number) => { opacity: number; color: string; height: number }
  marker: React.ReactNode
  status: React.ReactNode
}) {
  const COUNT = 46

  return (
    <div
      className={cn(
        'rounded-xl border p-3 transition-colors duration-500 sm:p-3.5',
        tone === 'good'
          ? 'border-[#18C964]/20 bg-[#0A110E]/90 shadow-[0_0_20px_-8px_rgba(24,201,100,0.12)]'
          : 'border-line bg-white/[0.015]',
      )}
    >
      <div className="mb-2 flex flex-wrap items-start justify-between gap-1.5">
        <div>
          <p className="text-[13px] font-semibold tracking-[-0.01em] text-white/90">{title}</p>
          <p className="mt-0.5 text-[11px] leading-snug text-white/40">{subtitle}</p>
        </div>
        {badge}
      </div>

      {/* Packet track */}
      <div className="relative h-9 overflow-hidden rounded-lg border border-white/[0.08] bg-black/50 sm:h-10">
        {/* Buffered region behind the playhead */}
        <div
          className={cn(
            'absolute inset-y-0 left-0 transition-none',
            tone === 'good' ? 'bg-[#18C964]/10' : 'bg-white/[0.03]',
          )}
          style={{ width: pct(progress) }}
        />

        {/* High-quality upgraded zone highlight for Harmonia */}
        {tone === 'good' && (
          <div
            className="pointer-events-none absolute inset-y-0 right-0 bg-gradient-to-r from-[#18C964]/[0.08] to-transparent"
            style={{ left: pct(HANDOFF) }}
          />
        )}

        {/* Packets layer */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-1.5">
          {Array.from({ length: COUNT }, (_, i) => {
            const x = i / (COUNT - 1)
            const { opacity, color, height } = packets(i, x)
            const delivered = x <= progress

            return (
              <span
                key={i}
                className="rounded-full transition-[height,background-color,box-shadow] duration-150"
                style={{
                  width: 3,
                  height: Math.max(3, Math.round(height * 0.75)),
                  backgroundColor: delivered ? color : 'rgba(255,255,255,0.06)',
                  opacity: delivered ? opacity : 0.35,
                  boxShadow:
                    delivered && tone === 'good' && x >= HANDOFF
                      ? '0 0 8px rgba(24, 201, 100, 0.6)'
                      : undefined,
                }}
              />
            )
          })}
        </div>

        {/* Lane markers (upgrade threshold / stall region) with highest contrast layer */}
        <div className="pointer-events-none absolute inset-0 z-20">
          {marker}
        </div>

        {/* Playhead */}
        <div
          className={cn(
            'pointer-events-none absolute inset-y-0 z-30 w-px transition-none',
            tone === 'good'
              ? 'bg-[#18C964] shadow-[0_0_12px_2px_rgba(24,201,100,0.8)]'
              : 'bg-white/80 shadow-[0_0_10px_2px_rgba(255,255,255,0.4)]',
          )}
          style={{ left: pct(progress) }}
        >
          <span
            className={cn(
              'absolute top-0.5 left-1/2 size-2 -translate-x-1/2 rounded-full transition-colors',
              tone === 'good'
                ? 'bg-[#18C964] shadow-[0_0_8px_#18C964]'
                : 'bg-white shadow-[0_0_6px_#fff]',
            )}
          />
        </div>
      </div>

      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em]">{status}</p>
    </div>
  )
}
