export const sectionAnimations = {
  none: 'None',
  fade: 'Fade in',
  rise: 'Rise gently',
  zoom: 'Soft zoom',
  editorial: 'Headline and photo reveal',
} as const

export type SectionAnimation = keyof typeof sectionAnimations
