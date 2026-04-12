/**
 * Motion configuration with prefers-reduced-motion support.
 *
 * All Framer Motion animations should reference these helpers
 * to respect users with vestibular disorders.
 */

const mediaQuery =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false }

/** True when the user has requested reduced motion. */
export const prefersReducedMotion = mediaQuery.matches

/**
 * Returns motion config that disables animations when prefers-reduced-motion is set.
 *
 * Usage:
 *   <motion.div
 *     initial={{ opacity: 0 }}
 *     animate={{ opacity: 1 }}
 *     transition={reducedMotion()}
 *   >
 */
export function reducedMotion(config?: {
  duration?: number
  ease?: string | number[]
  type?: string
  stiffness?: number
  damping?: number
  delay?: number
}) {
  if (prefersReducedMotion) {
    return { duration: 0, ease: 'linear' }
  }
  return config ?? { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
}

/**
 * Returns stagger delay that becomes 0 when prefers-reduced-motion is set.
 *
 * Usage:
 *   transition={{ delay: reducedStagger(i) }}
 */
export function reducedStagger(index: number, base = 0.04) {
  if (prefersReducedMotion) return 0
  return index * base
}
