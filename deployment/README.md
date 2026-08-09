# COGI Project - Docker Deployment Guide

## 📋 Prerequisites

- AWS EC2 instance (t3.medium or larger recommended)
- Docker & Docker Compose installed
- Domain name configured (optional but recommended)
- SSL certificate (recommended for production)

## 🚀 Quick Start

### 1. SSH into your EC2 instance

```bash
ssh -i your-key.pem ec2-user@YOUR_EC2_IP
```

### 2. Clone the repository

```bash
git clone <your-repo-url>
cd cogi-project
```

### 3. Set up environment variables

```bash
cp .env.example .env
nano .env  # Edit with your production values
```

**Important:** Generate secure keys for production:

```bash
# Generate APP_KEYS (run 4 times for 4 keys)
openssl rand -base64 32

# Generate other secrets
openssl rand -base64 32  # For API_TOKEN_SALT
openssl rand -base64 32  # For ADMIN_JWT_SECRET
openssl rand -base64 32  # For TRANSFER_TOKEN_SALT
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For ENCRYPTION_KEY
```

### 4. Build and start services

```bash
# Build all images
docker compose build

# Start all services
docker compose up -d

# Check status
docker compose ps
```

### 5. Verify deployment

```bash
# Check Strapi health
curl http://localhost/_health

# Check logs
docker compose logs -f strapi
docker compose logs -f nginx
```

## 🌐 Service URLs

After deployment, access your services at (single host, path prefixes):

| Service | URL |
|---------|-----|
| Public Website | `http://YOUR_EC2_IP` |
| Admin Portal | `http://YOUR_EC2_IP/admin` |
| Strapi API | `http://YOUR_EC2_IP/api` |
| Strapi Admin | `http://YOUR_EC2_IP/admin-strapi` |
| Site config read | `http://YOUR_EC2_IP/site-config.json` |

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string (no local Postgres container) | `postgresql://user:pass@ep-xxx.neon.tech/cogi?sslmode=require` |
| `DATABASE_SSL` | TLS to Neon | `true` |
| `APP_KEYS` | Strapi application keys | `["key1","key2"]` |
| `JWT_SECRET` | JWT authentication secret | `your-jwt-secret` |
| `VITE_STRAPI_URL` | Strapi API URL for frontend | `http://YOUR_EC2_IP` |
| `VITE_PUBLIC_SITE_URL` | Public site URL (build-time) | `http://YOUR_EC2_IP` |
| `VITE_ADMIN_SITE_URL` | Admin portal URL (build-time) | `http://YOUR_EC2_IP/admin` |
| `CORS_ORIGIN` | Allowed browser origins for Strapi | `http://YOUR_EC2_IP` |

### Domain Configuration (optional)

1. Point an A record at the EC2 IP in DNS settings
2. Update `CORS_ORIGIN` in `.env` with your domain
3. Update `VITE_*` URLs and run `bash deploy-ssl.sh yourdomain.com` for HTTPS

## 🛠️ Common Commands

```bash
# View logs
docker compose logs -f [service-name]

# Restart a specific service
docker compose restart strapi

# Rebuild after code changes
docker compose build [service-name]
docker compose up -d [service-name]

# Stop all services
docker compose down

# Stop and remove volumes (WARNING: deletes data)
docker compose down -v

# Access container shell
docker exec -it cogi-strapi sh
docker exec -it cogi-postgres psql -U strapi -d cogi_strapi
```

## 🔄 Updating the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker compose build
docker compose up -d

# Verify health
curl http://localhost/_health
```

## 🗄️ Database Management

### Backup

```bash
# Backup PostgreSQL
docker exec cogi-postgres pg_dump -U strapi cogi_strapi > backup_$(date +%Y%m%d).sql
```

### Restore

```bash
# Restore from backup
cat backup.sql | docker exec -i cogi-postgres psql -U strapi -d cogi_strapi
```

## 🔒 Security Checklist

- [ ] Generate strong unique secrets for all keys
- [ ] Enable SSL/TLS (use Let's Encrypt or AWS Certificate Manager)
- [ ] Configure firewall rules (allow only ports 80, 443, 22)
- [ ] Set up regular database backups
- [ ] Review Strapi permissions and API access
- [ ] Never commit `.env` file to version control

## 🐛 Troubleshooting

### Services won't start

```bash
# Check logs for errors
docker compose logs

# Check if ports are in use
sudo lsof -i :80
sudo lsof -i :1337
```

### Database connection issues

```bash
# Verify PostgreSQL is running
docker compose ps postgres

# Check database logs
docker compose logs postgres

# Test connection
docker exec -it cogi-postgres psql -U strapi -d cogi_strapi
```

### Strapi not connecting to database

```bash
# Check Strapi logs
docker compose logs strapi

# Verify environment variables
docker exec cogi-strapi env | grep DATABASE
```

## 📊 Monitoring

### Health Checks

```bash
# Strapi health
curl -s http://localhost/_health

# All services status
docker compose ps
```

### Resource Usage

```bash
# Container resource usage
docker stats

# Disk usage
docker system df
```
