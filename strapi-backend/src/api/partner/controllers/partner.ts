import { publishActionsFor } from '../../../utils/publish-actions';
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::partner.partner', ({ strapi }) => ({
  ...publishActionsFor('api::partner.partner'),
}));

