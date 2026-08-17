export type Status = 'draft' | 'published'
export type EnquiryStatus = 'new' | 'in_progress' | 'resolved' | 'spam'
export type ModuleKey = 'homepage' | 'pages' | 'navigation' | 'media' | 'programs' | 'blog' | 'events' | 'stories' | 'testimonials' | 'team' | 'partners' | 'locations' | 'enquiries' | 'newsletter' | 'settings' | 'users' | 'audit' | 'theme' | 'header' | 'footer' | 'seo'

export interface AuthUser { id: number; username: string; email: string; firstname?: string; lastname?: string; role?: { id: number; name: string; type: string } }
export interface LoginPayload { identifier: string; password: string }
export interface ChangePasswordPayload { currentPassword: string; password: string; passwordConfirmation: string }
export interface DashboardStats { pages: number; pagesPublished: number; pagesDraft: number; articles: number; upcomingEvents: number; enquiries: number; newsletterSubscribers: number }
export interface ActivityItem { id: string; actor: string; action: string; resource: string; createdAt: string }
export interface SeoFields { metaTitle?: string; metaDescription?: string; keywords?: string }
export interface BaseRecord { id: string; documentId?: string; createdAt?: string; updatedAt?: string }
export interface PageRecord extends BaseRecord {
  title: string
  slug: string
  status: Status
  pageType?: 'content' | 'link'
  summary?: string
  heroImageUrl?: string
  externalUrl?: string
  showInHeader?: boolean
  showInFooter?: boolean
  templateId?: string
  seo?: SeoFields
  sections?: Array<{ id: string; type: string; title: string; content: string; imageUrl?: string; buttonLabel?: string; buttonHref?: string }>
}
export interface HomepageSection { id: string; label: string; enabled: boolean; order: number; summary: string }
export interface HeroSlide { id: string; imageUrl: string; alt?: string }
export interface HomepageRecord {
  heroHeadline: string
  heroIntro: string
  heroImageUrl?: string
  heroImageAlt?: string
  heroSlides?: HeroSlide[]
  primaryCtaLabel: string
  primaryCtaHref: string
  missionTitle: string
  missionStatement: string
  missionScripture?: string
  stats: Array<{ value: string; label: string }>
  sections: HomepageSection[]
}
export interface NavItem {
  id: string
  label: string
  href: string
  visible?: boolean
  children?: NavItem[]
}
export interface NavigationMenu extends BaseRecord { name: string; location: 'header' | 'footer' | 'mobile' | 'utility'; items: NavItem[] }
export interface ThemeSettings {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  accentColor: string
  fontFamily: string
  headingFontFamily: string
}
export interface HeaderSettings {
  backgroundColor: string
  textColor: string
  logoUrl: string
  logoAlt: string
  ctaText: string
  ctaLink: string
  sticky: boolean
}
export interface FooterSettings {
  backgroundColor: string
  textColor: string
  logoUrl: string
  description: string
  copyright: string
  showSocial: boolean
  facebookUrl?: string
  instagramUrl?: string
  youtubeUrl?: string
}
export interface SeoSettings {
  metaTitle: string
  metaDescription: string
  keywords: string
  ogImageUrl: string
  siteUrl: string
}
export interface MediaFile extends BaseRecord { name: string; url: string; mime: string; size: number; alternativeText?: string }
export interface ProgramRecord extends BaseRecord { title: string; slug: string; summary: string; description: string; area: string; status: Status; order: number }
export interface BlogRecord extends BaseRecord { title: string; slug: string; summary: string; body: string; author: string; category: string; status: Status; seo?: SeoFields }
export interface EventRecord extends BaseRecord { title: string; slug: string; summary: string; description: string; startDate: string; endDate?: string; venue?: string; category?: string; status: Status }
export interface StoryRecord extends BaseRecord { title: string; slug: string; summary: string; type: 'video' | 'written'; country?: string; program?: string; featured: boolean; status: Status; imageUrl?: string; videoUrl?: string }
export interface TestimonialRecord extends BaseRecord { quote: string; author: string; mediaType: 'written' | 'video'; country?: string; program?: string; featured: boolean; status: Status }
export interface TeamRecord extends BaseRecord { name: string; title: string; role: 'board' | 'global-team' | 'staff' | 'advisor'; region?: string; country?: string; bio: string; order: number; publicVisibility: boolean; status?: Status }
export interface PartnerRecord extends BaseRecord { name: string; description?: string; url?: string; region?: string; order: number; status: Status }
export interface LocationRecord extends BaseRecord { country: string; region?: string; summary?: string; programs?: string; latitude?: number; longitude?: number; status: Status }
export interface EnquiryRecord extends BaseRecord { name: string; email: string; type: string; message: string; status: EnquiryStatus; notes?: string; createdAt: string }
export interface SubscriberRecord extends BaseRecord { name: string; email: string; whatsapp?: string; source?: string; consent: boolean; createdAt: string }
export interface SettingsRecord { organizationName: string; tagline: string; mission: string; vision: string; primaryEmail: string; primaryPhone?: string; address?: string; maintenanceMode: boolean; seo?: SeoFields }
export interface AdminUserRecord { id: number; username: string; email: string; firstname?: string; lastname?: string; blocked: boolean; role?: { id: number; name: string; type: string } }
export interface AuditRecord extends BaseRecord { actor: string; action: string; resourceType: string; recordId?: string; ip?: string; createdAt: string }
export interface ModuleConfig<T extends BaseRecord> { key: ModuleKey; title: string; endpoint: string; route: string; singular: string; description: string; fields: FormField<T>[]; columns: Array<{ key: keyof T; label: string }> }
export type FormField<T> = { name: keyof T; label: string; type: 'text' | 'textarea' | 'select' | 'number' | 'date' | 'checkbox' | 'richtext'; required?: boolean; options?: Array<{ label: string; value: string }> }
