import { publishActionsFor } from '../../../utils/publish-actions';
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::team-member.team-member', ({ strapi }) => ({
  ...publishActionsFor('api::team-member.team-member'),
}));

