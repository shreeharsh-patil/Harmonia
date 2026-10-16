'use client'

import { motion } from 'framer-motion'
import { Odometer } from '@/components/ui/odometer'
import { LogoMark } from '@/components/ui/logo'
import { cn } from '@/lib/utils'

/**
 * Harmonia Library and Offline playback preview.
 */
const ROWS = [
  { rank: 1, title: 'Downloaded Tracks', subtitle: 'Expo FileSystem private cache', count: '1.2 GB' },
  { rank: 2, title: 'Local Device Music', subtitle: 'Internal storage scanned via MediaLibrary', count: '240 songs' },
  { rank: 3, title: 'Cloud Sync Playlists', subtitle: 'Synced via optional Harmonia Backend', count: '14 lists' },
] as const

export function ReplayCard() {
  return (
    <div className="flex h-full flex-col gap-3.5">
      {/* Embossed recap card */}
      <div className="relative overflow-hidden rounded-xl border border-line bg-surface-2 p-3.5">
        {/* Sheen across the face */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent"
        />

        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-white/40">
              Harmonia Library
            </p>
            <p className="mt-1.5 text-[1.75rem] font-bold leading-none tracking-[-0.04em] text-white">
              <Odometer value={240} />
            </p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">
              Available offline
            </p>
          </div>

          {/* Harmonia icon */}
          <LogoMark className="size-8 shrink-0 opacity-80" />
        </div>

        <div className="relative mt-3.5 flex flex-col gap-2 border-t border-white/[0.06] pt-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">Offline Cache</span>
            <span className="font-mono text-[9.5px] text-[#18C964]">1.2 GB / 8.0 GB</span>
          </div>
          {/* Animated storage bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#18C964] via-[#A7F3D0] to-[#18C964]"
              initial={{ width: 0 }}
              whileInView={{ width: '35%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Ranked rows */}
      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">Library Collections</p>

        {ROWS.map((row, i) => (
          <motion.div
            key={row.title}
            className="group/row flex cursor-default items-center gap-2.5 rounded-lg border border-line bg-white/[0.02] px-2.5 py-2 transition-all duration-200 hover:border-[#18C964]/40 hover:bg-[#18C964]/[0.05] hover:translate-x-1"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 130, damping: 20, delay: 0.08 + i * 0.09 }}
          >
            <span
              className={cn(
                'grid size-5 shrink-0 place-items-center rounded-full font-mono text-[10px] font-semibold tabular-nums transition-colors',
                row.rank === 1
                  ? 'bg-[#18C964] text-black shadow-[0_0_8px_rgba(24,201,100,0.5)]'
                  : 'bg-white/[0.08] text-white/60 group-hover/row:bg-white/20 group-hover/row:text-white',
              )}
            >
              {row.rank}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12px] font-medium text-white/85 group-hover/row:text-white">
                {row.title}
              </span>
              <span className="block truncate text-[10.5px] text-white/40">{row.subtitle}</span>
            </span>

            <span className="shrink-0 font-mono text-[9.5px] tabular-nums text-white/50 group-hover/row:text-[#18C964]">
              {row.count}
            </span>
          </motion.div>
        ))}
      </div>

      <p className="mt-auto font-mono text-[10px] uppercase tracking-[0.12em] text-white/25">
        MP3 · FLAC · AAC · M4A — cached locally for offline playback
      </p>
    </div>
  )
}
