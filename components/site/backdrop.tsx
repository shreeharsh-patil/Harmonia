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
  const spotlightRef = useRef<HTMLDivElement>(null)
  const [isPointerDevice, setIsPointerDevice] = useState(false)

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

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      }

      if (Math.abs(targetX - currentX) > 0.3 || Math.abs(targetY - currentY) > 0.3) {
        rafId = requestAnimationFrame(tick)
      } else {
        rafId = null
      }
    }

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY

      if (spotlightRef.current) {
        spotlightRef.current.style.opacity = '1'
      }

      if (!rafId) {
        rafId = requestAnimationFrame(tick)
      }
    }

    const handlePointerLeave = () => {
      if (spotlightRef.current) {
        spotlightRef.current.style.opacity = '0'
      }
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
      style={{ contain: 'strict' }}
    >
      {/* ---------------- 1. Hardware-Accelerated Diffused Aurora Blobs (Zero Blur Filter Cost) ---------------- */}
      {/* Blob 1: Hero right side emerald glow */}
      <div
        className="absolute -top-[10rem] right-[2%] h-[56rem] w-[56rem] rounded-full sm:h-[66rem] sm:w-[66rem] animate-aurora-slow"
        style={{
          background:
            'radial-gradient(circle at center, rgba(24,201,100,0.20) 0%, rgba(6,78,59,0.14) 28%, rgba(6,78,59,0.04) 52%, transparent 72%)',
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* Blob 2: Deep forest green ambient drift */}
      <div
        className="absolute top-[6rem] right-[22%] h-[46rem] w-[54rem] rounded-full sm:h-[54rem] sm:w-[62rem] animate-aurora-reverse"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(6,78,59,0.26) 0%, rgba(10,17,14,0.16) 36%, rgba(6,78,59,0.03) 60%, transparent 78%)',
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* Blob 3: Soft mint / teal accent stream */}
      <div
        className="absolute top-[0rem] -right-[6rem] h-[36rem] w-[36rem] rounded-full sm:h-[42rem] sm:w-[42rem] animate-aurora-pulse"
        style={{
          background:
            'radial-gradient(circle at center, rgba(167,243,208,0.15) 0%, rgba(24,201,100,0.09) 30%, rgba(6,78,59,0.02) 55%, transparent 70%)',
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* Blob 4: Soft global wash across top */}
      <div
        className="absolute -top-[24rem] left-1/2 h-[50rem] w-[72rem] -translate-x-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(24,201,100,0.08) 0%, rgba(6,78,59,0.04) 35%, transparent 72%)',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* ---------------- 2. Base Architectural Grid ---------------- */}
      <div className="absolute inset-0 grid-lines opacity-80" />

      {/* ---------------- 3. Interactive Pointer Radial Illumination ---------------- */}
      {isPointerDevice && (
        <div
          ref={spotlightRef}
          className="pointer-events-none fixed -left-[240px] -top-[240px] h-[480px] w-[480px] rounded-full opacity-0 transition-opacity duration-300 ease-out"
          style={{
            background:
              'radial-gradient(circle, rgba(24,201,100,0.13) 0%, rgba(24,201,100,0.03) 45%, transparent 70%)',
            willChange: 'transform',
            transform: 'translate3d(-1000px, -1000px, 0)',
          }}
        />
      )}

      {/* ---------------- 4. Cinematic Vignette ---------------- */}
      <div className="absolute inset-0 bg-[radial-gradient(125%_105%_at_50%_0%,transparent_55%,rgba(5,8,7,0.85)_100%)]" />
    </div>
  )
}
