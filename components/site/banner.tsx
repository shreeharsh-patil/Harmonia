'use client'

import Image from 'next/image'
import { Reveal } from '@/components/ui/reveal'

export function Banner() {
  return (
    <section aria-label="Harmonia Banner" className="relative px-6 py-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-black/50 p-4 sm:p-7 backdrop-blur-xl shadow-[0_30px_90px_-30px_rgba(0,0,0,0.9)]">
            {/* Ambient neon backdrop glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 opacity-30 blur-[90px] transition-opacity duration-700 group-hover:opacity-45"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 50%, rgba(244,63,94,0.35) 0%, rgba(120,40,200,0.25) 50%, transparent 75%)',
              }}
            />

            <div className="relative flex items-center justify-center">
              <Image
                src="/harmonia-banner.png"
                alt="Harmonia — Neon Headphones and Logo"
                width={2172}
                height={724}
                priority
                className="h-auto w-full max-h-[380px] rounded-2xl object-contain drop-shadow-[0_15px_40px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
