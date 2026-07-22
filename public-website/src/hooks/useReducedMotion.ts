import { useReducedMotion as useFramerReducedMotion } from 'framer-motion'

export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false
}

export function motionProps(reduced: boolean) {
  if (reduced) {
    return { initial: false, animate: false, transition: { duration: 0 } }
  }
  return {}
}
