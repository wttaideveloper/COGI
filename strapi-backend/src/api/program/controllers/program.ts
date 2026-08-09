import { publishActionsFor } from '../../../utils/publish-actions';
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::program.program', ({ strapi }) => ({
  ...publishActionsFor('api::program.program'),
}));
