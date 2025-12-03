#!/usr/bin/env bash

# WTG Route Machine - Production Server Setup Script
# US 9.1: Server Provisioning & Hardening
#
# This script sets up a fresh Ubuntu/Debian server for production OSRM deployment.
# Run as root or with sudo privileges.
#
# Usage:
#   curl -sSL https://raw.githubusercontent.com/.../setup-server.sh | sudo bash
#   OR
#   sudo bash setup-server.sh

set -e  # Exit on error
set -u  # Exit on undefined variable

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVICE_USER="osrm"
SSH_PORT=22  # Change if you want custom SSH port
ALLOWED_SSH_KEY=""  # Will be prompted

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}WTG Route Machine - Server Setup${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Please run as root or with sudo${NC}"
  exit 1
fi

echo -e "${YELLOW}[1/7] Updating system packages...${NC}"
apt update
apt upgrade -y
apt autoremove -y

echo -e "${YELLOW}[2/7] Installing essential packages...${NC}"
apt install -y \
  curl \
  wget \
  git \
  htop \
  ufw \
  fail2ban \
  unattended-upgrades \
  apt-transport-https \
  ca-certificates \
  gnupg \
  lsb-release

echo -e "${YELLOW}[3/7] Creating service user: ${SERVICE_USER}${NC}"
if id "$SERVICE_USER" &>/dev/null; then
  echo "User $SERVICE_USER already exists"
else
  useradd -m -s /bin/bash "$SERVICE_USER"
  echo "User $SERVICE_USER created"
fi

# Add user to docker group (will be created later)
echo "User will be added to docker group after Docker installation"

echo -e "${YELLOW}[4/7] Configuring UFW firewall...${NC}"
# Reset UFW to defaults
ufw --force reset

# Default policies
ufw default deny incoming
ufw default allow outgoing

# Allow SSH
ufw allow $SSH_PORT/tcp comment 'SSH'

# Allow HTTP/HTTPS for Nginx
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'

# DENY direct access to OSRM ports
ufw deny 5001/tcp comment 'OSRM Foot - Internal Only'
ufw deny 5002/tcp comment 'OSRM Bicycle - Internal Only'
ufw deny 5003/tcp comment 'OSRM Car - Internal Only'

# Enable firewall (non-interactive)
ufw --force enable

echo -e "${GREEN}✓ Firewall configured${NC}"
ufw status verbose

echo -e "${YELLOW}[5/7] Hardening SSH configuration...${NC}"

# Backup original sshd_config
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Update SSH settings
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config

# Restart SSH
systemctl restart sshd

echo -e "${GREEN}✓ SSH hardened (root login disabled, password auth disabled)${NC}"

echo -e "${YELLOW}[6/7] Configuring automatic security updates...${NC}"
cat > /etc/apt/apt.conf.d/50unattended-upgrades <<EOF
Unattended-Upgrade::Allowed-Origins {
    "\${distro_id}:\${distro_codename}-security";
    "\${distro_id}ESMApps:\${distro_codename}-apps-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
EOF

systemctl enable unattended-upgrades
systemctl start unattended-upgrades

echo -e "${GREEN}✓ Automatic security updates enabled${NC}"

echo -e "${YELLOW}[7/7] Configuring Fail2Ban (SSH protection)...${NC}"
systemctl enable fail2ban
systemctl start fail2ban

echo -e "${GREEN}✓ Fail2Ban enabled${NC}"

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ Server setup complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Add your SSH public key to ~/.ssh/authorized_keys for user: $SERVICE_USER"
echo "2. Test SSH access as $SERVICE_USER BEFORE logging out"
echo "3. Run the Docker installation script: sudo bash install-docker.sh"
echo ""
echo -e "${YELLOW}Important:${NC}"
echo "- Root login is now DISABLED"
echo "- Password authentication is DISABLED"
echo "- Only SSH key authentication is allowed"
echo "- Ports 5001-5003 are blocked from external access"
echo ""
echo -e "${RED}⚠️  Make sure you can login as $SERVICE_USER with SSH key before closing this session!${NC}"
