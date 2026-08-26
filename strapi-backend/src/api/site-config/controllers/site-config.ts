import { factories } from '@strapi/strapi'
import { singleTypePublishActions } from '../../../utils/publish-actions'

export default factories.createCoreController('api::site-config.site-config', () => ({
  ...singleTypePublishActions('api::site-config.site-config'),
  async find(ctx) {
    try {
      return await super.find(ctx)
    } catch {
      ctx.status = 200
      ctx.body = { data: null }
    }
  },
}))
