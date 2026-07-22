# COGI Website Revamp – Requirements Mapping (Phase 1 Discovery)

**Sources:** DOCX `COGI_website_REVAMP_Final (1).docx` (primary) · Live site `https://coginternational.org/` (reference) · Full-stack development prompt

**Organisation:** Companions of Grace International (COGI)  
**Tagline:** Equipping Healthcare Professionals for Kingdom Engagement

---

## 1. Requirements Extracted from the DOCX

### Organisation identity
- Global fellowship cultivating **Communities of Grace** in healthcare
- Vision: Global Christian Healthcare Community actively on Mission for God
- Mission: Inspire and enable transformation so healthcare professionals think, live, and work missionally
- Scripture refs: Colossians 3:17 · Romans 12:2

### Public sitemap & content (DOCX sections 01–23)

| # | Section | Page / placement | Key content / features |
|---|---------|------------------|------------------------|
| 01 | Hero | Homepage | Org identity paragraph, primary CTA |
| 02 | Our Mission | Homepage | Mission statement + scripture |
| 03 | Video | Homepage | Intro video (Global Advance–style) |
| 04 | Our Methods | Homepage | Enable / Train / Support (alt: Enable, Equip, Encourage) |
| 05 | Our Impact | Homepage | Stats: 10+ countries, 500+ professionals, 30+ programs, ∞ communities |
| 06 | Portfolio | Homepage | 4 ministry areas |
| 07 | Where We Serve | Homepage | Interactive world map; countries listed |
| 08 | Stories | Homepage + Resources | 1–2 video stories; Watch/Read links; event calendar note |
| 09 | Vision & Mission | About Us | Full vision + mission |
| 10 | Our Story | About Us › Our Story | Timeline 2019→2020→2023→2026 |
| 11 | Board Members | About Us › Board Members | Modal profiles (7 members; Ted Lang bio pending) |
| 12 | Global Team | About Us › Global Team | By region/country, expandable |
| 13 | Our Beliefs | About Us | Statement of faith |
| 14 | Partners | About Us › Our Partners | Logo grid + external links |
| 15 | Programs | Programs | 4 programs with Express Interest CTAs |
| 16 | Stories of Transformation | Resources | Filters by country/program; gallery |
| 17 | Testimonials | Resources | Written quotes + filters |
| 18 | Get Involved | Partnerships | Pray / Participate / Partner + Join form |
| 19 | Donate | Donate | GiveLively embed; one-time/recurring; FAQ |
| 20 | Blog | Resources | Searchable articles (≈50 to migrate) |
| 21 | Contact | Contact + Footer | Form, address/map, emails, social |
| 22 | Newsletter | Footer / Homepage | Name, Email, WhatsApp |
| 23 | Legal | Utility | Privacy, Terms, Cookie Notice, hidden Admin |

### Programs (detailed)
1. **Kingdom of God** — Seminar + Discovery Series  
2. **Missional Training** — M-Trail + Missional Health Course (+ future Institute placeholder)  
3. **Care for the Caregiver (C4C)** — 8-module journey  
4. **Missional Church & Healthcare** — One-Day Seminar + HEAL Week (under development)

### Forms
- Contact / general enquiry
- Newsletter (Name, Email, WhatsApp)
- Join the Movement (Get Involved) — single form with pathway select
- Program interest / enroll CTAs → enquiry forms
- Donate via GiveLively (external)

### Navigation (from DOCX developer notes)
- **About Us** dropdown: Our Story | Board Members | Global Team (+ Vision & Mission, Beliefs, Partners)
- **Programs** (portfolio + detail pages)
- **Resources**: Stories, Testimonials, Blog
- **Partnerships / Get Involved**
- **Donate** (prominent CTA)
- **Contact**
- Footer social: Instagram, Facebook, LinkedIn, YouTube

### Admin / CMS (from full-stack prompt)
- Custom React admin portal + Strapi
- Homepage section enable/order, page builder, media, news/blog, events, programs, team, partners, publications, gallery, enquiries, newsletter, SEO, preview, roles, audit, revisions

### Content to migrate from live site
- Leadership bios (refresh with DOCX wording)
- Program descriptions (replace with DOCX portfolio)
- Partner list (DOCX order supersedes old partners)
- Stories/testimonials (DOCX quotes + future video)
- Locations (expanded country list)
- Blog articles (~50) — migration backlog

---

## 2. Proposed Sitemap

```text
/                              Home
/about                         About overview (Vision & Mission)
/about/our-story               Timeline story
/about/board                   Board members (modals)
/about/global-team             Regional team
/about/beliefs                 Our Beliefs
/about/partners                Partners
/programs                      Programs index
/programs/:slug                Program detail
/resources                     Resources hub
/resources/stories             Stories of Transformation
/resources/testimonials        Written testimonials
/resources/blog                Blog index
/resources/blog/:slug          Blog article
/events                        Events calendar / list
/events/:slug                  Event detail
/get-involved                  Pray · Participate · Partner
/donate                        Donate (GiveLively)
/contact                       Contact
/search                        Site search
/privacy-policy                Privacy Policy
/terms-of-use                  Terms of Use
/cookie-notice                 Cookie Notice
/accessibility                 Accessibility Statement
/preview/*                     Signed draft preview (auth)
/*                             Custom 404

Admin (separate app):
/login, /forgot-password, /reset-password
/dashboard
/homepage, /pages, /navigation, /media
/programs, /events, /blog, /stories, /testimonials
/team, /partners, /locations, /publications, /gallery
/enquiries, /newsletter, /forms
/settings, /users, /roles, /audit, /seo
```

---

## 3. Proposed Architecture

```text
┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐
│ Public Website  │  │  Admin Portal   │  │ Strapi Admin UI  │
│ React+Vite:5173 │  │ React+Vite:5174 │  │ (technical ops)  │
└────────┬────────┘  └────────┬────────┘  └────────┬─────────┘
         │ REST/JSON          │ JWT REST           │
         └──────────┬─────────┴────────────────────┘
                    ▼
            ┌───────────────┐
            │ Strapi CMS    │  :1337
            │ Users/Roles   │
            │ Upload/Media  │
            └───────┬───────┘
                    ▼
            ┌───────────────┐
            │ PostgreSQL    │
            └───────────────┘
```

**Content flow:** Admin Portal → authenticated Strapi API → PostgreSQL → Public site fetches published content (TanStack Query, short cache / webhook revalidation).

**Stack:** React 18 + TypeScript + Vite + Tailwind + React Router + TanStack Query + React Hook Form + Zod + Framer Motion + React Helmet Async · Strapi 5 · PostgreSQL · JWT RBAC.

**Design direction (public):** Deep teal healthcare identity (`#0A4D4A` / `#0E6B66`), warm gold accent (`#C9A227`), soft mist backgrounds with subtle gradients — not purple gradients or cream/terracotta broadsheet. Display: Cormorant Garamond; UI: Plus Jakarta Sans. Full-bleed hero photography plane; brand-first hero; WCAG 2.1 AA.

---

## 4. Strapi Content-Model Table

### Single types
| Type | Purpose |
|------|---------|
| `global-setting` | Org identity, contact, SEO defaults, cookie, maintenance |
| `homepage` | Hero, mission, video, methods, impact, portfolio, map, stories, newsletter, section visibility/order |
| `header-setting` | Logo, sticky, CTA, nav relation |
| `footer-setting` | About, menus, social, copyright, legal links |

### Collection types
| Type | Key fields |
|------|------------|
| `page` | title, slug, sections (DZ), SEO, status, workflow |
| `navigation-menu` | name, location, items (nested) |
| `program` | title, slug, summary, body, area, experiences, CTA, gallery, order, status |
| `news-article` / blog | title, slug, summary, body, image, author, category, tags, dates, SEO |
| `news-category` | name, slug |
| `event` | title, slug, dates, venue, links, status, category |
| `event-category` | name, slug |
| `team-member` | name, title, department/region, bio, image, contacts, order, publicVisibility |
| `department` / region | name, type |
| `partner` | name, logo, url, description, region, order |
| `testimonial` | quote, author, mediaType, program, country, featured |
| `story` | title, type (video/written), media, country, program, featured |
| `publication` | title, file, cover, category, dates, featured |
| `gallery-album` | title, images, association |
| `location` | country, region, summary, programs, lat/lng |
| `contact-enquiry` | name, email, type, message, status, notes |
| `newsletter-subscriber` | name, email, whatsapp, source, consent |
| `faq` | question, answer, category |
| `redirect` | from, to, code |
| `audit-record` | actor, action, type, recordId, diff, ip |
| `form-definition` / `form-submission` | configurable forms |

### Reusable components
SEO, Link, Button, MediaAlt, HeroSlide, RichTextSection, ImageText, CardGrid, Statistic, CTA, TestimonialBlock, Accordion, Video, GalleryBlock, DocumentDownload, ContactInfo, SocialLinks, LocationBlock, SectionSettings, MethodCard, ImpactStat, PortfolioArea, TimelineMilestone

### Dynamic zone (page builder)
Hero, RichText, ImageText, Columns2/3, CardGrid, ProgramList, NewsList, EventList, TeamList, Statistics, Testimonials, Partners, Gallery, Video, FAQ, Documents, ContactForm, Newsletter, CTA, Map, Embed

---

## 5. Admin Portal Module List

1. Authentication (login, logout, forgot/reset password, profile, change password)
2. Dashboard (counts, recent activity, quick actions)
3. Homepage manager (sections, hero, stats, preview)
4. Pages & page builder
5. Navigation manager
6. Media library
7. Programs
8. Blog / news
9. Events
10. Stories & testimonials
11. Team (board + global)
12. Partners
13. Locations / map data
14. Publications & gallery
15. Enquiries & Join forms
16. Newsletter subscribers
17. Global / header / footer settings
18. SEO & redirects
19. Users & roles
20. Audit log & revisions
21. Preview launcher (desktop/tablet/mobile)

---

## 6. API List (REST)

### Public
```
GET  /api/homepage
GET  /api/global-setting
GET  /api/header-setting
GET  /api/footer-setting
GET  /api/pages?filters[slug][$eq]=
GET  /api/pages/:id
GET  /api/programs
GET  /api/programs?filters[slug][$eq]=
GET  /api/news-articles
GET  /api/news-articles?filters[slug][$eq]=
GET  /api/events
GET  /api/stories
GET  /api/testimonials
GET  /api/team-members
GET  /api/partners
GET  /api/locations
GET  /api/publications
GET  /api/gallery-albums
GET  /api/faqs
GET  /api/navigation-menus
POST /api/contact-enquiries
POST /api/newsletter-subscribers
GET  /api/search?q=
```

### Admin (JWT + RBAC)
Full CRUD on all content types · media upload · publish/unpublish · preview token · users/roles · audit · export CSV (enquiries, subscribers)

---

## 7. Development Milestones

| Phase | Deliverable | Status |
|-------|-------------|--------|
| 1 Discovery | This mapping + sitemap + models | Done |
| 2 Architecture | Monorepo, env examples, content schemas | Next |
| 3 Strapi | Types, components, seed, permissions | |
| 4 Public site | All DOCX pages, forms, SEO, map, a11y | |
| 5 Admin portal | Auth, modules, homepage/page builders | |
| 6 Integration | Publish → live, preview, cache | |
| 7 Docs & deploy | Guides, tests, deployment configs | |

---

## 8. Assumptions and Identified Gaps

| Item | Assumption / gap |
|------|------------------|
| GiveLively | Embed/widget; exact form ID TBD — placeholder config in env |
| Ted Lang bio | Placeholder until ministry provides text |
| Global team surnames | DOCX lists first names only for many members |
| Blog (50 articles) | Structure + sample posts; full migration is a content task |
| Event calendar | DOCX asks “Home Page?” — included on Home (featured) + `/events` |
| Institute of Missional Healthcare | Placeholder page/route reserved |
| Partner logos | Seed with name placeholders; upload via admin |
| Office address | Not fully specified in DOCX — configurable in Global Settings |
| Email provider | Resend/SMTP via env; not hard-coded |
| Multilingual | Architecture i18n-ready; English only for v1 |
| Approval workflow | Draft → Review → Approved → Published in custom admin; Strapi draft/publish as base |
| Media storage | Local in dev; S3/Cloudinary-ready via env |
| Existing WP site | Content reference only; new stack, new design (not a visual clone) |
| Admin domain | `admin.coginternational.org` in prod; localhost:5174 in dev |
`}
