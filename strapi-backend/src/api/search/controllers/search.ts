const SEARCHABLE_TYPES = [
  'api::news-article.news-article',
  'api::program.program',
  'api::event.event',
  'api::page.page',
  'api::story.story',
] as const;

type SearchResult = {
  id: number;
  documentId: string;
  type: string;
  title: string;
  slug: string;
  summary: string | null;
  url: string;
};

const TYPE_URL_PREFIX: Record<string, string> = {
  'api::news-article.news-article': '/resources/blog',
  'api::program.program': '/programs',
  'api::event.event': '/events',
  'api::page.page': '',
  'api::story.story': '/resources/stories',
};

export default {
  async search(ctx: any) {
    const query = String(ctx.query.q || '').trim();

    if (!query || query.length < 2) {
      return ctx.badRequest('Query parameter "q" must be at least 2 characters.');
    }

    const limit = Math.min(Number(ctx.query.limit) || 20, 50);
    const results: SearchResult[] = [];

    for (const uid of SEARCHABLE_TYPES) {
      try {
        const entries = await (strapi.documents as any)(uid).findMany({
          filters: {
            $or: [
              { title: { $containsi: query } },
              { summary: { $containsi: query } },
              { slug: { $containsi: query } },
            ],
          },
          status: 'published',
          limit: Math.ceil(limit / SEARCHABLE_TYPES.length),
        });

        for (const entry of entries) {
          const title = entry.title as string;
          const slug = entry.slug as string;
          const prefix = TYPE_URL_PREFIX[uid] ?? '';

          results.push({
            id: entry.id as number,
            documentId: entry.documentId as string,
            type: uid.split('.').pop() ?? uid,
            title,
            slug,
            summary: (entry.summary as string) ?? null,
            url: prefix ? `${prefix}/${slug}` : `/${slug}`,
          });
        }
      } catch {
        // Skip types that fail (e.g. unpublished single-type edge cases)
      }
    }

    ctx.body = {
      data: results.slice(0, limit),
      meta: {
        query,
        total: results.length,
      },
    };
  },
};
