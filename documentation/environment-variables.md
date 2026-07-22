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
# Production Postgres:
# DATABASE_CLIENT=postgres
# DATABASE_HOST=
# DATABASE_PORT=5432
# DATABASE_NAME=
# DATABASE_USERNAME=
# DATABASE_PASSWORD=
# DATABASE_SSL=true
PUBLIC_URL=http://localhost:1337
```

Never commit real secrets. Rotate keys before production deploy.
