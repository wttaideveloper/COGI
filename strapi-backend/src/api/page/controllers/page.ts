import { publishActionsFor } from '../../../utils/publish-actions';
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::page.page', ({ strapi }) => ({
  ...publishActionsFor('api::page.page'),
}));

