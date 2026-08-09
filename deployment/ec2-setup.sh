#!/bin/bash
# ===========================================
# COGI Project - EC2 Deployment Setup Script
# ===========================================
# This script sets up Docker and Docker Compose on a fresh EC2 instance.
# Supports Ubuntu (APT) and Amazon Linux 2023 (dnf).
# Run this on your EC2 instance after SSH-ing in.
# ===========================================

set -e

echo "🚀 Starting COGI Project Deployment Setup..."

# Detect the package manager (detect functions)
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

echo "📦 Detected package manager: $PKG_MGR"

# Determine the current user for the docker group
CURRENT_USER=${USER:-$(whoami)}

# Update system + install Docker
echo "📦 Updating system packages and installing Docker..."
case "$PKG_MGR" in
    apt)
        sudo apt-get update -y
        sudo apt-get install -y ca-certificates curl
        sudo install -m 0755 -d /etc/apt/keyrings
        sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
        sudo chmod a+r /etc/apt/keyrings/docker.asc
        # Add Docker's repository (distro/version detected at runtime)
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
            sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt-get update -y
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
        ;;
    dnf)
        sudo dnf update -y
        sudo dnf install -y docker
        sudo dnf install -y docker-compose-plugin
        ;;
    yum)
        sudo yum update -y
        sudo yum install -y docker
        sudo yum install -y docker-compose-plugin
        ;;
esac

# Start + enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker "$CURRENT_USER"

echo "✅ Verifying installations..."
docker --version
docker compose version

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Log out and log back in (for docker group)"
echo "2. Transfer or clone your repository:"
echo "   git clone <your-repo-url>"
echo "   cd cogi-project"
echo ""
echo "3. Create .env file from template:"
echo "   cp .env.example .env"
echo "   nano .env  # Edit with your values"
echo ""
echo "4. Start the services:"
echo "   bash deploy.sh"
echo ""
echo "5. Check status:"
echo "   docker compose ps"
echo "   docker compose logs -f"
echo ""
echo "6. Set up SSL (if you have a domain):"
echo "   bash deploy-ssl.sh yourdomain.com"
echo ""