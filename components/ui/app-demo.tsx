'use client'

import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * The real app, running.
 */
export function AppDemo({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const sync = () => setPaused(video.paused)

    video.addEventListener('play', sync)
    video.addEventListener('playing', sync)
    video.addEventListener('pause', sync)
    sync()

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReduced) {
      void video.play().then(sync, sync)
    }

    // Resource optimization: Pause video playback when off-screen or tab hidden
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (entry.isIntersecting && !prefersReduced) {
          void video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(video)

    const handleVisibility = () => {
      if (document.hidden) {
        video.pause()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      video.removeEventListener('play', sync)
      video.removeEventListener('playing', sync)
      video.removeEventListener('pause', sync)
    }
  }, [])

  // The cap matches the hero's demo column exactly, so on large screens the
  // video fills that column with no side gap, and on small ones it simply
  // centres rather than growing into a full-width portrait wall.
  return (
    <div className={cn('relative mx-auto w-full max-w-[330px] animate-float-hero transform-gpu', className)}>
      {/* Soft emerald ambient backlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[56px] bg-[radial-gradient(ellipse_at_center,rgba(24,201,100,0.22)_0%,rgba(6,78,59,0.12)_45%,transparent_72%)] opacity-80"
        style={{ contain: 'paint', willChange: 'transform' }}
      />

      <div className="relative overflow-hidden rounded-[34px] border border-white/15 bg-surface shadow-[0_50px_100px_-30px_rgba(0,0,0,0.95),0_0_35px_-8px_rgba(24,201,100,0.2)]">
        {/* Specular edge sheen on top glass */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />

        <video
          ref={videoRef}
          poster="/harmonia-demo-poster.jpg"
          width={540}
          height={960}
          loop
          muted
          playsInline
          autoPlay
          preload="metadata"
          aria-label="Harmonia Mobile playing audio with synchronized lyrics and responsive mobile UI"
          className="block w-full"
        >
          <source src="/harmonia-demo.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Shown whenever the video is not running — reduced motion, blocked
          autoplay, or the visitor paused it themselves. */}
      {paused ? (
        <button
          type="button"
          onClick={() => void videoRef.current?.play()}
          className="absolute inset-0 grid place-items-center rounded-[34px] bg-black/35 transition-colors hover:bg-black/25"
          aria-label="Play the Harmonia Mobile demo"
        >
          <span className="grid size-14 place-items-center rounded-full bg-white text-canvas shadow-[0_8px_30px_-6px_rgba(0,0,0,0.6)]">
            <Play className="ml-0.5 size-5 fill-current" aria-hidden />
          </span>
        </button>
      ) : null}
    </div>
  )
}
