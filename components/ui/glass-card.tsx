'use client'

import { useRef, useState, type ReactNode } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Elevated panel with a dynamic specular highlight that tracks the pointer.
 *
 * Highly optimized for 120 FPS scrolling: specular highlight layers only mount
 * when the pointer actually enters a card, removing compositor overhead during scroll.
 */
export function GlassCard({
  children,
  className,
  interactive = true,
}: {
  children: ReactNode
  className?: string
  interactive?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)

  const wash = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, rgba(24,201,100,0.06), rgba(255,255,255,0.03) 40%, transparent 70%)`
  const edge = useMotionTemplate`radial-gradient(320px circle at ${x}px ${y}px, rgba(24,201,100,0.55), rgba(255,255,255,0.3) 45%, transparent 75%)`

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!interactive) return
    x.set(e.nativeEvent.offsetX)
    y.set(e.nativeEvent.offsetY)
  }

  function onEnter() {
    if (!interactive) return
    setIsHovered(true)
  }

  function onLeave() {
    setIsHovered(false)
    x.set(-400)
    y.set(-400)
  }

  return (
    <div
      ref={ref}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn(
        'group/card relative overflow-hidden rounded-[22px] glass',
        'transition-all duration-300 [transition-timing-function:var(--ease-out-expo)]',
        interactive && 'hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_50px_-20px_rgba(24,201,100,0.18)]',
        className,
      )}
    >
      {/* Interior specular wash (only active on hover) */}
      {interactive && isHovered ? (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: wash }}
        />
      ) : null}

      {/* Lit hairline edge: the gradient is masked to a 1px inset ring (only active on hover) */}
      {interactive && isHovered ? (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none absolute inset-0 z-0 rounded-[22px]"
          style={{
            background: edge,
            padding: 1,
            WebkitMask:
              'linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)',
            mask: 'linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)',
          }}
        />
      ) : null}

      {/* Static top-edge sheen — present even without a pointer (touch devices). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />

      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}
