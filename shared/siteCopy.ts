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
  intro: 'https://www.youtube.com/watch?v=r6bd53UB7mk',
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
    closingTitle?: string
    closingBody?: string
    closingImageUrl?: string
    closingPrimaryLabel?: string
    closingPrimaryHref?: string
    closingSecondaryLabel?: string
    closingSecondaryHref?: string
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
    methods?: Array<{ id: string; title: string; subtitle: string; description: string; imageUrl?: string }>
    newsletterTitle: string
    newsletterDescription: string
    testimonialsEyebrow: string
    testimonialsTitle: string
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
  about: PageHeroCopy & { visionTitle: string; visionBody: string; missionTitle: string; missionBody: string; scripture: string }
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
    newsletterTitle: string; newsletterIntro: string; submitLabel: string
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
    giveUrl?: string
    giveCta: string
    mailTitle: string
    mailBody: string
    stockTitle: string
    stockBody: string
    legacyTitle: string
    legacyBody: string
    faqTitle: string
    faqs: Array<{ id: string; question: string; answer: string }>
  }
  resources: {
    kogVideoUrl?: string
    kogPosterUrl?: string
    exploreLabel: string
    heroTitle: string
    heroSubtitle: string
    imageUrl?: string
    cards: CopyBlock[]
  }
  contact: PageHeroCopy & { email: string; phone: string; office: string; submitLabel: string; formTitle: string; infoTitle: string; socialTitle: string; mapNote: string }
  programs: PageHeroCopy & { learnMore: string; expressInterest: string }
  events: PageHeroCopy & { featuredLabel: string; detailsLabel: string }
  board: PageHeroCopy & {
    members: Array<{ id: string; name: string; title: string; country: string; bio: string; imageUrl?: string }>
  }
  globalTeam: PageHeroCopy & {
    members: Array<{ id: string; name: string; title: string; region: string; country: string; bio: string; responsibilities?: string; contribution?: string; imageUrl?: string }>
  }
  partners: PageHeroCopy
  storiesPage: PageHeroCopy
  testimonials: PageHeroCopy
  blog: PageHeroCopy & { migrationNote: string }
  search: PageHeroCopy & { placeholder: string; button: string }
}

export const defaultSiteCopy: SiteCopy = {
  "homepage": {
    "closingTitle": "Your calling can make a difference",
    "closingBody": "Pray with us, join a learning community, or help bring training to healthcare professionals around the world.",
    "closingImageUrl": "/images/cogi-give.png",
    "closingPrimaryLabel": "Join the movement",
    "closingPrimaryHref": "/get-involved",
    "closingSecondaryLabel": "Support the mission",
    "closingSecondaryHref": "/donate",
    "newsletterTitle": "Stay connected",
    "newsletterDescription": "Subscribe to receive updates on programs, events, and stories from the COGI community.",
    "testimonialsEyebrow": "Voices from the fellowship",
    "testimonialsTitle": "From volunteers and partners",
    "eyebrow": "Companions of Grace International",
    "secondaryCtaLabel": "Explore Our Programs",
    "secondaryCtaHref": "/programs",
    "newsletterBannerTitle": "Stories of transformation",
    "newsletterBannerBody": "Watch and read how healthcare professionals, churches, and communities are being transformed across nations.",
    "newsletterBannerCta": "Watch stories",
    "legacyTitle": "Communities of Grace in healthcare",
    "legacyBody": "We are a global fellowship of Christ-followers cultivating Communities of Grace in healthcare by accompanying individuals and communities to develop a Kingdom perspective that shapes life, vocation, and service.",
    "videoTitle": "Meet Companions of Grace",
    "videoDescription": "A glimpse of our community, our calling, and the people we serve.",
    "videoImageUrl": "/images/cogi-video-thumb.png",
    "videoUrl": "",
    "methodsTitle": "Our methods",
    "methodsSubtitle": "Companionship for a life of mission",
    "portfolioTitle": "What we do",
    "portfolioSubtitle": "",
    "mapTitle": "Where we serve",
    "mapSubtitle": "Explore the programs and people serving across our global community.",
    "storiesTitle": "Stories of transformation",
    "storiesSubtitle": "Featured video and written stories from healthcare professionals on the front lines.",
    "watchStoriesCta": "Watch stories",
    "readStoriesCta": "Read stories",
    "impactTitle": "Our impact",
    "impactIntro": "Through communities of learning, mentoring, and mission, Companions of Grace is witnessing healthcare professionals, churches, and communities being transformed across nations. Every story reflects God's ongoing work of renewal through faithful healthcare witness.",
    "faithTitle": "Our beliefs",
    "faithStatement": "We believe in the full authority of Scripture; in God the Father, Son, and Holy Spirit; in the virgin birth, sinless life, atoning death, physical resurrection and return of our Lord Jesus Christ; in salvation by grace through faith; in the present ministry of the Holy Spirit; and in the urgency of fulfilling the Great Commission through the local church and every vocation — including healthcare.",
    "methods": [
      {
        "id": "encourage",
        "title": "Encourage",
        "subtitle": "",
        "description": "Encourage healthcare professionals through intentional companionship and mutual encouragement.",
        "imageUrl": "/images/cogi-gathering.png"
      },
      {
        "id": "equip",
        "title": "Equip",
        "subtitle": "",
        "description": "Equip healthcare professionals for missional healthcare engagement.",
        "imageUrl": "/images/cogi-train.png"
      },
      {
        "id": "envision",
        "title": "Envision",
        "subtitle": "",
        "description": "Envision healthcare professionals to become Christ-centered in life and vocation.",
        "imageUrl": "/images/cogi-india.png"
      },
      {
        "id": "empower",
        "title": "Empower",
        "subtitle": "",
        "description": "Empower healthcare professionals to embrace a biblical and missional perspective for healthcare.",
        "imageUrl": "/images/cogi-support.png"
      }
    ]
  },
  "about": {
    "heroTitle": "Vision & mission",
    "heroSubtitle": "Equipping healthcare professionals for Kingdom engagement",
    "imageUrl": "/images/cogi-enable.png",
    "visionTitle": "Our vision",
    "visionBody": "The Global Christian Healthcare Community actively on Mission for God.",
    "missionTitle": "Our mission",
    "missionBody": "Inspire and enable Christian healthcare workers to think, live and work missionally through Christ-centered training and companionship - advancing the Kingdom of God.",
    "scripture": "Colossians 3:17  ·  Romans 12:2"
  },
  "story": {
    "heroTitle": "Our story",
    "heroSubtitle": "A fellowship born from prayer, friendship, and Kingdom vision",
    "intro": "Companions of Grace International was born in 2019 through prayer and discernment among like-minded individuals carrying a shared conviction for Kingdom engagement and faithful Christian witness in the health fields of the world.",
    "imageUrl": "/images/homepage-c4c-india.jpg",
    "milestones": [
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
  },
  "beliefs": {
    "heroTitle": "Our beliefs",
    "heroSubtitle": "Essential convictions that underlie our mission and purpose",
    "intro": "We subscribe to the central beliefs of the Church.",
    "imageUrl": "/images/cogi-video-thumb.png",
    "items": [
      {
        "id": "belief-1",
        "title": "God",
        "content": "We believe there is one true God, eternally existing in three persons – Father, Son, and Holy Spirit- who we worship and glorify."
      },
      {
        "id": "belief-2",
        "title": "Jesus Christ",
        "content": "We believe in Jesus Christ, The Son of God, the Living Word (Logos), born of the virgin Mary, fully God and fully human - our Savior and Lord."
      },
      {
        "id": "belief-3",
        "title": "The Holy Spirit",
        "content": "We believe in the Holy Spirit – The Third Person of the Godhead, the giver of life, who glorifies Christ, convicts the world of sin, and accomplishes God's saving work in those who repent and believe — transforming and empowering them for witness and service through His gifts."
      },
      {
        "id": "belief-4",
        "title": "The Bible",
        "content": "We believe the Bible is the inspired, inerrant, and authoritative Word of God, forming the foundation of our faith, life, and mission."
      },
      {
        "id": "belief-5",
        "title": "The Universal Church",
        "content": "We believe in the Universal Church, for whom Christ is coming again, and with whom we seek to collaborate and partner in discipling and envisioning healthcare workers for missional healthcare"
      },
      {
        "id": "belief-6",
        "title": "The Image of God",
        "content": "We believe in the Imago Dei that all people are created in God's image, yet fallen and under the power of sin and death and cannot belong to the Kingdom of God except through the new birth in Christ Jesus. Justification is by grace through faith in Christ alone."
      },
      {
        "id": "belief-7",
        "title": "The Kingdom of God",
        "content": "We believe the Kingdom of God is His sovereign reign over creation, revealed and redeemed in Christ Jesus through His sinless life, atoning death, bodily resurrection, Heavenly ascension."
      },
      {
        "id": "belief-8",
        "title": "Redemption",
        "content": "We believe His redemptive work is restorative, reconciling, and life-giving, renewing all things toward God’s purposes and bringing justice, peace, and flourishing to creation."
      },
      {
        "id": "belief-9",
        "title": "The Return of Christ",
        "content": "We believe the Kingdom will be consummated at the return of Christ Jesus. Until then, we are called to follow Jesus and join Him in building His Kingdom."
      },
      {
        "id": "belief-10",
        "title": "Our Calling in Healthcare",
        "content": "We believe, the calling in healthcare, is lived out through faithful witness, missional engagement and compassionate care."
      }
    ]
  },
  "getInvolved": {
    "newsletterTitle": "Stay in touch",
    "newsletterIntro": "Subscribe for stories, events, and ways to serve.",
    "submitLabel": "Join the Movement",
    "heroTitle": "Get involved",
    "heroSubtitle": "Individual engagement and organizational partnership",
    "formTitle": "Join the movement",
    "formIntro": "Join a growing global fellowship of healthcare students, professionals, churches, and organizations committed to serving Christ and advancing God’s Kingdom through healthcare.",
    "imageUrl": "/images/cogi-kenya.png",
    "pathways": [
      {
        "title": "Individual engagement",
        "body": "Pray with our global community, participate in a training program, or volunteer your time and skills to support healthcare learning and ministry."
      },
      {
        "title": "Become a partner",
        "body": "Collaborate as a church, institution, organization, or ministry. Host a training program, connect healthcare professionals, or explore shared opportunities for mission."
      }
    ]
  },
  "donate": {
    "heroTitle": "Donate",
    "heroSubtitle": "You may not be able to travel, but your gift can.",
    "intro": "Help faculty travel to equip healthcare workers. Your support brings training and companionship to communities and helps missional healthcare grow.",
    "imageUrl": "/images/cogi-give.png",
    "giveTitle": "Buy Us a Coffee",
    "giveBody": "Turn the cost of your next coffee into encouragement for someone who cares for others. Your gift helps COGI faculty travel, train, and walk alongside healthcare professionals. Give once or make it a monthly act of kindness—choose an amount that works for you.",
    "giveCta": "Give a coffee-sized gift",
    "mailTitle": "Mail a check",
    "mailBody": "Companions of Grace International · Northern New Jersey, United States. Email info@coginternational.org for mailing details.",
    "stockTitle": "Donate stock or assets",
    "stockBody": "Donating appreciated stock or other non-cash assets can allow a larger charitable contribution. Contact us to coordinate.",
    "legacyTitle": "Planned legacy giving",
    "legacyBody": "Wills, retirement plans, charitable trusts, and other planned gifts can create a lasting legacy of biblical stewardship.",
    "faqTitle": "Frequently asked questions",
    "faqs": [
      {
        "id": "donate-how",
        "question": "How do I donate to COGI?",
        "answer": "Visit our Donate page to give one-time or recurring gifts through our secure GiveLively integration."
      },
      {
        "id": "donate-mail",
        "question": "Where should I mail a check?",
        "answer": "Companions of Grace International · Northern New Jersey, United States. Email info@coginternational.org for mailing details."
      },
      {
        "id": "faculty-travel",
        "question": "How does my gift support training?",
        "answer": "Gifts help faculty travel to training locations and equip healthcare workers. Contact us to discuss supporting a particular country or training journey."
      }
    ]
  },
  "resources": {
    "exploreLabel": "Explore",
    "heroTitle": "Resources",
    "heroSubtitle": "Stories of transformation, testimonials, and insights from the COGI fellowship",
    "cards": [
      {
        "title": "Stories of transformation",
        "body": "Watch and read how God is at work through healthcare professionals.",
        "href": "/resources/stories",
        "imageUrl": "/images/cogi-india.png",
        "cta": "Watch stories"
      },
      {
        "title": "Written testimonials",
        "body": "Reflections from program participants, churches, and partners.",
        "href": "/resources/testimonials",
        "imageUrl": "/images/cogi-support.png"
      },
      {
        "title": "Blog",
        "body": "Articles on missional living, programs, and partnerships.",
        "href": "/resources/blog",
        "imageUrl": "/images/cogi-gathering.png"
      }
    ]
  },
  "contact": {
    "email": "",
    "phone": "",
    "office": "",
    "submitLabel": "Send Message",
    "heroTitle": "Contact us",
    "heroSubtitle": "We'd love to hear from you",
    "imageUrl": "/images/cogi-hero.png",
    "formTitle": "Send a message",
    "infoTitle": "Contact information",
    "socialTitle": "Connect on social",
    "mapNote": "Companions of Grace International · Northern New Jersey, United States"
  },
  "programs": {
    "heroTitle": "Our programs",
    "heroSubtitle": "Four ministry areas equipping healthcare professionals for Kingdom engagement",
    "imageUrl": "/images/cogi-train.png",
    "learnMore": "Learn more",
    "expressInterest": "Express interest"
  },
  "events": {
    "featuredLabel": "Featured",
    "detailsLabel": "View details",
    "heroTitle": "Events",
    "heroSubtitle": "Seminars, trainings, and immersive experiences",
    "imageUrl": "/images/cogi-gathering.png"
  },
  "board": {
    "heroTitle": "Board members",
    "heroSubtitle": "Leaders committed to equipping healthcare professionals for Kingdom engagement",
    "imageUrl": "/images/cogi-support.png",
    "members": [
      {
        "id": "abraham-thomas",
        "name": "Abraham Thomas",
        "title": "Chairman",
        "country": "United States",
        "bio": "With over three decades of experience in healthcare and church leadership, Abe serves as Chairman of the COGI Board. Based in New Jersey, he is a practicing pediatrician, President of the U.S. Chapter of Helping Hands for Hospitals, and an Elder at The Life Christian Church in West Orange. He and his wife, Ruby, have two sons, Ashish and Vivek; Vivek is married to Savannah, and they have a daughter, Georgia."
      },
      {
        "id": "mathew-george",
        "name": "Mathew George Mulavelil",
        "title": "CEO & President",
        "country": "India",
        "bio": "Mathew George Mulavelil has devoted much of his career to healthcare mission, leadership, and formation. He spent two decades with the Emmanuel Hospital Association (EHA), based at Duncan Hospital, where he and his wife, Latha Mathew, pioneered its dental missions, establishing 14 dental units across the network, including the first at Duncan Hospital. He later served as Managing Director of Duncan Hospital. He then spent seven years with the Evangelical Medical Fellowship of India (EMFI), leading its Missions Department, where he developed mission training initiatives and strengthened its graduate ministry. As CEO and President of COGI, he continues to equip and mentor healthcare professionals for Kingdom engagement. He and Latha have a daughter, Rachel."
      },
      {
        "id": "charles-faust",
        "name": "Charles Faust",
        "title": "Treasurer",
        "country": "United States",
        "bio": "Chuck is a retired business executive who brings extensive global leadership experience from senior operating and financial roles with multinational companies headquartered in the United States, Japan, and Hong Kong. As COGI’s Treasurer and a close advisor to the CEO, he provides leadership in the development and oversight of the organization’s financial and administrative systems. He also contributes to COGI’s curriculum, particularly the Care for the Caregiver program, and assists with editing training resources. Chuck serves as an Elder in his local church. He and his wife, Mary, have been married for 40 years and live near Boise, Idaho, where they enjoy time with their three children and six grandchildren."
      },
      {
        "id": "ted-lang",
        "name": "Ted Lang",
        "title": "Secretary",
        "country": "United States",
        "bio": ""
      },
      {
        "id": "sunil-abraham",
        "name": "Sunil Abraham",
        "title": "Board Member",
        "country": "Australia",
        "bio": "Sunil Abraham is a practising Family Physician based in Rockhampton, Queensland, Australia. He previously served as Professor and Head of the Department of Family Medicine at Christian Medical College (CMC), Vellore, India, becoming India’s first Professor of Family Medicine. Known for his wisdom, warmth, and thoughtful approach, he is deeply committed to serving God through healthcare, with a particular passion for discipleship and mentoring. He is also actively involved in ministry among the homeless through his church and community organizations. He is married to Mary, an ENT surgeon, and they have two daughters, Joanna and Erica."
      },
      {
        "id": "enoch-osafo",
        "name": "Enoch Osafo",
        "title": "Board Member",
        "country": "Ghana",
        "bio": "Mr. Enoch Osafo is a Lay Preacher in the Methodist Church Ghana, a registered Pharmacist with a Master’s in Public Health and an LLB. He is deeply committed to discipleship, initiatives of compassion, and the integration of faith and work. As former Health Director of the Methodist Church Ghana and Acting Director of Methodist Development and Relief Services, he helped strengthen the Church’s health and humanitarian ministries. His commitment to equipping healthcare professionals for mission led to the formation of the Annual Methodist Health Professionals Conference and Methodist Health Students in Mission. He has also engaged with US-based 501(c) organizations and the World Bank, strengthening systems that promote health and human dignity. He and his wife, Dr. Charlotte Osafo, a nephrologist and pioneer in kidney transplantation in Ghana, have four children—Sally, Benny, Lisbeth, and Lizette."
      },
      {
        "id": "molly-thomas",
        "name": "Molly Thomas",
        "title": "Board Member",
        "country": "United Kingdom",
        "bio": "Molly is a dermatologist with over two decades of experience in mission healthcare, having served as a Consultant and Head of the Department at two mission hospitals in rural India before relocating to the United Kingdom. She remains deeply committed to nurturing Kingdom-minded healthcare professionals and strengthening healthcare mission initiatives. She and her husband, Viju John, a pediatric surgeon, have three children."
      }
    ]
  },
  "globalTeam": {
    "heroTitle": "Global team",
    "heroSubtitle": "The faces of COGI",
    "imageUrl": "/images/cogi-hero.png",
    "members": [
      {
        "id": "uganda-proscovia",
        "name": "Proscovia",
        "country": "Uganda",
        "region": "Africa",
        "title": "",
        "bio": ""
      },
      {
        "id": "uganda-gideon",
        "name": "Gideon",
        "country": "Uganda",
        "region": "Africa",
        "title": "",
        "bio": ""
      },
      {
        "id": "tanzania-lindeal",
        "name": "Lindeal",
        "country": "Tanzania",
        "region": "Africa",
        "title": "",
        "bio": ""
      },
      {
        "id": "tanzania-cornell",
        "name": "Cornell",
        "country": "Tanzania",
        "region": "Africa",
        "title": "",
        "bio": ""
      },
      {
        "id": "tanzania-samwell",
        "name": "Samwell",
        "country": "Tanzania",
        "region": "Africa",
        "title": "",
        "bio": ""
      },
      {
        "id": "tanzania-emile",
        "name": "Emile",
        "country": "Tanzania",
        "region": "Africa",
        "title": "",
        "bio": ""
      },
      {
        "id": "kenya-joan",
        "name": "Joan",
        "country": "Kenya",
        "region": "Africa",
        "title": "",
        "bio": ""
      },
      {
        "id": "kenya-mugo",
        "name": "Mugo",
        "country": "Kenya",
        "region": "Africa",
        "title": "",
        "bio": ""
      },
      {
        "id": "kenya-cynthia",
        "name": "Cynthia",
        "country": "Kenya",
        "region": "Africa",
        "title": "",
        "bio": ""
      },
      {
        "id": "kenya-lorna",
        "name": "Lorna",
        "country": "Kenya",
        "region": "Africa",
        "title": "",
        "bio": ""
      },
      {
        "id": "kenya-lorraine",
        "name": "Lorraine",
        "country": "Kenya",
        "region": "Africa",
        "title": "",
        "bio": ""
      },
      {
        "id": "kenya-crystal",
        "name": "Crystal",
        "country": "Kenya",
        "region": "Africa",
        "title": "",
        "bio": ""
      },
      {
        "id": "kenya-paul",
        "name": "Paul",
        "country": "Kenya",
        "region": "Africa",
        "title": "",
        "bio": ""
      },
      {
        "id": "kenya-joash",
        "name": "Joash",
        "country": "Kenya",
        "region": "Africa",
        "title": "",
        "bio": ""
      },
      {
        "id": "ghana-enoch",
        "name": "Enoch",
        "country": "Ghana",
        "region": "Africa",
        "title": "",
        "bio": ""
      },
      {
        "id": "ghana-king",
        "name": "King",
        "country": "Ghana",
        "region": "Africa",
        "title": "",
        "bio": ""
      },
      {
        "id": "ghana-diladem",
        "name": "Diladem",
        "country": "Ghana",
        "region": "Africa",
        "title": "",
        "bio": ""
      },
      {
        "id": "ghana-samuel-elorm",
        "name": "Samuel Elorm",
        "country": "Ghana",
        "region": "Africa",
        "title": "",
        "bio": ""
      },
      {
        "id": "ghana-kupalorm",
        "name": "Kupalorm",
        "country": "Ghana",
        "region": "Africa",
        "title": "",
        "bio": ""
      },
      {
        "id": "india-blessena",
        "name": "Blessena",
        "country": "India",
        "region": "Asia-Pacific",
        "title": "",
        "bio": ""
      },
      {
        "id": "india-swaroop",
        "name": "Swaroop",
        "country": "India",
        "region": "Asia-Pacific",
        "title": "",
        "bio": ""
      },
      {
        "id": "india-vivek-sunny",
        "name": "Vivek Sunny",
        "country": "India",
        "region": "Asia-Pacific",
        "title": "",
        "bio": ""
      },
      {
        "id": "india-abilash",
        "name": "Abilash",
        "country": "India",
        "region": "Asia-Pacific",
        "title": "",
        "bio": ""
      },
      {
        "id": "india-martin",
        "name": "Martin",
        "country": "India",
        "region": "Asia-Pacific",
        "title": "",
        "bio": ""
      },
      {
        "id": "india-vineeth",
        "name": "Vineeth",
        "country": "India",
        "region": "Asia-Pacific",
        "title": "",
        "bio": ""
      },
      {
        "id": "philippines-stella-osorio",
        "name": "Stella Osorio",
        "country": "Philippines",
        "region": "Asia-Pacific",
        "title": "",
        "bio": ""
      },
      {
        "id": "singapore-wee-king",
        "name": "Wee King",
        "country": "Singapore",
        "region": "Asia-Pacific",
        "title": "",
        "bio": ""
      },
      {
        "id": "indonesia-junirita",
        "name": "Junirita",
        "country": "Indonesia",
        "region": "Asia-Pacific",
        "title": "",
        "bio": ""
      }
    ]
  },
  "partners": {
    "heroTitle": "Our partners",
    "heroSubtitle": "Collaborating to multiply missional healthcare impact",
    "imageUrl": "/images/cogi-give.png"
  },
  "storiesPage": {
    "heroTitle": "Stories of transformation",
    "heroSubtitle": "Watch and read how God is at work through healthcare professionals",
    "imageUrl": "/images/cogi-india.png"
  },
  "testimonials": {
    "heroTitle": "Written testimonials",
    "heroSubtitle": "Voices from the COGI global fellowship",
    "imageUrl": "/images/cogi-support.png"
  },
  "blog": {
    "heroTitle": "Blog",
    "heroSubtitle": "Insights on missional healthcare, programs, and partnerships",
    "imageUrl": "/images/cogi-gathering.png",
    "migrationNote": ""
  },
  "search": {
    "heroTitle": "Search",
    "heroSubtitle": "Find programs, articles, events, and pages",
    "imageUrl": "/images/cogi-hero.png",
    "placeholder": "Search the site…",
    "button": "Search"
  }
}

function preferText(value: string | undefined, fallback: string) {
  return (value ?? '').trim() ? String(value).trim() : fallback
}

function preferUrl(value: string | undefined, fallback: string): string
function preferUrl(value: string | undefined, fallback?: string): string | undefined
function preferUrl(value: string | undefined, fallback?: string) {
  if (value === undefined) return fallback
  return value
}

export function stripHtml(value: string | undefined) {
  return (value ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function mergeSiteCopy(partial?: Partial<SiteCopy> | null): SiteCopy {
  const d = defaultSiteCopy
  const p = partial ?? {}
  return {
    homepage: { ...d.homepage, ...p.homepage },
    about: {
      ...d.about,
      ...p.about,
      heroTitle: preferText(p.about?.heroTitle, d.about.heroTitle),
      heroSubtitle: preferText(p.about?.heroSubtitle, d.about.heroSubtitle),
      visionTitle: preferText(p.about?.visionTitle, d.about.visionTitle),
      visionBody: preferText(p.about?.visionBody, d.about.visionBody),
      missionTitle: preferText(p.about?.missionTitle, d.about.missionTitle),
      missionBody: preferText(p.about?.missionBody, d.about.missionBody),
      scripture: preferText(p.about?.scripture, d.about.scripture),
      imageUrl: preferUrl(p.about?.imageUrl, d.about.imageUrl),
    },
    story: {
      ...d.story,
      ...p.story,
      milestones: Array.isArray(p.story?.milestones) ? p.story!.milestones : d.story.milestones,
    },
    beliefs: {
      ...d.beliefs,
      ...p.beliefs,
      intro: p.beliefs?.intro === "We subscribe to the central beliefs of the historic church." ? d.beliefs.intro : p.beliefs?.intro || d.beliefs.intro,
      items: Array.isArray(p.beliefs?.items) ? p.beliefs!.items : d.beliefs.items,
    },
    getInvolved: {
      ...d.getInvolved,
      ...p.getInvolved,
      imageUrl: preferUrl(p.getInvolved?.imageUrl, d.getInvolved.imageUrl),
      pathways: Array.isArray(p.getInvolved?.pathways) ? p.getInvolved!.pathways : d.getInvolved.pathways,
    },
    donate: {
      ...d.donate,
      ...p.donate,
      imageUrl: preferUrl(p.donate?.imageUrl, d.donate.imageUrl),
      faqs: Array.isArray(p.donate?.faqs) ? p.donate!.faqs : d.donate.faqs,
    },
    resources: {
      ...d.resources,
      ...p.resources,
      imageUrl: preferUrl(p.resources?.imageUrl, d.resources.imageUrl),
      cards: Array.isArray(p.resources?.cards) ? p.resources!.cards : d.resources.cards,
    },
    contact: {
      ...d.contact,
      ...p.contact,
      imageUrl: preferUrl(p.contact?.imageUrl, d.contact.imageUrl),
    },
    programs: {
      ...d.programs,
      ...p.programs,
      imageUrl: preferUrl(p.programs?.imageUrl, d.programs.imageUrl),
    },
    events: {
      ...d.events,
      ...p.events,
      imageUrl: preferUrl(p.events?.imageUrl, d.events.imageUrl),
    },
    board: {
      ...d.board,
      ...p.board,
      members: (Array.isArray(p.board?.members) ? p.board!.members : d.board.members).map((member) => ({
        ...member,
        name: stripHtml(member.name),
        title: stripHtml(member.title),
        country: stripHtml(member.country),
        bio: stripHtml(member.bio),
      })),
    },
    globalTeam: {
      ...d.globalTeam,
      ...p.globalTeam,
      members: (Array.isArray(p.globalTeam?.members) ? p.globalTeam!.members : d.globalTeam.members).map((member) => ({
        ...member,
        name: stripHtml(member.name),
        title: stripHtml(member.title),
        region: stripHtml(member.region),
        country: stripHtml(member.country),
        bio: stripHtml(member.bio),
      })),
    },
    partners: { ...d.partners, ...p.partners },
    storiesPage: { ...d.storiesPage, ...p.storiesPage, imageUrl: preferUrl(p.storiesPage?.imageUrl, d.storiesPage.imageUrl) },
    testimonials: { ...d.testimonials, ...p.testimonials, imageUrl: preferUrl(p.testimonials?.imageUrl, d.testimonials.imageUrl) },
    blog: { ...d.blog, ...p.blog, imageUrl: preferUrl(p.blog?.imageUrl, d.blog.imageUrl) },
    search: { ...d.search, ...p.search, imageUrl: preferUrl(p.search?.imageUrl, d.search.imageUrl) },
  }
}
