# Deployment Guide

## Environments

| App | Suggested host | Domain |
|-----|----------------|--------|
| Public website | Vercel / Netlify | coginternational.org |
| Admin portal | Vercel / Netlify | admin.coginternational.org |
| Strapi | Render / Railway / Azure | api.coginternational.org |
| Database | Managed PostgreSQL | private |
| Media | Cloudinary or S3 | CDN |
| Email | Resend / SES / SMTP | — |

## PostgreSQL

1. Provision a managed Postgres instance.
2. Set Strapi env:

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=...
DATABASE_PORT=5432
DATABASE_NAME=cogi_strapi
DATABASE_USERNAME=...
DATABASE_PASSWORD=...
DATABASE_SSL=true
```

3. Deploy Strapi; schemas sync on first boot.
4. Create Super Admin via Strapi admin UI.
5. Seed content (see seed script / admin import).

## Strapi production

- Set strong unique `APP_KEYS`, `JWT_SECRET`, `ADMIN_JWT_SECRET`, salts.
- `PUBLIC_URL` = public API URL.
- Configure CORS for public + admin origins.
- Enable HTTPS only; put Cloudflare in front.
- Configure upload provider (S3/Cloudinary) for media persistence.
- Schedule database backups daily; retain media backups separately.

## Frontends

Build:

```bash
cd public-website && npm ci && npm run build
cd admin-portal && npm ci && npm run build
```

Env:

```env
VITE_STRAPI_URL=https://api.coginternational.org
VITE_PUBLIC_SITE_URL=https://coginternational.org
VITE_ADMIN_SITE_URL=https://admin.coginternational.org
VITE_GIVELIVELY_URL=https://...
```

## SSL / DNS

Point apex and www to the public site host. Point `admin` and `api` subdomains. Enable Cloudflare SSL Full (strict).

## Post-deploy checklist

- [ ] Strapi health `/_health`
- [ ] Public homepage loads from API
- [ ] Admin login works
- [ ] Form submissions create enquiry records
- [ ] Media upload works
- [ ] Preview draft flow works
- [ ] robots.txt / sitemap live
- [ ] No secrets in client bundles
