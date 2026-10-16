'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const ROLL_SPRING = { type: 'spring' as const, stiffness: 100, damping: 20 }

/**
 * One vertically-rolling digit column.
 */
function DigitColumn({ value }: { value: number }) {
  return (
    <span
      aria-hidden
      className="relative inline-block overflow-hidden align-baseline"
      style={{ height: '1em', width: '0.615em', lineHeight: 1 }}
    >
      <motion.span
        className="absolute left-0 top-0 flex w-full flex-col items-center"
        animate={{ y: `-${value}em` }}
        transition={ROLL_SPRING}
      >
        {DIGITS.map((d) => (
          <span key={d} className="block w-full text-center" style={{ height: '1em', lineHeight: 1 }}>
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

/**
 * Animated numeric odometer that counts up from 0 the first time it scrolls into
 * view, then rolls digit-by-digit on any later value change.
 *
 * Guarantees 100% server/client HTML hydration match by initializing state to `value`.
 */
export function Odometer({
  value,
  className,
  duration = 1.2,
  separator = true,
  prefix,
  suffix,
}: {
  value: number
  className?: string
  duration?: number
  separator?: boolean
  prefix?: string
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const [display, setDisplay] = useState(value)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!inView || hasAnimated) return
    setHasAnimated(true)

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value, duration, hasAnimated])

  const text = separator ? display.toLocaleString('en-US') : String(display)

  return (
    <span ref={ref} className={cn('tnum inline-flex items-baseline', className)}>
      <span className="sr-only">
        {prefix}
        {separator ? value.toLocaleString('en-US') : String(value)}
        {suffix}
      </span>
      {prefix ? <span aria-hidden>{prefix}</span> : null}
      <span aria-hidden className="inline-flex items-baseline">
        {text.split('').map((char, i) =>
          char >= '0' && char <= '9' ? (
            <DigitColumn key={`${i}-d`} value={Number(char)} />
          ) : (
            <span key={`${i}-s`} className="inline-block" style={{ width: '0.3em' }}>
              {char}
            </span>
          ),
        )}
      </span>
      {suffix ? <span aria-hidden>{suffix}</span> : null}
    </span>
  )
}
