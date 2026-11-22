# Deployment Guide

This project ships Docker Compose files that deploy the full stack on a single EC2 instance: public website, admin portal, and Strapi behind one Nginx reverse proxy. The database is **Neon PostgreSQL** (hosted), so **no PostgreSQL container is created**. The deploy scripts are distro-aware and support **Ubuntu (apt)** and **Amazon Linux 2023 (dnf)**.

## Architecture

One host serves all apps with **path prefixes** (no subdomains needed):

| App | URL path | Upstream |
|-----|----------|----------|
| Public website | `/` | `public-website` |
| Admin portal | `/admin` | `admin-portal` |
| Strapi API | `/api` | `strapi` |
| Strapi admin | `/admin-strapi` | `strapi` |
| Site config read | `/site-config.json` | `config-sync` |
| Site config write | `/__site-config` | `config-sync` |

Database is Neon Postgres — `DATABASE_URL` is passed to the `strapi` container via env (no `postgres` service).

## All-in-one EC2 (recommended)

1. Provision an EC2 instance (Ubuntu 22.04/24.04 or Amazon Linux 2023, ≥2 GB RAM). Open ports `22` (SSH), `80`, `443` in the security group.
2. SSH in, transfer or clone the repo, and run the setup + deploy scripts:
   ```bash
   chmod +x deployment/ec2-setup.sh deploy.sh deploy-ssl.sh
   bash deployment/ec2-setup.sh        # installs Docker + Compose v2 (apt or dnf)
   # log out and back in so the docker group takes effect, then:
   git clone <repo-url> && cd <repo>
   cp .env.example .env
   nano .env   # set real values (see below)
   bash deploy.sh                       # validates secrets, builds, starts stack
   ```
3. `deploy.sh` validates required secrets and brings up the stack. It will also install Docker/Compose itself if they are missing (same apt/dnf logic as `ec2-setup.sh`).

### Set the real values in `.env` before building (critical)

- `DATABASE_URL` — your **Neon** connection string (direct / non-pooled):
  `postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/cogi?sslmode=require`. Get it from Neon console → Connect.
- `DATABASE_SSL=true`.
- `VITE_STRAPI_URL`, `VITE_PUBLIC_SITE_URL`, `VITE_ADMIN_SITE_URL` are baked into the frontends at **build time** — set them to your public host (domain or EC2 IP). Same origin for everything, path prefixes only:
  ```env
  STRAPI_URL=https://www.yourdomain.com
  VITE_STRAPI_URL=https://www.yourdomain.com
  VITE_PUBLIC_SITE_URL=https://www.yourdomain.com
  VITE_ADMIN_SITE_URL=https://www.yourdomain.com/admin
  CORS_ORIGIN=https://www.yourdomain.com
  DATABASE_SSL=true
  ```
- Generate strong secrets for `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY` (`openssl rand -base64 32`).

### SSL (optional, needs a domain)

```bash
bash deploy-ssl.sh yourdomain.com
```

This obtains a Let's Encrypt certificate for the single domain, writes `nginx/nginx-ssl.conf` and `docker-compose.prod.yml`, and restarts behind HTTPS with auto-renewal. All apps stay under the same domain via path prefixes.

### Get code onto the server

The recommended path is a **git repo** (the one this project lives in). Push your changes locally, then on the server:

```bash
git clone <repo-url> && cd <repo>
```

`.gitignore` excludes `node_modules`, `dist`, `.env` (and `.freebuff/`), so a clone is clean and Docker builds dependencies inside the containers — the server does not need Node/npm installed. After any code change: `git push` locally, then on the server `git pull && bash deploy.sh`.

## Post-deploy checklist

### Deploy saved local content

Publish the intended local edits in the local admin first. This updates
`public-website/public/site-config.json`; include that file and any new public
images with your code changes. **Save draft** saves to the local database without
including those unpublished edits in the deployment snapshot.

On the server, pull the changes and run `bash deploy.sh`. It builds the release,
imports the newer snapshot and its images into Strapi, then starts the apps.
The importer preserves a newer production admin publish. A failed import stops
deployment instead of reporting success. The persistent configuration cache also
adopts a newer bundled snapshot. Existing HTTPS installations automatically use
`docker-compose.prod.yml`; `COMPOSE_FILE` can override that choice.

Running only `docker compose up -d --build` does not perform the content import.
Use `deploy.sh` for content releases. The importer upserts snapshot records; it
does not delete unrelated production records.

- [ ] Strapi health `/_health` (via nginx: `curl http://<IP>/_health`)
- [ ] Public homepage loads and pulls from API
- [ ] Admin portal loads at `/admin`
- [ ] Strapi admin login at `/admin-strapi`
- [ ] Form submissions create enquiry records
- [ ] Media upload works
- [ ] No secrets in client bundles
