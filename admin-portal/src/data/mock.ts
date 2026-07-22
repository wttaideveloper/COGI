import type { ActivityItem, AdminUserRecord, AuditRecord, BlogRecord, DashboardStats, EnquiryRecord, EventRecord, HomepageRecord, LocationRecord, MediaFile, NavigationMenu, PageRecord, PartnerRecord, ProgramRecord, SettingsRecord, StoryRecord, SubscriberRecord, TeamRecord, TestimonialRecord } from '@/types'

export const mockStats: DashboardStats = { pages: 18, pagesPublished: 14, pagesDraft: 4, articles: 52, upcomingEvents: 6, enquiries: 23, newsletterSubscribers: 784 }
export const mockActivity: ActivityItem[] = [
  { id: '1', actor: 'Sarah Admin', action: 'Published', resource: 'Care for the Caregiver program', createdAt: '2026-07-12T10:30:00Z' },
  { id: '2', actor: 'David Editor', action: 'Updated', resource: 'Homepage hero', createdAt: '2026-07-11T14:15:00Z' },
  { id: '3', actor: 'System', action: 'Received', resource: 'New partnership enquiry', createdAt: '2026-07-11T09:00:00Z' },
]
export const mockHomepage: HomepageRecord = {
  heroHeadline: 'Equipping Healthcare Professionals for Kingdom Engagement',
  heroIntro: 'COGI cultivates communities of grace among healthcare professionals serving missionally around the world.',
  heroImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80',
  heroImageAlt: 'Healthcare professionals collaborating in a clinic',
  heroSlides: [
    { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80', alt: 'Healthcare professionals collaborating in a clinic' },
    { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1600&q=80', alt: 'Medical team serving together' },
    { id: 's3', imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1600&q=80', alt: 'Community healthcare and care' },
  ],
  primaryCtaLabel: 'Join the Movement',
  primaryCtaHref: '/get-involved',
  missionTitle: 'Our Mission',
  missionStatement: 'Inspire and enable transformation so healthcare professionals think, live, and work missionally.',
  stats: [{ value: '10+', label: 'Countries' }, { value: '500+', label: 'Professionals' }, { value: '30+', label: 'Programs' }],
  sections: [
    { id: 'hero', label: 'Hero', enabled: true, order: 1, summary: 'Primary homepage introduction and call to action.' },
    { id: 'mission', label: 'Mission', enabled: true, order: 2, summary: 'Mission statement and scripture.' },
    { id: 'methods', label: 'Methods', enabled: true, order: 3, summary: 'Enable, train, and support.' },
    { id: 'impact', label: 'Impact Stats', enabled: true, order: 4, summary: 'Countries, professionals, programs.' },
  ],
}
export const mockPages: PageRecord[] = [
  { id: '1', title: 'About COGI', slug: 'about', status: 'published', updatedAt: '2026-07-10', seo: { metaTitle: 'About COGI' }, sections: [{ id: 's1', type: 'Hero', title: 'Vision & Mission', content: 'Global Christian Healthcare Community actively on Mission for God.' }] },
  { id: '2', title: 'Donate', slug: 'donate', status: 'draft', updatedAt: '2026-07-08', seo: { metaTitle: 'Donate' }, sections: [{ id: 's1', type: 'Embed', title: 'GiveLively', content: 'Donation embed placeholder.' }] },
]
export const mockMedia: MediaFile[] = [
  { id: '1', name: 'mission-photo.jpg', url: 'https://images.unsplash.com/photo-1584515933487-779824d29309', mime: 'image/jpeg', size: 245000, alternativeText: 'Healthcare professionals serving together', createdAt: '2026-07-09' },
  { id: '2', name: 'hero-clinic.jpg', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d', mime: 'image/jpeg', size: 312000, alternativeText: 'Clinic collaboration', createdAt: '2026-07-10' },
  { id: '3', name: 'community-care.jpg', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2', mime: 'image/jpeg', size: 278000, alternativeText: 'Community healthcare', createdAt: '2026-07-11' },
]
export const mockNavigation: NavigationMenu[] = [
  {
    id: '1',
    name: 'Main Navigation',
    location: 'header',
    items: [
      { id: 'a', label: 'About Us', href: '/about', visible: true, children: [{ id: 'b', label: 'Board Members', href: '/about/board', visible: true }, { id: 'b2', label: 'Our Story', href: '/about/our-story', visible: true }] },
      { id: 'c', label: 'Programs', href: '/programs', visible: true },
      { id: 'd', label: 'Resources', href: '/resources', visible: true },
      { id: 'e', label: 'Get Involved', href: '/get-involved', visible: true },
      { id: 'f', label: 'Donate', href: '/donate', visible: true },
      { id: 'g', label: 'Contact', href: '/contact', visible: true },
    ],
  },
]
export const mockPrograms: ProgramRecord[] = [
  { id: '1', title: 'Kingdom of God', slug: 'kingdom-of-god', summary: 'Seminar and discovery series.', description: 'Formation and teaching for Kingdom engagement in healthcare.', area: 'Formation', status: 'published', order: 1 },
  { id: '2', title: 'Care for the Caregiver', slug: 'care-for-the-caregiver', summary: 'Eight-module journey for caregiver renewal.', description: 'Support, rhythms, and community for healthcare workers.', area: 'Care', status: 'published', order: 2 },
]
export const mockBlog: BlogRecord[] = [{ id: '1', title: 'Communities of Grace in Healthcare', slug: 'communities-of-grace', summary: 'How COGI equips professionals for mission.', body: '<p>Healthcare is a place where grace can be embodied through skill, presence, and hope.</p>', author: 'COGI Editorial', category: 'News', status: 'published' }]
export const mockEvents: EventRecord[] = [{ id: '1', title: 'Missional Health Course', slug: 'missional-health-course', summary: 'Online cohort for health professionals.', description: 'A facilitated online learning cohort.', startDate: '2026-08-15', endDate: '2026-08-16', venue: 'Online', category: 'Training', status: 'published' }]
export const mockStories: StoryRecord[] = [{ id: '1', title: 'Serving with Hope', slug: 'serving-with-hope', summary: 'A story from a physician community.', type: 'written', country: 'India', program: 'Kingdom of God', featured: true, status: 'published' }]
export const mockTestimonials: TestimonialRecord[] = [{ id: '1', quote: 'COGI helped me see my clinical work as a place of worship and mission.', author: 'Dr. Miriam', mediaType: 'written', country: 'Kenya', program: 'C4C', featured: true, status: 'published' }]
export const mockTeam: TeamRecord[] = [{ id: '1', name: 'Ted Lang', title: 'Board Member', role: 'board', region: 'Global', bio: 'Board profile pending final ministry text.', order: 1, publicVisibility: true }, { id: '2', name: 'Anita Rao', title: 'Regional Lead', role: 'global-team', region: 'Asia', country: 'India', bio: 'Supports communities of grace across regional healthcare networks.', order: 2, publicVisibility: true }]
export const mockPartners: PartnerRecord[] = [{ id: '1', name: 'Healthcare Christian Fellowship', description: 'Global ministry partner.', url: 'https://example.org', region: 'Global', order: 1, status: 'published' }]
export const mockLocations: LocationRecord[] = [{ id: '1', country: 'India', region: 'Asia', summary: 'Regional training and fellowship communities.', latitude: 20.5937, longitude: 78.9629, status: 'published' }]
export const mockEnquiries: EnquiryRecord[] = [{ id: '1', name: 'Grace Thomas', email: 'grace@example.com', type: 'program-interest', message: 'I would like to know more about C4C.', status: 'new', notes: 'Reply with next cohort dates.', createdAt: '2026-07-12T08:30:00Z' }]
export const mockSubscribers: SubscriberRecord[] = [{ id: '1', name: 'Joshua Lee', email: 'joshua@example.com', whatsapp: '+1 555 0100', source: 'footer', consent: true, createdAt: '2026-07-09T11:00:00Z' }]
export const mockSettings: SettingsRecord = { organizationName: 'Companions of Grace International', tagline: 'Equipping Healthcare Professionals for Kingdom Engagement', mission: 'Inspire and enable transformation so healthcare professionals think, live, and work missionally.', vision: 'Global Christian Healthcare Community actively on Mission for God', primaryEmail: 'hello@coginternational.org', primaryPhone: '+1 555 0101', address: 'Global fellowship - address configurable', maintenanceMode: false, seo: { metaTitle: 'COGI', metaDescription: 'Companions of Grace International' } }
export const mockUsers: AdminUserRecord[] = [{ id: 1, username: 'admin', email: 'admin@cogi.local', firstname: 'COGI', lastname: 'Admin', blocked: false, role: { id: 1, name: 'Super Admin', type: 'super-admin' } }, { id: 2, username: 'editor', email: 'editor@cogi.local', firstname: 'Content', lastname: 'Editor', blocked: false, role: { id: 2, name: 'Editor', type: 'editor' } }]
export const mockAudit: AuditRecord[] = [{ id: '1', actor: 'COGI Admin', action: 'login.demo', resourceType: 'auth', ip: '127.0.0.1', createdAt: '2026-07-13T07:00:00Z' }, { id: '2', actor: 'Sarah Admin', action: 'publish', resourceType: 'program', recordId: '1', ip: '10.0.0.2', createdAt: '2026-07-12T10:30:00Z' }]
