# Harmonia Mobile — Landing Page

A promotional landing page for [Harmonia Mobile](https://github.com/shreeharsh-patil/Harmonia), a source-available React Native / Expo music player with free multi-source streaming (JioSaavn, YouTube Music), LRCLib synced lyrics, offline downloads, and native background playback.

The page renders live repository telemetry — star counts, fork counts, release tags, APK sizes and download totals — pulled from the GitHub REST API on the server, with fallback to verified build telemetry.

<p>
  <img alt="Next.js 15" src="https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-087EA4?logo=react&logoColor=white">
  <img alt="TypeScript 5.7" src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white">
  <img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white">
</p>

> [!NOTE]
> This is an independent landing page. All audio streams are resolved directly from free, publicly accessible providers (JioSaavn, YouTube Music, LRCLib) and local device files. No Spotify credentials or subscriptions are required.

---

## Contents

- [Stack](#stack)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [License](#license)
- [Credits](#credits)

---

## Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 15, App Router | React Server Components, ISR |
| UI | React 19 | Server components by default, client islands where needed |
| Language | TypeScript 5.7 | `strict` mode |
| Styling | Tailwind CSS v4 | CSS-first config via `@theme` in `app/globals.css` |
| Animation | Framer Motion 12 | Scroll reveals, springs, layout transitions |
| Icons | lucide-react & react-icons | |
| Utilities | `clsx` + `tailwind-merge` | Combined in the `cn()` helper |

## Quick start

Requires **Node.js 20 or newer** (Node 22 recommended).

```bash
npm install
npm run dev
```

The dev server runs on **http://localhost:3100**.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `GITHUB_TOKEN` | No | Raises the GitHub REST API rate limit from 60 requests/hour to 5,000/hour. |
| `NEXT_PUBLIC_SITE_URL` | No | Overrides canonical domain URL for SEO tags. |
| `GOOGLE_SITE_VERIFICATION` | No | Enables the Google Search Console `google-site-verification` meta tag. |

## Releases and downloads

The landing page never links to the private app source repository. GitHub returns
`404` for release assets of a private repository when the visitor is not signed
in, so every download URL is normalised onto the public mirror:

| Item | Value |
| --- | --- |
| Download repository | `shreeharsh-patil/Harmonia` (public) |
| Latest APK alias | `https://github.com/shreeharsh-patil/Harmonia/releases/latest/download/Harmonia-mobile.apk` |
| Version-pinned APK | `https://github.com/shreeharsh-patil/Harmonia/releases/download/<tag>/Harmonia-mobile.apk` |

Releases are ordered by **semantic version**, not by `published_at`: GitHub
restamps the publish date whenever a release is edited, which previously made an
older build look like the newest one. The `latest` shown in the hero, nav,
install section and JSON-LD all come from that ordering, so a new v2.1.4 outranks
v2.1.3 even if v2.1.3 is edited afterwards.

To ship a new build:

1. Publish the APK as a release asset on the public repository, named
   `Harmonia-mobile.apk`, alongside `Harmonia-mobile.apk.sha256` and
   `update-manifest.json`.
2. Nothing else. The page revalidates every 5 minutes and the primary CTA points
   at the `releases/latest/download` alias, so the new file is downloadable even
   while cached telemetry still names the previous version.
3. If the GitHub API is rate-limited for the deployment, the page falls back to
   `FALLBACK_RELEASES` in `lib/github.ts`. Update that list when the version
   changes so the fallback never advertises a stale build.

`GITHUB_TOKEN` (optional) lifts the API rate limit only; it is never used to
download APKs. Self-hosted deployments may drop APKs into
`public/releases/` and keep `file=` downloads local instead of redirecting.

## Google Search Console

The site is crawlable without extra work, but Google only discovers and indexes
it reliably after the property is verified and the sitemap is submitted. To
connect it:

1. Open Google Search Console and add the URL-prefix property
   `https://listenharmonia.vercel.app`.
2. Pick an HTML verification method.
3. Add the verification string as `GOOGLE_SITE_VERIFICATION` in the Vercel
   project environment (Production), matching the meta tag value Google gives
   you, and redeploy. The layout only renders the meta tag when the variable is
   set; it is never fabricated.
4. Submit `https://listenharmonia.vercel.app/sitemap.xml` and request indexing
   for the homepage and `https://listenharmonia.vercel.app/spotify-mod-apk-alternative`.

Do not claim a `google-site-verification` value you do not control.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server with HMR on port 3100 |
| `npm run build` | Production build |
| `npm start` | Serve production build on port 3100 |
| `npm run typecheck` | `tsc --noEmit` |

## Project structure

```
app/
  api/github/route.ts    Telemetry refresh endpoint
  spotify-mod-apk-alternative/
                        Search-targeted, honest Spotify-mod-APK-alternative page
  globals.css            Tailwind tokens and animations
  layout.tsx             Metadata, SEO tags, font definitions
  page.tsx               Server component: fetches telemetry and composes sections
components/
  site/                  Page sections (nav, hero, metrics, features, changelog, install, footer)
  features/              Interactive cards (pipeline visualizer, lyrics card, audio controls, presence, library)
  ui/                    Primitives (app demo video, glass card, logo, odometer, reveal)
lib/
  github.ts              GitHub REST client and release parsing
  site.ts                Site origin and configuration
  utils.ts               Helper utilities
public/
  harmonia-demo.mp4      Web-optimized demo capture
  harmonia-icon.png      App icon
  harmonia-logo.png      App logo
  .well-known/           Android App Links assetlinks.json
```

## License

Harmonia Mobile is distributed under a custom Source-Available License.

## Credits

Harmonia Mobile is developed by [Shreeharsh Patil](https://github.com/shreeharsh-patil).
