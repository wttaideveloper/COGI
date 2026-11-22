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
} from './publicTypes'
import { siteVideos } from './siteCopy'

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
    title: 'Healthcare that reaches people',
    description:
      'Volunteer doctors and nurses bringing free care, medicine, and hope to families who often cannot reach a clinic.',
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
    { id: 'patients', value: '1,000+', label: 'Patients served through partners' },
    { id: 'volunteers', value: '200+', label: 'Volunteers & facilitators mobilized' },
    { id: 'countries', value: '10+', label: 'Countries engaged' },
    { id: 'professionals', value: '500+', label: 'Healthcare professionals equipped' },
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
    "id": "1",
    "slug": "kingdom-of-god",
    "title": "Discover the Kingdom of God",
    "summary": "Formational studies that reshape how you see, serve, and shape healthcare.",
    "description": "The Kingdom of God Program is a progressive formational journey that helps you align your life, calling, and service with God’s grand narrative.",
    "area": "Discover the Kingdom of God",
    "order": 1,
    "audience": "Healthcare students and professionals",
    "highlights": [],
    "experiences": [
      {
        "id": "kog-seminar",
        "title": "Kingdom of God Seminar",
        "description": "A focused one-day or two-session formation experience introducing the biblical narrative of the Kingdom of God and its implications for life, calling, and healthcare praxis",
        "status": "active"
      },
      {
        "id": "kog-discovery",
        "title": "Discovery Series",
        "description": "A three-series small group study exploring Jesus’ teachings on the Kingdom of God, integral health and healing, and compassionate care.",
        "status": "active"
      }
    ]
  },
  {
    "id": "2",
    "slug": "missional-training",
    "title": "Missional Healthcare Courses",
    "summary": "Missional trainings that shape you for Kingdom engagement.",
    "description": "The Missional Training Program helps healthcare students and professionals discern their place within God’s mission in the world. Grounded in Scripture, it invites you to see healthcare as missional.",
    "area": "Missional Healthcare Courses",
    "order": 2,
    "audience": "Healthcare students and professionals",
    "highlights": [],
    "experiences": [
      {
        "id": "m-trail",
        "title": "M-Trail",
        "description": "An immersive internship that places healthcare students in real-world missional settings, with mentorship and community engagement.",
        "status": "active"
      },
      {
        "id": "mhc",
        "title": "Missional Health Course",
        "description": "A five-day residential training program that invites you to see your life and healthcare calling within the bigger picture of God’s mission in the world.",
        "status": "active"
      }
    ]
  },
  {
    "id": "3",
    "slug": "care-for-the-caregiver",
    "title": "Care for the Caregiver",
    "summary": "Trainings and workshops that equip you to navigate the emotional, relational, and vocational challenges of caregiving.",
    "description": "Caregivers need care too. Those who devote themselves to caring for others often find it difficult to receive care themselves. The demands of caregiving can take a toll on emotional, relational, and personal well-being.",
    "area": "Care for the Caregiver",
    "order": 3,
    "audience": "Healthcare students and professionals",
    "highlights": [],
    "experiences": [
      {
        "id": "c4c-journey",
        "title": "Eight-module journey",
        "description": "Develop Christ-centered resilience and relational wisdom to navigate life at work, at home, and in your community, caring for yourself and other caregivers.",
        "status": "active"
      }
    ]
  },
  {
    "id": "4",
    "slug": "missional-church-healthcare",
    "title": "The Church and Missional Healthcare",
    "summary": "Seminars and programs envisioning church leaders and healthcare professionals for collaborative, missional engagement.",
    "description": "Equipping church leaders and healthcare workers to embrace healthcare as a vital expression of God’s redemptive work in the world.",
    "area": "The Church and Missional Healthcare",
    "order": 4,
    "audience": "Church leaders and healthcare professionals",
    "highlights": [],
    "experiences": [
      {
        "id": "heal-seminar",
        "title": "HEAL Seminars",
        "description": "An eight-hour seminar helping church leaders rediscover healthcare as an integral expression of the Church’s mission.",
        "status": "active"
      },
      {
        "id": "heal-week",
        "title": "HEAL Week",
        "description": "An annual church initiative celebrating and commissioning healthcare professionals. Get in touch to learn about this initiative as it develops.",
        "status": "development"
      }
    ]
  }
]

export const fallbackTimeline: TimelineMilestone[] = [
  {
    "year": "2020",
    "title": "Genesis",
    "description": "COGI takes shape as a focused initiative for missional healthcare and Kingdom living."
  },
  {
    "year": "2023",
    "title": "Feet on the Ground",
    "description": "The vision hits the ground. New places. New people. New partnerships. A growing movement begins to take shape beyond India."
  },
  {
    "year": "2026",
    "title": "Crossing Borders",
    "description": "The movement goes global—crossing different countries, spanning cultures and building communities of healthcare professionals, having a shared vision and calling for missional engagement."
  }
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
  { id: 'gt-africa', name: 'East Africa team', title: 'Regional facilitators', role: 'global-team', region: 'Americas & Africa', country: 'Kenya', bio: 'Facilitating programs, mentoring, and Communities of Grace across East Africa.', order: 1 },
  { id: 'gt-asia', name: 'Asia-Pacific team', title: 'Regional facilitators', role: 'global-team', region: 'Asia-Pacific', country: 'India', bio: 'Coordinating Kingdom of God seminars, missional training, and partnerships across Asia-Pacific.', order: 2 },
  { id: 'gt-americas', name: 'North America team', title: 'Regional coordinators', role: 'global-team', region: 'Americas & Africa', country: 'United States', bio: 'Supporting board leadership, fellowship, and North American healthcare community engagement.', order: 3 },
]

export const fallbackPartners: Partner[] = [
  {
    "id": "capro",
    "name": "CAPRO",
    "description": "",
    "order": 1,
    "logoUrl": "/images/partners/capro.png",
    "url": "https://capromissions.org"
  },
  {
    "id": "tms-global",
    "name": "TMS Global",
    "description": "",
    "order": 2,
    "logoUrl": "/images/partners/tms-global.png",
    "url": "https://www.tms-global.org/"
  },
  {
    "id": "nurses-christian-fellowship-international",
    "name": "Nurses Christian Fellowship International",
    "description": "",
    "order": 3,
    "logoUrl": "/images/partners/ncfi.png",
    "url": "https://ncfi.org"
  },
  {
    "id": "lifespring-church-idaho",
    "name": "LifeSpring Church, Idaho",
    "description": "",
    "order": 4,
    "logoUrl": "/images/partners/lifespring.png",
    "url": "https://mylifespringchurch.org/"
  },
  {
    "id": "the-methodist-church-ghana",
    "name": "The Methodist Church Ghana",
    "description": "",
    "order": 5,
    "logoUrl": "/images/partners/methodist-ghana.png",
    "url": "https://website.methodistchurch.org.gh/"
  },
  {
    "id": "global-methodist-church",
    "name": "Global Methodist Church",
    "description": "",
    "order": 6,
    "logoUrl": "/images/partners/global-methodist.png",
    "url": "https://globalmethodist.org"
  },
  {
    "id": "cmf-ghana",
    "name": "CMF Ghana",
    "description": "",
    "order": 7,
    "logoUrl": "/images/partners/cmf.png"
  },
  {
    "id": "cmf-tanzania",
    "name": "CMF Tanzania",
    "description": "",
    "order": 8
  },
  {
    "id": "cmf-uganda",
    "name": "CMF Uganda",
    "description": "",
    "order": 9
  },
  {
    "id": "cmf-kenya",
    "name": "CMF Kenya",
    "description": "",
    "order": 10
  },
  {
    "id": "portico-church-charlottesville",
    "name": "Portico Church, Charlottesville",
    "description": "",
    "order": 11,
    "logoUrl": "/images/partners/portico.png",
    "url": "https://porticocville.org"
  },
  {
    "id": "healthcare-christian-fellowship-international",
    "name": "Healthcare Christian Fellowship International",
    "description": "",
    "order": 12,
    "logoUrl": "/images/partners/hcfi.png",
    "url": "https://www.hcfglobal.org/"
  }
]

export const fallbackStories: Story[] = [
  {
    "id": "kenya-video-story",
    "slug": "kenya-video-story",
    "title": "Communities of Grace in East Africa",
    "summary": "Healthcare professionals in Kenya learning to serve with a Kingdom perspective.",
    "type": "video",
    "country": "Kenya",
    "program": "Missional Healthcare Courses",
    "featured": true,
    "imageUrl": "/images/cogi-kenya.png",
    "videoUrl": "/videos/kenya-story.mp4",
    "content": "Through communities of learning, mentoring, and mission, healthcare professionals in Kenya are being equipped to think, live, and work missionally."
  },
  {
    "id": "india-written-story",
    "slug": "india-written-story",
    "title": "A Kingdom perspective at the bedside",
    "summary": "How Kingdom of God studies are shaping vocation and service in South Asia.",
    "type": "video",
    "country": "India",
    "program": "Discover the Kingdom of God",
    "featured": true,
    "imageUrl": "/images/cogi-india.png",
    "videoUrl": "/videos/india-story.mp4",
    "content": "What began as God knitting hearts together among healthcare leaders has become a growing fellowship. In India, Kingdom of God seminars help professionals develop a perspective that shapes life, vocation, and service."
  },
  {
    "id": "stella-osorio-story",
    "slug": "stella-osorio-story",
    "title": "Caregivers need care too",
    "summary": "The Care for the Caregiver (C4C) Program helps create a safe space for reflection, emotional renewal, and spiritual strengthening.",
    "content": "The Care for the Caregiver (C4C) Program helps create a safe space for reflection, emotional renewal, and spiritual strengthening. Through practical sessions on listening, communication, caring for the grieving, resilience, and Christ-centered caregiving, it equips us with valuable tools to care for ourselves and others more effectively. A deeply enriching and transformative experience that affirms the vital importance of caring for caregivers.\n\n— Stella Osorio",
    "type": "written",
    "country": "Singapore",
    "program": "Care for the Caregiver",
    "featured": true,
    "imageUrl": "/images/cogi-support.png"
  },
  {
    "id": "abhilash-pappala-story",
    "slug": "abhilash-pappala-story",
    "title": "Seeing life through a Kingdom lens",
    "summary": "Kingdom of God studies have transformed the way I understand and live my faith.",
    "content": "Kingdom of God studies have transformed the way I understand and live my faith. They led me to genuine repentance and a deeper understanding of God’s grace and Kingdom purpose. Seeing life through a Kingdom lens has reshaped my attitudes, relationships, decisions, and stewardship, bringing greater clarity, purpose, and joy to everyday life.\n\n— Abhilash Pappala",
    "type": "written",
    "country": "India",
    "program": "Discover the Kingdom of God",
    "featured": true,
    "imageUrl": "/images/cogi-india.png"
  },
  {
    "id": "blessena-story",
    "slug": "blessena-story",
    "title": "From biblical teaching to everyday Kingdom living",
    "summary": "Kingdom of God studies are highly interactive and practical, helping translate biblical teaching into everyday Kingdom living.",
    "content": "Kingdom of God studies are highly interactive and practical, helping translate biblical teaching into everyday Kingdom living. They move beyond theory, guiding participants toward intentional steps shaped by God’s reign. The “I WILL” statements provide a simple framework for reflection and accountability, helping participants recognize and sustain their growth toward a Kingdom-centered lifestyle.\n\n— Blessena",
    "type": "written",
    "country": "India",
    "program": "Discover the Kingdom of God",
    "featured": true,
    "imageUrl": "/images/cogi-india.png"
  }
]

export const fallbackTestimonials: Testimonial[] = [
  {
    "id": "stella-osorio",
    "author": "Stella Osorio",
    "country": "Singapore",
    "program": "Care for the Caregiver",
    "quote": "The Care for the Caregiver (C4C) Program helps create a safe space for reflection, emotional renewal, and spiritual strengthening. Through practical sessions on listening, communication, caring for the grieving, resilience, and Christ-centered caregiving, it equips us with valuable tools to care for ourselves and others more effectively. A deeply enriching and transformative experience that affirms the vital importance of caring for caregivers.",
    "featured": true,
    "mediaType": "written"
  },
  {
    "id": "abhilash-pappala",
    "author": "Abhilash Pappala",
    "country": "India",
    "program": "Discover the Kingdom of God",
    "quote": "Kingdom of God studies have transformed the way I understand and live my faith. They led me to genuine repentance and a deeper understanding of God’s grace and Kingdom purpose. Seeing life through a Kingdom lens has reshaped my attitudes, relationships, decisions, and stewardship, bringing greater clarity, purpose, and joy to everyday life.",
    "featured": true,
    "mediaType": "written"
  },
  {
    "id": "blessena",
    "author": "Blessena",
    "country": "India",
    "program": "Discover the Kingdom of God",
    "quote": "Kingdom of God studies are highly interactive and practical, helping translate biblical teaching into everyday Kingdom living. They move beyond theory, guiding participants toward intentional steps shaped by God’s reign. The “I WILL” statements provide a simple framework for reflection and accountability, helping participants recognize and sustain their growth toward a Kingdom-centered lifestyle.",
    "featured": true,
    "mediaType": "written"
  }
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
  {
    "id": "india",
    "country": "India",
    "lat": 20.6,
    "lng": 79,
    "programs": [
      "Care for the Caregiver",
      "Discover the Kingdom of God"
    ],
    "summary": "",
    "region": "Asia-Pacific"
  },
  {
    "id": "uganda",
    "country": "Uganda",
    "lat": 1.37,
    "lng": 32.3,
    "programs": [
      "Missional Health Course"
    ],
    "summary": "",
    "region": "Americas & Africa"
  },
  {
    "id": "kenya",
    "country": "Kenya",
    "lat": -0.02,
    "lng": 37.9,
    "programs": [
      "Care for the Caregiver",
      "Missional Health Course"
    ],
    "summary": "",
    "region": "Americas & Africa"
  },
  {
    "id": "tanzania",
    "country": "Tanzania",
    "lat": -6.37,
    "lng": 34.9,
    "programs": [
      "Missional Health Course"
    ],
    "summary": "",
    "region": "Americas & Africa"
  },
  {
    "id": "rwanda",
    "country": "Rwanda",
    "lat": -1.94,
    "lng": 29.87,
    "programs": [
      "Missional Health Course"
    ],
    "summary": "",
    "region": "Americas & Africa"
  },
  {
    "id": "ghana",
    "country": "Ghana",
    "lat": 7.95,
    "lng": -1.02,
    "programs": [
      "Missional Health Course",
      "Care for the Caregiver"
    ],
    "summary": "",
    "region": "Americas & Africa"
  },
  {
    "id": "united-states",
    "country": "United States",
    "lat": 37.1,
    "lng": -95.7,
    "programs": [
      "The Church and Missional Healthcare",
      "Care for the Caregiver"
    ],
    "summary": "",
    "region": "Americas & Africa"
  },
  {
    "id": "philippines",
    "country": "Philippines",
    "lat": 12.88,
    "lng": 121.77,
    "programs": [
      "Care for the Caregiver"
    ],
    "summary": "",
    "region": "Asia-Pacific"
  },
  {
    "id": "singapore",
    "country": "Singapore",
    "lat": 1.35,
    "lng": 103.82,
    "programs": [
      "Care for the Caregiver"
    ],
    "summary": "",
    "region": "Asia-Pacific"
  },
  {
    "id": "indonesia",
    "country": "Indonesia",
    "lat": -0.79,
    "lng": 113.92,
    "programs": [
      "Care for the Caregiver",
      "Missional Health Course"
    ],
    "summary": "",
    "region": "Asia-Pacific"
  },
  {
    "id": "australia",
    "country": "Australia",
    "lat": -25.27,
    "lng": 133.78,
    "programs": [
      "Care for the Caregiver"
    ],
    "summary": "",
    "region": "Asia-Pacific"
  },
  {
    "id": "new-zealand",
    "country": "New Zealand",
    "lat": -40.9,
    "lng": 174.89,
    "programs": [
      "Care for the Caregiver"
    ],
    "summary": "",
    "region": "Asia-Pacific"
  }
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
