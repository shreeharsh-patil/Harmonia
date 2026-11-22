# Harmonia Mobile Promotional Video — Review Report

## Creative Choices & Alternate Storylines Considered
- **Selected Storyline**: *From Search to Sung Line* (`1080 × 1920`, `30 fps`, `28.0 s`, `120 BPM` pacing).
  - *Why chosen*: Opens directly on Harmonia's real Home discovery feed on Frame 0 (`"Free music. Zero ads."`) and threads one causal user interaction across the entire app: tapping `Search` in the floating Liquid Glass dock → typing `"Blinding Lights"` with dual-engine resolution (`JioSaavn + YTM · 320 kbps`) → expanding into the adaptive `320 kbps / 24-bit ALAC` player stage with live pipeline buffer & playhead scrub → iris-revealing real-time character-synced LRCLib lyrics → sliding into synced playlists (`cosy coding sessions`) & on-device `Downloads` / `Local Music` → ending on a cursor-clicked Harmonia headphones mark and CTA (`Download Latest APK · listenharmonia.vercel.app`).
  - *Other storylines considered (`STORYLINES.md`, not built)*:
    1. *The Buffer Race*: Split-screen stalling stream vs. Harmonia instant fast-start collapse.
    2. *Three Stages, One Track*: Match-cut tour switching Classic, Expressive, and Apple Music stages around one locked cover.
- **Website Stabilization (`promo/components/ui/app-demo.tsx`)**:
  - Removed `animate-float-hero` from `<AppDemo />`'s video wrapper so the rendered promo film sits rock-steady on the landing page instead of bobbing vertically during playback, and eliminated the redundant drawn inner phone bezel and shaky 1-second screenshot flashes that plagued the original `540 × 960` demo video.

## What Was Measured & Visually Inspected
- **Static & Runtime Audit (`npx hyperframes check --json`)**:
  - Latest check ID: `cd05633c-96a9-4aa8-8ff4-71a0a6716f80` (`ok: true`, `0` errors).
  - Contrast check: `53/53` text elements passed WCAG AA (`0` contrast warnings after lifting `.lyric-dim` / `.lyric-base` contrast in `compositions/scene-lyrics.html`).
  - Fixes applied from visual review of contact sheets (`review-beats.jpg`, `review-phone.jpg`, `review-seam-01..10.jpg`):
    1. Re-cropped `screen-home-top.png`, `screen-home-feed.png`, `screen-search-browse.png`, and `screen-search-results.png` to eliminate top/bottom clipped UI headings and duplicate header bars during scroll.
    2. Replaced crossfade/blank gaps between adjacent sub-compositions with `0.45 s` composited `z-index` transitions (circular iris reveals from clicked controls in `scene-search.html`, `scene-player.html`, `scene-lyrics.html`, and `scene-endcard.html`; opaque upward sheet wipe in `scene-library.html`).
    3. Removed duplicate artwork `<img>` mount in `scene-search.html` (eliminating `duplicate_media_discovery_risk`).
    4. Darkened the top gradient scrim in `scene-lyrics.html` so background lyric artwork never ghosts behind `"Word-by-word synced lyrics."`.
    5. Matched `#lib-device-card` surface background to `#000000` in `scene-library.html` to eliminate inner frame border seams around `screen-library-cards.png`.

## Kept Warnings & Scope Notes
- **`film_silent` (`info`/`warning`)**: Kept intentionally without a background audio track because `<AppDemo />` (`promo/components/ui/app-demo.tsx:101`) renders `<video muted playsInline autoPlay loop>`, and no HeyGen login or local MusicGen model is present. To add music stems later, sign in with `! npx hyperframes auth login` and place an `<audio id="bgm">` bed on `index.html`.
- **`outside_safe_zone`**: Kept for TikTok/Reels/Shorts social safe-zone markers because this composition targets the dedicated `<AppDemo />` rounded phone container in `promo/components/site/hero.tsx`, not third-party social feeds with bottom/right app HUD overlays; all display text sits comfortably inside the container and passes legibility on the 360 px phone sheet (`review-phone.jpg`).
- **`line_unread` on `#lyric-row-3` (`1.70 s` vs `2.40 s`)**: The parent `.lyric-row` (`I once was lost, but now I am found`) remains continuously readable on screen from `15.2 s` through `18.3 s` (`~3.1 s`); only the `#lyric-lit-3a` clip-sweep highlight enters progressively while singing, which is intentional karaoke reveal timing.
- **`timeline_track_too_dense` (`lint`)**: Advisory notice on multi-element scene files (`4–5` clips); all timelines share isolated scene scopes cleanly.

## Weakest Shot & Future Iteration Idea
- In `scene-hook.html`, stitching `screen-home-top.png` and `screen-home-feed.png` cleanly transitions between Harmonia's Home discovery sections; capturing a single continuous native tall scroll screenshot from a physical Android device build would allow even longer vertical scroll travel with live dynamic Liquid Glass cards.
