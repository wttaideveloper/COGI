/**
 * COGI Strapi seed script
 *
 * Usage (after first `npm run develop` creates the database):
 *   npm run seed
 *
 * Requires Strapi to be buildable. Loads the app, seeds content, then exits.
 */
import { createStrapi } from '@strapi/strapi';
import {
  globalSettingData,
  homepageData,
  headerSettingData,
  footerSettingData,
  programsData,
  teamMembersData,
  partnersData,
  testimonialsData,
  locationsData,
  navigationMenusData,
  faqsData,
} from '../src/seed/seed-data';

type StrapiLike = any;

async function publishDocument(strapi: StrapiLike, uid: string, documentId: string) {
  try {
    await strapi.documents(uid).publish({ documentId });
  } catch {
    // Already published or single-type without publish workflow
  }
}

async function seedSingleType(strapi: StrapiLike, uid: string, data: Record<string, unknown>) {
  const existing = await strapi.documents(uid).findFirst({});
  if (existing) {
    await strapi.documents(uid).update({
      documentId: existing.documentId,
      data,
    });
    console.log(`  Updated ${uid}`);
  } else {
    await strapi.documents(uid).create({ data });
    console.log(`  Created ${uid}`);
  }
}

async function seedCollection(
  strapi: StrapiLike,
  uid: string,
  items: Record<string, unknown>[],
  uniqueField = 'slug',
) {
  for (const item of items) {
    const key = item[uniqueField] as string;
    const existing = await strapi.documents(uid).findMany({
      filters: { [uniqueField]: { $eq: key } },
      limit: 1,
    });

    if (existing.length > 0) {
      await strapi.documents(uid).update({
        documentId: existing[0].documentId,
        data: item,
      });
      await publishDocument(strapi, uid, existing[0].documentId);
      console.log(`  Updated ${uid}: ${key}`);
    } else {
      const created = await strapi.documents(uid).create({
        data: item,
        status: 'published',
      });
      await publishDocument(strapi, uid, created.documentId);
      console.log(`  Created ${uid}: ${key}`);
    }
  }
}

async function seed(strapi: Core.Strapi) {
  console.log('Seeding global settings...');
  await seedSingleType(strapi, 'api::global-setting.global-setting', globalSettingData);

  console.log('Seeding navigation menus...');
  await seedCollection(strapi, 'api::navigation-menu.navigation-menu', navigationMenusData);

  const headerMenu = await strapi.documents('api::navigation-menu.navigation-menu').findMany({
    filters: { slug: { $eq: 'main-header' } },
    limit: 1,
  });

  console.log('Seeding header/footer settings...');
  await seedSingleType(strapi, 'api::header-setting.header-setting', {
    ...headerSettingData,
    navigationMenu: headerMenu[0]?.documentId,
  });

  const footerMenu = await strapi.documents('api::navigation-menu.navigation-menu').findMany({
    filters: { slug: { $eq: 'footer-main' } },
    limit: 1,
  });

  await seedSingleType(strapi, 'api::footer-setting.footer-setting', {
    ...footerSettingData,
    menus: footerMenu[0] ? [footerMenu[0].documentId] : [],
  });

  console.log('Seeding programs...');
  await seedCollection(strapi, 'api::program.program', programsData);

  console.log('Seeding locations...');
  await seedCollection(strapi, 'api::location.location', locationsData, 'country');

  console.log('Seeding team members...');
  await seedCollection(strapi, 'api::team-member.team-member', teamMembersData);

  console.log('Seeding partners...');
  await seedCollection(strapi, 'api::partner.partner', partnersData);

  console.log('Seeding testimonials...');
  for (const testimonial of testimonialsData) {
    const existing = await strapi.documents('api::testimonial.testimonial').findMany({
      filters: { author: { $eq: testimonial.author } },
      limit: 1,
    });
    if (existing.length > 0) {
      await strapi.documents('api::testimonial.testimonial').update({
        documentId: existing[0].documentId,
        data: testimonial,
      });
    } else {
      await strapi.documents('api::testimonial.testimonial').create({
        data: testimonial,
        status: 'published',
      });
    }
  }

  console.log('Seeding FAQs...');
  await seedCollection(strapi, 'api::faq.faq', faqsData, 'question');

  console.log('Seeding homepage...');
  await seedSingleType(strapi, 'api::homepage.homepage', homepageData);
  const homepage = await strapi.documents('api::homepage.homepage').findFirst({});
  if (homepage) {
    await publishDocument(strapi, 'api::homepage.homepage', homepage.documentId);
  }

  console.log('COGI seed complete.');
}

async function main() {
  const appContext = await createStrapi({ distDir: './dist' });
  const strapi = await appContext.load();

  try {
    await seed(strapi);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await strapi.destroy();
  }
}

main();
