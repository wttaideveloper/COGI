import type { HomepageBlockKind, HomepageSection } from '@/types'

export const BUILTIN_SECTION_IDS = [
  'hero',
  'newsletterBanner',
  'legacy',
  'video',
  'mission',
  'methods',
  'impact',
  'portfolio',
  'map',
  'stories',
  'events',
  'newsletter',
  'donate',
  'faith',
] as const

export const DEFAULT_BUILTIN_SECTIONS: HomepageSection[] = [
  { id: 'hero', label: 'Hero', enabled: true, order: 1, summary: 'Primary homepage introduction and call to action.', kind: 'built-in' },
  { id: 'newsletterBanner', label: 'Gold banner', enabled: true, order: 2, summary: 'Lead story / newsletter callout.', kind: 'built-in' },
  { id: 'legacy', label: 'Legacy', enabled: true, order: 3, summary: 'Strong legacy, bold future.', kind: 'built-in' },
  { id: 'mission', label: 'Mission', enabled: true, order: 4, summary: 'Mission statement and scripture.', kind: 'built-in' },
  { id: 'video', label: 'Video', enabled: true, order: 5, summary: 'Introduction video / photo.', kind: 'built-in' },
  { id: 'methods', label: 'Methods', enabled: true, order: 6, summary: 'Enable, train, and support.', kind: 'built-in' },
  { id: 'impact', label: 'Impact Stats', enabled: true, order: 7, summary: 'Countries, professionals, programs.', kind: 'built-in' },
  { id: 'portfolio', label: 'Portfolio', enabled: true, order: 8, summary: 'Four ministry areas.', kind: 'built-in' },
  { id: 'map', label: 'Where we serve', enabled: true, order: 9, summary: 'Countries served.', kind: 'built-in' },
  { id: 'stories', label: 'Featured Stories', enabled: true, order: 10, summary: 'Featured story teasers.', kind: 'built-in' },
  { id: 'events', label: 'Featured Event', enabled: true, order: 11, summary: 'Upcoming featured event.', kind: 'built-in' },
  { id: 'newsletter', label: 'Newsletter', enabled: true, order: 12, summary: 'Newsletter signup.', kind: 'built-in' },
  { id: 'donate', label: 'Donate CTA', enabled: true, order: 13, summary: 'Donate call to action.', kind: 'built-in' },
  { id: 'faith', label: 'Statement of faith', enabled: true, order: 14, summary: 'Closing faith statement.', kind: 'built-in' },
]

export const SECTION_HINTS: Record<string, string> = {
  hero: 'Photo, headline, buttons',
  newsletterBanner: 'Stories callout',
  legacy: 'Who we are',
  video: 'Intro film',
  mission: 'Statement & scripture',
  methods: 'Enable · Train · Support',
  impact: 'Key numbers',
  portfolio: 'Ministry areas',
  map: 'Map heading',
  stories: 'Featured stories',
  events: 'Upcoming featured event',
  newsletter: 'Signup form',
  donate: 'Give call to action',
  faith: 'Statement of faith',
}

export const CUSTOM_BLOCK_OPTIONS: Array<{
  kind: Exclude<HomepageBlockKind, 'built-in'>
  label: string
  summary: string
  sampleTitle: string
  sampleContent: string
}> = [
  {
    kind: 'text',
    label: 'Text',
    summary: 'Heading and a paragraph',
    sampleTitle: 'New section title',
    sampleContent: 'Write the story, announcement, or invitation visitors should read here.',
  },
  {
    kind: 'split',
    label: 'Photo + text',
    summary: 'Image beside a story',
    sampleTitle: 'A story from the field',
    sampleContent: 'Pair a photo with a short story about a community, program, or partnership.',
  },
  {
    kind: 'banner',
    label: 'Full-width banner',
    summary: 'Photo background with heading',
    sampleTitle: 'Join us',
    sampleContent: 'A short line over a wide photo.',
  },
  {
    kind: 'cta',
    label: 'Call to action',
    summary: 'Heading, text, and a button',
    sampleTitle: 'Take the next step',
    sampleContent: 'Invite people to pray, give, or get involved.',
  },
  {
    kind: 'quote',
    label: 'Quote',
    summary: 'Highlighted quote or verse',
    sampleTitle: 'A word to remember',
    sampleContent: '“Whatever you do, in word or deed, do everything in the name of the Lord Jesus.” — Colossians 3:17',
  },
  {
    kind: 'image',
    label: 'Photo',
    summary: 'A wide photo with a caption',
    sampleTitle: 'Caption',
    sampleContent: 'Describe what the photo shows.',
  },
]

export function isCustomSection(section: Pick<HomepageSection, 'id' | 'kind'>): boolean {
  if (section.kind && section.kind !== 'built-in') return true
  return !BUILTIN_SECTION_IDS.includes(section.id as (typeof BUILTIN_SECTION_IDS)[number])
}

export function ensureBuiltinSections(sections?: HomepageSection[] | null): HomepageSection[] {
  const current = Array.isArray(sections) ? sections : []
  const byId = new Map(current.map((section) => [section.id, section]))
  const savedOrder = new Map(current.map((section) => [section.id, section.order]))
  const builtins = DEFAULT_BUILTIN_SECTIONS.map((builtin) => {
    const existing = byId.get(builtin.id)
    return existing
      ? { ...builtin, ...existing, id: builtin.id, kind: 'built-in' as const, enabled: existing.enabled !== false }
      : { ...builtin }
  }).sort((a, b) => {
    const aOrder = savedOrder.has(a.id) ? Number(savedOrder.get(a.id)) : a.order
    const bOrder = savedOrder.has(b.id) ? Number(savedOrder.get(b.id)) : b.order
    if (aOrder !== bOrder) return aOrder - bOrder
    return a.order - b.order
  })
  const customs = current.filter(isCustomSection)
  return [...builtins, ...customs].map((section, index) => ({ ...section, order: index + 1 }))
}

export function createHomepageBlock(kind: Exclude<HomepageBlockKind, 'built-in'>, order: number): HomepageSection {
  const option = CUSTOM_BLOCK_OPTIONS.find((item) => item.kind === kind) || CUSTOM_BLOCK_OPTIONS[0]
  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    kind: option.kind,
    label: option.label,
    enabled: true,
    order,
    summary: option.summary,
    title: option.sampleTitle,
    content: option.sampleContent,
    imageUrl: '',
    imageAlt: '',
    buttonLabel: option.kind === 'cta' || option.kind === 'banner' ? 'Learn more' : '',
    buttonHref: option.kind === 'cta' || option.kind === 'banner' ? '/get-involved' : '',
    eyebrow: '',
  }
}
