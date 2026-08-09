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
  stats: [{ value: '10+', label: 'Countries' }, { value: '500+', label: 'Healthcare Professionals' }, { value: '30+', label: 'Programs Delivered' }, { value: '∞', label: 'Communities of Grace' }],
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
      { id: 'a', label: 'About Us', href: '/about', visible: true, children: [{ id: 'a1', label: 'Vision & Mission', href: '/about', visible: true }, { id: 'a2', label: 'Our Story', href: '/about/our-story', visible: true }, { id: 'a3', label: 'Board Members', href: '/about/board', visible: true }, { id: 'a4', label: 'Global Team', href: '/about/global-team', visible: true }, { id: 'a5', label: 'Our Beliefs', href: '/about/beliefs', visible: true }, { id: 'a6', label: 'Our Partners', href: '/about/partners', visible: true }] },
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
export const mockTeam: TeamRecord[] = [
  { id: '1', name: 'Dr. Abraham Thomas', title: 'Chairman', role: 'board', region: 'North America', bio: 'Abe is a practicing pediatrician in Northern New Jersey. After completing medical education in India, he migrated to the United States with his wife Ruby. Once they became empty nesters, God opened a new chapter of partnership with Mathew in discipling healthcare workers. Mathew and Abe miraculously reconnected, and when Mathew shared his vision about discipleship amongst healthcare workers, Abe felt led to partner. About 15 months ago he joined hands in prayer and fellowship with a group of likeminded brothers — and to see the early fruits of that prayer and hard work is truly exciting.', order: 1, publicVisibility: true },
  { id: '2', name: 'Dr. Mathew George', title: 'Chief Executive Officer', role: 'board', region: 'South Asia', bio: 'Mathew is a dentist by profession who worked at Duncan Hospital, a rural mission hospital and unit of Emmanuel Hospital Association (EHA) in Raxaul, Bihar, India. He later served as Missions Secretary of the Evangelical Medical Fellowship of India (EMFI), working in medical missions training, mentoring of medical students and professionals, and the Kingdom of God in Healthcare program. God called him to form Companions of Grace International to help healthcare professionals live lives that advance the Kingdom of God.', order: 2, publicVisibility: true },
  { id: '3', name: 'Mr. Charles Faust', title: 'Secretary', role: 'board', region: 'North America', bio: 'Chuck is a retired business executive having served in chief operating and chief financial roles for multi-national companies. In February 2013, God opened a pathway after his 35-year business career drew to a close, enabling him and his wife Mary to travel on a medical mission trip to Duncan Hospital in Raxaul, Bihar, India. There he met Mathew and God knit their hearts together in Christian brotherhood. From then they communicated and prayed together regularly over the years since.', order: 3, publicVisibility: true },
  { id: '4', name: 'Mr. Paul East', title: 'Board Member', role: 'board', region: 'North America', bio: 'Paul has known and walked with Mathew for many years in Christian brotherhood. In recent years it became clear that God has called Mathew to lead a movement amongst healthcare professionals. When asked to join the Board, it was quickly clear that he needed to join this work. Paul brings wisdom, discernment, and steady partnership to the board.', order: 4, publicVisibility: true },
  { id: '5', name: 'Dr. Sunil Abraham', title: 'Board Member', role: 'board', region: 'South Asia', bio: 'Sunil serves with wisdom and pastoral care, helping shape the missional healthcare vision of COGI across South Asia.', order: 5, publicVisibility: true },
  { id: '6', name: 'Dr. Manoj Jacob', title: 'Board Member', role: 'board', region: 'South Asia', bio: 'Manoj brings clinical and missional healthcare experience, supporting Kingdom of God programs and mentorship of healthcare professionals.', order: 6, publicVisibility: true },
  { id: '7', name: 'Ted Lang', title: 'Board Member', role: 'board', region: 'Global', bio: 'Board profile pending final ministry text.', order: 7, publicVisibility: true },
  { id: '8', name: 'Priya', title: 'Program Facilitator', role: 'global-team', region: 'South Asia', country: 'India', bio: 'Facilitates Kingdom of God seminars and Discovery Series across South Asia.', order: 1, publicVisibility: true },
  { id: '9', name: 'Rajan', title: 'Mentor', role: 'global-team', region: 'South Asia', country: 'India', bio: 'Provides mentoring and coaching for healthcare students and early-career professionals.', order: 2, publicVisibility: true },
  { id: '10', name: 'Grace', title: 'Regional Coordinator', role: 'global-team', region: 'East Africa', country: 'Kenya', bio: 'Coordinates Missional Training programs and church partnerships in East Africa.', order: 3, publicVisibility: true },
  { id: '11', name: 'David', title: 'C4C Facilitator', role: 'global-team', region: 'East Africa', country: 'Uganda', bio: 'Leads Care for the Caregiver cohorts for hospital staff and community health workers.', order: 4, publicVisibility: true },
  { id: '12', name: 'Amara', title: 'Program Lead', role: 'global-team', region: 'West Africa', country: 'Nigeria', bio: 'Partners with CAPRO to deliver missional healthcare training across West Africa.', order: 5, publicVisibility: true },
  { id: '13', name: 'Sarah', title: 'North America Coordinator', role: 'global-team', region: 'North America', country: 'United States', bio: 'Connects US-based healthcare professionals with global Communities of Grace.', order: 6, publicVisibility: true },
]
export const mockPartners: PartnerRecord[] = [
  { id: '1', name: 'Global Advance', description: 'A Christian nonprofit organization that sends people to share the love and message of Jesus cross-culturally and equips Christ followers to better engage their neighbors.', url: 'https://globaladvance.org', region: 'Global', order: 1, status: 'published' },
  { id: '2', name: 'Healthcare Christian Fellowship International (HCFI)', description: 'Active in more than 120 countries, HCFI seeks to equip caregivers to practice integral healthcare.', url: 'https://hcfi.org', region: 'Global', order: 2, status: 'published' },
  { id: '3', name: 'CAPRO Mission', description: 'A mission agency with a clear mandate of bringing the transformational message of Jesus to the unreached peoples of our generation.', url: 'https://capromissions.org', region: 'Africa', order: 3, status: 'published' },
  { id: '4', name: 'Emmanuel Hospital Association (EHA)', description: 'A network of mission hospitals across India where COGI leaders have served and where Kingdom of God programs were first piloted, including Duncan Hospital in Raxaul, Bihar.', region: 'South Asia', order: 4, status: 'published' },
  { id: '5', name: 'Evangelical Medical Fellowship of India (EMFI)', description: 'Partner in medical missions training, mentoring of medical students and professionals, and development of the Kingdom of God in Healthcare curriculum.', region: 'South Asia', order: 5, status: 'published' },
]
export const mockLocations: LocationRecord[] = [
  { id: '1', country: 'India', region: 'South Asia', summary: 'Birthplace of COGI vision; Kingdom of God and C4C programs active.', latitude: 20.5937, longitude: 78.9629, status: 'published' },
  { id: '2', country: 'United States', region: 'North America', summary: 'Board headquarters; seminars and church engagement programs.', latitude: 39.8283, longitude: -98.5795, status: 'published' },
  { id: '3', country: 'Kenya', region: 'East Africa', summary: 'M-Trail and missional training through CAPRO partnership.', latitude: -0.0236, longitude: 37.9062, status: 'published' },
  { id: '4', country: 'Uganda', region: 'East Africa', summary: 'C4C cohorts and church-healthcare bridge programs.', latitude: 1.3733, longitude: 32.2903, status: 'published' },
  { id: '5', country: 'Nigeria', region: 'West Africa', summary: 'Missional healthcare training with CAPRO.', latitude: 9.082, longitude: 8.6753, status: 'published' },
  { id: '6', country: 'United Kingdom', region: 'Europe', summary: 'HCFI collaboration and mentoring programs.', latitude: 55.3781, longitude: -3.436, status: 'published' },
  { id: '7', country: 'Bangladesh', region: 'South Asia', summary: 'Emerging Communities of Grace among nursing professionals.', latitude: 23.685, longitude: 90.3563, status: 'published' },
  { id: '8', country: 'Nepal', region: 'South Asia', summary: 'Rural healthcare mission partnerships.', latitude: 28.3949, longitude: 84.124, status: 'published' },
  { id: '9', country: 'Tanzania', region: 'East Africa', summary: 'Cross-cultural M-Trail and field placements.', latitude: -6.369, longitude: 34.8888, status: 'published' },
  { id: '10', country: 'Philippines', region: 'Southeast Asia', summary: 'Discovery Series among allied health communities.', latitude: 12.8797, longitude: 121.774, status: 'published' },
  { id: '11', country: 'Ghana', region: 'West Africa', summary: 'Church-healthcare engagement seminars.', latitude: 7.9465, longitude: -1.0232, status: 'published' },
]
export const mockEnquiries: EnquiryRecord[] = [{ id: '1', name: 'Grace Thomas', email: 'grace@example.com', type: 'program-interest', message: 'I would like to know more about C4C.', status: 'new', notes: 'Reply with next cohort dates.', createdAt: '2026-07-12T08:30:00Z' }]
export const mockSubscribers: SubscriberRecord[] = [{ id: '1', name: 'Joshua Lee', email: 'joshua@example.com', whatsapp: '+1 555 0100', source: 'footer', consent: true, createdAt: '2026-07-09T11:00:00Z' }]
export const mockSettings: SettingsRecord = { organizationName: 'Companions of Grace International', tagline: 'Equipping Healthcare Professionals for Kingdom Engagement', mission: 'Inspire and enable transformation so healthcare professionals think, live, and work missionally.', vision: 'Global Christian Healthcare Community actively on Mission for God', primaryEmail: 'hello@coginternational.org', primaryPhone: '+1 555 0101', address: 'Global fellowship - address configurable', maintenanceMode: false, seo: { metaTitle: 'COGI', metaDescription: 'Companions of Grace International' } }
export const mockUsers: AdminUserRecord[] = [{ id: 1, username: 'admin', email: 'admin@cogi.local', firstname: 'COGI', lastname: 'Admin', blocked: false, role: { id: 1, name: 'Super Admin', type: 'super-admin' } }, { id: 2, username: 'editor', email: 'editor@cogi.local', firstname: 'Content', lastname: 'Editor', blocked: false, role: { id: 2, name: 'Editor', type: 'editor' } }]
export const mockAudit: AuditRecord[] = [{ id: '1', actor: 'COGI Admin', action: 'login.demo', resourceType: 'auth', ip: '127.0.0.1', createdAt: '2026-07-13T07:00:00Z' }, { id: '2', actor: 'Sarah Admin', action: 'publish', resourceType: 'program', recordId: '1', ip: '10.0.0.2', createdAt: '2026-07-12T10:30:00Z' }]
