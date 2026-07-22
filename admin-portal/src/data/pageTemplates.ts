export type PageSectionType = 'banner' | 'heading' | 'text' | 'image' | 'split' | 'quote' | 'cta' | 'columns'

export type PageSection = {
  id: string
  type: PageSectionType
  title: string
  content: string
  imageUrl?: string
  buttonLabel?: string
  buttonHref?: string
}

export type PageTemplateId = 'starter' | 'about' | 'program' | 'events' | 'contact' | 'giving' | 'resources' | 'blank' | 'link'

export const PAGE_SECTION_OPTIONS: Array<{ type: PageSectionType; label: string; description: string }> = [
  { type: 'banner', label: 'Banner', description: 'Full-width hero image area' },
  { type: 'heading', label: 'Heading', description: 'Title and subtitle' },
  { type: 'text', label: 'Text', description: 'Paragraphs and body copy' },
  { type: 'image', label: 'Image', description: 'Photo with caption' },
  { type: 'split', label: 'Text + Image', description: 'Photo beside text' },
  { type: 'columns', label: 'Two columns', description: 'Side-by-side text' },
  { type: 'quote', label: 'Quote', description: 'Highlighted quote or verse' },
  { type: 'cta', label: 'Button / CTA', description: 'Call-to-action link' },
]

export const PAGE_TEMPLATES: Array<{
  id: PageTemplateId
  label: string
  description: string
  emoji: string
  pageType: 'content' | 'link'
  sections: PageSectionType[]
}> = [
  { id: 'starter', label: 'Simple page', description: 'Heading + paragraph for announcements', emoji: '✨', pageType: 'content', sections: ['heading', 'text'] },
  { id: 'about', label: 'About us', description: 'Banner, story, photo, and quote', emoji: '📖', pageType: 'content', sections: ['banner', 'heading', 'text', 'split', 'quote'] },
  { id: 'program', label: 'Program / ministry', description: 'Banner, story, photo, and join CTA', emoji: '🩺', pageType: 'content', sections: ['banner', 'heading', 'text', 'split', 'cta'] },
  { id: 'events', label: 'Events', description: 'Promote a retreat, course, or gathering', emoji: '📅', pageType: 'content', sections: ['banner', 'heading', 'text', 'cta'] },
  { id: 'resources', label: 'Resources', description: 'Heading, text columns, and links', emoji: '📚', pageType: 'content', sections: ['heading', 'text', 'columns', 'cta'] },
  { id: 'contact', label: 'Contact', description: 'Location, details, and get-in-touch CTA', emoji: '📍', pageType: 'content', sections: ['heading', 'text', 'columns', 'cta'] },
  { id: 'giving', label: 'Giving / donate', description: 'Story, quote, and donate button', emoji: '💝', pageType: 'content', sections: ['banner', 'heading', 'text', 'quote', 'cta'] },
  { id: 'blank', label: 'Blank page', description: 'Start empty — add blocks yourself', emoji: '📄', pageType: 'content', sections: [] },
  { id: 'link', label: 'Menu link only', description: 'External or internal link without page body', emoji: '🔗', pageType: 'link', sections: [] },
]

const sampleCopy: Record<PageSectionType, { title: string; content: string; buttonLabel?: string; buttonHref?: string }> = {
  banner: { title: 'Banner image', content: 'Add a hero image URL for this page.' },
  heading: { title: 'Page heading', content: 'A short supporting subtitle goes here.' },
  text: { title: 'Main content', content: 'Replace this sample paragraph with your story, details, or ministry description.' },
  image: { title: 'Image', content: 'Caption for the photo.' },
  split: { title: 'Story with photo', content: 'Tell the story on one side and pair it with an image.' },
  columns: { title: 'Two columns', content: 'Left column text | Right column text' },
  quote: { title: 'Quote', content: '“Whatever you do, work heartily, as for the Lord.” — Colossians 3:23' },
  cta: { title: 'Call to action', content: 'Invite people to take the next step.', buttonLabel: 'Get Involved', buttonHref: '/get-involved' },
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function createSection(type: PageSectionType): PageSection {
  const sample = sampleCopy[type]
  return {
    id: `sec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    title: sample.title,
    content: sample.content,
    buttonLabel: sample.buttonLabel,
    buttonHref: sample.buttonHref,
    imageUrl: '',
  }
}

export function sectionsFromTemplate(templateId: PageTemplateId): PageSection[] {
  const template = PAGE_TEMPLATES.find((item) => item.id === templateId) || PAGE_TEMPLATES[0]
  return template.sections.map((type) => createSection(type))
}
