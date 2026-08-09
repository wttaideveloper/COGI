import { publishActionsFor } from '../../../utils/publish-actions';
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::location.location', ({ strapi }) => ({
  ...publishActionsFor('api::location.location'),
}));

