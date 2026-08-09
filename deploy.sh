#!/bin/bash
# ============================================
# COGI Platform - EC2 Deployment Script
# ============================================
# Run this script on your EC2 instance after
# cloning the repository.
# ============================================

set -e

echo "🚀 COGI Platform - EC2 Deployment"
echo "=================================="

# Detect the package manager
has() { command -v "$1" &> /dev/null; }

if has apt-get; then
    PKG_MGR=apt
elif has dnf; then
    PKG_MGR=dnf
elif has yum; then
    PKG_MGR=yum
else
    echo "❌ No supported package manager (apt/dnf/yum) found."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Installing..."
    case "$PKG_MGR" in
        apt)
            sudo apt-get update -y
            sudo apt-get install -y ca-certificates curl
            sudo install -m 0755 -d /etc/apt/keyrings
            sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
            sudo chmod a+r /etc/apt/keyrings/docker.asc
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
                sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            sudo apt-get update -y
            sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
            ;;
        dnf)
            sudo dnf update -y
            sudo dnf install -y docker docker-compose-plugin
            ;;
        yum)
            sudo yum update -y
            sudo yum install -y docker docker-compose-plugin
            ;;
    esac
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
    echo "✅ Docker installed. Please log out and back in for group changes to take effect."
    exit 1
fi

# Check if Docker Compose v2 plugin is installed
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose v2 is not installed. Installing..."
    case "$PKG_MGR" in
        apt)
            sudo apt-get update -y
            sudo apt-get install -y docker-compose-plugin
            ;;
        dnf)
            sudo dnf install -y docker-compose-plugin
            ;;
        yum)
            sudo yum install -y docker-compose-plugin
            ;;
    esac
    if ! docker compose version &> /dev/null; then
        echo "❌ docker-compose-plugin install failed. Install Docker Compose v2 manually."
        exit 1
    fi
    echo "✅ Docker Compose v2 installed."
fi

echo "✅ Docker $(docker --version) found"
echo "✅ Docker Compose $(docker compose version) found"

# Check for .env file
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  No .env file found!"
    echo "Creating .env from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo ""
        echo "📝 Please edit .env with your production values:"
        echo "   nano .env"
        echo ""
        echo "Required values to change:"
        echo "  - DATABASE_URL (Neon Postgres connection string: postgresql://user:pass@ep-xxx.neon.tech/cogi?sslmode=require)"
        echo "  - APP_KEYS (generate with: openssl rand -base64 32)"
        echo "  - API_TOKEN_SALT (generate with: openssl rand -base64 32)"
        echo "  - ADMIN_JWT_SECRET (generate with: openssl rand -base64 32)"
        echo "  - TRANSFER_TOKEN_SALT (generate with: openssl rand -base64 32)"
        echo "  - JWT_SECRET (generate with: openssl rand -base64 32)"
        echo "  - ENCRYPTION_KEY (generate with: openssl rand -base64 32)"
        echo ""
        echo "Run this script again after updating .env"
        exit 1
    else
        echo "❌ No .env.example found. Please create a .env file."
        exit 1
    fi
fi

# Validate critical variables using grep instead of eval
missing=0
for var in DATABASE_URL APP_KEYS API_TOKEN_SALT ADMIN_JWT_SECRET TRANSFER_TOKEN_SALT JWT_SECRET ENCRYPTION_KEY; do
    val=$(grep -E "^${var}=" .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
    if [ -z "$val" ] || [[ "$val" == *"CHANGE_ME"* ]]; then
        echo "❌ $var is not set or still has default value"
        missing=1
    fi
done

if [ $missing -eq 1 ]; then
    echo ""
    echo "⚠️  Please update your .env file with secure production values."
    echo "   nano .env"
    exit 1
fi

echo ""
echo "🔧 Building and starting services..."

# Build and start all services
docker compose down --remove-orphans 2>/dev/null || true
docker compose build --no-cache
docker compose up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 15

# Health checks
echo ""
echo "🏥 Running health checks..."

# Check Strapi
if curl -sf http://localhost:${STRAPI_PORT:-1337}/_health &>/dev/null; then
    echo "  ✅ Strapi is ready"
else
    echo "  ⏳ Strapi is still starting..."
fi

# Check Nginx
if curl -sf http://localhost:${HTTP_PORT:-80}/ &>/dev/null; then
    echo "  ✅ Nginx is serving traffic"
else
    echo "  ⏳ Nginx is still starting..."
fi

echo ""
echo "=================================="
echo "🎉 Deployment complete!"
echo "=================================="
echo ""
echo "📊 Service URLs:"
IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'YOUR_EC2_IP')
echo "  Public Website:  http://$IP"
echo "  Admin Portal:    http://$IP/admin"
echo "  Strapi API:      http://$IP/api"
echo "  Strapi Admin:    http://$IP/admin-strapi"
echo ""
echo "📋 Useful commands:"
echo "  docker compose logs -f          # View all logs"
echo "  docker compose logs -f strapi   # View Strapi logs"
echo "  docker compose ps               # Check service status"
echo "  docker compose restart          # Restart all services"
echo "  docker compose down             # Stop all services"
echo ""
echo "📝 Next steps:"
echo "  1. Create Strapi admin user at http://$IP/admin-strapi (or via CLI)"
echo "  2. Seed content via admin portal or Strapi API"
echo "  3. Set up SSL with Let's Encrypt (see deploy-ssl.sh) if you add a domain"
echo "  4. Update CORS_ORIGIN in .env if you serve from a custom domain"
