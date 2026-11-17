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
const PACKET_COUNT = 46

type LaneRefs = {
  track: HTMLDivElement | null
  buffered: HTMLDivElement | null
  playhead: HTMLDivElement | null
  packets: (HTMLSpanElement | null)[]
  delivered: boolean[]
  width: number
}

function createLaneRefs(): LaneRefs {
  return {
    track: null,
    buffered: null,
    playhead: null,
    packets: [],
    delivered: Array.from({ length: PACKET_COUNT }, () => false),
    width: 0,
  }
}

/**
 * Side-by-side visualizer: a conventional lossy stream against Harmonia's
 * start-fast-then-upgrade adaptive pipeline.
 *
 * Drives playheads, buffered fills, packet reveals, and readouts directly via
 * DOM refs in a viewport-gated requestAnimationFrame loop so 60 FPS motion
 * produces zero per-frame React re-renders and zero layout thrashing.
 */
export function PipelineVisualizer() {
  const [playing, setPlaying] = useState(true)
  const [phase, setPhase] = useState({ upgraded: false, stalling: false })

  const containerRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLSpanElement>(null)
  const bitrateRef = useRef<HTMLSpanElement>(null)
  const warnLaneRef = useRef<LaneRefs>(createLaneRefs())
  const goodLaneRef = useRef<LaneRefs>(createLaneRefs())

  const progressRef = useRef(0)
  const lastPctTextRef = useRef(-1)
  const lastBitrateRef = useRef(-1)
  const phaseRef = useRef({ upgraded: false, stalling: false })
  const isVisibleRef = useRef(false)
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = motionQuery.matches
    if (motionQuery.matches) {
      progressRef.current = 0.5
    }

    const measureWidths = () => {
      if (warnLaneRef.current.track) {
        warnLaneRef.current.width = warnLaneRef.current.track.clientWidth
      }
      if (goodLaneRef.current.track) {
        goodLaneRef.current.width = goodLaneRef.current.track.clientWidth
      }
    }

    const paintLane = (
      lane: LaneRefs,
      laneProgress: number,
      tone: 'warn' | 'good',
    ) => {
      if (lane.buffered) {
        lane.buffered.style.transform = `scaleX(${laneProgress})`
      }
      if (lane.playhead && lane.width > 0) {
        lane.playhead.style.transform = `translate3d(${(laneProgress * lane.width).toFixed(2)}px, 0, 0)`
      }

      for (let i = 0; i < PACKET_COUNT; i++) {
        const x = i / (PACKET_COUNT - 1)
        const isDelivered = x <= laneProgress
        if (lane.delivered[i] === isDelivered) continue

        const el = lane.packets[i]
        if (!el) continue
        lane.delivered[i] = isDelivered

        if (tone === 'warn') {
          const inStall = x >= STALL_START && x < STALL_END
          el.style.backgroundColor = isDelivered ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.06)'
          el.style.opacity = isDelivered ? (inStall ? '0' : '0.9') : '0.35'
        } else {
          const isHq = x >= HANDOFF
          el.style.backgroundColor = isDelivered
            ? isHq
              ? '#18C964'
              : 'rgba(167, 243, 208, 0.65)'
            : 'rgba(255,255,255,0.06)'
          el.style.opacity = isDelivered ? (isHq ? '1' : '0.85') : '0.35'
        }
      }
    }

    const paintFrame = (p: number) => {
      const upgraded = p >= HANDOFF
      const stalling = p >= STALL_START && p < STALL_END

      if (
        phaseRef.current.upgraded !== upgraded ||
        phaseRef.current.stalling !== stalling
      ) {
        phaseRef.current = { upgraded, stalling }
        setPhase({ upgraded, stalling })
      }

      const pctInt = Math.floor(p * 100)
      if (lastPctTextRef.current !== pctInt && timeRef.current) {
        lastPctTextRef.current = pctInt
        timeRef.current.textContent = `t = ${String(pctInt).padStart(2, '0')}%`
      }

      const ramp = Math.min(1, Math.max(0, (p - HANDOFF) / 0.05))
      const bitrate = Math.round(160 + ramp * 160)
      if (lastBitrateRef.current !== bitrate && bitrateRef.current) {
        lastBitrateRef.current = bitrate
        bitrateRef.current.textContent = `${bitrate} kbps`
      }

      const warnProgress = stalling ? STALL_START + (p - STALL_START) * 0.2 : p
      paintLane(warnLaneRef.current, warnProgress, 'warn')
      paintLane(goodLaneRef.current, p, 'good')
    }

    measureWidths()
    paintFrame(progressRef.current)

    const ro = new ResizeObserver(() => {
      measureWidths()
      paintFrame(progressRef.current)
    })
    if (warnLaneRef.current.track) ro.observe(warnLaneRef.current.track)
    if (goodLaneRef.current.track) ro.observe(goodLaneRef.current.track)

    let animId = 0
    let lastTime = 0

    const stopLoop = () => {
      if (animId) {
        cancelAnimationFrame(animId)
        animId = 0
      }
    }

    const loop = (now: number) => {
      if (!playing || !isVisibleRef.current || document.hidden || reducedMotionRef.current) {
        animId = 0
        return
      }
      const delta = lastTime ? Math.min(100, now - lastTime) : 0
      lastTime = now
      progressRef.current = (progressRef.current + delta / CYCLE_MS) % 1
      paintFrame(progressRef.current)
      animId = requestAnimationFrame(loop)
    }

    const startLoop = () => {
      if (animId || !playing || !isVisibleRef.current || document.hidden || reducedMotionRef.current) {
        return
      }
      lastTime = performance.now()
      animId = requestAnimationFrame(loop)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry?.isIntersecting ?? false
        isVisibleRef.current = visible
        container.dataset.inView = visible ? 'true' : 'false'
        if (visible) {
          measureWidths()
          startLoop()
        } else {
          stopLoop()
        }
      },
      { threshold: 0.05 },
    )
    io.observe(container)

    const onVisibilityChange = () => {
      container.dataset.paused = document.hidden ? 'true' : 'false'
      if (document.hidden) {
        stopLoop()
      } else {
        startLoop()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    const onMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches
      if (e.matches) {
        stopLoop()
        progressRef.current = 0.5
        paintFrame(0.5)
      } else {
        startLoop()
      }
    }
    motionQuery.addEventListener('change', onMotionChange)

    return () => {
      stopLoop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      motionQuery.removeEventListener('change', onMotionChange)
    }
  }, [playing])

  const { upgraded, stalling } = phase

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

          <span
            ref={timeRef}
            className="font-mono text-[10px] tabular-nums uppercase tracking-[0.14em] text-white/40"
          >
            t = 00%
          </span>
        </div>

        {/* Live bitrate badge */}
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/75 px-3 py-1">
          <span
            className={cn(
              'size-1.5 rounded-full transition-colors duration-300',
              upgraded
                ? 'bg-[#18C964] shadow-[0_0_10px_2px_rgba(24,201,100,0.8)]'
                : 'bg-white/40',
            )}
          />
          <span
            ref={bitrateRef}
            className={cn(
              'font-mono text-[11px] font-semibold tabular-nums transition-colors duration-200',
              upgraded ? 'text-[#18C964]' : 'text-white/80',
            )}
          >
            160 kbps
          </span>
          <span className="font-mono text-[9.5px] uppercase tracking-wider text-white/40">
            {upgraded ? 'JioSaavn HQ' : 'Fast Start'}
          </span>
        </div>
      </div>

      {/* ---------------------------- Lane 1: Conventional player ---------------------------- */}
      <Lane
        laneRef={warnLaneRef}
        title="Conventional player"
        subtitle="One stream, one quality. Re-buffers when the pipe narrows."
        tone="warn"
        badge={
          <span className="inline-flex items-center gap-1 rounded-md border border-line bg-white/[0.04] px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-white/45">
            128 kbps · locked
          </span>
        }
        packetHeight={(i, x) => {
          const inStall = x >= STALL_START && x < STALL_END
          const h = inStall ? 3 : 8 + (i % 3) * 3
          return Math.max(3, Math.round(h * 0.75))
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
        laneRef={goodLaneRef}
        title="Harmonia adaptive pipeline"
        subtitle="Checks local/offline storage, then resolves direct JioSaavn or YouTube Music with fast start."
        tone="good"
        badge={
          <motion.span
            key={upgraded ? 'hq' : 'fast'}
            initial={{ opacity: 0, y: -3, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className={cn(
              'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-wider transition-colors duration-300',
              upgraded
                ? 'border-[#18C964]/50 bg-[#18C964]/15 text-[#18C964] shadow-[0_0_12px_rgba(24,201,100,0.2)]'
                : 'border-line bg-white/[0.04] text-white/55',
            )}
          >
            {upgraded ? '320 kbps · JioSaavn HQ' : '160 kbps · Fast Start'}
          </motion.span>
        }
        packetHeight={(i, x) => {
          const h = x >= HANDOFF ? 14 + (i % 3) * 4 : 8 + (i % 3) * 3
          return Math.max(3, Math.round(h * 0.75))
        }}
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
                'ml-2 flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider transition-[transform,background-color,color,box-shadow] duration-300',
                upgraded
                  ? 'border border-[#18C964] bg-[#18C964] text-black shadow-[0_0_18px_rgba(24,201,100,0.95)] scale-105'
                  : 'border border-[#18C964]/70 bg-[#0A110E]/95 text-[#18C964] shadow-[0_0_10px_rgba(24,201,100,0.4)]',
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
              <span className="hidden text-[8px] font-semibold opacity-80 sm:inline">&bull; 320k</span>
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
  laneRef,
  title,
  subtitle,
  tone,
  badge,
  packetHeight,
  marker,
  status,
}: {
  laneRef: React.RefObject<LaneRefs>
  title: string
  subtitle: string
  tone: 'warn' | 'good'
  badge: React.ReactNode
  packetHeight: (i: number, x: number) => number
  marker: React.ReactNode
  status: React.ReactNode
}) {
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
      <div
        ref={(el) => {
          laneRef.current.track = el
        }}
        className="relative h-9 overflow-hidden rounded-lg border border-white/[0.08] bg-black/50 sm:h-10"
        style={{ contain: 'layout paint' }}
      >
        {/* Buffered region behind the playhead (GPU scaleX) */}
        <div
          ref={(el) => {
            laneRef.current.buffered = el
          }}
          className={cn(
            'absolute inset-0 origin-left will-change-transform',
            tone === 'good' ? 'bg-[#18C964]/10' : 'bg-white/[0.03]',
          )}
          style={{ transform: 'scaleX(0)' }}
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
          {Array.from({ length: PACKET_COUNT }, (_, i) => {
            const x = i / (PACKET_COUNT - 1)
            const height = packetHeight(i, x)

            return (
              <span
                key={i}
                ref={(el) => {
                  laneRef.current.packets[i] = el
                }}
                className="rounded-full"
                style={{
                  width: 3,
                  height,
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  opacity: 0.35,
                }}
              />
            )
          })}
        </div>

        {/* Lane markers (upgrade threshold / stall region) with highest contrast layer */}
        <div className="pointer-events-none absolute inset-0 z-20">{marker}</div>

        {/* Playhead (GPU translate3d) */}
        <div
          ref={(el) => {
            laneRef.current.playhead = el
          }}
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 z-30 w-px will-change-transform',
            tone === 'good'
              ? 'bg-[#18C964] shadow-[0_0_12px_2px_rgba(24,201,100,0.8)]'
              : 'bg-white/80 shadow-[0_0_10px_2px_rgba(255,255,255,0.4)]',
          )}
          style={{ transform: 'translate3d(0, 0, 0)' }}
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
