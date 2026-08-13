import { factories } from '@strapi/strapi';
import { singleTypePublishActions } from '../../../utils/publish-actions';

export default factories.createCoreController('api::site-config.site-config', () => ({
  ...singleTypePublishActions('api::site-config.site-config'),
}));
