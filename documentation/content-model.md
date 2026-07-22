# Strapi Content Model

## Single types

| UID | Purpose |
|-----|---------|
| `api::global-setting.global-setting` | Organisation identity, contact, SEO defaults, cookie, maintenance |
| `api::homepage.homepage` | Homepage sections, hero, mission, methods, impact, portfolio, visibility/order |
| `api::header-setting.header-setting` | Logo, sticky header, CTA, navigation |
| `api::footer-setting.footer-setting` | Footer about, menus, social, legal, copyright |

## Collection types

| UID | Draft/Publish | Notes |
|-----|---------------|-------|
| `api::page.page` | Yes | Dynamic zone page builder |
| `api::program.program` | Yes | Four ministry pathways |
| `api::news-article.news-article` | Yes | Blog |
| `api::news-category.news-category` | No | |
| `api::event.event` | Yes | Calendar / upcoming |
| `api::event-category.event-category` | No | |
| `api::team-member.team-member` | Yes | Board + global team |
| `api::partner.partner` | Yes | Logo grid |
| `api::testimonial.testimonial` | Yes | Written quotes |
| `api::story.story` | Yes | Video/written stories |
| `api::publication.publication` | Yes | Documents |
| `api::gallery-album.gallery-album` | Yes | |
| `api::location.location` | Yes | Map countries |
| `api::contact-enquiry.contact-enquiry` | No | Form inbox |
| `api::newsletter-subscriber.newsletter-subscriber` | No | |
| `api::faq.faq` | Yes | Donate FAQ etc. |
| `api::navigation-menu.navigation-menu` | No | Header/footer menus |
| `api::redirect.redirect` | No | URL redirects |
| `api::audit-record.audit-record` | No | Admin audit trail |

## Shared components

`shared.seo`, `shared.link`, `shared.button`, `shared.media-alt`, `shared.social-links`, `shared.contact-info`, `shared.section-settings`, `shared.statistic`, `shared.cta`, `shared.hero-slide`, `shared.method-card`, `shared.portfolio-area`, `shared.timeline-milestone`, `shared.nav-item`

## Section components (page builder)

`sections.hero`, `sections.rich-text`, `sections.image-text`, `sections.card-grid`, `sections.statistics`, `sections.cta-banner`, `sections.video`, `sections.faq-accordion`, `sections.newsletter`, `sections.contact-form`, `sections.map`, `sections.embed`

## Seed

Seed payloads live in `strapi-backend/src/seed/seed-data.ts`. Bootstrap sets public `find`/`findOne` and form `create` permissions.
