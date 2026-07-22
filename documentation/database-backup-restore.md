# Database Backup and Restore

## PostgreSQL (production)

### Backup

```bash
pg_dump -Fc -h $DATABASE_HOST -U $DATABASE_USERNAME -d $DATABASE_NAME -f cogi_strapi_$(date +%F).dump
```

Schedule daily via host cron or managed backup.

### Restore

```bash
pg_restore -h $DATABASE_HOST -U $DATABASE_USERNAME -d $DATABASE_NAME --clean --if-exists cogi_strapi_YYYY-MM-DD.dump
```

## SQLite (local only)

Copy `strapi-backend/.tmp/data.db` to a safe location. Restore by replacing the file while Strapi is stopped.

## Media

- Local uploads: back up `strapi-backend/public/uploads`
- Cloudinary/S3: enable provider versioning / lifecycle backups

## Retention

- Enquiry records: define retention with ministry (e.g. 24 months)
- Newsletter: honour unsubscribe; retain consent metadata as required by law
- Audit logs: retain 12+ months for accountability
