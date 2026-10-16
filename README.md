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
