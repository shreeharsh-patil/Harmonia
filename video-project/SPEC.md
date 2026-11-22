# Harmonia Mobile — Promotional Video Director's Spec

```text
GOAL:    A viewer immediately trusts Harmonia as a fast, ad-free, audiophile-grade mobile music player and clicks "Download Latest APK" on the site.
OUTPUT:  HyperFrames, 1080 x 1920 (9:16 portrait), 30 fps
TIME:    28.0 s x 30 fps = 840 frames; 120 BPM (0.5 s / 15 frames per beat, 2.0 s / 60 frames per bar)
LOOK:    Ground #060B09 (Harmonia obsidian), secondary card surface #0D1713 / #121F1A with 1 px rgba(255,255,255,0.10) hairline rim;
         Ink #F5F7F5 primary, #9CA8A1 secondary;
         Accent #18C964 (Harmonia Emerald) strictly rationed to at most 1 keyword per headline, active status chips, primary play FAB, and end-card mark;
         Track-adaptive washes in Scene 3 (#24110E crimson-obsidian), Scene 4 (frosted blur twilight from synced lyrics backdrop), Scene 5 (#0B1A26 deep playlist blue-obsidian);
         Display face Inter (weight 900, 62–72 px, -0.035em tracking) & body Inter (weight 400/700, 30–44 px); technical pills JetBrains Mono (weight 700, 28–30 px);
         Medium: full-bleed real mobile product UI layered with isolated high-legibility floating focus cards (width 940–980 px, border-radius 28–36 px, 0.55 ambient drop shadow: 0 28px 64px rgba(0,0,0,0.58)), zero outer bezel because <AppDemo /> provides the site frame.
OBJECTS: 1) Real Harmonia UI screens (Home, Search browse, Search results, Player stage, Synced Lyrics frosted sheet, cosy coding playlist, On-device Library cards);
         2) Isolated floating focus cards (Search query bar, Track resolution row + JioSaavn/YTM badge, 320 kbps / 24-bit ALAC playback stage, Character-level lyric rows);
         3) Interactive cursor (52 x 52 px crisp white vector pointer with #060B09 3 px stroke + tactile press pulse scale 1 -> 0.84 -> 1 on click);
         4) Official Harmonia headphones mark (assets/harmonia-icon.png, 220 x 220 px) inside a rounded obsidian tile.
MOTION:  Root data-motion-blur="on";
         Arrivals: expo.out / power4.out (12–16 frames / 0.40–0.53 s);
         Camera / card morphs & scrolls: power2.inOut (14–22 frames / 0.45–0.73 s);
         Exits & zoom-throughs: power3.in (8–12 frames / 0.27–0.40 s);
         Springs (mark landing & click rebound): back.out(1.4) (13 frames / 0.43 s) on position/scale only, never opacity;
         Titles: word-by-word blur(8px)->blur(0px) + opacity 0->1 (5 frames per word, 2 frames stagger) then held DEAD STILL (0 px drift);
         Interactive cursor click causes the next shot on the same / next frame.
SHOTS:
  1. [000–135 | 0.0–4.5 s]   scene-hook     Hero Home feed (top Trending + Start listening) visible on frame 0; title "Free music. Zero ads" holds still; Home feed scrolls cleanly upward at 0.9–2.6 s; cursor glides in at 3.0 s and clicks Search dock icon at 3.65 s -> camera zoom-whip into Search.
  2. [135–285 | 4.5–9.5 s]   scene-search   Real Search browse screen arrives cleanly; title "Dual-engine instant search" holds still; isolated Search input card expands (1.6x legibility) and types "Blinding Lights" at 0.7–1.7 s with "Songs" emerald pill activating; real search results glide up at 1.95 s with track #1 highlighted ("320 kbps · JioSaavn + YTM Direct"); cursor clicks row #1 at 4.25 s.
  3. [285–450 | 9.5–15.0 s]  scene-player   Object-becomes-the-world: Blinding Lights artwork expands into warm crimson-obsidian Now Playing stage; title "Up to 320 kbps & lossless ALAC" holds still; pipeline pill "Fast Start -> 320 kbps HQ" animates fill cleanly while playhead scrubs smoothly 1:04 -> 1:10 and heart toggles red; cursor moves to Lyrics icon and clicks at 4.75 s -> Iris reveal.
  4. [450–615 | 15.0–20.5 s] scene-lyrics   Iris clip-path opens onto frosted-glass LRCLib lyrics sheet (Amazing Grace); title "Real-time synced lyrics" holds still; crisp 40–44 px lyric rows scroll upward smoothly at 1.0 s and 2.7 s while word-level highlight sweep illuminates each syllable across the active line with subtle 1.04x focus.
  5. [615–735 | 20.5–24.5 s] scene-library  Pull-back / carry-across into "cosy coding sessions" playlist + real "On this device" cards (Downloads: 7.5 MB offline · Local Music: FLAC, MP3, WAV) + anchored Liquid Glass MiniPlayer; title "Your music, online & offline" holds still; emerald Play button pulses cleanly on press.
  6. [735–840 | 24.5–28.0 s] scene-endcard  Colour flood to #060B09 emerald studio ground; cursor clicks center emblem -> Harmonia icon lands at 220 px with back.out(1.4), "HARMONIA" wipes crisp at 74 px, subtitle "Free Music. Zero Subscriptions." lands at 40 px, CTA pill "listenharmonia.vercel.app" holds dead still through frame 840 (last 2.1 s hold).
BANNED:  - Phone-inside-phone drawn borders or thick artificial chrome inside the 1080x1920 frame
         - CSS animate-float-hero bobbing on the web player wrapper
         - Static 4-second opener or blank frame 0
         - Rapid 1-second shaky unframed screenshot flashing
         - Abrupt horizontal/square aspect-ratio clipping on full-height screens
         - Drifting/breathing titles after landing, particles/orbs, docked corner logos, 3-card feature grids
QA:      Check frames at 0.0 s (frame 0 thumbnail), 1.8 s (scroll mid-flight), 3.65 s (Search dock click), 6.5 s (Search results highlight card), 12.2 s (Player pipeline + playhead), 17.5 s (Lyric sweep mid-word), 22.5 s (Library offline + playlist), 26.5 s (End card lockup), plus all 5 transition cut strips (-0.2s to +0.2s) and 360 px phone contact sheet.
```
