import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

/**
 * Adds real draft-and-publish actions to a content type.
 *
 * Strapi's core content API always updates with `status: 'published'`
 * (see CoreService.getFetchParams), and it strips `publishedAt` from the
 * request body (filterDataPublishedAt). As a result a plain PUT can never
 * unpublish a document — it silently republishes. These actions call the
 * document service directly so the admin portal can truly publish/unpublish.
 */

async function resolveSingleDocumentId(uid: string): Promise<string | null> {
  const docs = strapi.documents(uid as never) as {
    findFirst: (params?: Record<string, unknown>) => Promise<{ documentId?: string } | null>;
  };
  const draft = await docs.findFirst({ status: 'draft' });
  if (draft?.documentId) return draft.documentId;
  const published = await docs.findFirst({ status: 'published' });
  if (published?.documentId) return published.documentId;
  const anyDoc = await docs.findFirst({});
  return anyDoc?.documentId ?? null;
}

export function publishActionsFor(uid: string) {
  return {
    async publish(ctx: Context) {
      const { id } = ctx.params;
      const doc = await strapi.documents(uid as never).publish({ documentId: id });
      ctx.body = { documentId: id, status: 'published', entries: doc?.entries?.length ?? 0 };
    },
    async unpublish(ctx: Context) {
      const { id } = ctx.params;
      await strapi.documents(uid as never).unpublish({ documentId: id });
      ctx.body = { documentId: id, status: 'draft' };
    },
  };
}

export function singleTypePublishActions(uid: string) {
  return {
    async publish(ctx: Context) {
      const documentId = await resolveSingleDocumentId(uid);
      if (!documentId) {
        ctx.status = 404;
        ctx.body = { error: { message: 'No document to publish' } };
        return;
      }
      const doc = await strapi.documents(uid as never).publish({ documentId });
      ctx.set('Cache-Control', 'no-store');
      ctx.body = { documentId, status: 'published', entries: doc?.entries?.length ?? 0 };
    },
    async unpublish(ctx: Context) {
      const documentId = await resolveSingleDocumentId(uid);
      if (!documentId) {
        ctx.status = 404;
        ctx.body = { error: { message: 'No document to unpublish' } };
        return;
      }
      await strapi.documents(uid as never).unpublish({ documentId });
      ctx.set('Cache-Control', 'no-store');
      ctx.body = { documentId, status: 'draft' };
    },
  };
}

export function coreRouterWithPublish(uid: string, pluralName: string) {
  const coreRouter = factories.createCoreRouter(uid as never);
  return {
    type: 'content-api',
    get routes() {
      const baseRoutes = typeof coreRouter.routes === 'function' ? coreRouter.routes() : coreRouter.routes;
      return [
        ...baseRoutes,
        {
          method: 'POST',
          path: `/${pluralName}/:id/actions/publish`,
          handler: `${uid}.publish`,
          config: { policies: [] },
        },
        {
          method: 'POST',
          path: `/${pluralName}/:id/actions/unpublish`,
          handler: `${uid}.unpublish`,
          config: { policies: [] },
        },
      ];
    },
  };
}

export function coreRouterWithSinglePublish(uid: string, singularName: string) {
  const coreRouter = factories.createCoreRouter(uid as never);
  return {
    type: 'content-api',
    get routes() {
      const baseRoutes = typeof coreRouter.routes === 'function' ? coreRouter.routes() : coreRouter.routes;
      return [
        ...baseRoutes,
        {
          method: 'POST',
          path: `/${singularName}/actions/publish`,
          handler: `${uid}.publish`,
          config: { policies: [] },
        },
        {
          method: 'POST',
          path: `/${singularName}/actions/unpublish`,
          handler: `${uid}.unpublish`,
          config: { policies: [] },
        },
      ];
    },
  };
}
