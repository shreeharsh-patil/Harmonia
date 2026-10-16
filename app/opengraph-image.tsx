import { ImageResponse } from 'next/og'

export const alt = 'Harmonia Mobile — The source-available music player for Android'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Social card, generated at build time rather than shipped as a binary.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#070707',
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          padding: '0 88px',
          color: '#fff',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          Harmonia Mobile
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 24,
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: -4,
            lineHeight: 1.04,
          }}
        >
          <span>Free Music.</span>
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>Zero Subscriptions.</span>
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 34,
            fontSize: 30,
            color: 'rgba(255,255,255,0.62)',
          }}
        >
          Direct JioSaavn & YouTube Music streaming, synced lyrics & offline downloads.
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 44,
            fontSize: 22,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
          }}
        >
          Android · React Native · Expo · Free Providers · Source-Available
        </div>
      </div>
    ),
    size,
  )
}
