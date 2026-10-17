'use client'

/**
 * AmbientAudioWaves
 *
 * Subtle, decorative acoustic wave ribbons inspired by sound frequencies and harmonics.
 * Sits quietly behind the phone showcase on the hero's right side, integrated with
 * the emerald aurora background.
 *
 * Adheres strictly to the Harmonia palette:
 * - Emerald accent (#18C964)
 * - Deep forest green (#064E3B)
 * - Soft mint (#A7F3D0)
 */
export function AmbientAudioWaves() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -inset-x-12 -inset-y-16 -z-10 select-none overflow-visible opacity-75 sm:-inset-x-20 sm:-inset-y-24"
    >
      <svg
        viewBox="0 0 600 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full animate-wave-flow"
        style={{ contain: 'paint', willChange: 'transform', transform: 'translate3d(0, 0, 0)' }}
      >
        <defs>
          {/* Wave Gradients */}
          <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#18C964" stopOpacity="0" />
            <stop offset="35%" stopColor="#18C964" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#A7F3D0" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#064E3B" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="wave-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#064E3B" stopOpacity="0" />
            <stop offset="30%" stopColor="#064E3B" stopOpacity="0.6" />
            <stop offset="65%" stopColor="#18C964" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#18C964" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="wave-grad-3" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0" />
            <stop offset="50%" stopColor="#A7F3D0" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#18C964" stopOpacity="0" />
          </linearGradient>

          {/* Radial mask for organic falloff */}
          <radialGradient id="wave-fade" cx="55%" cy="48%" r="52%">
            <stop offset="30%" stopColor="#fff" stopOpacity="1" />
            <stop offset="75%" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="wave-mask">
            <rect width="600" height="800" fill="url(#wave-fade)" />
          </mask>
        </defs>

        <g mask="url(#wave-mask)">
          {/* Resonant Sound Wave 1 - Primary fluid curve */}
          <path
            d="M 60 120 C 180 240, 480 180, 520 380 C 560 580, 220 620, 310 740"
            stroke="url(#wave-grad-1)"
            strokeWidth="2"
            strokeLinecap="round"
            className="opacity-70"
          />

          {/* Resonant Sound Wave 2 - Lower harmonic wave */}
          <path
            d="M 120 80 C 260 210, 530 260, 490 460 C 450 660, 160 670, 240 760"
            stroke="url(#wave-grad-2)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="opacity-60"
          />

          {/* Resonant Sound Wave 3 - High frequency crest */}
          <path
            d="M 40 180 C 140 280, 440 220, 470 420 C 500 620, 280 640, 360 720"
            stroke="url(#wave-grad-3)"
            strokeWidth="1.25"
            strokeLinecap="round"
            className="opacity-80"
          />

          {/* Resonant Sound Wave 4 - Subtle outer echo */}
          <path
            d="M 180 60 C 320 180, 560 310, 520 520 C 480 730, 200 690, 280 780"
            stroke="url(#wave-grad-1)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="4 8"
            className="opacity-40"
          />

          {/* Concentric subtle sound ring 1 */}
          <ellipse
            cx="380"
            cy="360"
            rx="180"
            ry="110"
            transform="rotate(-18 380 360)"
            stroke="url(#wave-grad-3)"
            strokeWidth="1"
            className="opacity-30"
          />

          {/* Concentric subtle sound ring 2 */}
          <ellipse
            cx="380"
            cy="360"
            rx="260"
            ry="160"
            transform="rotate(-18 380 360)"
            stroke="url(#wave-grad-2)"
            strokeWidth="1"
            strokeDasharray="2 6"
            className="opacity-25"
          />
        </g>
      </svg>
    </div>
  )
}
