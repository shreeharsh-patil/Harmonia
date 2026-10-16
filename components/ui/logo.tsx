'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * The shipped Harmonia logo artwork and icon.
 */

/**
 * The mark on its own, for anywhere a small Harmonia icon is needed.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/harmonia-icon.png"
      alt="Harmonia"
      width={192}
      height={192}
      unoptimized
      className={cn('size-7 shrink-0 rounded-lg object-contain', className)}
    />
  )
}

/**
 * The full lockup — mark plus wordmark — for the header and footer.
 */
export function LogoWordmark({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <Image
        src="/harmonia-icon.png"
        alt="Harmonia"
        width={192}
        height={192}
        priority
        className="size-8 shrink-0 rounded-lg object-contain shadow-sm"
      />
      <span className="font-sans text-xl font-bold tracking-tight text-white">Harmonia</span>
    </div>
  )
}
