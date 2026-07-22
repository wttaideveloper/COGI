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

export const fallbackGlobalSettings: GlobalSettings = {
  organizationName: 'Companions of Grace International',
  tagline: 'Equipping Healthcare Professionals for Kingdom Engagement',
  mission:
    'Inspire and enable transformation so healthcare professionals think, live, and work missionally — bringing the love of Christ to patients, colleagues, and communities around the world.',
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
    title: 'Companions of Grace International',
    description:
      'A global fellowship cultivating Communities of Grace among healthcare professionals — equipping them for Kingdom engagement worldwide.',
  },
}

export const fallbackHomepage: Homepage = {
  hero: {
    headline: 'Communities of Grace in Healthcare',
    subheadline: 'Equipping Healthcare Professionals for Kingdom Engagement',
    intro:
      'Companions of Grace International is a global fellowship cultivating Communities of Grace among healthcare professionals — inspiring transformation so they think, live, and work missionally across cultures and continents.',
    primaryCta: { label: 'Explore Our Programs', href: '/programs' },
    secondaryCta: { label: 'Join the Movement', href: '/get-involved' },
    imageAlt: 'Healthcare professionals serving together in community',
  },
  mission: {
    title: 'Our Mission',
    statement: fallbackGlobalSettings.mission,
    scripture:
      'And whatever you do, in word or deed, do everything in the name of the Lord Jesus, giving thanks to God the Father through him. — Colossians 3:17',
  },
  video: {
    title: 'See COGI in Action',
    description:
      'Discover how healthcare professionals around the world are being equipped to live missionally — in clinics, hospitals, classrooms, and communities.',
    thumbnailAlt: 'COGI introduction video thumbnail',
  },
  methods: [
    {
      id: 'enable',
      title: 'Enable',
      subtitle: 'Inspire Kingdom Vision',
      description:
        'We open eyes to see healthcare as sacred vocation — helping professionals discover their calling as ambassadors of Christ in every clinical encounter.',
      icon: 'enable',
    },
    {
      id: 'train',
      title: 'Train',
      subtitle: 'Equip for Mission',
      description:
        'Through seminars, courses, and mentoring pathways, we provide practical tools and biblical frameworks for missional living in healthcare settings.',
      icon: 'train',
    },
    {
      id: 'support',
      title: 'Support',
      subtitle: 'Sustain Communities',
      description:
        'We walk alongside caregivers through coaching, prayer partnerships, and peer communities that nurture resilience and faithful witness.',
      icon: 'support',
    },
  ],
  impactStats: [
    { id: 'countries', value: '10+', label: 'Countries', description: 'Active ministry presence' },
    { id: 'professionals', value: '500+', label: 'Healthcare Professionals', description: 'Equipped and engaged' },
    { id: 'programs', value: '30+', label: 'Programs Delivered', description: 'Across our portfolio' },
    { id: 'communities', value: '∞', label: 'Communities of Grace', description: 'Growing worldwide' },
  ],
  portfolio: [
    {
      id: 'kog',
      title: 'Kingdom of God',
      summary: 'Seminars and Discovery Series challenging you to live as a kingdom citizen in healthcare.',
      programSlug: 'kingdom-of-god',
    },
    {
      id: 'missional-training',
      title: 'Missional Training',
      summary: 'M-Trail and Missional Health Course equipping students and professionals for cross-cultural service.',
      programSlug: 'missional-training',
    },
    {
      id: 'c4c',
      title: 'Care for the Caregiver',
      summary: 'An 8-module journey focused on caring for healthcare workers who care for others.',
      programSlug: 'care-for-the-caregiver',
    },
    {
      id: 'missional-church',
      title: 'Missional Church & Healthcare',
      summary: 'Bridging local church and healthcare mission through seminars and HEAL Week experiences.',
      programSlug: 'missional-church-healthcare',
    },
  ],
  storiesTeaser: {
    title: 'Stories of Transformation',
    description: 'Watch and read how God is transforming healthcare professionals and the communities they serve.',
    featuredStoryIds: ['charles-faust-journey', 'duncan-hospital-partnership'],
  },
  featuredEventId: 'heal-week-2026',
  newsletter: {
    title: 'Stay Connected',
    description: 'Receive updates on programs, events, and stories from the COGI global fellowship.',
  },
  donateCta: {
    title: 'Partner With Us',
    description:
      'Your generosity equips healthcare professionals worldwide to live and serve missionally. Every gift extends the reach of Communities of Grace.',
    buttonLabel: 'Give Today',
  },
}

export const fallbackPrograms: Program[] = [
  {
    id: '1',
    slug: 'kingdom-of-god',
    title: 'Kingdom of God',
    summary: 'Equipping and building a missional heart and mind among health professionals for the extension of God\'s kingdom.',
    description:
      'The Kingdom of God program challenges healthcare professionals to see their vocation through the lens of Scripture. Through interactive seminars and small-group Discovery Series, participants explore what it means to live as kingdom citizens — bearing witness to Christ in word and deed within clinical and community settings.',
    area: 'Theological Formation',
    experiences: [
      {
        id: 'kog-seminar',
        title: 'Kingdom of God Seminar',
        description:
          'An introductory one-day seminar on the Kingdom of God with life application in the context of healthcare. Participants engage with biblical foundations and practical case studies.',
        status: 'active',
      },
      {
        id: 'discovery-series',
        title: 'Discovery Series',
        description:
          'Two series of facilitated small-group studies exploring the perspectives and lifestyles of the Kingdom in healthcare. Designed for ongoing discipleship in local Communities of Grace.',
        status: 'active',
      },
    ],
    highlights: [
      'Biblical framework for missional healthcare',
      'Small-group Discovery Series format',
      'Applicable to all healthcare disciplines',
      'Facilitator training available',
    ],
    audience: 'Healthcare professionals, students, and church leaders engaged in healthcare ministry',
    order: 1,
  },
  {
    id: '2',
    slug: 'missional-training',
    title: 'Missional Training',
    summary: 'Wholistically maturing students and professionals through intentional coaching, mentoring, and immersive experiences.',
    description:
      'Missional Training prepares the next generation of healthcare missionaries through experiential learning. From a one-day missions taster to a two-week group internship, participants grow in cross-cultural competence, spiritual formation, and practical healthcare skills.',
    area: 'Experiential Learning',
    experiences: [
      {
        id: 'm-trail',
        title: 'M-Trail',
        description:
          'A one-day missions taster for students and professionals in healthcare. Participants experience cross-cultural engagement, prayer walks, and missional reflection in a supportive group setting.',
        status: 'active',
      },
      {
        id: 'missional-health-course',
        title: 'Missional Health Course',
        description:
          'An eight-module intensive, fully residential or blended course in Missional Healthcare. Combines theological reflection, clinical skills, and field immersion.',
        status: 'active',
      },
      {
        id: 'institute-placeholder',
        title: 'Institute of Missional Healthcare',
        description: 'A future two-year blended program in rural healthcare for primary care providers. Currently in development.',
        status: 'placeholder',
      },
    ],
    highlights: [
      'M-Trail one-day immersion',
      'Residential and blended course options',
      'Cross-cultural field placements',
      'Mentoring and coaching included',
    ],
    audience: 'Medical, nursing, dental, and allied health students and early-career professionals',
    order: 2,
  },
  {
    id: '3',
    slug: 'care-for-the-caregiver',
    title: 'Care for the Caregiver (C4C)',
    summary: 'An 8-module group training program focused on equipping healthcare professionals to care for themselves and one another.',
    description:
      'This 8-lesson group training program equips Christian and non-Christian healthcare professionals to more effectively deal with the difficulties they face in daily life at work, at home, and within their communities. Through interactive sessions, role plays, and prayer partnerships, participants build lasting support networks.',
    area: 'Pastoral Care',
    experiences: [
      {
        id: 'c4c-journey',
        title: '8-Module C4C Journey',
        description:
          'A facilitated, interactive series covering feelings, listening, Christ-centered care, grief, and ongoing resilience — with small-group interaction and prayer partner relationships.',
        status: 'active',
      },
    ],
    highlights: [
      'Program Introduction & Understanding Feelings',
      'The Art of Listening & Christ Centered Caregiver',
      'Caring with a Process Approach & Speaking Truth in Love',
      'Caring for the Grieving & Now What?',
      'Prayer partner relationships beyond the program',
    ],
    audience: 'Anyone in healthcare with a heart for caring and openness to new skills',
    order: 3,
  },
  {
    id: '4',
    slug: 'missional-church-healthcare',
    title: 'Missional Church & Healthcare',
    summary: 'Bridging local church engagement with healthcare mission through seminars and immersive week-long experiences.',
    description:
      'This program connects congregations with the missional potential of their healthcare members. Churches learn to envision, equip, and send healthcare professionals as ambassadors of grace in their workplaces and communities.',
    area: 'Church Engagement',
    experiences: [
      {
        id: 'one-day-seminar',
        title: 'One-Day Seminar',
        description:
          'A church-focused seminar helping congregations understand the unique missional opportunity healthcare professionals represent in their communities.',
        status: 'active',
      },
      {
        id: 'heal-week',
        title: 'HEAL Week',
        description:
          'A week-long immersive experience combining healthcare service, spiritual formation, and community engagement. Currently under development.',
        status: 'development',
      },
    ],
    highlights: [
      'Church leadership engagement',
      'Healthcare member commissioning',
      'Community health outreach models',
      'HEAL Week immersive experience (coming soon)',
    ],
    audience: 'Church leaders, healthcare ministry coordinators, and mission committees',
    order: 4,
  },
]

export const fallbackTimeline: TimelineMilestone[] = [
  {
    year: '2019',
    title: 'Vision Conceived',
    description:
      'God knit hearts together among healthcare leaders in India and the United States. Weekly prayer and fellowship birthed a vision for equipping healthcare professionals for Kingdom engagement.',
  },
  {
    year: '2020',
    title: 'COGI Established',
    description:
      'Companions of Grace International was formally launched with founding board members, initial partnerships, and the first Kingdom of God seminars delivered to healthcare communities.',
  },
  {
    year: '2023',
    title: 'Global Expansion',
    description:
      'Programs expanded across Africa, South Asia, and North America. Partnerships with HCFI, CAPRO, and local churches multiplied the reach of missional healthcare training.',
  },
  {
    year: '2026',
    title: 'Growing Fellowship',
    description:
      'Over 500 healthcare professionals equipped across 10+ countries. New programs including HEAL Week and the Institute of Missional Healthcare advance the vision of global Communities of Grace.',
  },
]

export const fallbackBeliefs: Belief[] = [
  {
    id: 'god',
    title: 'God',
    content:
      'There is one true God, eternally existing in three persons — Father, Son, and Holy Spirit.',
  },
  {
    id: 'jesus',
    title: 'Jesus Christ',
    content:
      'The Son is the living Word (Logos) of God who has become flesh through miraculous conception by the Holy Spirit and His virgin birth. We affirm the full deity and humanity of Jesus the Christ, the Messiah, who lived a sinless life on earth as a man, surrendered His life on a cross, rose from the dead, and ascended into heaven and is seated at the right hand of the Father. During His earthly ministry, Jesus taught, proclaimed, and demonstrated the kingdom of God.',
  },
  {
    id: 'holy-spirit',
    title: 'Holy Spirit',
    content:
      'The Third Person of the Godhead, the work of the Holy Spirit is to bring glory to Christ Jesus. The Spirit is active in convicting humans of sin and accomplishing God\'s saving work in those who repent and believe. The Spirit enables the transformation of human lives and empowers believers for witness and service, distributing gifts according to God\'s will.',
  },
  {
    id: 'bible',
    title: 'The Bible',
    content:
      'The Bible is the fundamental basis for our beliefs and is the fully inspired written Word of God as contained in the 66 books of the Old and New Testaments. It is the unique, authoritative, and inerrant (in the original manuscripts) standard for faith and life and contains all things necessary for salvation through faith in Jesus Christ.',
  },
  {
    id: 'humankind',
    title: 'Humankind',
    content:
      'Is created in the image of God, in all its diversity, for the purpose of being in relationship with God and exercising dominion over His creation. However, all humans are fallen beings and are under the power of sin and death. All, left to themselves, are unable to please God and be reconciled to Him. Thus, all humans are in desperate need of salvation. God sent His Son, Jesus, to provide a way for humankind (and all creation) to be restored to a right relationship with Him.',
  },
  {
    id: 'salvation',
    title: 'Salvation',
    content:
      'Restoration to a right relationship with God and the eternal life that accompanies it is only possible through Jesus Christ. By prevenient grace, God has shown His great lovingkindness and initiates a restored relationship with all humankind. Salvation is not earned by human effort but is offered by God\'s love, mercy, and grace. It is received by repentance and faith in Jesus. God desires that all humankind be restored to Him through His gift of salvation.',
  },
  {
    id: 'church',
    title: 'Church',
    content:
      'The Church is the Body of Christ, the universal community of believers in Jesus. Jesus loves the Church and gave His life for it. Endowed with gifts by the Holy Spirit, it is the mission of the Church to glorify God, make disciples, witness His redemptive grace to the world, and prepare to meet Jesus upon His glorious return to the earth.',
  },
  {
    id: 'kingdom',
    title: 'The Kingdom of God',
    content:
      'Restored at the first advent of Christ, the kingdom of God will be consummated at the return of Christ Jesus and will be characterized by victory over death, Satan, and all evil. Those who have died in Christ will be resurrected to eternal life with God. Until that time, we are called to follow Jesus and join Him in His kingdom work.',
  },
  {
    id: 'calling',
    title: 'Calling',
    content:
      'Final words have great meaning. For believers in Christ Jesus, His final words call us to action. He has sent each believer into the world to share the good news of salvation, to make disciples, and to teach them according to the tenants of the Word of God. In obedience to that call, we each are to proclaim the gospel, make disciples, and share our love for God and our neighbors by doing and proclaiming God\'s mercy and justice.',
  },
]

export const fallbackBoardMembers: TeamMember[] = [
  {
    id: 'abraham-thomas',
    name: 'Dr. Abraham Thomas',
    title: 'Chairman',
    role: 'board',
    country: 'United States',
    bio: 'Abe is a practicing pediatrician in Northern New Jersey. After completing medical education in India, he migrated to the United States with his wife Ruby. Once they became empty nesters, God opened a new chapter of partnership with Mathew in discipling healthcare workers. Mathew and Abe miraculously reconnected, and when Mathew shared his vision about discipleship amongst healthcare workers, Abe felt led to partner. About 15 months ago he joined hands in prayer and fellowship with a group of likeminded brothers — and to see the early fruits of that prayer and hard work is truly exciting.',
    order: 1,
  },
  {
    id: 'mathew-george',
    name: 'Dr. Mathew George',
    title: 'Chief Executive Officer',
    role: 'board',
    country: 'India / United States',
    bio: 'Mathew is a dentist by profession who worked at Duncan Hospital, a rural mission hospital and unit of Emmanuel Hospital Association (EHA) in Raxaul, Bihar, India. He later served as Missions Secretary of the Evangelical Medical Fellowship of India (EMFI), working in medical missions training, mentoring of medical students and professionals, and the Kingdom of God in Healthcare program. God called him to form Companions of Grace International to help healthcare professionals live lives that advance the Kingdom of God.',
    order: 2,
  },
  {
    id: 'charles-faust',
    name: 'Mr. Charles Faust',
    title: 'Secretary',
    role: 'board',
    country: 'United States',
    bio: 'Chuck is a retired business executive having served in chief operating and chief financial roles for multi-national companies. In February 2013, God opened a pathway after his 35-year business career drew to a close, enabling him and his wife Mary to travel on a medical mission trip to Duncan Hospital in Raxaul, Bihar, India. There he met Mathew and God knit their hearts together in Christian brotherhood. From then they communicated and prayed together regularly over the years since.',
    order: 3,
  },
  {
    id: 'paul-east',
    name: 'Mr. Paul East',
    title: 'Board Member',
    role: 'board',
    country: 'United States',
    bio: 'Paul has known and walked with Mathew for many years in Christian brotherhood. In recent years it became clear that God has called Mathew to lead a movement amongst healthcare professionals. When asked to join the Board, it was quickly clear that he needed to join the effort. Healthcare professionals have a unique opportunity to care and witness at critical moments in patients\' lives. Christian healthcare professionals need training and nurturing to honor the Lord Jesus, and in these challenging times they need to be equipped to be on mission within a changing world.',
    order: 4,
  },
  {
    id: 'sunil-abraham',
    name: 'Dr. Sunil Abraham',
    title: 'Board Member',
    role: 'board',
    country: 'India',
    bio: 'Sunil supports the work of COGI because of its vision to equip and strengthen the disciples of Christ in healthcare to follow Him and serve Him as individuals and communities. Healthcare workers need encouragement, fellowship and a fresh vision to perceive their work beyond their job by understanding the times they are in and God\'s calling wherever He has kept them. COGI provides them resources and people who will walk with them in this often hard and lonely journey.',
    order: 5,
  },
  {
    id: 'manoj-jacob',
    name: 'Dr. Manoj Jacob',
    title: 'Board Member',
    role: 'board',
    country: 'India',
    bio: 'Manoj has known Mathew and his family for many years and served together on multiple occasions. Their association included when Mathew was Managing Director of Duncan Hospital while Manoj served as General Secretary of EMFI. Later they worked closely in medical missions training and the Kingdom of God in Healthcare program. As Mathew began the COGI journey, Manoj was motivated to help as an advisor and encourager, and joined the Board as the vision gained momentum. He is impressed at the partnerships and geographical engagements formed in the first year.',
    order: 6,
  },
  {
    id: 'ted-lang',
    name: 'Ted Lang',
    title: 'Board Member',
    role: 'board',
    country: 'United States',
    bio: 'Bio coming soon.',
    order: 7,
  },
]

export const fallbackGlobalTeam: TeamMember[] = [
  { id: 'gt-india-1', name: 'Priya', title: 'Program Facilitator', role: 'global', region: 'South Asia', country: 'India', bio: 'Facilitates Kingdom of God seminars and Discovery Series across South Asia.', order: 1 },
  { id: 'gt-india-2', name: 'Rajan', title: 'Mentor', role: 'global', region: 'South Asia', country: 'India', bio: 'Provides mentoring and coaching for healthcare students and early-career professionals.', order: 2 },
  { id: 'gt-kenya-1', name: 'Grace', title: 'Regional Coordinator', role: 'global', region: 'East Africa', country: 'Kenya', bio: 'Coordinates Missional Training programs and church partnerships in East Africa.', order: 3 },
  { id: 'gt-uganda-1', name: 'David', title: 'C4C Facilitator', role: 'global', region: 'East Africa', country: 'Uganda', bio: 'Leads Care for the Caregiver cohorts for hospital staff and community health workers.', order: 4 },
  { id: 'gt-nigeria-1', name: 'Amara', title: 'Program Lead', role: 'global', region: 'West Africa', country: 'Nigeria', bio: 'Partners with CAPRO to deliver missional healthcare training across West Africa.', order: 5 },
  { id: 'gt-usa-1', name: 'Sarah', title: 'North America Coordinator', role: 'global', region: 'North America', country: 'United States', bio: 'Connects US-based healthcare professionals with global Communities of Grace.', order: 6 },
  { id: 'gt-uk-1', name: 'James', title: 'HCFI Liaison', role: 'global', region: 'Europe', country: 'United Kingdom', bio: 'Collaborates with Healthcare Christian Fellowship International on mentoring programs.', order: 7 },
]

export const fallbackPartners: Partner[] = [
  {
    id: 'global-advance',
    name: 'Global Advance',
    description:
      'A Christian nonprofit organization that sends people to share the love and message of Jesus cross-culturally and equips Christ followers to better engage their neighbors. As partners we seek to envision healthcare members of churches in missional healthcare and engage meaningfully with communities that are marginalized and needy.',
    url: 'https://globaladvance.org',
    region: 'Global',
    order: 1,
  },
  {
    id: 'hcfi',
    name: 'Healthcare Christian Fellowship International (HCFI)',
    description:
      'Active in more than 120 countries, HCFI seeks to equip caregivers to practice integral healthcare. As partners, we collaborate developing and conducting Mentoring through Strategic Gaming programs and the Great 7 studies.',
    url: 'https://hcfi.org',
    region: 'Global',
    order: 2,
  },
  {
    id: 'capro',
    name: 'CAPRO Mission',
    description:
      'A mission agency with a clear mandate of bringing the transformational message of Jesus to the unreached peoples of our generation. As partners we conduct bouquet trainings in Missional Healthcare for students and professionals, initially focused on East Africa with aims to broaden across the African continent.',
    url: 'https://capromissions.org',
    region: 'Africa',
    order: 3,
  },
  {
    id: 'eha',
    name: 'Emmanuel Hospital Association (EHA)',
    description:
      'A network of mission hospitals across India where COGI leaders have served and where Kingdom of God programs were first piloted, including Duncan Hospital in Raxaul, Bihar.',
    region: 'South Asia',
    order: 4,
  },
  {
    id: 'emfi',
    name: 'Evangelical Medical Fellowship of India (EMFI)',
    description:
      'Partner in medical missions training, mentoring of medical students and professionals, and development of the Kingdom of God in Healthcare curriculum.',
    region: 'South Asia',
    order: 5,
  },
]

export const fallbackStories: Story[] = [
  {
    id: 'charles-faust-journey',
    slug: 'charles-faust-journey',
    title: 'A Pathway Opened in India',
    summary: 'How a retired executive found his calling on a medical mission trip to Duncan Hospital.',
    type: 'written',
    country: 'India',
    program: 'Kingdom of God',
    featured: true,
    content:
      'It was in February 2013 that God opened a pathway to my being a part of this movement. My full-time business career of more than 35 years was drawn to a close quite suddenly, enabling my wife Mary and I to travel on a primarily medical mission trip to Duncan Hospital in Raxaul, Bihar, India. Only a few months earlier I would have scoffed if someone had told me I would shortly be headed to India, but God is amazing! And it was there in a few short weeks that Mathew and I met and formed a close relationship where God knit our hearts together in Christian brotherhood.',
  },
  {
    id: 'duncan-hospital-partnership',
    slug: 'duncan-hospital-partnership',
    title: 'Kingdom Work at Duncan Hospital',
    summary: 'The birthplace of COGI\'s vision — rural mission healthcare in Bihar, India.',
    type: 'video',
    country: 'India',
    program: 'Missional Training',
    featured: true,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content:
      'Duncan Hospital in Raxaul, Bihar served as the crucible where Kingdom of God seminars and missional healthcare training first took shape among Indian healthcare professionals.',
  },
  {
    id: 'kenya-m-trail',
    slug: 'kenya-m-trail',
    title: 'First M-Trail in East Africa',
    summary: 'Students and professionals experience a one-day missions taster in Nairobi.',
    type: 'written',
    country: 'Kenya',
    program: 'Missional Training',
    featured: false,
    content:
      'Through our partnership with CAPRO, the first M-Trail in East Africa brought together nursing students, physicians, and community health workers for a day of cross-cultural reflection, prayer, and hands-on community engagement.',
  },
  {
    id: 'c4c-cohort-delhi',
    slug: 'c4c-cohort-delhi',
    title: 'Healing the Healers in Delhi',
    summary: 'An 8-module C4C cohort helps hospital staff build resilience and peer support.',
    type: 'written',
    country: 'India',
    program: 'Care for the Caregiver',
    featured: false,
    content:
      'Frontline workers in a major Delhi hospital completed the full Care for the Caregiver journey, forming prayer partnerships that continue beyond the program\'s conclusion.',
  },
]

export const fallbackTestimonials: Testimonial[] = [
  {
    id: 'stella',
    quote:
      'Before COGI, I saw my nursing career as just a job. The Kingdom of God seminar opened my eyes to see every patient encounter as a sacred moment. I now pray with colleagues before shifts and mentor younger nurses in living missionally.',
    author: 'Stella',
    role: 'Registered Nurse',
    country: 'Kenya',
    program: 'Kingdom of God',
    featured: true,
  },
  {
    id: 'abhilash',
    quote:
      'The M-Trail experience changed the trajectory of my medical career. I went from wanting to specialize for prestige to wanting to serve where the need is greatest. COGI walked with me through that transformation with mentoring and prayer.',
    author: 'Abhilash',
    role: 'Medical Student',
    country: 'India',
    program: 'Missional Training',
    featured: true,
  },
  {
    id: 'chacko',
    quote:
      'As a hospital administrator, I was burning out. The Care for the Caregiver program gave me tools to listen, grieve, and care for my team. Our hospital culture has shifted toward mutual support and Christ-centered compassion.',
    author: 'Chacko',
    role: 'Hospital Administrator',
    country: 'India',
    program: 'Care for the Caregiver',
    featured: true,
  },
  {
    id: 'blessena',
    quote:
      'Our church never knew how to engage our healthcare members in mission. The Missional Church seminar helped us commission our doctors and nurses as ambassadors of grace in their workplaces. It has transformed our congregation\'s outreach.',
    author: 'Blessena',
    role: 'Church Elder',
    country: 'Uganda',
    program: 'Missional Church & Healthcare',
    featured: true,
  },
]

export const fallbackBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'living-missionally-in-the-clinic',
    title: 'Living Missionally in the Clinic',
    summary: 'Practical ways healthcare professionals can bear witness to Christ in everyday clinical practice.',
    content:
      '<p>Healthcare settings are among the most missional environments on earth. Patients arrive at vulnerable moments — frightened, in pain, facing uncertainty. As followers of Christ, we have a unique privilege to bring not only clinical excellence but the compassion of Jesus into every encounter.</p><p>The Kingdom of God seminar introduces three postures: <strong>presence</strong>, <strong>prayer</strong>, and <strong>proclamation</strong>. Presence means being fully attentive. Prayer means inviting God into the room. Proclamation means being ready to share hope when the Spirit opens the door.</p><p>Start small. Pray before your shift. Learn one colleague\'s story. Look for the person God places in your path today. Missional living in healthcare is not about adding tasks — it is about transforming the tasks you already do.</p>',
    author: 'Dr. Mathew George',
    category: 'Missional Living',
    publishedAt: '2025-11-15',
  },
  {
    id: '2',
    slug: 'why-caregivers-need-care',
    title: 'Why Caregivers Need Care',
    summary: 'The biblical and practical case for the Care for the Caregiver program.',
    content:
      '<p>Healthcare workers face rates of burnout, depression, and moral injury that far exceed the general population. Yet the culture of medicine often stigmatizes vulnerability and self-care.</p><p>The Care for the Caregiver program addresses this through eight interactive modules that build skills in listening, processing grief, and sustaining peer support. Rooted in Scripture and informed by best practices in pastoral care, C4C creates Communities of Grace within healthcare institutions.</p><p>When caregivers are cared for, patients receive better care. Churches and mission agencies retain the workers they invest in. The Kingdom advances through healed healers.</p>',
    author: 'COGI Editorial Team',
    category: 'Programs',
    publishedAt: '2025-10-02',
  },
  {
    id: '3',
    slug: 'partnerships-that-multiply-impact',
    title: 'Partnerships That Multiply Impact',
    summary: 'How COGI collaborates with HCFI, CAPRO, and local churches to extend missional healthcare training.',
    content:
      '<p>No single organization can equip the global healthcare workforce for Kingdom engagement. COGI was founded on the conviction that partnerships multiply impact.</p><p>With HCFI, we develop mentoring through strategic gaming and Great 7 studies. With CAPRO, we deliver missional healthcare training across Africa. With EHA and EMFI in India, we root programs in decades of medical missions experience.</p><p>We invite churches, mission agencies, and healthcare institutions to explore partnership pathways through our Get Involved page.</p>',
    author: 'Mr. Charles Faust',
    category: 'Partnerships',
    publishedAt: '2025-09-18',
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
    summary: 'A one-day seminar for healthcare professionals in the Northeast US.',
    description:
      'Join us for a full-day Kingdom of God seminar designed for physicians, nurses, dentists, and allied health professionals. Explore biblical foundations for missional healthcare and connect with a local Community of Grace.',
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
  { id: 'in', country: 'India', region: 'South Asia', summary: 'Birthplace of COGI vision; Kingdom of God and C4C programs active.', programs: ['Kingdom of God', 'Care for the Caregiver', 'Missional Training'], lat: 20.5937, lng: 78.9629 },
  { id: 'us', country: 'United States', region: 'North America', summary: 'Board headquarters; seminars and church engagement programs.', programs: ['Kingdom of God', 'Missional Church & Healthcare'], lat: 39.8283, lng: -98.5795 },
  { id: 'ke', country: 'Kenya', region: 'East Africa', summary: 'M-Trail and missional training through CAPRO partnership.', programs: ['Missional Training'], lat: -0.0236, lng: 37.9062 },
  { id: 'ug', country: 'Uganda', region: 'East Africa', summary: 'C4C cohorts and church-healthcare bridge programs.', programs: ['Care for the Caregiver', 'Missional Church & Healthcare'], lat: 1.3733, lng: 32.2903 },
  { id: 'ng', country: 'Nigeria', region: 'West Africa', summary: 'Missional healthcare training with CAPRO.', programs: ['Missional Training'], lat: 9.082, lng: 8.6753 },
  { id: 'gb', country: 'United Kingdom', region: 'Europe', summary: 'HCFI collaboration and mentoring programs.', programs: ['Kingdom of God'], lat: 55.3781, lng: -3.436 },
  { id: 'bd', country: 'Bangladesh', region: 'South Asia', summary: 'Emerging Communities of Grace among nursing professionals.', programs: ['Care for the Caregiver'], lat: 23.685, lng: 90.3563 },
  { id: 'np', country: 'Nepal', region: 'South Asia', summary: 'Rural healthcare mission partnerships.', programs: ['Missional Training'], lat: 28.3949, lng: 84.124 },
  { id: 'tz', country: 'Tanzania', region: 'East Africa', summary: 'Cross-cultural M-Trail and field placements.', programs: ['Missional Training'], lat: -6.369, lng: 34.8888 },
  { id: 'ph', country: 'Philippines', region: 'Southeast Asia', summary: 'Discovery Series among allied health communities.', programs: ['Kingdom of God'], lat: 12.8797, lng: 121.774 },
  { id: 'gh', country: 'Ghana', region: 'West Africa', summary: 'Church-healthcare engagement seminars.', programs: ['Missional Church & Healthcare'], lat: 7.9465, lng: -1.0232 },
]

export const fallbackFAQs: FAQ[] = [
  {
    id: '1',
    question: 'How do I register for a COGI program?',
    answer: 'Visit the program page and click "Express Interest" or go to Get Involved to submit the Join the Movement form. Our team will follow up with registration details.',
    category: 'Programs',
  },
  {
    id: '2',
    question: 'Are donations tax-deductible?',
    answer: 'Companions of Grace International is a registered nonprofit. Donations made through our GiveLively page are tax-deductible to the extent allowed by law. Consult your tax advisor for specifics.',
    category: 'Donate',
  },
  {
    id: '3',
    question: 'Can I participate if I am not a Christian?',
    answer: 'Several programs, including Care for the Caregiver, welcome participants of all backgrounds. Kingdom-focused programs are designed for those exploring or committed to Christian faith.',
    category: 'Programs',
  },
  {
    id: '4',
    question: 'How can my church partner with COGI?',
    answer: 'We offer Missional Church & Healthcare seminars and partnership pathways. Contact us through the Get Involved page or email info@coginternational.org.',
    category: 'Partnerships',
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
