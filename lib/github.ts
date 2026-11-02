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

/**
 * Public, unauthenticated download endpoint.
 *
 * APK assets live on the public `Harmonia` repository. The app source repository
 * (`Harmonia-mobile`) is private, so its release asset URLs return 404 for
 * visitors. Every download URL is normalised to this repository.
 */
export const LATEST_APK_URL = `${LATEST_RELEASE_URL}/download/Harmonia-mobile.apk`

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

const PUBLIC_RELEASE_URL = (tag: string, file = 'Harmonia-mobile.apk') =>
  `${RELEASES_URL}/download/${tag}/${file}`

const PUBLIC_RELEASE_PAGE = (tag: string) => `${RELEASES_URL}/tag/${tag}`

/**
 * Verified build telemetry for the public download repository.
 *
 * Only releases whose APK is publicly mirrored are listed here. Older private
 * builds are intentionally omitted: surfacing them would advertise downloads
 * that visitors cannot access without repository access.
 */
const FALLBACK_RELEASES: Release[] = [
  {
    tag: 'v2.1.3',
    name: 'Harmonia Mobile 2.1.3',
    publishedAt: '2026-11-01T19:43:49Z',
    prerelease: false,
    body: 'Harmonia Mobile 2.1.3 standalone Android APK. Includes automatic in-app updates with SHA-256 integrity verification, native lock-screen/notification Previous/Next controls, synchronized lyrics, and equalizer. Built with the persistent Harmonia EAS Android signing identity for consistent sideloaded updates.',
    htmlUrl: PUBLIC_RELEASE_PAGE('v2.1.3'),
    apk: {
      name: 'Harmonia-mobile.apk',
      size: 128211430,
      downloadUrl: PUBLIC_RELEASE_URL('v2.1.3'),
      downloadCount: 1,
    },
    highlights: [
      'Automatic in-app updates with SHA-256 integrity verification',
      'Native lock-screen and notification Previous/Next controls',
      'Synchronized lyrics suite and five-band equalizer',
      'Built with the persistent Harmonia EAS Android signing identity',
    ],
  },
  {
    tag: 'v2.1.2',
    name: 'Harmonia Mobile 2.1.2',
    publishedAt: '2026-11-01T17:47:17Z',
    prerelease: false,
    body: 'Harmonia Mobile 2.1.2 standalone Android APK. Playback stability and lock-screen control polish ahead of the 2.1.3 release.',
    htmlUrl: PUBLIC_RELEASE_PAGE('v2.1.2'),
    apk: {
      name: 'Harmonia-mobile.apk',
      size: 128195830,
      downloadUrl: PUBLIC_RELEASE_URL('v2.1.2'),
      downloadCount: 1,
    },
    highlights: [
      'Playback stability and recovery improvements',
      'Native media navigation controls on the lock screen',
      'Full offline library downloads and synchronized lyrics',
    ],
  },
  {
    tag: 'v2.1.1',
    name: 'Harmonia Mobile 2.1.1',
    publishedAt: '2026-11-01T15:30:20Z',
    prerelease: false,
    body: 'Harmonia Mobile 2.1.1 standalone Android APK. Adaptive audio pipeline and notification-control fixes.',
    htmlUrl: PUBLIC_RELEASE_PAGE('v2.1.1'),
    apk: {
      name: 'Harmonia-mobile.apk',
      size: 127087742,
      downloadUrl: PUBLIC_RELEASE_URL('v2.1.1'),
      downloadCount: 1,
    },
    highlights: [
      'Adaptive audio pipeline fixes',
      'Notification Previous/Next reliability',
      'Equalizer and synced lyrics improvements',
    ],
  },
  {
    tag: 'v2.1.0',
    name: 'Harmonia Mobile 2.1.0',
    publishedAt: '2026-10-31T19:31:19Z',
    prerelease: false,
    body: 'Harmonia Mobile 2.1.0 standalone Android APK. Includes corrected Previous/Next notification and lock-screen controls. Built with the persistent Harmonia EAS Android signing identity for consistent sideloaded updates.',
    htmlUrl: PUBLIC_RELEASE_PAGE('v2.1.0'),
    apk: {
      name: 'Harmonia-mobile.apk',
      size: 127372326,
      downloadUrl: PUBLIC_RELEASE_URL('v2.1.0'),
      downloadCount: 1,
    },
    highlights: [
      'Corrected Previous/Next notification and lock-screen controls',
      'Persistent EAS Android signing identity for consistent sideloaded updates',
      'Multi-source adaptive playback pipeline (JioSaavn, YouTube Music, local audio)',
    ],
  },
  {
    tag: 'v2.0.0',
    name: 'Harmonia Mobile 2.0.0',
    publishedAt: '2026-10-17T03:35:14Z',
    prerelease: false,
    body: 'Harmonia Mobile 2.0.0 standalone Android APK. Includes corrected Previous/Next notification and lock-screen controls. Built with the persistent Harmonia EAS Android signing identity for consistent sideloaded updates.',
    htmlUrl: PUBLIC_RELEASE_PAGE('v2.0.0'),
    apk: {
      name: 'Harmonia-mobile.apk',
      size: 126111874,
      downloadUrl: PUBLIC_RELEASE_URL('v2.0.0'),
      downloadCount: 1,
    },
    highlights: [
      'Corrected Previous/Next notification and lock-screen playback controls',
      'Persistent EAS Android signing identity for consistent sideloaded updates',
      'Multi-source adaptive playback pipeline (JioSaavn, YouTube Music, local audio)',
      'LRCLib synced lyrics with word and character-level timing',
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

/**
 * Rewrites any historical/private asset URL onto the public mirror repository.
 * Live API data should already be public, but this keeps stale cache entries and
 * hand-written fallbacks from ever leaking an inaccessible `Harmonia-mobile` URL
 * to the browser.
 */
function toPublicDownloadUrl(url: string, tag: string): string {
  if (!url || !url.startsWith('http')) return PUBLIC_RELEASE_URL(tag)
  return url
    .replace(
      /github\.com\/shreeharsh-patil\/Harmonia-mobile\/releases\/download\/[^/]+\//,
      'github.com/shreeharsh-patil/Harmonia/releases/download/',
    )
    .replace(
      /github\.com\/shreeharsh-patil\/Harmonia-mobile\/releases\/latest\/download\//,
      'github.com/shreeharsh-patil/Harmonia/releases/latest/download/',
    )
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
    htmlUrl: (raw.html_url ?? `${RELEASES_URL}/tag/${tag}`).replace(
      'github.com/shreeharsh-patil/Harmonia-mobile/releases',
      'github.com/shreeharsh-patil/Harmonia/releases',
    ),
    apk: apkRaw?.browser_download_url
      ? {
          name: apkRaw.name ?? 'Harmonia-mobile.apk',
          size: apkRaw.size ?? 0,
          downloadUrl: toPublicDownloadUrl(apkRaw.browser_download_url, tag),
          downloadCount: apkRaw.download_count ?? 0,
        }
      : null,
    highlights: parseHighlights(body),
  }
}

/** Semver-aware rank so a re-published mirror never outranks a newer build. */
function releaseRank(tag: string): number[] {
  const match = tag.trim().match(/^v?(\d+)\.(\d+)\.(\d+)/i)
  if (!match) return [-1, -1, -1]
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

/**
 * Newest-first ordering by semantic version, then publish time.
 *
 * GitHub restamps `published_at` whenever a release is edited, so v2.1.0 ended
 * up "newer" than v2.1.3 and the site advertised the wrong latest build. Sorting
 * on the tag itself is the only stable definition of latest. Exported so the
 * ordering can be tested without the GitHub API.
 */
export function compareReleases(a: Release, b: Release): number {
  const ar = releaseRank(a.tag)
  const br = releaseRank(b.tag)
  for (let i = 0; i < 3; i += 1) {
    if (ar[i] !== br[i]) return br[i] - ar[i]
  }
  const at = a.publishedAt ? Date.parse(a.publishedAt) : 0
  const bt = b.publishedAt ? Date.parse(b.publishedAt) : 0
  return bt - at
}

export async function getTelemetry(): Promise<Telemetry> {
  // Only the public repository is read. The app source repo is private, so its
  // release assets cannot be downloaded by visitors and must never be surfaced.
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

  // Guarantee that the public download history is always present, even when the
  // GitHub API is rate-limited or offline.
  const releaseMap = new Map<string, Release>()

  // 1. Seed with verified public releases.
  for (const fallback of FALLBACK_RELEASES) {
    releaseMap.set(fallback.tag, fallback)
  }

  // 2. Overlay live public releases (fresh assets, dates, download counts).
  if (Array.isArray(releasesRaw)) {
    for (const r of releasesRaw) {
      if (!r.draft && r.tag_name) {
        const normalized = normalizeRelease(r)
        // A live release without an uploaded APK must not erase a verified
        // fallback download link.
        if (!normalized.apk) {
          const fallback = releaseMap.get(normalized.tag)
          if (fallback?.apk) normalized.apk = fallback.apk
        }
        releaseMap.set(normalized.tag, normalized)
      }
    }
  }

  const fetchedReleases = Array.from(releaseMap.values()).sort(compareReleases)

  const totalDownloads = fetchedReleases.reduce((sum, r) => sum + (r.apk?.downloadCount ?? 0), 0)

  return {
    repo,
    releases: fetchedReleases,
    releaseCount: fetchedReleases.length,
    latest: fetchedReleases[0] ?? null,
    totalDownloads,
    degraded: !repoRaw || !Array.isArray(releasesRaw),
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
  if (release?.apk) {
    return {
      url: toPublicDownloadUrl(release.apk.downloadUrl, release.tag),
      isDirect: true,
      size: formatBytes(release.apk.size),
      fileName: release.apk.name || 'Harmonia-mobile.apk',
    }
  }

  // Always fall back to the public mirror's moving "latest" asset, never a
  // version-pinned APK from the private app repository.
  return {
    url: LATEST_APK_URL,
    isDirect: true,
    size: '122 MB',
    fileName: 'Harmonia-mobile.apk',
  }
}
