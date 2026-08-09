import { publishActionsFor } from '../../../utils/publish-actions';
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::event.event', ({ strapi }) => ({
  ...publishActionsFor('api::event.event'),
}));

