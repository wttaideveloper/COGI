/** Original COGI photography generated for this site. */

export const siteImages = {
  heroCrowd: '/images/cogi-hero.png',
  heroHands: '/images/cogi-hands.png',
  missionField: '/images/cogi-india.png',
  historicGathering: '/images/cogi-gathering.png',
  kenya: '/images/cogi-kenya.png',
  pakistan: '/images/cogi-india.png',
  give: '/images/cogi-give.png',
  giveAlt: '/images/cogi-give.png',
  videoThumb: '/images/cogi-video-thumb.png',
  clinic: '/images/cogi-train.png',
  careHands: '/images/cogi-support.png',
  healthcareTeam: '/images/cogi-gathering.png',
  community: '/images/cogi-hero.png',
  hope: '/images/cogi-church.png',
  enable: '/images/cogi-enable.png',
  train: '/images/cogi-train.png',
  support: '/images/cogi-support.png',
}

export const siteVideos = {
  intro: '/videos/intro.mp4',
  kenya: '/videos/kenya-story.mp4',
  india: '/videos/india-story.mp4',
}

export type CopyBlock = { title: string; body: string; imageUrl?: string; href?: string; cta?: string }

export type PageHeroCopy = {
  heroTitle: string
  heroSubtitle: string
  imageUrl?: string
}

export type SiteCopy = {
  homepage: {
    eyebrow: string
    secondaryCtaLabel: string
    secondaryCtaHref: string
    newsletterBannerTitle: string
    newsletterBannerBody: string
    newsletterBannerCta: string
    legacyTitle: string
    legacyBody: string
    videoTitle: string
    videoDescription: string
    videoImageUrl: string
    videoUrl: string
    methodsTitle: string
    methodsSubtitle: string
    portfolioTitle: string
    portfolioSubtitle: string
    mapTitle: string
    mapSubtitle: string
    storiesTitle: string
    storiesSubtitle: string
    watchStoriesCta: string
    readStoriesCta: string
    impactTitle: string
    impactIntro: string
    faithTitle: string
    faithStatement: string
  }
  about: PageHeroCopy & { visionTitle: string; missionTitle: string }
  story: {
    heroTitle: string
    heroSubtitle: string
    intro: string
    imageUrl: string
    milestones: Array<{ year: string; title: string; description: string }>
  }
  beliefs: {
    heroTitle: string
    heroSubtitle: string
    intro: string
    imageUrl?: string
    items: Array<{ id: string; title: string; content: string }>
  }
  getInvolved: {
    heroTitle: string
    heroSubtitle: string
    formTitle: string
    formIntro: string
    imageUrl: string
    pathways: CopyBlock[]
  }
  donate: {
    heroTitle: string
    heroSubtitle: string
    intro: string
    imageUrl: string
    giveTitle: string
    giveBody: string
    giveCta: string
    mailTitle: string
    mailBody: string
    stockTitle: string
    stockBody: string
    legacyTitle: string
    legacyBody: string
    faqTitle: string
  }
  resources: {
    heroTitle: string
    heroSubtitle: string
    cards: CopyBlock[]
  }
  contact: PageHeroCopy & { formTitle: string; infoTitle: string; socialTitle: string; mapNote: string }
  programs: PageHeroCopy & { learnMore: string; expressInterest: string }
  events: PageHeroCopy
  board: PageHeroCopy
  globalTeam: PageHeroCopy
  partners: PageHeroCopy
  storiesPage: PageHeroCopy
  testimonials: PageHeroCopy
  blog: PageHeroCopy & { migrationNote: string }
  search: PageHeroCopy & { placeholder: string; button: string }
}

export const defaultSiteCopy: SiteCopy = {
  homepage: {
    eyebrow: 'Companions of Grace International',
    secondaryCtaLabel: 'Explore Our Programs',
    secondaryCtaHref: '/programs',
    newsletterBannerTitle: 'Stories of transformation',
    newsletterBannerBody:
      'Watch and read how healthcare professionals, churches, and communities are being transformed across nations.',
    newsletterBannerCta: 'Watch stories',
    legacyTitle: 'Communities of Grace in healthcare',
    legacyBody:
      'We are a global fellowship of Christ-followers cultivating Communities of Grace in healthcare by accompanying individuals and communities to develop a Kingdom perspective that shapes life, vocation, and service.',
    videoTitle: 'Watch our story',
    videoDescription:
      'A short introduction to who Companions of Grace is, why we exist, and the global need we are responding to within healthcare.',
    videoImageUrl: siteImages.videoThumb,
    videoUrl: siteVideos.intro,
    methodsTitle: 'Our methods',
    methodsSubtitle: 'Enable · Train · Support',
    portfolioTitle: 'What we do — our portfolio',
    portfolioSubtitle:
      'Our programs are organized around four interconnected areas of ministry, each designed to inspire and prepare healthcare professionals for faithful Kingdom engagement.',
    mapTitle: 'Where we serve',
    mapSubtitle:
      'Explore current areas of engagement. Select a nation to see programs, communities, and partnerships on the ground.',
    storiesTitle: 'Stories of transformation',
    storiesSubtitle: 'Featured video and written stories from healthcare professionals on the front lines.',
    watchStoriesCta: 'Watch stories',
    readStoriesCta: 'Read stories',
    impactTitle: 'Our impact',
    impactIntro:
      'Through communities of learning, mentoring, and mission, Companions of Grace is witnessing healthcare professionals, churches, and communities being transformed across nations. Every story reflects God\'s ongoing work of renewal through faithful healthcare witness.',
    faithTitle: 'Our beliefs',
    faithStatement:
      'We believe in the full authority of Scripture; in God the Father, Son, and Holy Spirit; in the virgin birth, sinless life, atoning death, physical resurrection and return of our Lord Jesus Christ; in salvation by grace through faith; in the present ministry of the Holy Spirit; and in the urgency of fulfilling the Great Commission through the local church and every vocation — including healthcare.',
  },
  about: {
    heroTitle: 'Vision & mission',
    heroSubtitle: 'Equipping healthcare professionals for Kingdom engagement',
    imageUrl: siteImages.missionField,
    visionTitle: 'Our vision',
    missionTitle: 'Our mission',
  },
  story: {
    heroTitle: 'Our story',
    heroSubtitle: 'A fellowship born from prayer, friendship, and Kingdom vision',
    intro:
      'What began as God knitting hearts together among healthcare leaders has become a global movement. COGI exists to ignite Communities of Grace — catalytic healthcare professionals who lift spiritual and practical hope in their nations.',
    imageUrl: siteImages.historicGathering,
    milestones: [
      { year: '2013', title: 'A pathway opened', description: 'A medical mission journey to Duncan Hospital in Raxaul, Bihar knit together friendships that would later become COGI.' },
      { year: '2019', title: 'Vision conceived', description: 'Weekly prayer and fellowship among leaders in India and the United States clarified the call: healthcare is sacred vocation.' },
      { year: '2020', title: 'COGI established', description: 'Companions of Grace International was formally launched with a founding board, initial partnerships, and the first Kingdom of God seminars.' },
      { year: '2023', title: 'Global expansion', description: 'Programs expanded across Africa, South Asia, and North America through partnerships with churches and mission networks.' },
      { year: '2026', title: 'Growing fellowship', description: 'More than 500 healthcare professionals equipped across 10+ countries as Communities of Grace continue to grow.' },
    ],
  },
  beliefs: {
    heroTitle: 'Our beliefs',
    heroSubtitle: 'Essential convictions that underlie our mission and purpose',
    intro: 'These essential beliefs shape how we equip healthcare professionals for Kingdom engagement.',
    imageUrl: siteImages.heroHands,
    items: [
      { id: 'god', title: 'God', content: 'There is one true God, eternally existing in three persons — Father, Son, and Holy Spirit.' },
      { id: 'jesus', title: 'Jesus Christ', content: 'The Son is the living Word who became flesh through miraculous conception and virgin birth. We affirm His full deity and humanity, sinless life, atoning death, resurrection, and ascension.' },
      { id: 'holy-spirit', title: 'Holy Spirit', content: 'The Spirit brings glory to Christ, convicts of sin, accomplishes saving work in those who repent and believe, transforms lives, and empowers believers for witness and service.' },
      { id: 'bible', title: 'The Bible', content: 'The Bible is the fully inspired written Word of God in the 66 books of the Old and New Testaments — unique, authoritative, and the standard for faith and life.' },
      { id: 'salvation', title: 'Salvation', content: 'Restoration to God is possible only through Jesus Christ. Salvation is offered by grace and received by repentance and faith — not earned by human effort.' },
      { id: 'church', title: 'Church', content: 'The Church is the Body of Christ. Endowed with gifts by the Spirit, it glorifies God, makes disciples, and witnesses His redemptive grace to the world.' },
      { id: 'calling', title: 'Calling', content: 'Christ sends each believer to share the good news, make disciples, and love God and neighbor. Healthcare is one of the most strategic missional vocations on earth.' },
    ],
  },
  getInvolved: {
    heroTitle: 'Get involved',
    heroSubtitle: 'Pray · Participate · Partner',
    formTitle: 'Join the movement',
    formIntro: 'Tell us how you would like to engage and we will connect you with the right pathway.',
    imageUrl: siteImages.kenya,
    pathways: [
      { title: 'Pray', body: 'Join our global prayer network for healthcare professionals, programs, and communities that need the hope of Christ.' },
      { title: 'Participate', body: 'Enroll in a program, attend an event, or become a facilitator in your region.' },
      { title: 'Partner', body: 'Churches, mission agencies, and healthcare institutions — explore collaboration that multiplies Communities of Grace.' },
    ],
  },
  donate: {
    heroTitle: 'Donate',
    heroSubtitle: 'Partner with us to equip healthcare professionals for Kingdom engagement',
    intro: 'Your generosity equips healthcare professionals worldwide to live and serve missionally. Every gift extends the reach of Communities of Grace.',
    imageUrl: siteImages.give,
    giveTitle: 'Give securely online',
    giveBody: 'Choose a one-time or recurring gift. Every donation is stewarded with care for the glory of God and the equipping of healthcare professionals.',
    giveCta: 'Give today',
    mailTitle: 'Mail a check',
    mailBody: 'Companions of Grace International · Northern New Jersey, United States. Email info@coginternational.org for mailing details.',
    stockTitle: 'Donate stock or assets',
    stockBody: 'Donating appreciated stock or other non-cash assets can allow a larger charitable contribution. Contact us to coordinate.',
    legacyTitle: 'Planned legacy giving',
    legacyBody: 'Wills, retirement plans, charitable trusts, and other planned gifts can create a lasting legacy of biblical stewardship.',
    faqTitle: 'Frequently asked questions',
  },
  resources: {
    heroTitle: 'Resources',
    heroSubtitle: 'Stories of transformation, testimonials, and insights from the COGI fellowship',
    cards: [
      { title: 'Stories of transformation', body: 'Watch and read how God is at work through healthcare professionals.', href: '/resources/stories', imageUrl: siteImages.pakistan, cta: 'Watch stories' },
      { title: 'Written testimonials', body: 'Reflections from program participants, churches, and partners.', href: '/resources/testimonials', imageUrl: siteImages.careHands },
      { title: 'Blog', body: 'Articles on missional living, programs, and partnerships.', href: '/resources/blog', imageUrl: siteImages.healthcareTeam },
    ],
  },
  contact: {
    heroTitle: 'Contact us',
    heroSubtitle: "We'd love to hear from you",
    imageUrl: siteImages.community,
    formTitle: 'Send a message',
    infoTitle: 'Contact information',
    socialTitle: 'Connect on social',
    mapNote: 'Companions of Grace International · Northern New Jersey, United States',
  },
  programs: {
    heroTitle: 'Our programs',
    heroSubtitle: 'Four ministry areas equipping healthcare professionals for Kingdom engagement',
    imageUrl: siteImages.clinic,
    learnMore: 'Learn more',
    expressInterest: 'Express interest',
  },
  events: {
    heroTitle: 'Events',
    heroSubtitle: 'Seminars, trainings, and immersive experiences',
    imageUrl: siteImages.historicGathering,
  },
  board: {
    heroTitle: 'Board members',
    heroSubtitle: 'Leaders committed to equipping healthcare professionals for Kingdom engagement',
    imageUrl: siteImages.healthcareTeam,
  },
  globalTeam: {
    heroTitle: 'Global team',
    heroSubtitle: 'Facilitators, mentors, and coordinators across our regions',
    imageUrl: siteImages.kenya,
  },
  partners: {
    heroTitle: 'Our partners',
    heroSubtitle: 'Collaborating to multiply missional healthcare impact',
    imageUrl: siteImages.hope,
  },
  storiesPage: {
    heroTitle: 'Stories of transformation',
    heroSubtitle: 'Watch and read how God is at work through healthcare professionals',
    imageUrl: siteImages.pakistan,
  },
  testimonials: {
    heroTitle: 'Written testimonials',
    heroSubtitle: 'Voices from the COGI global fellowship',
    imageUrl: siteImages.careHands,
  },
  blog: {
    heroTitle: 'Blog',
    heroSubtitle: 'Insights on missional healthcare, programs, and partnerships',
    imageUrl: siteImages.healthcareTeam,
    migrationNote: '',
  },
  search: {
    heroTitle: 'Search',
    heroSubtitle: 'Find programs, articles, events, and pages',
    placeholder: 'Search the site…',
    button: 'Search',
  },
}

export function mergeSiteCopy(partial?: Partial<SiteCopy> | null): SiteCopy {
  const d = defaultSiteCopy
  const p = partial ?? {}
  return {
    homepage: { ...d.homepage, ...p.homepage },
    about: { ...d.about, ...p.about },
    story: {
      ...d.story,
      ...p.story,
      milestones: p.story?.milestones?.length ? p.story.milestones : d.story.milestones,
    },
    beliefs: {
      ...d.beliefs,
      ...p.beliefs,
      items: p.beliefs?.items?.length ? p.beliefs.items : d.beliefs.items,
    },
    getInvolved: {
      ...d.getInvolved,
      ...p.getInvolved,
      pathways: p.getInvolved?.pathways?.length ? p.getInvolved.pathways : d.getInvolved.pathways,
    },
    donate: { ...d.donate, ...p.donate },
    resources: {
      ...d.resources,
      ...p.resources,
      cards: p.resources?.cards?.length ? p.resources.cards : d.resources.cards,
    },
    contact: { ...d.contact, ...p.contact },
    programs: { ...d.programs, ...p.programs },
    events: { ...d.events, ...p.events },
    board: { ...d.board, ...p.board },
    globalTeam: { ...d.globalTeam, ...p.globalTeam },
    partners: { ...d.partners, ...p.partners },
    storiesPage: { ...d.storiesPage, ...p.storiesPage },
    testimonials: { ...d.testimonials, ...p.testimonials },
    blog: { ...d.blog, ...p.blog },
    search: { ...d.search, ...p.search },
  }
}
