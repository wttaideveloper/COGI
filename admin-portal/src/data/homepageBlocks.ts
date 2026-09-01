import type { HomepageBlockKind, HomepageSection } from '@/types'

export const BUILTIN_SECTION_IDS = [
  'hero',
  'newsletterBanner',
  'legacy',
  'video',
  'mission',
  'splitPrograms',
  'splitStories',
  'methods',
  'impact',
  'portfolio',
  'map',
  'stories',
  'testimonials',
  'events',
  'newsletter',
  'donate',
  'faith',
] as const

export const DEFAULT_BUILTIN_SECTIONS: HomepageSection[] = [
  { id: 'hero', label: 'Welcome banner', enabled: true, order: 1, summary: 'The first thing visitors see', kind: 'built-in' },
  { id: 'newsletterBanner', label: 'Highlight banner', enabled: true, order: 2, summary: 'A short callout under the welcome', kind: 'built-in' },
  { id: 'legacy', label: 'Our story', enabled: true, order: 3, summary: 'Who we are and why we exist', kind: 'built-in' },
  { id: 'mission', label: 'Mission', enabled: true, order: 4, summary: 'Mission statement and scripture', kind: 'built-in' },
  { id: 'video', label: 'Intro video', enabled: true, order: 5, summary: 'Film or photo introduction', kind: 'built-in' },
  {
    id: 'splitPrograms',
    label: 'Programs (photo + text)',
    enabled: true,
    order: 6,
    summary: 'Photo on one side, words on the other',
    kind: 'built-in',
    title: 'Programs',
    content: 'Training, formation, and Kingdom of God seminars that help healthcare professionals think, live, and work missionally — in clinics, hospitals, and communities around the world.',
    imageUrl: '/images/cogi-train.png',
    imageAlt: 'Healthcare professionals in training',
    imageSide: 'right',
    buttonLabel: 'Learn more',
    buttonHref: '/programs',
  },
  {
    id: 'splitStories',
    label: 'Stories (photo + text)',
    enabled: true,
    order: 7,
    summary: 'Photo on one side, words on the other',
    kind: 'built-in',
    title: 'Stories of transformation',
    content: 'From the bedside to the mission field, Companions of Grace walk with healthcare workers whose ordinary work is becoming extraordinary witness. Watch and read how communities of grace are taking shape.',
    imageUrl: '/images/cogi-kenya.png',
    imageAlt: 'Healthcare workers serving a community',
    imageSide: 'left',
    buttonLabel: 'See stories',
    buttonHref: '/resources/stories',
  },
  { id: 'methods', label: 'How we work', enabled: true, order: 8, summary: 'Enable, train, and support', kind: 'built-in' },
  { id: 'impact', label: 'Key numbers', enabled: true, order: 9, summary: 'Countries, people, and programs', kind: 'built-in' },
  { id: 'portfolio', label: 'What we do', enabled: true, order: 10, summary: 'Ministry areas', kind: 'built-in' },
  { id: 'map', label: 'Where we serve', enabled: true, order: 11, summary: 'Map of countries', kind: 'built-in' },
  { id: 'stories', label: 'Featured stories', enabled: true, order: 12, summary: 'Story cards from the library', kind: 'built-in' },
  { id: 'testimonials', label: 'Testimonials', enabled: true, order: 13, summary: 'Rotating quotes and short clips', kind: 'built-in' },
  { id: 'events', label: 'Next event', enabled: true, order: 14, summary: 'The upcoming featured event', kind: 'built-in' },
  { id: 'newsletter', label: 'Email signup', enabled: true, order: 15, summary: 'Newsletter form', kind: 'built-in' },
  { id: 'donate', label: 'Give', enabled: true, order: 16, summary: 'Invite people to donate', kind: 'built-in' },
  { id: 'faith', label: 'Statement of faith', enabled: true, order: 17, summary: 'Closing faith statement', kind: 'built-in' },
]

export const SECTION_HINTS: Record<string, string> = {
  hero: 'Video or photos, headline, and buttons',
  newsletterBanner: 'A short colored callout',
  legacy: 'Who we are',
  video: 'The intro film',
  mission: 'Mission statement',
  splitPrograms: 'Big photo beside a short story',
  splitStories: 'Big photo beside a short story',
  methods: 'Three photo cards',
  impact: 'The numbers visitors see',
  portfolio: 'Four ministry areas',
  map: 'Interactive world map',
  stories: 'Two featured stories',
  testimonials: 'Rotating quotes and clips',
  events: 'Picked from Events',
  newsletter: 'Signup form',
  donate: 'Give button',
  faith: 'Closing statement',
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
    label: 'Words',
    summary: 'A heading and a paragraph',
    sampleTitle: 'New section title',
    sampleContent: 'Write the story, announcement, or invitation visitors should read here.',
  },
  {
    kind: 'split',
    label: 'Photo beside words',
    summary: 'A large photo next to a short story',
    sampleTitle: 'A story from the field',
    sampleContent: 'Pair a photo with a short story about a community, program, or partnership.',
  },
  {
    kind: 'banner',
    label: 'Wide photo banner',
    summary: 'Heading over a full-width photo',
    sampleTitle: 'Join us',
    sampleContent: 'A short line over a wide photo.',
  },
  {
    kind: 'cta',
    label: 'Button invitation',
    summary: 'Heading, a sentence, and a button',
    sampleTitle: 'Take the next step',
    sampleContent: 'Invite people to pray, give, or get involved.',
  },
  {
    kind: 'quote',
    label: 'Quote or verse',
    summary: 'A highlighted quote',
    sampleTitle: 'A word to remember',
    sampleContent: '“Whatever you do, in word or deed, do everything in the name of the Lord Jesus.” — Colossians 3:17',
  },
  {
    kind: 'image',
    label: 'Photo with caption',
    summary: 'A wide photo and a short caption',
    sampleTitle: 'Caption',
    sampleContent: 'Describe what the photo shows.',
  },
]

export function isSplitSection(section: Pick<HomepageSection, 'id' | 'kind'>): boolean {
  return section.kind === 'split' || section.id === 'splitPrograms' || section.id === 'splitStories'
}

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
      ? { ...builtin, ...existing, id: builtin.id, label: builtin.label, summary: builtin.summary, kind: 'built-in' as const, enabled: existing.enabled !== false }
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
    imageSide: option.kind === 'split' ? 'right' : undefined,
    buttonLabel: option.kind === 'cta' || option.kind === 'banner' || option.kind === 'split' ? 'Learn more' : '',
    buttonHref: option.kind === 'cta' || option.kind === 'banner' || option.kind === 'split' ? '/get-involved' : '',
    eyebrow: '',
  }
}
