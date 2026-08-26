import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::global-setting.global-setting', () => ({
  async find(ctx) {
    try {
      return await super.find(ctx)
    } catch {
      ctx.status = 200
      ctx.body = { data: null }
    }
  },
}))
