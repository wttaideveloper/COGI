import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        env('PUBLIC_URL', 'http://localhost:1337'),
        env('CORS_ORIGIN', ''),
        // Local development origins (Vite dev servers) - dev only
        ...(env('NODE_ENV', 'development') !== 'production'
          ? [
              'http://localhost:5173',
              'http://localhost:5174',
              'http://127.0.0.1:5173',
              'http://127.0.0.1:5174',
            ]
          : []),
      ].filter(Boolean),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: '*',
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
