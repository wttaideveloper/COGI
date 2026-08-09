# Environment Variables

## Public website (`public-website/.env`)

```env
VITE_STRAPI_URL=http://localhost:1337
VITE_PUBLIC_SITE_URL=http://localhost:5173
VITE_GIVELIVELY_URL=
```

## Admin portal (`admin-portal/.env`)

```env
VITE_STRAPI_URL=http://localhost:1337
VITE_ADMIN_SITE_URL=http://localhost:5174
VITE_PUBLIC_SITE_URL=http://localhost:5173
```

## Strapi (`strapi-backend/.env`)

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=
API_TOKEN_SALT=
ADMIN_JWT_SECRET=
TRANSFER_TOKEN_SALT=
JWT_SECRET=
ENCRYPTION_KEY=
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
# Production Postgres (Neon, hosted - no Postgres container):
# DATABASE_CLIENT=postgres
# DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/cogi?sslmode=require
# DATABASE_SSL=true
PUBLIC_URL=http://localhost:1337
```

Local dev uses SQLite. In production (Docker Compose) `DATABASE_URL` is injected as an env var and Strapi uses Neon directly.

Never commit real secrets. Rotate keys before production deploy.

## Site config sync (`config-sync/`)

A minimal `node` service that persists admin-saved config (navigation, theme, homepage) to a shared volume so the public site reads the same file. No `.env` variables required; it reads:

- `DATA_DIR` (default `/data`) — location of the persisted `site-config.json`
- `SEED_FILE` (default `/seed/site-config.json`) — initial file copied on first boot

Nginx routes `/site-config.json` (public read) and `/__site-config` (admin write) to this service in production.

> **Note (production):** `VITE_STRAPI_URL`, `VITE_PUBLIC_SITE_URL`, and `VITE_ADMIN_SITE_URL` are baked into the frontend bundles at **build time**. They must point to your real public URL in the EC2 `.env` file before `docker compose build` — otherwise the built sites will call `localhost` and fail from users' browsers.
