'use client'

import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Disc3 } from 'lucide-react'
import { pct } from '@/lib/utils'

/**
 * Deterministic pseudo-waveform — no Math.random, so SSR and client agree.
 * Determinism alone isn't enough, though: these are long floats, so every value
 * goes through `pct()` before it reaches an inline style. See `lib/utils.ts`.
 */
function waveform(seed: number, count = 42) {
  return Array.from({ length: count }, (_, i) => {
    const a = Math.sin(i * 0.55 + seed) * 0.5 + 0.5
    const b = Math.sin(i * 1.31 + seed * 2.2) * 0.3 + 0.5
    return 0.22 + Math.min(1, a * 0.6 + b * 0.5) * 0.78
  })
}

const OUTGOING = waveform(1.2)
const INCOMING = waveform(4.7)

const OUT_BPM = 124
const IN_BPM = 128

/**
 * Crossfade/Automix control.
 *
 * The slider is the real interaction: it sets the transition window, and the two
 * waveforms overlap by exactly that much so the tradeoff is visible rather than
 * described. At 0s the tracks butt up against each other (gapless); at 12s
 * they're deeply blended.
 */
export function AutomixCard() {
  const [seconds, setSeconds] = useState(6)
  const sliderId = useId()

  // Overlap as a fraction of the lane width. 12s maps to ~46% overlap, which is
  // as far as it can go before the two waveforms become unreadable.
  const overlap = (seconds / 12) * 0.46
  const beatMatched = seconds > 0

  return (
    <div className="flex h-full flex-col gap-4">
      {/* BPM handoff */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Disc3 className="size-3.5 text-[#18C964] animate-spin" style={{ animationDuration: '6s' }} aria-hidden />
          <span className="font-mono text-[11px] tabular-nums text-white/80">{OUT_BPM} BPM</span>
        </div>

        <div className="relative flex-1">
          <div className="h-px w-full bg-gradient-to-r from-[#18C964]/40 via-white/50 to-[#18C964]/40" />
          <motion.span
            className="absolute -top-[3px] size-1.5 rounded-full bg-[#18C964] shadow-[0_0_10px_2px_rgba(24,201,100,0.7)]"
            animate={{ left: ['0%', '100%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] tabular-nums text-white/80">{IN_BPM} BPM</span>
          <Activity className="size-3.5 text-[#A7F3D0] animate-pulse" aria-hidden />
        </div>
      </div>

      {/* Overlapping waveforms */}
      <div className="relative h-24 overflow-hidden rounded-xl border border-white/[0.08] bg-black/45">
        {/* Outgoing track, anchored left */}
        <div
          className="absolute inset-y-0 left-0 flex items-center gap-[2px] px-2 transition-all duration-300"
          style={{ width: pct(0.5 + overlap / 2) }}
        >
          {OUTGOING.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-full bg-gradient-to-t from-white/20 via-white/50 to-white/90 transition-all duration-200"
              style={{ height: pct(h * 0.66) }}
            />
          ))}
        </div>

        {/* Incoming track, anchored right */}
        <div
          className="absolute inset-y-0 right-0 flex items-end justify-end gap-[2px] px-2 pb-2 transition-all duration-300"
          style={{ width: pct(0.5 + overlap / 2) }}
        >
          {INCOMING.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-full bg-gradient-to-t from-[#18C964] via-[#18C964]/70 to-[#064E3B]/40 transition-all duration-200"
              style={{ height: pct(h * 0.58) }}
            />
          ))}
        </div>

        {/* Transition window with glowing emerald boundary */}
        <motion.div
          className="absolute inset-y-0 border-x border-dashed border-[#18C964]/60 bg-[#18C964]/[0.08] shadow-[0_0_15px_rgba(24,201,100,0.12)] backdrop-blur-[1px]"
          animate={{
            left: pct(0.5 - overlap / 2),
            width: pct(overlap),
          }}
          transition={{ type: 'spring', stiffness: 240, damping: 25 }}
        >
          <span className="absolute left-1/2 top-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-[#18C964]/30 bg-black/80 px-2 py-0.5 font-mono text-[8.5px] font-semibold uppercase tracking-wider text-[#18C964] shadow-[0_0_10px_rgba(24,201,100,0.25)]">
            {seconds === 0 ? 'gapless' : `${seconds}s mix`}
          </span>
        </motion.div>

        {/* Beat grid ticks */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-2 opacity-35">
          {Array.from({ length: 17 }, (_, i) => (
            <span
              key={i}
              className={i % 4 === 0 ? 'h-3 w-px bg-[#18C964]/80' : 'h-1.5 w-px bg-white/40'}
            />
          ))}
        </div>
      </div>

      {/* Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor={sliderId}
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35"
          >
            Crossfade duration
          </label>
          <span className="font-mono text-[11px] tabular-nums text-white">
            {seconds.toFixed(0)}s
          </span>
        </div>

        <input
          id={sliderId}
          type="range"
          min={0}
          max={12}
          step={1}
          value={seconds}
          onChange={(e) => setSeconds(Number(e.target.value))}
          aria-valuetext={`${seconds} seconds`}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 outline-none [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#18C964] [&::-webkit-slider-thumb]:shadow-[0_0_10px_2px_rgba(24,201,100,0.6)] [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#18C964]"
          style={{
            background: `linear-gradient(to right, #18C964 0%, #18C964 ${pct(
              seconds / 12,
            )}, rgba(255, 255, 255, 0.1) ${pct(seconds / 12)})`,
          }}
        />

        <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-white/25">
          <span>0s · gapless</span>
          <span>{beatMatched ? 'beat-matched · tempo-stretched' : 'hard cut'}</span>
          <span>12s</span>
        </div>
      </div>
    </div>
  )
}
