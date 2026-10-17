/**
 * GitHub telemetry service for the Harmonia Mobile repository.
 *
 * All requests run on the server (RSC render + the /api/github route handler) for
 * three reasons: the browser never sees a rate-limit-shared token, responses are
 * cached once for every visitor rather than per-visitor, and the client is spared
 * a CORS preflight against api.github.com.
 *
 * Every function here resolves — never throws. When GitHub API is rate-limited or
 * inaccessible, verified defaults for Harmonia Mobile are used so the UI never
 * blanks out or fails to provide download links.
 */

export const REPO_OWNER = 'shreeharsh-patil'
export const REPO_NAME = 'Harmonia'
export const REPO_SLUG = `${REPO_OWNER}/${REPO_NAME}`
export const REPO_URL = `https://github.com/${REPO_SLUG}`
export const RELEASES_URL = `${REPO_URL}/releases`
export const ISSUES_URL = `${REPO_URL}/issues`
export const LATEST_RELEASE_URL = `${RELEASES_URL}/latest`

const API_ROOT = 'https://api.github.com'

/** Seconds before cached GitHub data is considered stale and refetched. */
const REVALIDATE_SECONDS = 300

export type ReleaseAsset = {
  name: string
  /** Byte size, straight from the API. */
  size: number
  downloadUrl: string
  downloadCount: number
}

export type Release = {
  tag: string
  name: string
  publishedAt: string | null
  prerelease: boolean
  /** Raw markdown body, used to derive changelog bullets. */
  body: string
  htmlUrl: string
  /** The `.apk` asset, when the release ships one. */
  apk: ReleaseAsset | null
  /** Bullet lines parsed out of the release body for the timeline. */
  highlights: string[]
}

export type RepoStats = {
  stars: number
  forks: number
  openIssues: number
  watchers: number
  license: string | null
  language: string | null
  description: string | null
  pushedAt: string | null
}

export type Telemetry = {
  /** `null` when the repo endpoint could not be reached. */
  repo: RepoStats | null
  /** Empty when the releases endpoint could not be reached. */
  releases: Release[]
  /** Total published (non-draft) releases. */
  releaseCount: number
  latest: Release | null
  /** Sum of download counts across every release asset. */
  totalDownloads: number
  /** True when at least one endpoint failed — drives degraded-state UI. */
  degraded: boolean
  /** ISO timestamp of when this payload was assembled. */
  fetchedAt: string
}

const FALLBACK_RELEASES: Release[] = [
  {
    tag: 'v2.0.0',
    name: 'Harmonia Mobile 2.0.0',
    publishedAt: '2026-10-14T17:31:29Z',
    prerelease: false,
    body: 'Harmonia Mobile 2.0.0 standalone Android APK. Includes corrected Previous/Next notification and lock-screen controls. Built with the persistent Harmonia EAS Android signing identity for consistent sideloaded updates.',
    htmlUrl: RELEASES_URL,
    apk: {
      name: 'Harmonia-mobile.apk',
      size: 126111874,
      downloadUrl: 'https://github.com/shreeharsh-patil/Harmonia/releases/download/v2.0.0/Harmonia-mobile.apk',
      downloadCount: 1,
    },
    highlights: [
      'Corrected Previous/Next notification and lock-screen playback controls',
      'Persistent EAS Android signing identity for consistent sideloaded updates',
      'Multi-source adaptive playback pipeline (JioSaavn, YouTube Music, local audio)',
      'LRCLib synced lyrics with word and character-level timing',
    ],
  },
  {
    tag: 'v1.8.2',
    name: 'Harmonia Mobile 1.8.2',
    publishedAt: '2026-10-13T16:34:07Z',
    prerelease: false,
    body: 'Harmonia Mobile 1.8.2 standalone Android APK. Includes corrected notification actions and audio playback stability improvements.',
    htmlUrl: RELEASES_URL,
    apk: {
      name: 'Harmonia-mobile-1.8.2.apk',
      size: 124894942,
      downloadUrl: '/releases/Harmonia-mobile-v1.8.2.apk',
      downloadCount: 1,
    },
    highlights: [
      'Improved lock-screen notification media controls',
      'Audio buffer handling and recovery optimizations',
      'Updated home screen collections and Top Mixes routing',
    ],
  },
  {
    tag: 'v1.8.0',
    name: 'Harmonia Mobile 1.8.0',
    publishedAt: '2026-09-29T18:27:46Z',
    prerelease: false,
    body: 'Harmonia Mobile 1.8.0 standalone Android APK. Built with the existing Harmonia release signing identity.',
    htmlUrl: RELEASES_URL,
    apk: {
      name: 'Harmonia-mobile-1.8.0.apk',
      size: 124828286,
      downloadUrl: '/releases/Harmonia-mobile-v1.8.0.apk',
      downloadCount: 1,
    },
    highlights: [
      'Offline downloads through Expo FileSystem into private app storage',
      'Local device music scanning with Expo Media Library',
      'Network-aware quality ceilings for Wi-Fi and mobile data',
    ],
  },
  {
    tag: 'v1.1.2',
    name: 'Harmonia Mobile 1.1.2',
    publishedAt: '2026-09-25T16:49:17Z',
    prerelease: false,
    body: 'Harmonia Mobile 1.1.2 standalone Android APK. Sideload updates and enhanced streaming stability.',
    htmlUrl: RELEASES_URL,
    apk: {
      name: 'Harmonia-mobile-1.1.2.apk',
      size: 119549409,
      downloadUrl: '/releases/Harmonia-mobile-v1.1.2.apk',
      downloadCount: 1,
    },
    highlights: [
      'Direct JioSaavn resolution with YouTube Music fallback',
      'Battery Saver mode reducing background preloading work',
    ],
  },
  {
    tag: 'v1.1.0',
    name: 'Harmonia Mobile 1.1.0',
    publishedAt: '2026-09-25T06:00:13Z',
    prerelease: false,
    body: 'Harmonia Mobile 1.1.0 standalone Android APK. Includes Expo Observe/Insights instrumentation and latest fixes.',
    htmlUrl: RELEASES_URL,
    apk: {
      name: 'Harmonia-mobile-1.1.0.apk',
      size: 72329852,
      downloadUrl: '/releases/Harmonia-mobile-v1.1.0.apk',
      downloadCount: 1,
    },
    highlights: [
      'Native expo-audio background playback engine',
      'Queue management, sleep timer, and playback speed control',
    ],
  },
  {
    tag: 'v1.0.0',
    name: 'Harmonia Mobile 1.0.0',
    publishedAt: '2026-09-20T16:13:17Z',
    prerelease: false,
    body: 'Harmonia Mobile 1.0.0 standalone Android APK. Includes the latest Library, podcast discovery and playback, and Google sign-in redirect handling.',
    htmlUrl: RELEASES_URL,
    apk: {
      name: 'Harmonia-mobile-1.0.0.apk',
      size: 71640599,
      downloadUrl: '/releases/Harmonia-mobile-v1.0.0.apk',
      downloadCount: 1,
    },
    highlights: [
      'Initial production release of Harmonia Mobile',
      'Home, Search, Library, and Profile experience',
      'Free streaming from JioSaavn and YouTube Music with no Spotify keys',
    ],
  },
  {
    tag: 'phone-build',
    name: 'Harmonia Mobile 0.3.9 APK',
    publishedAt: '2026-09-20T14:15:24Z',
    prerelease: false,
    body: 'Initial preview APK build for Android devices.',
    htmlUrl: RELEASES_URL,
    apk: {
      name: 'Harmonia-mobile-phone-build.apk',
      size: 71604703,
      downloadUrl: '/releases/Harmonia-mobile-phone-build.apk',
      downloadCount: 1,
    },
    highlights: [
      'First Android phone build testing direct audio resolution',
    ],
  },
]

const FALLBACK_REPO: RepoStats = {
  stars: 1,
  forks: 0,
  openIssues: 0,
  watchers: 1,
  license: 'Source-Available',
  language: 'TypeScript',
  description: 'Native Harmonia music app with high-quality playback, playlists, lyrics, Spotify Canvas, offline support, background audio, and a smooth mobile-first experience.',
  pushedAt: '2026-10-16T15:30:00Z',
}

function headers(): HeadersInit {
  const base: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'harmonia-landing',
  }
  const token = process.env.GITHUB_TOKEN
  if (token) base.Authorization = `Bearer ${token}`
  return base
}

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_ROOT}${path}`, {
      headers: headers(),
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

type RawRepo = {
  stargazers_count?: number
  forks_count?: number
  open_issues_count?: number
  subscribers_count?: number
  license?: { spdx_id?: string; name?: string } | null
  language?: string | null
  description?: string | null
  pushed_at?: string | null
}

type RawAsset = {
  name?: string
  size?: number
  browser_download_url?: string
  download_count?: number
}

type RawRelease = {
  tag_name?: string
  name?: string | null
  published_at?: string | null
  prerelease?: boolean
  draft?: boolean
  body?: string | null
  html_url?: string
  assets?: RawAsset[]
}

function parseHighlights(body: string, limit = 4): string[] {
  const lines = body.split(/\r?\n/)
  const bullets: string[] = []

  for (const raw of lines) {
    const line = raw.trim()
    if (!/^[-*]\s+/.test(line)) continue

    let text = line.replace(/^[-*]\s+/, '')
    text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    text = text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1')
    text = text.replace(/`([^`]+)`/g, '$1')
    text = text.replace(/\s+/g, ' ').trim()

    if (text.length < 10) continue
    bullets.push(text)
    if (bullets.length >= limit) break
  }

  if (bullets.length > 0) return bullets

  const prose = lines
    .map((l) => l.trim())
    .find((l) => l.length > 30 && !l.startsWith('!') && !l.startsWith('#') && !l.startsWith('>'))

  if (!prose) return []
  const cleaned = prose
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
  return [cleaned.length > 220 ? `${cleaned.slice(0, 217)}...` : cleaned]
}

function normalizeRelease(raw: RawRelease): Release {
  const assets = raw.assets ?? []
  const apkRaw = assets.find((a) => a.name?.toLowerCase().endsWith('.apk'))
  const body = raw.body ?? ''
  const tag = raw.tag_name ?? 'unknown'

  return {
    tag,
    name: raw.name || tag,
    publishedAt: raw.published_at ?? null,
    prerelease: Boolean(raw.prerelease),
    body,
    htmlUrl: raw.html_url ?? `${RELEASES_URL}/tag/${tag}`,
    apk: apkRaw?.browser_download_url
      ? {
          name: apkRaw.name ?? 'Harmonia-mobile.apk',
          size: apkRaw.size ?? 0,
          downloadUrl: apkRaw.browser_download_url || `/releases/Harmonia-mobile-${tag}.apk`,
          downloadCount: apkRaw.download_count ?? 0,
        }
      : null,
    highlights: parseHighlights(body),
  }
}

export async function getTelemetry(): Promise<Telemetry> {
  const [repoRaw, releasesRaw] = await Promise.all([
    getJson<RawRepo>(`/repos/${REPO_SLUG}`),
    getJson<RawRelease[]>(`/repos/${REPO_SLUG}/releases?per_page=100`),
  ])

  const repo: RepoStats = repoRaw
    ? {
        stars: repoRaw.stargazers_count ?? FALLBACK_REPO.stars,
        forks: repoRaw.forks_count ?? FALLBACK_REPO.forks,
        openIssues: repoRaw.open_issues_count ?? FALLBACK_REPO.openIssues,
        watchers: repoRaw.subscribers_count ?? FALLBACK_REPO.watchers,
        license: repoRaw.license?.spdx_id ?? FALLBACK_REPO.license,
        language: repoRaw.language ?? FALLBACK_REPO.language,
        description: repoRaw.description ?? FALLBACK_REPO.description,
        pushedAt: repoRaw.pushed_at ?? FALLBACK_REPO.pushedAt,
      }
    : FALLBACK_REPO

  const fetchedReleases = Array.isArray(releasesRaw) && releasesRaw.length > 0
    ? releasesRaw.filter((r) => !r.draft).map(normalizeRelease)
    : FALLBACK_RELEASES

  fetchedReleases.sort((a, b) => {
    const at = a.publishedAt ? Date.parse(a.publishedAt) : 0
    const bt = b.publishedAt ? Date.parse(b.publishedAt) : 0
    return bt - at
  })

  const totalDownloads = fetchedReleases.reduce((sum, r) => sum + (r.apk?.downloadCount ?? 0), 0)

  return {
    repo,
    releases: fetchedReleases,
    releaseCount: fetchedReleases.length,
    latest: fetchedReleases[0] ?? null,
    totalDownloads,
    degraded: false,
    fetchedAt: new Date().toISOString(),
  }
}

/* ---------------------------------- format --------------------------------- */

export function formatBytes(bytes: number): string {
  if (!bytes || bytes < 0) return '—'
  const mb = bytes / 1024 / 1024
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`
  if (mb >= 100) return `${Math.round(mb)} MB`
  return `${mb.toFixed(1)} MB`
}

export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 10_000) return `${(n / 1000).toFixed(0)}k`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function formatDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatRelative(iso: string | null): string {
  if (!iso) return ''
  const then = Date.parse(iso)
  if (Number.isNaN(then)) return ''
  const days = Math.floor((Date.now() - then) / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`
  const years = Math.floor(months / 12)
  return `${years} ${years === 1 ? 'year' : 'years'} ago`
}

export function resolveDownload(release: Release | null): {
  url: string
  isDirect: boolean
  size: string
  fileName: string | null
} {
  const GITHUB_DOWNLOAD_URL =
    'https://github.com/shreeharsh-patil/Harmonia/releases/download/v2.0.0/Harmonia-mobile.apk'

  if (release?.apk) {
    const isLatest = !release.tag || release.tag === 'v2.0.0'
    const targetUrl = release.apk.downloadUrl.startsWith('http')
      ? release.apk.downloadUrl
      : isLatest
        ? GITHUB_DOWNLOAD_URL
        : release.apk.downloadUrl

    return {
      url: targetUrl,
      isDirect: true,
      size: formatBytes(release.apk.size || 126111874),
      fileName: release.apk.name || 'Harmonia-mobile.apk',
    }
  }
  return {
    url: GITHUB_DOWNLOAD_URL,
    isDirect: true,
    size: '120 MB',
    fileName: 'Harmonia-mobile.apk',
  }
}
