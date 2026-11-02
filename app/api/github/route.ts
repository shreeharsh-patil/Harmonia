import { getTelemetry } from '@/lib/github'

/**
 * Client-refresh endpoint for live telemetry.
 *
 * The page already server-renders real numbers, so this exists purely so the
 * counters can re-sync without a reload. It mirrors the RSC data source exactly,
 * meaning a client refresh can never disagree with what was painted server-side.
 */
export const revalidate = 300

export async function GET() {
  const telemetry = await getTelemetry()

  return Response.json(telemetry, {
    headers: {
      // Serve stale copies while revalidating so a GitHub rate limit never turns
      // into a user-visible failure.
      // s-maxage caches at the CDN, but browsers must revalidate: a cached
      // response was serving a zero download count long after it was stale.
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=1800',
    },
  })
}
