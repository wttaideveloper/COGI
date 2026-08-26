/**
 * Browsers and clients sometimes append cache-busting keys such as `_t`.
 * Strapi 5 rejects unknown query params with 400, so strip them first.
 */
export default () => {
  return async (ctx: { query?: Record<string, unknown> }, next: () => Promise<void>) => {
    if (ctx.query && typeof ctx.query === 'object') {
      delete ctx.query._t
      delete ctx.query.t
    }
    await next()
  }
}
