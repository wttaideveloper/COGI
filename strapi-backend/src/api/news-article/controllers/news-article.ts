import { publishActionsFor } from '../../../utils/publish-actions';
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::news-article.news-article', ({ strapi }) => ({
  ...publishActionsFor('api::news-article.news-article'),
}));

