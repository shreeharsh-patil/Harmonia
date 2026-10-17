'use client'

import { useRef, useState, type ReactNode } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-[#F5F7F5] text-[#050807] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_-5px_rgba(255,255,255,0.22)] active:translate-y-0',
  secondary:
    'bg-[#0A110E]/80 backdrop-blur-md border border-white/10 text-[#F5F7F5]/90 transition-all duration-200 hover:border-[#18C964]/40 hover:bg-[#18C964]/[0.06] hover:text-[#F5F7F5] hover:shadow-[0_0_24px_-4px_rgba(24,201,100,0.18)]',
  ghost:
    'text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors duration-200',
}

type MagneticButtonProps = {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: Variant
  className?: string
  /** Max px the button leans toward the cursor. 0 disables the magnet. */
  strength?: number
  external?: boolean
  download?: boolean | string
  'aria-label'?: string
}

/**
 * CTA with coupled cursor effects.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className,
  strength = 6,
  external,
  download,
  'aria-label': ariaLabel,
}: MagneticButtonProps) {
  const wrapRef = useRef<HTMLSpanElement>(null)
  const [hovered, setHovered] = useState(false)

  // Magnet offset.
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 })
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 })

  // Pointer position for the radial highlight, in element-local px.
  const px = useMotionValue(-200)
  const py = useMotionValue(-200)
  const highlight = useMotionTemplate`radial-gradient(150px circle at ${px}px ${py}px, ${
    variant === 'primary' ? 'rgba(0,0,0,0.16)' : 'rgba(255,255,255,0.14)'
  }, transparent 70%)`

  function handleMove(e: React.PointerEvent<HTMLSpanElement>) {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const localX = e.clientX - rect.left
    const localY = e.clientY - rect.top

    px.set(localX)
    py.set(localY)

    if (strength === 0) return
    // Normalize to -1..1 from the element centre, then scale to `strength` px.
    const nx = (localX / rect.width - 0.5) * 2
    const ny = (localY / rect.height - 0.5) * 2
    x.set(nx * strength)
    y.set(ny * strength)
  }

  function handleLeave() {
    setHovered(false)
    px.set(-200)
    py.set(-200)
    x.set(0)
    y.set(0)
  }

  const surface = cn(
    'group/btn relative z-10 inline-flex items-center justify-center gap-2 overflow-hidden rounded-full',
    'px-6 py-3 text-sm transition-colors duration-300 select-none w-full h-full',
    'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80',
    VARIANTS[variant],
    className,
  )

  const inner = (
    <>
      {/* Pointer-tracking specular highlight (clipped by this element). */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: highlight }}
      />
      <span className="relative z-10 inline-flex items-center gap-2 whitespace-nowrap">
        {children}
      </span>
    </>
  )

  const isDownload = Boolean(download)
  const isExternal = Boolean(external) && !isDownload

  const control = href ? (
    <a
      href={href}
      aria-label={ariaLabel}
      className={surface}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...(isDownload ? { download: typeof download === 'string' ? download : '' } : {})}
    >
      {inner}
    </a>
  ) : (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className={surface}>
      {inner}
    </button>
  )

  return (
    <motion.span
      ref={wrapRef}
      className="relative inline-flex isolate"
      style={{ x, y }}
      onPointerMove={handleMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={handleLeave}
      whileTap={{ scale: 0.97 }}
    >
      {/* Ambient halo behind the primary CTA — pure luminance, no hue. */}
      {variant === 'primary' ? (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute -inset-[7px] rounded-full bg-white blur-lg transition-opacity duration-500',
            // Driven by state, not `group-hover:`: the pointer handlers live on
            // this wrapper, and there is no `group` ancestor to hover.
            hovered ? 'opacity-30' : 'opacity-[0.14]',
          )}
        />
      ) : null}
      {control}
    </motion.span>
  )
}
