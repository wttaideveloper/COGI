import type { Core } from '@strapi/strapi';

const PUBLIC_READ_TYPES = [
  'api::global-setting.global-setting',
  'api::homepage.homepage',
  'api::site-config.site-config',
  'api::header-setting.header-setting',
  'api::footer-setting.footer-setting',
  'api::page.page',
  'api::program.program',
  'api::news-article.news-article',
  'api::news-category.news-category',
  'api::event.event',
  'api::event-category.event-category',
  'api::team-member.team-member',
  'api::partner.partner',
  'api::testimonial.testimonial',
  'api::story.story',
  'api::publication.publication',
  'api::gallery-album.gallery-album',
  'api::location.location',
  'api::faq.faq',
  'api::navigation-menu.navigation-menu',
] as const;

const PUBLIC_CREATE_TYPES = [
  'api::contact-enquiry.contact-enquiry',
  'api::newsletter-subscriber.newsletter-subscriber',
] as const;

const AUTH_FULL_TYPES = [
  'api::global-setting.global-setting',
  'api::homepage.homepage',
  'api::site-config.site-config',
  'api::header-setting.header-setting',
  'api::footer-setting.footer-setting',
  'api::page.page',
  'api::program.program',
  'api::news-article.news-article',
  'api::news-category.news-category',
  'api::event.event',
  'api::event-category.event-category',
  'api::team-member.team-member',
  'api::partner.partner',
  'api::testimonial.testimonial',
  'api::story.story',
  'api::publication.publication',
  'api::gallery-album.gallery-album',
  'api::location.location',
  'api::faq.faq',
  'api::navigation-menu.navigation-menu',
  'api::contact-enquiry.contact-enquiry',
  'api::newsletter-subscriber.newsletter-subscriber',
] as const;

const AUTH_ACTIONS = ['find', 'findOne', 'create', 'update', 'delete'] as const;

const AUTH_PUBLISH_ACTIONS = ['publish', 'unpublish'] as const;

const AUTH_UPLOAD_ACTIONS = [
  'content-api.upload',
  'content-api.destroy',
  'content-api.find',
  'content-api.findOne',
] as const;

const AUTH_PUBLISH_TYPES = [
  'api::site-config.site-config',
  'api::homepage.homepage',
  'api::page.page',
  'api::program.program',
  'api::news-article.news-article',
  'api::event.event',
  'api::story.story',
  'api::testimonial.testimonial',
  'api::team-member.team-member',
  'api::partner.partner',
  'api::location.location',
] as const;

async function ensurePermission(
  strapi: Core.Strapi,
  roleId: number,
  uid: string,
  action: string,
) {
  const permissionAction = `${uid}.${action}`;
  const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
    where: { role: roleId, action: permissionAction },
  });

  if (!existing) {
    await strapi.db.query('plugin::users-permissions.permission').create({
      data: { role: roleId, action: permissionAction },
    });
  }
}

async function ensureRolePermissions(
  strapi: Core.Strapi,
  roleType: 'public' | 'authenticated',
) {
  const role = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: roleType } });

  if (!role) {
    strapi.log.warn(`Role "${roleType}" not found; skipping permission bootstrap.`);
    return;
  }

  if (roleType === 'public') {
    for (const uid of PUBLIC_READ_TYPES) {
      await ensurePermission(strapi, role.id, uid, 'find');
      await ensurePermission(strapi, role.id, uid, 'findOne');
    }
    for (const uid of PUBLIC_CREATE_TYPES) {
      await ensurePermission(strapi, role.id, uid, 'create');
    }
    return;
  }

  for (const uid of AUTH_FULL_TYPES) {
    for (const action of AUTH_ACTIONS) {
      await ensurePermission(strapi, role.id, uid, action);
    }
  }
  for (const uid of AUTH_PUBLISH_TYPES) {
    for (const action of AUTH_PUBLISH_ACTIONS) {
      await ensurePermission(strapi, role.id, uid, action);
    }
  }
  for (const action of AUTH_UPLOAD_ACTIONS) {
    await ensurePermission(strapi, role.id, 'plugin::upload', action);
  }
}

const SEED_HOMEPAGE = {
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
    "<p>Inspire and enable transformation so healthcare professionals think, live, and work missionally — reflecting God's love and ushering in His Kingdom in every place they serve.</p>",
  missionScripture: 'Colossians 3:17 · Romans 12:2',
  videoUrl: '',
  videoHeading: 'Watch Our Story',
  methods: [
    {
      title: 'Enable',
      description:
        "Inspire healthcare professionals to perceive their work beyond their job — understanding the times and God's calling wherever He has placed them.",
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
    { value: '1,000', suffix: '+', label: 'Patients served through partners' },
    { value: '200', suffix: '+', label: 'Volunteers & facilitators mobilized' },
    { value: '10', suffix: '+', label: 'Countries engaged' },
    { value: '500', suffix: '+', label: 'Healthcare professionals equipped' },
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

const SEED_PROGRAM = {
  title: 'Kingdom of God',
  slug: 'kingdom-of-god',
  summary:
    'An introductory one-day seminar on the Kingdom of God with life application in the context of healthcare, plus Discovery Series for small groups.',
  body: '<p>Facilitated deeper studies on the Perspectives and Lifestyles of the Kingdom in Healthcare. What began as the Kingdom of God in Healthcare program equips professionals to honor the Lord Jesus in their profession and be a blessing to patients and communities.</p>',
  area: 'kingdom-of-god',
  experiences: [
    { title: 'Kingdom of God Seminar', description: 'One-day introductory seminar on the Kingdom of God in healthcare.' },
    { title: 'Discovery Series', description: 'Two series of studies for small groups exploring Kingdom perspectives.' },
  ],
  cta: { label: 'Express Interest', url: '/contact?program=kingdom-of-god', variant: 'primary' },
  order: 1,
  featured: true,
};

const SEED_NEWS_ARTICLE = {
  title: 'Welcome to the New COGI Website',
  slug: 'welcome-to-the-new-cogi-website',
  summary:
    'We are excited to launch our refreshed digital platform to equip and connect the global healthcare community.',
  body: '<p>Companions of Grace International is pleased to present a new website to better serve healthcare professionals around the world.</p><p>Explore our programs, stories, and resources — and reach out to get involved.</p>',
  author: 'COGI Communications',
  featured: true,
};

async function ensureAuthUser(strapi: Core.Strapi, email: string, password: string, username: string) {
  const existing = await strapi.db
    .query('plugin::users-permissions.user')
    .findOne({ where: { email } });

  if (existing) return;

  const role = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'authenticated' } });

  if (!role) {
    strapi.log.warn('Authenticated role not found; skipping admin auth user creation.');
    return;
  }

  try {
    await strapi.plugin('users-permissions').service('user').add({
      username,
      email,
      password,
      role: role.id,
      confirmed: true,
      provider: 'local',
    });
    strapi.log.info(`Created users-permissions auth user: ${email}`);
  } catch (error) {
    strapi.log.warn(`Failed to create auth user: ${String(error)}`);
  }
}

async function seedSingleType(strapi: Core.Strapi, uid: string, data: Record<string, unknown>) {
  try {
    const docs: any = strapi.documents(uid as any);
    const existing = await docs.findMany({});
    const count = Array.isArray(existing) ? existing.length : existing?.results?.length;
    if (count) return;

    const doc = await docs.create({ data });
    const documentId = doc?.documentId;
    if (documentId && typeof docs.publish === 'function') {
      await docs.publish({ documentId });
    }
    strapi.log.info(`Seeded ${uid}`);
  } catch (error) {
    strapi.log.warn(`Failed to seed ${uid}: ${String(error)}`);
  }
}

async function seedCollection(strapi: Core.Strapi, uid: string, data: Record<string, unknown>) {
  try {
    const docs: any = strapi.documents(uid as any);
    const existing = await docs.findMany({});
    if (existing?.results?.length) return;

    const doc = await docs.create({ data });
    const documentId = doc?.documentId;
    if (documentId) {
      await docs.publish({ documentId });
    }
    strapi.log.info(`Seeded ${uid}`);
  } catch (error) {
    strapi.log.warn(`Failed to seed ${uid}: ${String(error)}`);
  }
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensureRolePermissions(strapi, 'public');
    await ensureRolePermissions(strapi, 'authenticated');
    await ensureAuthUser(strapi, 'admin@cogi.local', 'admin123', 'cogi-admin');
    await ensureAuthUser(strapi, 'jamuna2580james@gmail.com', 'Qwert@123', 'jamuna');

    await seedSingleType(strapi, 'api::homepage.homepage', SEED_HOMEPAGE);
    await seedSingleType(strapi, 'api::global-setting.global-setting', {
      organizationName: 'Companions of Grace International',
      tagline: 'Equipping Healthcare Professionals for Kingdom Engagement',
      primaryEmail: 'info@coginternational.org',
      mission:
        "Inspire and enable transformation so healthcare professionals think, live, and work missionally — reflecting God's love and ushering in His Kingdom in every place they serve.",
      vision: 'Communities of Grace among healthcare professionals worldwide.',
    });
    await seedCollection(strapi, 'api::program.program', SEED_PROGRAM);
    await seedCollection(strapi, 'api::news-article.news-article', SEED_NEWS_ARTICLE);

    strapi.log.info('COGI public API permissions configured.');
  },
};
