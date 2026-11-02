'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Telemetry } from '@/lib/github'

type TelemetryState = {
  data: Telemetry | null
  /** True only while we have no data at all — this is what gates skeletons. */
  loading: boolean
}

const TelemetryContext = createContext<TelemetryState>({ data: null, loading: true })

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

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    const refresh = () => {
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
            return json
          })
        })
        .catch(() => {
          /* Offline or rate-limited: keep whatever we have and let the UI degrade. */
        })
    }

    // Always re-sync once, even when the server render was healthy: a cached
    // snapshot is what made the download counter read 0 while downloads existed.
    refresh()

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      cancelled = true
      controller.abort()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [initial])

  return (
    <TelemetryContext.Provider value={{ data, loading: data === null }}>
      {children}
    </TelemetryContext.Provider>
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
