import { factories } from '@strapi/strapi';
import { singleTypePublishActions } from '../../../utils/publish-actions';

export default factories.createCoreController('api::homepage.homepage', () => ({
  ...singleTypePublishActions('api::homepage.homepage'),
}));
