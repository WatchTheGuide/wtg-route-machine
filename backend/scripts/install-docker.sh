#!/usr/bin/env bash

# WTG Route Machine - Docker Installation Script
# US 9.2: Container Orchestration Setup
#
# Installs Docker Engine and Docker Compose on Ubuntu/Debian
# Run as root or with sudo privileges after setup-server.sh
#
# Usage:
#   sudo bash install-docker.sh

set -e
set -u

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

SERVICE_USER="osrm"

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Docker Installation${NC}"
echo -e "${GREEN}================================${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Please run as root or with sudo${NC}"
  exit 1
fi

echo -e "${YELLOW}[1/5] Removing old Docker versions (if any)...${NC}"
apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

echo -e "${YELLOW}[2/5] Adding Docker repository...${NC}"
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update

echo -e "${YELLOW}[3/5] Installing Docker Engine...${NC}"
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo -e "${YELLOW}[4/5] Starting Docker service...${NC}"
systemctl enable docker
systemctl start docker

echo -e "${YELLOW}[5/5] Adding $SERVICE_USER to docker group...${NC}"
usermod -aG docker "$SERVICE_USER"

# Configure Docker logging
echo -e "${YELLOW}Configuring Docker log rotation...${NC}"
mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

systemctl restart docker

echo ""
echo -e "${GREEN}✓ Docker installed successfully!${NC}"
echo ""
docker --version
docker compose version
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Logout and login again as $SERVICE_USER (for docker group to take effect)"
echo "2. Test: docker run hello-world"
echo "3. Clone the repository and proceed with deployment"
