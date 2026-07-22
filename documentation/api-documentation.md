# API Documentation

Base URL (local): `http://localhost:1337/api`

Public responses follow Strapi 5 format: `{ data, meta }`.

## Public endpoints

| Method | Path | Auth |
|--------|------|------|
| GET | `/homepage` | Public |
| GET | `/global-setting` | Public |
| GET | `/header-setting` | Public |
| GET | `/footer-setting` | Public |
| GET | `/pages` | Public |
| GET | `/pages?filters[slug][$eq]=about` | Public |
| GET | `/programs` | Public |
| GET | `/programs?filters[slug][$eq]=...` | Public |
| GET | `/news-articles` | Public |
| GET | `/events` | Public |
| GET | `/stories` | Public |
| GET | `/testimonials` | Public |
| GET | `/team-members` | Public |
| GET | `/partners` | Public |
| GET | `/locations` | Public |
| GET | `/publications` | Public |
| GET | `/gallery-albums` | Public |
| GET | `/faqs` | Public |
| GET | `/navigation-menus` | Public |
| GET | `/search?q=` | Public (custom) |
| POST | `/contact-enquiries` | Public |
| POST | `/newsletter-subscribers` | Public |

## Admin endpoints

Authenticated with `Authorization: Bearer <jwt>` from `/api/auth/local`.

Full CRUD on content types via Strapi REST. Media: `POST /api/upload`.

Users & permissions: Strapi plugin routes under `/api/users` (authenticated).

## Population

Example:

```
GET /api/programs?populate[featuredImage]=true&populate[seo]=true&publicationState=live
```

## Forms

Contact enquiry body:

```json
{
  "data": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "enquiryType": "general",
    "message": "Hello",
    "consent": true
  }
}
```

Newsletter:

```json
{
  "data": {
    "name": "Jane",
    "email": "jane@example.com",
    "whatsapp": "+1...",
    "source": "footer",
    "consent": true
  }
}
```
