# Architecture

## Overview

Three applications share one Strapi CMS and PostgreSQL database:

```text
Administrator → Admin Portal (React) → Strapi API (JWT)
Visitor       → Public Website (React) → Strapi API (public permissions)
Technical ops → Strapi Admin UI
```

Published content changes require no frontend redeploy.

## Content update flow

1. Admin authenticates via Strapi Users & Permissions (JWT).
2. Admin portal writes content through authenticated REST endpoints.
3. Strapi persists to PostgreSQL and media store.
4. Public site fetches published entries (TanStack Query; short `staleTime` / optional webhook revalidation).
5. Draft content remains unpublished and is only visible via signed preview tokens.

## Caching

- Public: `staleTime` 30–60s for most collections; homepage 15–30s.
- Optional: Strapi webhook → frontend revalidation endpoint in production.
- `Cache-Control` headers configurable at CDN (Cloudflare).

## Preview

Admin portal requests a short-lived preview JWT from Strapi custom endpoint. Public site `/preview/*` validates the token and loads draft entries. Preview chrome shows device frames (desktop / tablet / mobile).

## Security

- HTTPS in production; CORS allowlist for public + admin origins.
- Secrets only in environment variables.
- Public role: `find`/`findOne` on published content; `create` on enquiries and newsletter only.
- Rate limiting on form endpoints; file upload MIME/size limits.
- RBAC roles: Super Admin, Website Admin, Content Editor, Publisher, Enquiry Manager.

## Deployment (recommended)

| Service | Host |
|---------|------|
| Public website | Vercel / Netlify / Azure Static Web Apps |
| Admin portal | Vercel / Netlify (separate project) |
| Strapi | Render / Railway / Azure App Service |
| Database | Managed PostgreSQL |
| Media | Cloudinary or S3 |
| Email | Resend / SES / SMTP |
| DNS/CDN/SSL | Cloudflare |

## Multilingual readiness

Content types include `pluginOptions.i18n` readiness; v1 ships English only with locale switcher stub.
