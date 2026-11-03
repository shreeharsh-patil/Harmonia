'use client'

import { cn } from '@/lib/utils'

/**
 * A tabular-numeral counter.
 *
 * Deliberately not an animation-driven component: the previous roll-up
 * implementation painted a column of zeros whenever JS/animation frames were
 * late, so GitHub-backed counters could read `0` on the live page even after
 * the real values had loaded. The final value is rendered immediately; CSS
 * `tabular-nums` keeps the layout stable while the number changes.
 */
export function Odometer({
  value,
  className,
  separator = true,
  prefix,
  suffix,
}: {
  value: number
  className?: string
  separator?: boolean
  prefix?: string
  suffix?: string
}) {
  const text = separator ? value.toLocaleString('en-US') : String(value)

  return (
    <span
      className={cn('tnum inline-flex items-baseline', className)}
      aria-label={`${prefix ?? ''}${text}${suffix ?? ''}`}
    >
      {prefix ? <span aria-hidden>{prefix}</span> : null}
      <span>{text}</span>
      {suffix ? <span aria-hidden>{suffix}</span> : null}
    </span>
  )
}
