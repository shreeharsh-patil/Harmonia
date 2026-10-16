'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Backdrop
 *
 * Cinematic ambient background system for Harmonia.
 *
 * Layers:
 * 1. Base deep canvas (#050807)
 * 2. Animated Aurora Background:
 *    - 3 organic blurred gradient shapes drifting on 22-34s cycles.
 *    - Emerald accent (#18C964), deep forest green (#064E3B), and soft mint (#A7F3D0).
 *    - Weighted toward the hero's right side to illuminate the showcase without overpowering typography.
 * 3. Animated Grid Background:
 *    - Architectural 64px grid lines with delicate opacity.
 *    - Liquid pointer-tracking radial illumination on desktop (smooth cursor tracking with fade-out).
 *    - Staggered gentle emerald glow beads at selected grid intersections.
 * 4. Deep vignette and corner falloff.
 *
 * Zero hydration mismatch: CSS media queries handle reduced motion natively without DOM discrepancies.
 */
export function Backdrop() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPointerDevice, setIsPointerDevice] = useState(false)
  const [cursorActive, setCursorActive] = useState(false)

  useEffect(() => {
    // Detect fine pointer devices (desktop mouse/trackpad)
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    setIsPointerDevice(mediaQuery.matches)

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsPointerDevice(e.matches)
    }
    mediaQuery.addEventListener('change', handleMediaChange)

    if (!mediaQuery.matches) {
      return () => mediaQuery.removeEventListener('change', handleMediaChange)
    }

    let rafId: number | null = null
    let currentX = -1000
    let currentY = -1000
    let targetX = -1000
    let targetY = -1000

    const tick = () => {
      currentX += (targetX - currentX) * 0.15
      currentY += (targetY - currentY) * 0.15

      if (containerRef.current) {
        containerRef.current.style.setProperty('--cursor-x', `${currentX.toFixed(1)}px`)
        containerRef.current.style.setProperty('--cursor-y', `${currentY.toFixed(1)}px`)
      }

      if (Math.abs(targetX - currentX) > 0.2 || Math.abs(targetY - currentY) > 0.2) {
        rafId = requestAnimationFrame(tick)
      } else {
        rafId = null
      }
    }

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      setCursorActive(true)

      if (!rafId) {
        rafId = requestAnimationFrame(tick)
      }
    }

    const handlePointerLeave = () => {
      setCursorActive(false)
    }

    const handleVisibility = () => {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('mouseleave', handlePointerLeave)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange)
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('mouseleave', handlePointerLeave)
      document.removeEventListener('visibilitychange', handleVisibility)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-[#050807]"
      style={
        {
          '--cursor-x': '-1000px',
          '--cursor-y': '-1000px',
        } as React.CSSProperties
      }
    >
      {/* ---------------- 1. Animated Organic Aurora Blobs ---------------- */}
      {/* Blob 1: Hero right side emerald glow */}
      <div
        className="absolute -top-[10rem] right-[2%] h-[56rem] w-[56rem] rounded-full opacity-[0.24] blur-[130px] sm:h-[66rem] sm:w-[66rem] animate-aurora-slow"
        style={{
          background:
            'radial-gradient(circle at center, #18C964 0%, rgba(6,78,59,0.7) 45%, rgba(5,8,7,0) 72%)',
          contain: 'paint',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* Blob 2: Deep forest green ambient drift */}
      <div
        className="absolute top-[6rem] right-[22%] h-[46rem] w-[54rem] rounded-full opacity-[0.32] blur-[140px] sm:h-[54rem] sm:w-[62rem] animate-aurora-reverse"
        style={{
          background:
            'radial-gradient(ellipse at center, #064E3B 0%, rgba(10,17,14,0.75) 50%, rgba(5,8,7,0) 78%)',
          contain: 'paint',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* Blob 3: Soft mint / teal accent stream */}
      <div
        className="absolute top-[0rem] -right-[6rem] h-[36rem] w-[36rem] rounded-full opacity-[0.16] blur-[110px] sm:h-[42rem] sm:w-[42rem] animate-aurora-pulse"
        style={{
          background:
            'radial-gradient(circle at center, #A7F3D0 0%, rgba(24,201,100,0.45) 42%, rgba(5,8,7,0) 70%)',
          contain: 'paint',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* Blob 4: Soft global wash across top */}
      <div
        className="absolute -top-[24rem] left-1/2 h-[50rem] w-[72rem] -translate-x-1/2 rounded-full opacity-[0.12] blur-[140px]"
        style={{
          background:
            'radial-gradient(ellipse at center, #18C964 0%, rgba(6,78,59,0.4) 40%, rgba(5,8,7,0) 72%)',
          contain: 'paint',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* ---------------- 2. Base Architectural Grid ---------------- */}
      <div className="absolute inset-0 grid-lines opacity-80" />

      {/* ---------------- 3. Interactive Pointer Radial Illumination ---------------- */}
      {isPointerDevice && (
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{
            opacity: cursorActive ? 1 : 0,
            backgroundImage:
              'linear-gradient(to right, rgba(24,201,100,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(24,201,100,0.14) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage:
              'radial-gradient(420px circle at var(--cursor-x) var(--cursor-y), black 0%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(420px circle at var(--cursor-x) var(--cursor-y), black 0%, transparent 100%)',
          }}
        />
      )}

      {/* ---------------- 6. Cinematic Vignette ---------------- */}
      <div className="absolute inset-0 bg-[radial-gradient(125%_105%_at_50%_0%,transparent_55%,rgba(5,8,7,0.85)_100%)]" />
    </div>
  )
}
