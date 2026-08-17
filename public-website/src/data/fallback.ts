import type {
  Belief,
  BlogPost,
  Event,
  FAQ,
  GlobalSettings,
  Homepage,
  LegalPage,
  Location,
  Partner,
  Program,
  Story,
  TeamMember,
  Testimonial,
  TimelineMilestone,
} from '@/types'
import { siteImages, siteVideos } from '@/data/siteCopy'

const heroIdentity =
  'We are a global fellowship of Christ-followers cultivating Communities of Grace in healthcare by accompanying individuals and communities to develop a Kingdom perspective that shapes life, vocation, and service. In a rapidly changing global context, Companions of Grace seek to envision, empower, and engage healthcare professionals and communities in creative mission engagement, cultivating thriving Kingdom communities.'

const missionStatement =
  'Our mission is to inspire and enable the global Christian healthcare community to be transformed so they think, live and work missionally and thrive in their calling to serve. We equip them to provide whole-person care, demonstrate God\'s love, and offer hope, healing, and wholeness through Jesus Christ.'

export const fallbackGlobalSettings: GlobalSettings = {
  organizationName: 'Companions of Grace International',
  tagline: 'Equipping Healthcare Professionals for Kingdom Engagement',
  mission: missionStatement,
  vision:
    'The Global Christian Healthcare Community actively on Mission for God, reflecting His love, witnessing Christ in word and deed, ushering in God\'s Kingdom.',
  scriptureRefs: ['Colossians 3:17', 'Romans 12:2'],
  contactEmail: 'info@coginternational.org',
  address: 'Northern New Jersey, United States',
  socialLinks: [
    { platform: 'instagram', url: 'https://instagram.com/coginternational', label: 'Instagram' },
    { platform: 'facebook', url: 'https://facebook.com/coginternational', label: 'Facebook' },
    { platform: 'linkedin', url: 'https://linkedin.com/company/coginternational', label: 'LinkedIn' },
    { platform: 'youtube', url: 'https://youtube.com/@coginternational', label: 'YouTube' },
  ],
  seo: {
    title: 'COGI – Companions of Grace International',
    description:
      'Equipping healthcare professionals for Kingdom engagement through training, community, and missional healthcare programs worldwide.',
  },
}

export const fallbackHomepage: Homepage = {
  hero: {
    headline: 'Equipping Healthcare Professionals for Kingdom Engagement',
    subheadline: 'Companions of Grace International',
    intro: heroIdentity,
    primaryCta: { label: 'Get involved', href: '/get-involved' },
    secondaryCta: { label: 'Explore Our Programs', href: '/programs' },
    imageAlt: 'Healthcare professionals gathered in worship and mission',
  },
  mission: {
    title: 'Our Mission',
    statement: missionStatement,
    scripture: 'Colossians 3:17  ·  Romans 12:2',
  },
  video: {
    title: 'Watch our story',
    description:
      'A short introduction to who Companions of Grace is, why we exist, and the vision behind the ministry.',
    thumbnailAlt: 'Companions of Grace introduction video thumbnail',
    videoUrl: siteVideos.intro,
  },
  methods: [
    {
      id: 'enable',
      title: 'Enable',
      subtitle: 'Christ-centered life and vocation',
      description:
        'Enable healthcare professionals to become Christ-centered in life and vocation.',
      icon: 'enable',
    },
    {
      id: 'train',
      title: 'Train',
      subtitle: 'A biblical missional perspective',
      description:
        'Train healthcare professionals to develop a biblical missional perspective for healthcare.',
      icon: 'train',
    },
    {
      id: 'support',
      title: 'Support',
      subtitle: 'Companionship and encouragement',
      description:
        'Support healthcare professionals through intentional companionship and mutual encouragement.',
      icon: 'support',
    },
  ],
  impactStats: [
    { id: 'countries', value: '10+', label: 'Countries engaged' },
    { id: 'professionals', value: '500+', label: 'Healthcare professionals equipped' },
    { id: 'programs', value: '30+', label: 'Programs, workshops & formation experiences' },
    { id: 'communities', value: '∞', label: 'Growing Communities of Grace' },
  ],
  portfolio: [
    {
      id: 'kingdom-of-god',
      title: 'Kingdom of God Studies & Seminars',
      summary:
        'Seminars and study platforms that help healthcare professionals develop a Kingdom perspective and cultivate Kingdom-shaped communities.',
      programSlug: 'kingdom-of-god',
    },
    {
      id: 'missional-training',
      title: 'Missional Healthcare Training',
      summary:
        'Formation experiences that prepare healthcare professionals for faithful participation in God\'s mission through healthcare.',
      programSlug: 'missional-training',
    },
    {
      id: 'care-for-the-caregiver',
      title: 'Care for the Caregiver',
      summary:
        'Equipping healthcare professionals to navigate the emotional, relational, and vocational demands of caregiving.',
      programSlug: 'care-for-the-caregiver',
    },
    {
      id: 'missional-church-healthcare',
      title: 'Missional Church & Healthcare',
      summary:
        'Enabling church leaders and key healthcare professionals within the church to engage collaboratively in God\'s mission through healthcare.',
      programSlug: 'missional-church-healthcare',
    },
  ],
  storiesTeaser: {
    title: 'Stories of transformation',
    description: 'Featured video and written stories from healthcare professionals on the front lines.',
    featuredStoryIds: ['kenya-video-story', 'india-written-story'],
  },
  featuredEventId: 'heal-week-2026',
  newsletter: {
    title: 'Stay connected',
    description: 'Subscribe to receive updates on programs, events, and stories from the COGI community.',
  },
  donateCta: {
    title: 'Partner with us',
    description:
      'Your generosity equips healthcare professionals worldwide to live and serve missionally. Every gift extends the reach of Communities of Grace.',
    buttonLabel: 'Donate',
  },
}

export const fallbackPrograms: Program[] = [
  {
    id: '1',
    slug: 'kingdom-of-god',
    title: 'Kingdom of God Studies & Seminars',
    summary:
      'Seminars and study platforms that help healthcare professionals develop a Kingdom perspective and cultivate Kingdom-shaped communities.',
    description:
      'Facilitated deeper studies on the perspectives and lifestyles of the Kingdom in healthcare. An introductory one-day seminar with life application, plus Discovery Series for small groups, equips professionals to honor the Lord Jesus in their profession and be a blessing to patients and communities.',
    area: 'Kingdom of God Studies & Seminars',
    experiences: [
      { id: 'kog-seminar', title: 'Kingdom of God Seminar', description: 'One-day introductory seminar on the Kingdom of God in healthcare.', status: 'active' },
      { id: 'kog-discovery', title: 'Discovery Series', description: 'Two series of studies for small groups exploring Kingdom perspectives.', status: 'active' },
    ],
    highlights: ['Kingdom perspective', 'Study platforms', 'Kingdom-shaped communities'],
    audience: 'Healthcare professionals and small groups',
    order: 1,
  },
  {
    id: '2',
    slug: 'missional-training',
    title: 'Missional Healthcare Training',
    summary:
      'Formation experiences that prepare healthcare professionals for faithful participation in God\'s mission through healthcare.',
    description:
      'M-Trail missions taster, Missional Health Course, mentoring, and the future Institute of Missional Healthcare — comprehensive training pathways for healthcare professionals called to mission.',
    area: 'Missional Healthcare Training',
    experiences: [
      { id: 'm-trail', title: 'M-Trail', description: 'One-day missions taster for students and professionals in healthcare.', status: 'active' },
      { id: 'mhc', title: 'Missional Health Course', description: 'Eight-module intense residential or blended course in Missional Healthcare.', status: 'active' },
      { id: 'mentoring', title: 'Mentoring Program', description: 'Intentional mentoring and coaching for those in healthcare.', status: 'active' },
      { id: 'institute', title: 'Institute of Missional Healthcare', description: 'Future institute — placeholder for expanded training.', status: 'development' },
    ],
    highlights: ['M-Trail', 'Missional Health Course', 'Mentoring', 'Formation experiences'],
    audience: 'Students and healthcare professionals',
    order: 2,
  },
  {
    id: '3',
    slug: 'care-for-the-caregiver',
    title: 'Care for the Caregiver',
    summary:
      'Equipping healthcare professionals to navigate the emotional, relational, and vocational demands of caregiving.',
    description:
      'An 8-module group training journey focused on caring for health workers — addressing burnout, spiritual health, and community support so Christian healthcare professionals can thrive in their calling.',
    area: 'Care for the Caregiver',
    experiences: [
      { id: 'c4c-journey', title: '8-Module Journey', description: 'Group training focused on caring for health workers.', status: 'active' },
    ],
    highlights: ['Emotional health', 'Relational support', 'Vocational calling'],
    audience: 'Christian healthcare workers',
    order: 3,
  },
  {
    id: '4',
    slug: 'missional-church-healthcare',
    title: 'Missional Church & Healthcare',
    summary:
      'Enabling church leaders and key healthcare professionals within the church to engage collaboratively in God\'s mission through healthcare.',
    description:
      'One-Day Seminar and HEAL Week — integrating missional church principles with healthcare practice so local churches and healthcare professionals can partner together for Kingdom impact.',
    area: 'Missional Church & Healthcare',
    experiences: [
      { id: 'one-day', title: 'One-Day Seminar', description: 'Seminar on missional church and healthcare integration.', status: 'active' },
      { id: 'heal-week', title: 'HEAL Week', description: 'Intensive week program — under development.', status: 'development' },
    ],
    highlights: ['Church partnership', 'Collaborative mission', 'Healthcare witness'],
    audience: 'Church leaders and healthcare professionals',
    order: 4,
  },
]

export const fallbackTimeline: TimelineMilestone[] = [
  { year: '2013', title: 'A pathway opened', description: 'A medical mission journey to Duncan Hospital in Raxaul, Bihar knit together friendships that would later become COGI.' },
  { year: '2019', title: 'Vision conceived', description: 'Weekly prayer and fellowship among leaders in India and the United States clarified the call: healthcare is sacred vocation.' },
  { year: '2020', title: 'COGI established', description: 'Companions of Grace International was formally launched with a founding board, initial partnerships, and the first Kingdom of God seminars.' },
  { year: '2023', title: 'Global expansion', description: 'Programs expanded across Africa, South Asia, and North America through partnerships with churches and mission networks.' },
  { year: '2026', title: 'Growing fellowship', description: 'More than 500 healthcare professionals equipped across 10+ countries as Communities of Grace continue to grow.' },
]

export const fallbackBeliefs: Belief[] = [
  { id: 'god', title: 'God', content: 'There is one true God, eternally existing in three persons — Father, Son, and Holy Spirit.' },
  { id: 'jesus', title: 'Jesus Christ', content: 'The Son is the living Word who became flesh through miraculous conception and virgin birth. We affirm His full deity and humanity, sinless life, atoning death, resurrection, and ascension.' },
  { id: 'holy-spirit', title: 'Holy Spirit', content: 'The Spirit brings glory to Christ, convicts of sin, accomplishes saving work in those who repent and believe, transforms lives, and empowers believers for witness and service.' },
  { id: 'bible', title: 'The Bible', content: 'The Bible is the fully inspired written Word of God in the 66 books of the Old and New Testaments — unique, authoritative, and the standard for faith and life.' },
  { id: 'salvation', title: 'Salvation', content: 'Restoration to God is possible only through Jesus Christ. Salvation is offered by grace and received by repentance and faith — not earned by human effort.' },
  { id: 'church', title: 'Church', content: 'The Church is the Body of Christ. Endowed with gifts by the Spirit, it glorifies God, makes disciples, and witnesses His redemptive grace to the world.' },
  { id: 'calling', title: 'Calling', content: 'Christ sends each believer to share the good news, make disciples, and love God and neighbor. Healthcare is one of the most strategic missional vocations on earth.' },
]

export const fallbackBoardMembers: TeamMember[] = [
  { id: 'abraham-thomas', name: 'Dr. Abraham Thomas', title: 'Chairman', role: 'board', region: 'North America', country: 'United States', bio: 'Abe is a practicing pediatrician in Northern NJ. After completing medical education in India, he migrated to the US with his wife Ruby. Once empty nesters, God opened a pathway to partner with Mathew in discipleship amongst healthcare workers. He is privileged to serve as Chairman of the COGI Board.', order: 1 },
  { id: 'mathew-george', name: 'Dr. Mathew George', title: 'CEO', role: 'board', region: 'South Asia', country: 'India', bio: 'Mathew is a dentist by profession who worked at Duncan Hospital, a unit of Emmanuel Hospital Association (EHA). He later served as Missions Secretary of EMFI. God called him to form COGI — a missions effort focused on helping healthcare professionals live lives that advance the Kingdom of God.', order: 2 },
  { id: 'charles-faust', name: 'Mr. Charles Faust', title: 'Secretary', role: 'board', region: 'North America', country: 'United States', bio: 'Chuck is a retired business executive having served in chief operating and chief financial roles for multi-national companies. In 2013, God opened a pathway through a medical mission trip to Duncan Hospital where he met Mathew and formed a close Christian brotherhood that led to COGI.', order: 3 },
  { id: 'paul-east', name: 'Mr. Paul East', title: 'Board Member', role: 'board', region: 'North America', country: 'United States', bio: 'Paul supports COGI because healthcare professionals have a unique opportunity to come alongside, care, and witness by action and words. Christian healthcare professionals need training and nurturing to grow in faith, be effective in their profession, and bless their families, patients, and communities.', order: 4 },
  { id: 'sunil-abraham', name: 'Dr. Sunil Abraham', title: 'Board Member', role: 'board', region: 'International', bio: 'Dr. Sunil Abraham supports the work of COGI because of its vision to equip and strengthen the disciples of Christ in healthcare. Healthcare workers need encouragement, fellowship, and a fresh vision to perceive their work beyond their job.', order: 5 },
  { id: 'manoj-jacob', name: 'Dr. Manoj Jacob', title: 'Board Member', role: 'board', region: 'South Asia', country: 'India', bio: 'Dr. Manoj Jacob served as General Secretary of the Evangelical Medical Fellowship of India (EMFI) while Mathew was Managing Director of Duncan Hospital. He joined the Board to lend support as the vision gained momentum — impressed by partnerships and geographical engagements formed in the first year.', order: 6 },
  { id: 'ted-lang', name: 'Ted Lang', title: 'Board Member', role: 'board', region: 'North America', country: 'United States', bio: 'Bio pending. Please update when ministry provides full biography text.', order: 7 },
]

export const fallbackGlobalTeam: TeamMember[] = [
  { id: 'gt-africa', name: 'East Africa team', title: 'Regional facilitators', role: 'global', region: 'Americas & Africa', country: 'Kenya', bio: 'Facilitating programs, mentoring, and Communities of Grace across East Africa.', order: 1 },
  { id: 'gt-asia', name: 'Asia-Pacific team', title: 'Regional facilitators', role: 'global', region: 'Asia-Pacific', country: 'India', bio: 'Coordinating Kingdom of God seminars, missional training, and partnerships across Asia-Pacific.', order: 2 },
  { id: 'gt-americas', name: 'North America team', title: 'Regional coordinators', role: 'global', region: 'Americas & Africa', country: 'United States', bio: 'Supporting board leadership, fellowship, and North American healthcare community engagement.', order: 3 },
]

export const fallbackPartners: Partner[] = [
  { id: 'eha', name: 'Emmanuel Hospital Association (EHA)', description: 'Partner hospital network in India.', url: 'https://www.eha-health.org/', region: 'India', order: 1 },
  { id: 'emfi', name: 'Evangelical Medical Fellowship of India (EMFI)', description: 'Medical missions training and mentoring partner.', url: 'https://www.emfiindia.org/', region: 'India', order: 2 },
  { id: 'duncan', name: 'Duncan Hospital', description: 'Raxaul, Bihar — founding partnership location.', url: 'https://coginternational.org/', region: 'India', order: 3 },
  { id: 'global-advance', name: 'Global Advance', description: 'Mission training and church partnership network.', url: 'https://globaladvance.org/', region: 'International', order: 4 },
  { id: 'healthcare-missions', name: 'Healthcare Missions Network', description: 'Placeholder — upload logo via admin.', region: 'International', order: 5 },
]

export const fallbackStories: Story[] = [
  {
    id: 'kenya-video-story',
    slug: 'kenya-video-story',
    title: 'Communities of Grace in East Africa',
    summary: 'Healthcare professionals in Kenya learning to serve with a Kingdom perspective.',
    type: 'video',
    country: 'Kenya',
    program: 'Missional Healthcare Training',
    featured: true,
    imageUrl: siteImages.kenya,
    videoUrl: siteVideos.kenya,
    content:
      'Through communities of learning, mentoring, and mission, healthcare professionals in Kenya are being equipped to think, live, and work missionally.',
  },
  {
    id: 'india-written-story',
    slug: 'india-written-story',
    title: 'A Kingdom perspective at the bedside',
    summary: 'How Kingdom of God studies are shaping vocation and service in South Asia.',
    type: 'video',
    country: 'India',
    program: 'Kingdom of God Studies & Seminars',
    featured: true,
    imageUrl: siteImages.missionField,
    videoUrl: siteVideos.india,
    content:
      'What began as God knitting hearts together among healthcare leaders has become a growing fellowship. In India, Kingdom of God seminars help professionals develop a perspective that shapes life, vocation, and service.',
  },
]

export const fallbackTestimonials: Testimonial[] = [
  {
    id: 'charles-faust',
    quote:
      'It was in February, 2013 that God opened a pathway to my being a part of this movement. Only a few months earlier I would have scoffed if someone had told me I would shortly be headed to India, but God is amazing!',
    author: 'Mr. Charles Faust',
    role: 'Secretary, COGI Board',
    country: 'United States',
    program: 'Our Story',
    featured: true,
  },
  {
    id: 'paul-east',
    quote:
      'Healthcare professionals have a unique opportunity to come alongside, to care and to witness, by action and words, to persons who are often at critical times in their lives and open to respond to the Good News.',
    author: 'Mr. Paul East',
    role: 'Board Member',
    country: 'United States',
    program: 'Missional Healthcare Training',
    featured: true,
  },
  {
    id: 'sunil-abraham',
    quote: 'COGI provides healthcare workers resources and people who will walk with them in this often hard and lonely journey.',
    author: 'Dr. Sunil Abraham',
    role: 'Board Member',
    program: 'Care for the Caregiver',
    featured: true,
  },
]

export const fallbackBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'communities-of-grace',
    title: 'Cultivating Communities of Grace in healthcare',
    summary: 'How Companions of Grace equips healthcare professionals for Kingdom engagement.',
    content:
      '<p>We are a global fellowship of Christ-followers cultivating Communities of Grace in healthcare. In a rapidly changing global context, we seek to envision, empower, and engage healthcare professionals and communities in creative mission engagement.</p>',
    author: 'COGI',
    category: 'Vision',
    publishedAt: '2026-03-01',
  },
  {
    id: '2',
    slug: 'care-for-the-caregiver',
    title: 'Caring for those who care',
    summary: 'Why emotional, relational, and vocational support matters for healthcare professionals.',
    content:
      '<p>Care for the Caregiver equips healthcare professionals to navigate the demands of caregiving so they can thrive in their calling to serve.</p>',
    author: 'COGI',
    category: 'Programs',
    publishedAt: '2026-02-10',
  },
  {
    id: '3',
    slug: 'kingdom-perspective',
    title: 'A Kingdom perspective that shapes vocation',
    summary: 'Seminars and study platforms helping professionals cultivate Kingdom-shaped communities.',
    content:
      '<p>Kingdom of God Studies &amp; Seminars help healthcare professionals develop a Kingdom perspective and cultivate Kingdom-shaped communities.</p>',
    author: 'COGI',
    category: 'Programs',
    publishedAt: '2026-01-20',
  },
]

export const fallbackEvents: Event[] = [
  {
    id: 'heal-week-2026',
    slug: 'heal-week-2026',
    title: 'HEAL Week 2026',
    summary: 'A week-long immersive experience in missional healthcare — coming soon.',
    description:
      'HEAL Week combines healthcare service, spiritual formation, and community engagement in a week-long immersive experience. Participants will work alongside local healthcare teams, engage in daily devotion and reflection, and explore what it means to be on mission in a cross-cultural setting. Registration opens soon.',
    startDate: '2026-06-15',
    endDate: '2026-06-21',
    venue: 'TBD',
    location: 'East Africa',
    category: 'Immersive Experience',
    featured: true,
  },
  {
    id: 'kog-seminar-nj-2026',
    slug: 'kog-seminar-nj-2026',
    title: 'Kingdom of God Seminar — New Jersey',
    summary: 'A one-day seminar on the Kingdom of God in the context of healthcare.',
    description:
      'Join healthcare professionals for an introductory seminar on developing a Kingdom perspective that shapes life, vocation, and service.',
    startDate: '2026-03-22',
    venue: 'Northern New Jersey',
    location: 'United States',
    category: 'Seminar',
    registrationUrl: '/get-involved',
    featured: false,
  },
  {
    id: 'c4c-cohort-online-2026',
    slug: 'c4c-cohort-online-2026',
    title: 'Care for the Caregiver — Online Cohort',
    summary: '8-module virtual cohort for healthcare workers worldwide.',
    description:
      'This facilitated online cohort walks through all eight Care for the Caregiver modules with weekly sessions, small-group breakout rooms, and prayer partner matching.',
    startDate: '2026-04-05',
    endDate: '2026-06-07',
    venue: 'Virtual',
    location: 'Global',
    category: 'Training',
    registrationUrl: '/get-involved',
    featured: false,
  },
]

export const fallbackLocations: Location[] = [
  { id: 'us', country: 'United States', region: 'Americas & Africa', summary: 'Board leadership and North American healthcare fellowship.', programs: ['Kingdom of God Studies & Seminars', 'Care for the Caregiver'], lat: 40.7128, lng: -74.006 },
  { id: 'ug', country: 'Uganda', region: 'Americas & Africa', summary: 'Healthcare professional fellowship and formation experiences.', programs: ['Missional Healthcare Training'], lat: 1.3733, lng: 32.2903 },
  { id: 'ke', country: 'Kenya', region: 'Americas & Africa', summary: 'Missional healthcare training and Communities of Grace.', programs: ['Missional Healthcare Training', 'Care for the Caregiver'], lat: -0.0236, lng: 37.9062 },
  { id: 'rw', country: 'Rwanda', region: 'Americas & Africa', summary: 'Workshops and companionship among healthcare professionals.', programs: ['Missional Healthcare Training'], lat: -1.9403, lng: 29.8739 },
  { id: 'tz', country: 'Tanzania', region: 'Americas & Africa', summary: 'Formation experiences and Kingdom engagement in healthcare.', programs: ['Missional Healthcare Training'], lat: -6.369, lng: 34.8888 },
  { id: 'in', country: 'India', region: 'Asia-Pacific', summary: 'Primary ministry hub including Duncan Hospital, Bihar, and Kingdom of God seminars.', programs: ['Kingdom of God Studies & Seminars', 'Missional Church & Healthcare'], lat: 26.9784, lng: 84.8528 },
  { id: 'ph', country: 'Philippines', region: 'Asia-Pacific', summary: 'Medical missions and Kingdom of God seminars.', programs: ['Kingdom of God Studies & Seminars'], lat: 12.8797, lng: 121.774 },
  { id: 'sg', country: 'Singapore', region: 'Asia-Pacific', summary: 'Regional gathering point for Asia-Pacific healthcare professionals.', programs: ['Missional Healthcare Training'], lat: 1.3521, lng: 103.8198 },
  { id: 'au', country: 'Australia', region: 'Asia-Pacific', summary: 'Missional healthcare networking and formation.', programs: ['Care for the Caregiver'], lat: -25.2744, lng: 133.7751 },
  { id: 'nz', country: 'New Zealand', region: 'Asia-Pacific', summary: 'Fellowship and training among healthcare professionals.', programs: ['Care for the Caregiver'], lat: -40.9006, lng: 174.886 },
]

export const fallbackFAQs: FAQ[] = [
  {
    id: '1',
    question: 'What is Companions of Grace International?',
    answer: 'COGI is a global fellowship cultivating Communities of Grace among healthcare professionals, equipping them to think, live, and work missionally.',
    category: 'general',
  },
  {
    id: '2',
    question: 'How can I express interest in a program?',
    answer: 'Visit any program page and click Express Interest, or use the contact form selecting your program of interest.',
    category: 'programs',
  },
  {
    id: '3',
    question: 'How do I donate to COGI?',
    answer: 'Visit our Donate page to give one-time or recurring gifts through our secure GiveLively integration.',
    category: 'donate',
  },
  {
    id: '4',
    question: 'Where should I mail a check?',
    answer: 'Companions of Grace International · Northern New Jersey, United States. Email info@coginternational.org for mailing details.',
    category: 'donate',
  },
]

export const fallbackLegalPages: LegalPage[] = [
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    lastUpdated: '2026-01-01',
    content: `<p>Companions of Grace International ("COGI," "we," "us") respects your privacy. This policy describes how we collect, use, and protect personal information when you visit coginternational.org or submit forms on our website.</p>
<h2>Information We Collect</h2>
<p>We collect information you provide directly — such as name, email address, phone/WhatsApp number, and message content when you submit contact, newsletter, or get-involved forms.</p>
<h2>How We Use Information</h2>
<p>We use your information to respond to enquiries, send newsletters you have opted into, process program registrations, and improve our services. We do not sell your personal data.</p>
<h2>Cookies</h2>
<p>We use essential cookies for site functionality. See our Cookie Notice for details.</p>
<h2>Contact</h2>
<p>Questions about this policy: info@coginternational.org</p>`,
  },
  {
    slug: 'terms-of-use',
    title: 'Terms of Use',
    lastUpdated: '2026-01-01',
    content: `<p>By accessing coginternational.org, you agree to these Terms of Use. Content on this site is provided for informational purposes about Companions of Grace International's ministry.</p>
<h2>Use of Content</h2>
<p>Text, images, and media are owned by COGI or used with permission. You may not reproduce materials for commercial purposes without written consent.</p>
<h2>External Links</h2>
<p>Our site links to partner organizations and donation platforms. We are not responsible for third-party content or privacy practices.</p>
<h2>Disclaimer</h2>
<p>Program dates, locations, and offerings are subject to change. We strive for accuracy but make no warranties about completeness or timeliness.</p>`,
  },
  {
    slug: 'cookie-notice',
    title: 'Cookie Notice',
    lastUpdated: '2026-01-01',
    content: `<p>This website uses cookies — small text files stored on your device — to ensure proper functionality and improve your experience.</p>
<h2>Essential Cookies</h2>
<p>Required for navigation, form security, and accessibility preferences. These cannot be disabled.</p>
<h2>Analytics</h2>
<p>We may use privacy-respecting analytics to understand how visitors use our site. No personally identifiable information is shared with advertisers.</p>
<h2>Managing Cookies</h2>
<p>You can control cookies through your browser settings. Disabling essential cookies may affect site functionality.</p>`,
  },
  {
    slug: 'accessibility',
    title: 'Accessibility Statement',
    lastUpdated: '2026-01-01',
    content: `<p>Companions of Grace International is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant WCAG 2.1 AA standards.</p>
<h2>Measures We Support</h2>
<ul>
<li>Skip-to-content navigation</li>
<li>Keyboard-accessible menus and forms</li>
<li>Sufficient color contrast ratios</li>
<li>Reduced-motion support for animations</li>
<li>Descriptive alt text for images</li>
<li>Semantic HTML structure</li>
</ul>
<h2>Feedback</h2>
<p>If you encounter accessibility barriers on our site, please contact info@coginternational.org. We aim to respond within five business days.</p>`,
  },
]
