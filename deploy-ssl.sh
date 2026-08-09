#!/bin/bash
# ============================================
# COGI Platform - SSL Setup with Let's Encrypt
# ============================================
# Run this after deploy.sh to enable HTTPS
# ============================================

set -e

if [ -z "$1" ]; then
    echo "Usage: ./deploy-ssl.sh yourdomain.com"
    echo "Example: ./deploy-ssl.sh coginternational.org"
    echo ""
    echo "Note: the stack serves all apps under one domain using path prefixes"
    echo "      (/ = public, /admin = admin portal, /api = Strapi, /admin-strapi = Strapi admin)."
    exit 1
fi

DOMAIN=$1
EMAIL=${2:-admin@$DOMAIN}

echo "🔒 Setting up SSL for $DOMAIN"
echo "=================================="

# Install certbot
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    if command -v apt-get &> /dev/null; then
        sudo apt-get update -y
        sudo apt-get install -y certbot python3-certbot-nginx
    elif command -v dnf &> /dev/null; then
        sudo dnf install -y epel-release
        sudo dnf install -y certbot python3-certbot-nginx
    elif command -v yum &> /dev/null; then
        sudo yum install -y epel-release
        sudo yum install -y certbot python3-certbot-nginx
    else
        echo "❌ No supported package manager (apt/dnf/yum) found."
        exit 1
    fi
fi

# Stop nginx container temporarily
docker compose stop nginx

# Get SSL certificate
sudo certbot certonly --standalone \
    -d "$DOMAIN" \
    --email "$EMAIL" \
    --agree-tos \
    --non-interactive

# Copy certificates to nginx volume
sudo mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem nginx/ssl/

# Update nginx config for SSL
cat > nginx/nginx-ssl.conf << 'NGINX_SSL'
upstream public_website {
    server public-website:80;
}

upstream admin_portal {
    server admin-portal:80;
}

upstream strapi_backend {
    server strapi:1337;
}

upstream config_sync {
    server config-sync:3000;
}

limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# Redirect all HTTP to HTTPS
server {
    listen 80;
    server_name _;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name _;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    client_max_body_size 10M;

    # Public website (root)
    location / {
        proxy_pass http://public_website;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Site config (read by public site)
    location = /site-config.json {
        proxy_pass http://config_sync/site-config.json;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Admin portal (strip the /admin prefix for the container)
    location /admin/ {
        rewrite ^/admin(?<app>/.*)?$ $app break;
        proxy_pass http://admin_portal;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location = /admin {
        return 301 /admin/;
    }

    # Site config write endpoint (admin portal)
    location /__site-config {
        proxy_pass http://config_sync;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Strapi API
    location /api {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://strapi_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Strapi Admin
    location /admin-strapi {
        proxy_pass http://strapi_backend/admin;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Strapi Health Check
    location = /_health {
        proxy_pass http://strapi_backend/_health;
    }

    # Media uploads (Strapi static files)
    location /uploads {
        proxy_pass http://strapi_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
NGINX_SSL

# Substitute the real domain into the generated nginx SSL config
sed -i "s/__DOMAIN__/$DOMAIN/g" nginx/nginx-ssl.conf

# Update docker-compose to mount SSL certs
cat > docker-compose.prod.yml << 'COMPOSE'
version: '3.8'

services:
  strapi:
    build:
      context: ./strapi-backend
      dockerfile: Dockerfile
    container_name: cogi-strapi
    restart: unless-stopped
    environment:
      NODE_ENV: production
      HOST: 0.0.0.0
      PORT: 1337
      DATABASE_CLIENT: postgres
      DATABASE_URL: ${DATABASE_URL}
      DATABASE_SSL: ${DATABASE_SSL:-true}
      APP_KEYS: ${APP_KEYS}
      API_TOKEN_SALT: ${API_TOKEN_SALT}
      ADMIN_JWT_SECRET: ${ADMIN_JWT_SECRET}
      TRANSFER_TOKEN_SALT: ${TRANSFER_TOKEN_SALT}
      JWT_SECRET: ${JWT_SECRET}
      ENCRYPTION_KEY: ${ENCRYPTION_KEY}
      PUBLIC_URL: ${STRAPI_URL}
      CORS_ORIGIN: ${CORS_ORIGIN}
    volumes:
      - strapi_uploads:/opt/app/public/uploads
    networks:
      - cogi-network
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:1337/_health"]
      interval: 30s
      timeout: 10s
      retries: 3

  public-website:
    build:
      context: ./public-website
      dockerfile: Dockerfile
      args:
        VITE_STRAPI_URL: ${VITE_STRAPI_URL}
        VITE_PUBLIC_SITE_URL: ${VITE_PUBLIC_SITE_URL}
        VITE_GIVELIVELY_URL: ${VITE_GIVELIVELY_URL:-}
    container_name: cogi-public-website
    restart: unless-stopped
    networks:
      - cogi-network

  admin-portal:
    build:
      context: ./admin-portal
      dockerfile: Dockerfile
      args:
        VITE_STRAPI_URL: ${VITE_STRAPI_URL}
        VITE_ADMIN_SITE_URL: ${VITE_ADMIN_SITE_URL}
        VITE_PUBLIC_SITE_URL: ${VITE_PUBLIC_SITE_URL}
    container_name: cogi-admin-portal
    restart: unless-stopped
    networks:
      - cogi-network

  # Site Config Sync (persists admin config edits for the public site)
  config-sync:
    build:
      context: ./config-sync
      dockerfile: Dockerfile
    container_name: cogi-config-sync
    restart: unless-stopped
    environment:
      DATA_DIR: /data
      SEED_FILE: /seed/site-config.json
    volumes:
      - site_config:/data
      - ./public-website/public/site-config.json:/seed/site-config.json:ro
    networks:
      - cogi-network

  nginx:
    image: nginx:alpine
    container_name: cogi-nginx
    restart: unless-stopped
    depends_on:
      - public-website
      - admin-portal
      - strapi
      - config-sync
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx-ssl.conf:/etc/nginx/conf.d/default.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - nginx_logs:/var/log/nginx
    networks:
      - cogi-network

volumes:
  strapi_uploads:
    driver: local
  site_config:
    driver: local
  nginx_logs:
    driver: local

networks:
  cogi-network:
    driver: bridge
COMPOSE

# Restart with SSL
docker compose -f docker-compose.prod.yml up -d

# Setup certbot auto-renewal
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "0 0,12 * * * root certbot renew --quiet && cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $SCRIPT_DIR/nginx/ssl/ && cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $SCRIPT_DIR/nginx/ssl/ && docker compose -f $SCRIPT_DIR/docker-compose.prod.yml restart nginx" | sudo tee /etc/cron.d/certbot-renew

echo ""
echo "✅ SSL setup complete!"
echo "   https://$DOMAIN"
echo "   https://$DOMAIN/admin"
echo "   https://$DOMAIN/api"
echo "   https://$DOMAIN/admin-strapi"
