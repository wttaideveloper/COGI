import { publishActionsFor } from '../../../utils/publish-actions';
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::testimonial.testimonial', ({ strapi }) => ({
  ...publishActionsFor('api::testimonial.testimonial'),
}));

