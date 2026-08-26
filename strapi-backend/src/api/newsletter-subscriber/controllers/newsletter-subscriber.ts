import { factories } from '@strapi/strapi'

export default factories.createCoreController(
  'api::newsletter-subscriber.newsletter-subscriber',
  ({ strapi }) => ({
    async create(ctx) {
      const body = (ctx.request.body?.data ?? ctx.request.body ?? {}) as Record<string, unknown>
      const email = String(body.email || '').trim().toLowerCase()
      const name = String(body.name || '').trim()
      if (!name || !email) {
        return ctx.badRequest('Name and email are required')
      }

      const existing = await strapi.db.query('api::newsletter-subscriber.newsletter-subscriber').findOne({
        where: { email },
      })
      if (existing) {
        ctx.body = {
          data: existing,
          meta: { already: true },
        }
        return
      }

      if (ctx.request.body?.data) {
        ctx.request.body.data.email = email
        ctx.request.body.data.consent = body.consent !== false
        ctx.request.body.data.subscribedAt = body.subscribedAt || new Date().toISOString()
      }

      return super.create(ctx)
    },
  }),
)
