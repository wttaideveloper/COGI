# Testing Guide

## Public website

```bash
cd public-website
npm run build
npm run dev
```

Manual checks:
- All routes render with fallback content when Strapi is offline
- Forms validate (contact, newsletter, get involved)
- Header mobile menu and About dropdown
- Reduced-motion preference respected
- SEO titles via document head

Suggested automated stack: Vitest + React Testing Library + Playwright.

## Admin portal

```bash
cd admin-portal
npm run build
npm run dev
```

Demo login: `admin@cogi.local` / `admin123`

Checks:
- Protected routes redirect to login
- Dashboard charts render
- CRUD modules list/edit with mock or Strapi data
- CSV export for enquiries/newsletter
- Preview link opens public site URL

## Strapi

```bash
cd strapi-backend
npm run develop
```

Checks:
- Content types appear in Content-Type Builder
- Public find permissions for published types
- POST contact-enquiry and newsletter-subscriber
- Upload restrictions
