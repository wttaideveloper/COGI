const fs = require('node:fs');
const path = require('node:path');
const { createStrapi } = require('@strapi/strapi');

// Run from strapi-backend after compiling its TypeScript configuration.
async function main() {
  const publicDir = path.resolve(process.env.WEBSITE_PUBLIC_DIR || '../public-website/public');
  const snapshotPath = path.join(publicDir, 'site-config.json');
  const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
  fs.mkdirSync(path.resolve('public/uploads'), { recursive: true });
  const strapi = await createStrapi({ distDir: './dist' }).load();
  try {
    if (process.argv.includes('--if-newer')) {
      const live = await strapi.documents('api::site-config.site-config').findFirst({ status: 'published' });
      const incomingTime = Date.parse(snapshot.updatedAt) || 0;
      const liveTime = Date.parse(live?.payload?.updatedAt) || 0;
      if (!incomingTime) throw new Error('Deployment snapshot needs a valid updatedAt timestamp.');
      if (liveTime >= incomingTime) {
        console.log('Published CMS content is already current; preserving it.');
        return;
      }
    }
    async function upsert(uid, key, value, data) {
      const documents = strapi.documents(uid);
      const existing = await documents.findFirst({ filters: { [key]: value }, status: 'draft' });
      const document = existing
        ? await documents.update({ documentId: existing.documentId, data })
        : await documents.create({ data });
      await documents.publish({ documentId: document.documentId });
      return document.documentId;
    }

    const programIds = new Map();
    for (const row of snapshot.content['/programs']) {
      const documentId = await upsert('api::program.program', 'slug', row.slug, {
        title: row.title,
        slug: row.slug,
        summary: row.summary,
        body: row.body,
        area: row.slug === 'care-for-the-caregiver' ? 'care-for-caregiver' : row.slug,
        experiences: row.experiences,
        order: row.order,
        featured: true,
        cta: { label: 'Express interest', url: `/get-involved?program=${row.slug}#form`, variant: 'primary' },
      });
      programIds.set(row.title, documentId);
    }

    for (const row of snapshot.content['/locations']) {
      await upsert('api::location.location', 'country', row.country, {
        country: row.country, slug: row.id, region: row.region,
        summary: row.programs.join(' · '), programs: row.programs, latitude: row.lat, longitude: row.lng,
      });
    }

    const mediaIds = new Map();
    async function upload(url) {
      if (mediaIds.has(url)) return mediaIds.get(url);
      const filename = path.join(publicDir, url.replace(/^\/+/, ''));
      const name = path.basename(filename);
      const existing = await strapi.db.query('plugin::upload.file').findOne({ where: { name } });
      if (existing) { mediaIds.set(url, existing.id); return existing.id; }
      const ext = path.extname(filename).toLowerCase();
      const mimetype = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml' }[ext];
      const [file] = await strapi.plugin('upload').service('upload').upload({
        data: { fileInfo: { name, alternativeText: name.replace(/[-_]/g, ' ').replace(/\.[^.]+$/, '') } },
        files: { filepath: filename, originalFilename: name, mimetype, size: fs.statSync(filename).size },
      });
      mediaIds.set(url, file.id);
      return file.id;
    }

    const imageUrls = new Set();
    function collect(value) {
      if (typeof value === 'string' && value.startsWith('/images/')) imageUrls.add(value);
      else if (Array.isArray(value)) value.forEach(collect);
      else if (value && typeof value === 'object') Object.values(value).forEach(collect);
    }
    collect(snapshot);
    for (const url of imageUrls) await upload(url);

    for (const row of snapshot.content['/partners']) {
      await upsert('api::partner.partner', 'slug', row.id, {
        name: row.name, slug: row.id, url: row.url, description: row.description,
        region: row.region, order: row.order, logo: row.logoUrl ? await upload(row.logoUrl) : undefined,
      });
    }
    for (const row of snapshot.content['/testimonials']) {
      await upsert('api::testimonial.testimonial', 'author', row.author, {
        author: row.author, quote: row.quote, country: row.country,
        program: programIds.get(row.program), featured: row.featured, mediaType: row.mediaType,
      });
    }
    for (const row of snapshot.content['/stories']) {
      await upsert('api::story.story', 'slug', row.slug, {
        title: row.title, slug: row.slug, summary: row.summary, body: row.content,
        country: row.country, program: programIds.get(row.program), type: row.type,
        featured: row.featured, videoUrl: row.videoUrl,
        thumbnail: row.imageUrl ? await upload(row.imageUrl) : undefined,
      });
    }
    for (const [role, members] of [['board', snapshot.copy.board.members], ['global-team', snapshot.copy.globalTeam.members]]) {
      for (const [index, row] of members.entries()) {
        await upsert('api::team-member.team-member', 'slug', row.id, {
          name: row.name, slug: row.id, title: row.title, role, bio: row.bio,
          region: row.region || row.country, order: index + 1, publicVisibility: true,
        });
      }
    }
    const configDocuments = strapi.documents('api::site-config.site-config');
    const existing = await configDocuments.findFirst({ status: 'draft' });
    const config = existing
      ? await configDocuments.update({ documentId: existing.documentId, data: { payload: snapshot } })
      : await configDocuments.create({ data: { payload: snapshot } });
    await configDocuments.publish({ documentId: config.documentId });
    const saved = await configDocuments.findFirst({ status: 'published' });
    if (!require('node:util').isDeepStrictEqual(saved.payload, snapshot)) throw new Error('Published site configuration did not match the import.');
    console.log(`Imported and verified site configuration, programs, locations, partners, testimonials, teams, and ${mediaIds.size} media files.`);
  } finally {
    await strapi.destroy();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
