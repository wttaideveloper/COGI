import type { Core } from '@strapi/strapi';

const PUBLIC_READ_TYPES = [
  'api::global-setting.global-setting',
  'api::homepage.homepage',
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

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const publicRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) {
      strapi.log.warn('Public role not found; skipping permission bootstrap.');
      return;
    }

    for (const uid of PUBLIC_READ_TYPES) {
      await ensurePermission(strapi, publicRole.id, uid, 'find');
      await ensurePermission(strapi, publicRole.id, uid, 'findOne');
    }

    for (const uid of PUBLIC_CREATE_TYPES) {
      await ensurePermission(strapi, publicRole.id, uid, 'create');
    }

    strapi.log.info('COGI public API permissions configured.');
  },
};
