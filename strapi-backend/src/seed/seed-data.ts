/**
 * COGI seed data derived from requirements-mapping.md and coginternational.org
 */

export const globalSettingData = {
  organizationName: 'Companions of Grace International',
  tagline: 'Equipping Healthcare Professionals for Kingdom Engagement',
  primaryEmail: 'info@coginternational.org',
  phone: '',
  address: 'Northern New Jersey, USA',
  vision:
    'The Global Christian Healthcare Community actively on Mission for God, reflecting His love, witnessing Christ in word and deed, ushering in God\'s Kingdom.',
  mission:
    'Inspire and enable transformation so healthcare professionals think, live, and work missionally.',
  scriptureReferences: 'Colossians 3:17 · Romans 12:2',
  social: {
    instagram: 'https://instagram.com/coginternational',
    facebook: 'https://facebook.com/coginternational',
    linkedin: 'https://linkedin.com/company/coginternational',
    youtube: 'https://youtube.com/@coginternational',
  },
  defaultSeo: {
    metaTitle: 'COGI – Companions of Grace International',
    metaDescription:
      'Equipping healthcare professionals for Kingdom engagement through training, community, and missional healthcare programs worldwide.',
    keywords: 'COGI, healthcare missions, missional healthcare, Christian healthcare',
  },
  cookieNotice:
    '<p>We use cookies to improve your experience on our website. By continuing to browse, you agree to our use of cookies.</p>',
  maintenanceMode: false,
};

export const homepageData = {
  seo: {
    metaTitle: 'COGI – Equipping Healthcare Professionals for Kingdom Engagement',
    metaDescription:
      'Companions of Grace International cultivates Communities of Grace among healthcare professionals worldwide.',
  },
  heroSlides: [
    {
      title: 'Welcome to Companions of Grace International',
      subtitle: 'Equipping Healthcare Professionals for Kingdom Engagement',
      description:
        'A global fellowship cultivating Communities of Grace in healthcare — inspiring transformation so professionals think, live, and work missionally.',
      cta: { label: 'Explore Our Programs', url: '/programs', variant: 'primary' },
    },
    {
      title: 'Communities of Grace in Healthcare',
      subtitle: 'Enable · Train · Support',
      description:
        'Join a movement of Christian healthcare professionals advancing the Kingdom of God through word and deed.',
      cta: { label: 'Get Involved', url: '/get-involved', variant: 'primary' },
    },
  ],
  missionHeading: 'Our Mission',
  missionText:
    '<p>Inspire and enable transformation so healthcare professionals think, live, and work missionally — reflecting God\'s love and ushering in His Kingdom in every place they serve.</p>',
  missionScripture: 'Colossians 3:17 · Romans 12:2',
  videoUrl: '',
  videoHeading: 'Watch Our Story',
  methods: [
    {
      title: 'Enable',
      description:
        'Inspire healthcare professionals to perceive their work beyond their job — understanding the times and God\'s calling wherever He has placed them.',
      icon: 'enable',
    },
    {
      title: 'Train',
      description:
        'Equip disciples through seminars, courses, and mentoring so they grow in faith, excel in their profession, and bless patients and communities.',
      icon: 'train',
    },
    {
      title: 'Support',
      description:
        'Walk alongside healthcare workers in fellowship, encouragement, and community — resources and people for the often hard and lonely journey.',
      icon: 'support',
    },
  ],
  impactStats: [
    { value: '10', suffix: '+', label: 'Countries' },
    { value: '500', suffix: '+', label: 'Healthcare Professionals' },
    { value: '30', suffix: '+', label: 'Programs' },
    { value: '∞', label: 'Communities of Grace' },
  ],
  portfolioAreas: [
    {
      title: 'Kingdom of God',
      description: 'Seminar and Discovery Series on the Kingdom of God in healthcare.',
      slug: 'kingdom-of-god',
      cta: { label: 'Learn More', url: '/programs/kingdom-of-god' },
    },
    {
      title: 'Missional Training',
      description: 'M-Trail, Missional Health Course, and mentoring for healthcare professionals.',
      slug: 'missional-training',
      cta: { label: 'Learn More', url: '/programs/missional-training' },
    },
    {
      title: 'Care for the Caregiver',
      description: '8-module group training journey focused on caring for health workers.',
      slug: 'care-for-the-caregiver',
      cta: { label: 'Learn More', url: '/programs/care-for-the-caregiver' },
    },
    {
      title: 'Missional Church & Healthcare',
      description: 'One-Day Seminar and HEAL Week — integrating church and healthcare mission.',
      slug: 'missional-church-healthcare',
      cta: { label: 'Learn More', url: '/programs/missional-church-healthcare' },
    },
  ],
  storiesIntro:
    '<p>Stories of transformation from healthcare professionals around the world who have been equipped and sent on mission for God.</p>',
  newsletter: {
    heading: 'Stay Connected',
    description: 'Subscribe to receive updates on programs, events, and stories from the COGI community.',
    showWhatsApp: true,
  },
  sectionVisibility: {
    hero: true,
    mission: true,
    video: true,
    methods: true,
    impact: true,
    portfolio: true,
    map: true,
    stories: true,
    events: true,
    newsletter: true,
  },
  sectionOrder: [
    'hero',
    'mission',
    'video',
    'methods',
    'impact',
    'portfolio',
    'map',
    'stories',
    'events',
    'newsletter',
  ],
};

export const programsData = [
  {
    title: 'Kingdom of God',
    slug: 'kingdom-of-god',
    summary:
      'An introductory one-day seminar on the Kingdom of God with life application in the context of healthcare, plus Discovery Series for small groups.',
    area: 'kingdom-of-god',
    order: 1,
    featured: true,
    experiences: [
      { title: 'Kingdom of God Seminar', description: 'One-day introductory seminar on the Kingdom of God in healthcare.' },
      { title: 'Discovery Series', description: 'Two series of studies for small groups exploring Kingdom perspectives.' },
    ],
    body: '<p>Facilitated deeper studies on the Perspectives and Lifestyles of the Kingdom in Healthcare. What began as the Kingdom of God in Healthcare program equips professionals to honor the Lord Jesus in their profession and be a blessing to patients and communities.</p>',
    cta: { label: 'Express Interest', url: '/contact?program=kingdom-of-god', variant: 'primary' },
  },
  {
    title: 'Missional Training',
    slug: 'missional-training',
    summary:
      'M-Trail missions taster, Missional Health Course, mentoring, and the future Institute of Missional Healthcare.',
    area: 'missional-training',
    order: 2,
    featured: true,
    experiences: [
      { title: 'M-Trail', description: 'One-day missions taster for students and professionals in healthcare.' },
      { title: 'Missional Health Course', description: 'Eight-module intense residential or blended course in Missional Healthcare.' },
      { title: 'Mentoring Program', description: 'Intentional mentoring and coaching for those in healthcare.' },
      { title: 'Institute of Missional Healthcare', description: 'Future institute — placeholder for expanded training.' },
    ],
    body: '<p>A two-week group internship in Missional Healthcare and comprehensive training pathways for healthcare professionals called to mission.</p>',
    cta: { label: 'Express Interest', url: '/contact?program=missional-training', variant: 'primary' },
  },
  {
    title: 'Care for the Caregiver (C4C)',
    slug: 'care-for-the-caregiver',
    summary:
      'An 8-module group training program focused on equipping Christian healthcare workers to care for themselves and one another.',
    area: 'care-for-caregiver',
    order: 3,
    featured: true,
    experiences: [
      { title: '8-Module Journey', description: 'Group training focused on caring for health workers.' },
    ],
    body: '<p>This 8-lesson group training program equips Christian healthcare professionals to thrive in their calling — addressing burnout, spiritual health, and community support.</p>',
    cta: { label: 'Express Interest', url: '/contact?program=care-for-the-caregiver', variant: 'primary' },
  },
  {
    title: 'Missional Church & Healthcare',
    slug: 'missional-church-healthcare',
    summary:
      'One-Day Seminar and HEAL Week — integrating missional church principles with healthcare practice (under development).',
    area: 'missional-church-healthcare',
    order: 4,
    featured: false,
    experiences: [
      { title: 'One-Day Seminar', description: 'Seminar on missional church and healthcare integration.' },
      { title: 'HEAL Week', description: 'Intensive week program — under development.' },
    ],
    body: '<p>Exploring how local churches and healthcare professionals can partner together for Kingdom impact in their communities.</p>',
    cta: { label: 'Express Interest', url: '/contact?program=missional-church-healthcare', variant: 'primary' },
  },
];

export const teamMembersData = [
  {
    name: 'Dr. Abraham Thomas',
    slug: 'abraham-thomas',
    title: 'Chairman',
    role: 'board',
    region: 'North America',
    order: 1,
    shortBio: 'A practicing pediatrician in Northern NJ. After completing medical education in India, Abe has served in leadership and discipleship for decades.',
    bio: '<p>Abe is a practicing pediatrician in Northern NJ. After completing medical education in India, he migrated to the US with his wife Ruby. Once empty nesters, God opened a pathway to partner with Mathew in discipleship amongst healthcare workers. He is privileged to serve as Chairman of the COGI Board.</p>',
    publicVisibility: true,
  },
  {
    name: 'Dr. Mathew George',
    slug: 'mathew-george',
    title: 'CEO',
    role: 'board',
    region: 'South Asia',
    order: 2,
    shortBio: 'Dentist by profession; former Managing Director of Duncan Hospital, Raxaul, Bihar, India (EHA).',
    bio: '<p>Mathew is a Dentist by profession who worked at Duncan Hospital, a unit of Emmanuel Hospital Association (EHA). He later served as Missions Secretary of EMFI. God called him to form COGI — a missions effort focused on helping healthcare professionals live lives that advance the Kingdom of God.</p>',
    publicVisibility: true,
  },
  {
    name: 'Mr. Charles Faust',
    slug: 'charles-faust',
    title: 'Secretary',
    role: 'board',
    region: 'North America',
    order: 3,
    shortBio: 'Retired business executive; served in COO and CFO roles for multinational companies.',
    bio: '<p>Chuck is a retired business executive having served in chief operating and chief financial roles for multi-national companies. In 2013, God opened a pathway through a medical mission trip to Duncan Hospital where he met Mathew and formed a close Christian brotherhood that led to COGI.</p>',
    publicVisibility: true,
  },
  {
    name: 'Mr. Paul East',
    slug: 'paul-east',
    title: 'Board Member',
    role: 'board',
    region: 'North America',
    order: 4,
    shortBio: 'Committed to equipping healthcare professionals for unique opportunities to witness.',
    bio: '<p>Paul supports COGI because healthcare professionals have a unique opportunity to come alongside, care, and witness by action and words. Christian healthcare professionals need training and nurturing to grow in faith, be effective in their profession, and bless their families, patients, and communities.</p>',
    publicVisibility: true,
  },
  {
    name: 'Dr. Sunil Abraham',
    slug: 'sunil-abraham',
    title: 'Board Member',
    role: 'board',
    region: 'International',
    order: 5,
    shortBio: 'Supports equipping disciples of Christ in healthcare to follow Him and serve as communities.',
    bio: '<p>Dr. Sunil Abraham supports the work of COG because of its vision to equip and strengthen the disciples of Christ in healthcare. Healthcare workers need encouragement, fellowship, and a fresh vision to perceive their work beyond their job.</p>',
    publicVisibility: true,
  },
  {
    name: 'Dr. Manoj Jacob',
    slug: 'manoj-jacob',
    title: 'Board Member',
    role: 'board',
    region: 'South Asia',
    order: 6,
    shortBio: 'Former General Secretary of EMFI; advisor and encourager in the COGI journey.',
    bio: '<p>Dr. Manoj Jacob served as General Secretary of the Evangelical Medical Fellowship of India (EMFI) while Mathew was Managing Director of Duncan Hospital. He joined the Board to lend support as the vision gained momentum — impressed by partnerships and geographical engagements formed in the first year.</p>',
    publicVisibility: true,
  },
  {
    name: 'Ted Lang',
    slug: 'ted-lang',
    title: 'Board Member',
    role: 'board',
    region: 'North America',
    order: 7,
    shortBio: 'Bio pending — placeholder until ministry provides text.',
    bio: '<p>Bio pending. Please update when ministry provides full biography text.</p>',
    publicVisibility: true,
  },
];

export const partnersData = [
  { name: 'Emmanuel Hospital Association (EHA)', slug: 'eha', region: 'India', order: 1, url: 'https://www.eha-health.org/', description: 'Partner hospital network in India.' },
  { name: 'Evangelical Medical Fellowship of India (EMFI)', slug: 'emfi', region: 'India', order: 2, url: 'https://www.emfiindia.org/', description: 'Medical missions training and mentoring partner.' },
  { name: 'Duncan Hospital', slug: 'duncan-hospital', region: 'India', order: 3, url: 'https://coginternational.org/', description: 'Raxaul, Bihar — founding partnership location.' },
  { name: 'Global Advance', slug: 'global-advance', region: 'International', order: 4, url: 'https://globaladvance.org/', description: 'Mission training and church partnership network.' },
  { name: 'Healthcare Missions Network', slug: 'healthcare-missions', region: 'International', order: 5, description: 'Placeholder — upload logo via admin.' },
];

export const testimonialsData = [
  {
    author: 'Mr. Charles Faust',
    authorTitle: 'Secretary, COGI Board',
    quote: '<p>It was in February, 2013 that God opened a pathway to my being a part of this movement. Only a few months earlier I would have scoffed if someone had told me I would shortly be headed to India, but God is amazing!</p>',
    mediaType: 'written',
    country: 'United States',
    featured: true,
  },
  {
    author: 'Mr. Paul East',
    authorTitle: 'Board Member',
    quote: '<p>Healthcare professionals have a unique opportunity to come alongside, to care and to witness, by action and words, to persons who are often at critical times in their lives and open to respond to the Good News.</p>',
    mediaType: 'written',
    country: 'United States',
    featured: true,
  },
  {
    author: 'Dr. Sunil Abraham',
    authorTitle: 'Board Member',
    quote: '<p>COG provides healthcare workers resources and people who will walk with them in this often hard and lonely journey.</p>',
    mediaType: 'written',
    featured: false,
  },
];

export const locationsData = [
  { country: 'India', region: 'South Asia', summary: 'Primary ministry hub including Duncan Hospital, Bihar.', latitude: 26.9784, longitude: 84.8528, featured: true },
  { country: 'United States', region: 'North America', summary: 'Board leadership and North American healthcare community.', latitude: 40.7128, longitude: -74.006, featured: true },
  { country: 'Nepal', region: 'South Asia', summary: 'Healthcare missions and training partnerships.', latitude: 28.3949, longitude: 84.124, featured: true },
  { country: 'Kenya', region: 'East Africa', summary: 'Missional healthcare training and community engagement.', latitude: -0.0236, longitude: 37.9062, featured: true },
  { country: 'Uganda', region: 'East Africa', summary: 'Healthcare professional fellowship and training.', latitude: 1.3733, longitude: 32.2903, featured: false },
  { country: 'Philippines', region: 'Southeast Asia', summary: 'Medical missions and Kingdom of God seminars.', latitude: 12.8797, longitude: 121.774, featured: false },
  { country: 'United Kingdom', region: 'Europe', summary: 'Healthcare professional community and support.', latitude: 55.3781, longitude: -3.436, featured: false },
  { country: 'Australia', region: 'Oceania', summary: 'Missional healthcare networking.', latitude: -25.2744, longitude: 133.7751, featured: false },
  { country: 'Canada', region: 'North America', summary: 'Training and fellowship for healthcare professionals.', latitude: 56.1304, longitude: -106.3468, featured: false },
  { country: 'South Africa', region: 'Southern Africa', summary: 'Healthcare missions and community development.', latitude: -30.5595, longitude: 22.9375, featured: false },
  { country: 'Nigeria', region: 'West Africa', summary: 'Missional training and church-healthcare partnerships.', latitude: 9.082, longitude: 8.6753, featured: false },
];

export const navigationMenusData = [
  {
    name: 'Main Header Navigation',
    slug: 'main-header',
    location: 'header',
    items: [
      {
        label: 'About Us',
        url: '/about',
        children: [
          { label: 'Our Story', url: '/about/our-story' },
          { label: 'Board Members', url: '/about/board' },
          { label: 'Global Team', url: '/about/global-team' },
          { label: 'Vision & Mission', url: '/about' },
          { label: 'Our Beliefs', url: '/about/beliefs' },
          { label: 'Our Partners', url: '/about/partners' },
        ],
      },
      { label: 'Programs', url: '/programs' },
      {
        label: 'Resources',
        url: '/resources',
        children: [
          { label: 'Stories', url: '/resources/stories' },
          { label: 'Testimonials', url: '/resources/testimonials' },
          { label: 'Blog', url: '/resources/blog' },
        ],
      },
      { label: 'Get Involved', url: '/get-involved' },
      { label: 'Donate', url: '/donate' },
      { label: 'Contact', url: '/contact' },
    ],
  },
  {
    name: 'Footer Navigation',
    slug: 'footer-main',
    location: 'footer',
    items: [
      { label: 'About', url: '/about' },
      { label: 'Programs', url: '/programs' },
      { label: 'Resources', url: '/resources' },
      { label: 'Events', url: '/events' },
      { label: 'Contact', url: '/contact' },
      { label: 'Privacy Policy', url: '/privacy-policy' },
      { label: 'Terms of Use', url: '/terms-of-use' },
    ],
  },
];

export const headerSettingData = {
  sticky: true,
  showDonateCta: true,
  donateCta: { label: 'Donate', url: '/donate', variant: 'donate' },
  contactCta: { label: 'Contact', url: '/contact', variant: 'outline' },
};

export const footerSettingData = {
  aboutText:
    'Companions of Grace International equips healthcare professionals for Kingdom engagement through training, community, and mission.',
  copyrightText: 'Companions of Grace International. All rights reserved.',
  newsletterHeading: 'Subscribe to Our Newsletter',
  showNewsletter: true,
  social: globalSettingData.social,
  contactInfo: {
    email: 'info@coginternational.org',
    address: 'Northern New Jersey, USA',
  },
  legalLinks: [
    { label: 'Privacy Policy', url: '/privacy-policy' },
    { label: 'Terms of Use', url: '/terms-of-use' },
    { label: 'Cookie Notice', url: '/cookie-notice' },
    { label: 'Accessibility', url: '/accessibility' },
  ],
};

export const timelineMilestonesData = [
  { year: '2019', title: 'Vision Born', description: 'Mathew George senses God\'s call to equip healthcare professionals for Kingdom engagement.' },
  { year: '2020', title: 'COGI Founded', description: 'Companions of Grace International formally established with founding board members.' },
  { year: '2023', title: 'Global Expansion', description: 'Programs launched across multiple countries with growing partnerships.' },
  { year: '2026', title: 'Website Revamp', description: 'New digital platform to equip and connect the global healthcare community.' },
];

export const faqsData = [
  {
    question: 'What is Companions of Grace International?',
    answer: '<p>COGI is a global fellowship cultivating Communities of Grace among healthcare professionals, equipping them to think, live, and work missionally.</p>',
    category: 'general',
    order: 1,
  },
  {
    question: 'How can I express interest in a program?',
    answer: '<p>Visit any program page and click "Express Interest" or use the contact form selecting your program of interest.</p>',
    category: 'programs',
    order: 2,
  },
  {
    question: 'How do I donate to COGI?',
    answer: '<p>Visit our Donate page to give one-time or recurring gifts through our secure GiveLively integration.</p>',
    category: 'donate',
    order: 3,
  },
];
