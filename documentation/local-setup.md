# Local Setup Guide

## Prerequisites

- Node.js 20–22
- npm 10+
- Git
- PostgreSQL 14+ (production); SQLite is fine for local prototyping

## Clone / open

```bash
cd C:\Users\shree\Projects\cogi-platform
```

## 1. Strapi backend

```bash
cd strapi-backend
copy .env.example .env
npm install
npm run develop
```

Open http://localhost:1337/admin and create the first administrator.

## 2. Public website

```bash
cd public-website
copy .env.example .env
npm install
npm run dev
```

http://localhost:5173 — uses Strapi when available, otherwise DOCX fallback content.

## 3. Admin portal

```bash
cd admin-portal
copy .env.example .env
npm install
npm run dev
```

http://localhost:5174 — demo login `admin@cogi.local` / `admin123` if Strapi auth is unavailable.

## Seed content

After Strapi is running and the admin user exists, import seed data from `strapi-backend/src/seed/seed-data.ts` via the custom seed script or manual entry in Strapi/admin portal.

## Common ports

| Service | Port |
|---------|------|
| Public | 5173 |
| Admin | 5174 |
| Strapi | 1337 |
