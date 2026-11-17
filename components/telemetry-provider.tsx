'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import type { Telemetry } from '@/lib/github'

type TelemetryState = {
  data: Telemetry | null
  /** True only while we have no data at all — this is what gates skeletons. */
  loading: boolean
}

const TelemetryContext = createContext<TelemetryState>({ data: null, loading: true })

const REFRESH_MIN_INTERVAL_MS = 60_000

function hasMeaningfulChange(prev: Telemetry, next: Telemetry): boolean {
  return (
    prev.degraded !== next.degraded ||
    prev.totalDownloads !== next.totalDownloads ||
    prev.releaseCount !== next.releaseCount ||
    prev.latest?.tag !== next.latest?.tag ||
    prev.repo?.stars !== next.repo?.stars ||
    prev.repo?.forks !== next.repo?.forks ||
    prev.repo?.openIssues !== next.repo?.openIssues ||
    prev.repo?.watchers !== next.repo?.watchers
  )
}

/**
 * Distributes GitHub telemetry to every client island on the page.
 *
 * `initial` comes from the server render, so counters paint with real numbers on
 * first frame and skeletons only appear when the server fetch itself failed. In
 * that degraded case we retry once from the client — a visitor's own network may
 * succeed where the build-time/server fetch hit a rate limit.
 */
export function TelemetryProvider({
  initial,
  children,
}: {
  initial: Telemetry | null
  children: React.ReactNode
}) {
  const [data, setData] = useState<Telemetry | null>(initial)
  const lastFetchRef = useRef<number>(0)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    const refresh = (force = false) => {
      const now = Date.now()
      if (!force && now - lastFetchRef.current < REFRESH_MIN_INTERVAL_MS) return
      lastFetchRef.current = now

      fetch('/api/github', { signal: controller.signal, cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : null))
        .then((json: Telemetry | null) => {
          if (cancelled || !json) return
          setData((prev) => {
            if (!prev) return json
            // Never let a degraded retry replace good server data.
            if (json.degraded && !prev.degraded) return prev
            // Counters only move up. Guard against a stale/zero snapshot
            // overwriting a real download total that is already on screen.
            if (
              !json.degraded &&
              !prev.degraded &&
              json.totalDownloads < prev.totalDownloads
            ) {
              return prev
            }
            // Skip re-rendering the entire tree when values match SSR initial.
            if (!hasMeaningfulChange(prev, json)) return prev
            return json
          })
        })
        .catch(() => {
          /* Offline or rate-limited: keep whatever we have and let the UI degrade. */
        })
    }

    // Re-sync once after mount if needed, without triggering redundant re-renders when identical.
    refresh(true)

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') refresh(false)
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      cancelled = true
      controller.abort()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [initial])

  return (
    <MotionConfig reducedMotion="user">
      <TelemetryContext.Provider value={{ data, loading: data === null }}>
        {children}
      </TelemetryContext.Provider>
    </MotionConfig>
  )
}

export function useTelemetry() {
  return useContext(TelemetryContext)
}

/**
 * Convenience reader for a single repo metric.
 *
 * Returns `null` while unavailable so callers render a skeleton rather than a
 * misleading `0`.
 */
export function useMetric(key: 'stars' | 'forks' | 'openIssues' | 'watchers'): number | null {
  const { data } = useTelemetry()
  return data?.repo?.[key] ?? null
}
