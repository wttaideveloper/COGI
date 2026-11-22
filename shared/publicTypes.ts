export interface SEO {
  title?: string
  description?: string
  image?: string
}

export interface GlobalSettings {
  organizationName: string
  tagline: string
  mission: string
  vision: string
  scriptureRefs: string[]
  contactEmail: string
  contactPhone?: string
  address?: string
  socialLinks: SocialLink[]
  seo: SEO
}

export interface SocialLink {
  platform: 'instagram' | 'facebook' | 'linkedin' | 'youtube'
  url: string
  label: string
}

export interface HeroContent {
  headline: string
  subheadline: string
  intro: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  imageAlt: string
  imageUrl?: string
}

export interface MethodCard {
  imageUrl?: string
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
}

export interface ImpactStat {
  id: string
  value: string
  label: string
  description?: string
}

export interface PortfolioArea {
  id: string
  title: string
  summary: string
  programSlug: string
}

export interface VideoSection {
  title: string
  description: string
  videoUrl?: string
  thumbnailAlt: string
}

export interface Homepage {
  hero: HeroContent
  mission: {
    title: string
    statement: string
    scripture: string
  }
  video: VideoSection
  methods: MethodCard[]
  impactStats: ImpactStat[]
  portfolio: PortfolioArea[]
  storiesTeaser: {
    title: string
    description: string
    featuredStoryIds: string[]
  }
  featuredEventId?: string
  newsletter: {
    title: string
    description: string
  }
  donateCta: {
    title: string
    description: string
    buttonLabel: string
  }
}

export interface ProgramExperience {
  id: string
  title: string
  description: string
  status?: 'active' | 'development' | 'placeholder'
}

export interface Program {
  id: string
  slug: string
  title: string
  summary: string
  description: string
  area: string
  experiences: ProgramExperience[]
  highlights: string[]
  audience: string
  order: number
}

export interface TimelineMilestone {
  year: string
  title: string
  description: string
}

export interface Belief {
  id: string
  title: string
  content: string
}

export interface TeamMember {
  id: string
  name: string
  title: string
  role: 'board' | 'global' | 'global-team'
  region?: string
  country?: string
  bio: string
  imageAlt?: string
  order: number
}

export interface Partner {
  logoUrl?: string
  id: string
  name: string
  description: string
  url?: string
  region?: string
  order: number
}

export interface Story {
  id: string
  slug: string
  title: string
  summary: string
  type: 'video' | 'written'
  country: string
  program: string
  featured: boolean
  videoUrl?: string
  imageUrl?: string
  content?: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  role?: string
  country?: string
  program?: string
  featured: boolean
  mediaType?: 'written' | 'video'
  videoUrl?: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  author: string
  category: string
  publishedAt: string
  imageUrl?: string
  imageAlt?: string
}

export interface Event {
  id: string
  slug: string
  title: string
  summary: string
  description: string
  startDate: string
  endDate?: string
  venue?: string
  location?: string
  category: string
  registrationUrl?: string
  featured: boolean
}

export interface Location {
  id: string
  country: string
  region: string
  summary: string
  programs: string[]
  lat?: number
  lng?: number
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  type?: string
}

export interface NewsletterFormData {
  name: string
  email: string
  whatsapp?: string
}

export interface GetInvolvedFormData {
  name: string
  email: string
  phone?: string
  pathway: 'pray' | 'participate' | 'partner'
  profession?: string
  organization?: string
  country?: string
  preferredContact?: 'email' | 'whatsapp'
  roleArea?: string
  message?: string
  programInterest?: string
}

export interface SearchResult {
  id: string
  type: 'page' | 'program' | 'blog' | 'event' | 'story'
  title: string
  summary: string
  url: string
}

export interface StrapiResponse<T> {
  data: T
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface LegalPage {
  slug: string
  title: string
  content: string
  lastUpdated: string
}
