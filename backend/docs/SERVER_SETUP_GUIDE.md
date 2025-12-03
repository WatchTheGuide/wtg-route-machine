# US 9.1: Server Provisioning & Hardening - Checklist

## Automated Setup (Recommended)

Użyj skryptu automatyzującego:

```bash
# Na świeżym serwerze Ubuntu/Debian jako root:
curl -sSL https://raw.githubusercontent.com/YOUR_REPO/main/backend/scripts/setup-server.sh | sudo bash

# Lub skopiuj skrypt i uruchom lokalnie:
sudo bash backend/scripts/setup-server.sh
```

## Manual Setup (Step-by-step)

Jeśli wolisz manualną konfigurację:

### 1. System Update

```bash
sudo apt update && sudo apt upgrade -y
sudo apt autoremove -y
```

### 2. Create Service User

```bash
# Create user without root privileges
sudo useradd -m -s /bin/bash osrm

# Set password (optional, SSH keys recommended)
sudo passwd osrm
```

### 3. Configure SSH Key Authentication

**On your local machine:**

```bash
# Generate SSH key pair (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key to server
ssh-copy-id osrm@YOUR_SERVER_IP
```

**On the server:**

```bash
# Ensure .ssh directory exists
sudo mkdir -p /home/osrm/.ssh
sudo chmod 700 /home/osrm/.ssh

# Create authorized_keys file
sudo touch /home/osrm/.ssh/authorized_keys
sudo chmod 600 /home/osrm/.ssh/authorized_keys
sudo chown -R osrm:osrm /home/osrm/.ssh

# Paste your public key into authorized_keys
sudo nano /home/osrm/.ssh/authorized_keys
```

### 4. Harden SSH Configuration

```bash
# Backup original config
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Edit SSH config
sudo nano /etc/ssh/sshd_config
```

**Change these settings:**

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

**Restart SSH:**

```bash
sudo systemctl restart sshd
```

⚠️ **IMPORTANT:** Test SSH login as `osrm` user in a NEW terminal before closing current session!

### 5. Configure Firewall (UFW)

```bash
# Install UFW
sudo apt install -y ufw

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# DENY OSRM ports (internal only)
sudo ufw deny 5001/tcp
sudo ufw deny 5002/tcp
sudo ufw deny 5003/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

### 6. Install Security Updates

```bash
# Install unattended-upgrades
sudo apt install -y unattended-upgrades

# Enable automatic security updates
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 7. Install Fail2Ban (SSH Protection)

```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Verification Checklist

- [ ] System is updated (`sudo apt update && sudo apt list --upgradable`)
- [ ] User `osrm` exists (`id osrm`)
- [ ] SSH key authentication works (`ssh osrm@YOUR_SERVER_IP`)
- [ ] Root login disabled (try `ssh root@YOUR_SERVER_IP` - should fail)
- [ ] Password authentication disabled
- [ ] Firewall is active (`sudo ufw status`)
- [ ] Ports 80, 443, 22 are open
- [ ] Ports 5001-5003 are blocked from external access
- [ ] Fail2Ban is running (`sudo systemctl status fail2ban`)

## Security Best Practices

1. **Change default SSH port** (optional but recommended):

   ```bash
   sudo nano /etc/ssh/sshd_config
   # Change: Port 2222
   sudo ufw allow 2222/tcp
   sudo ufw delete allow 22/tcp
   sudo systemctl restart sshd
   ```

2. **Setup monitoring** (Covered in US 12.2)

3. **Regular backups** of `/etc` and application data

4. **Use strong SSH keys**: ED25519 or RSA 4096-bit

## Next Steps

After completing US 9.1, proceed to:

- **US 9.2**: Install Docker and Docker Compose (`bash install-docker.sh`)
- **Epic 10**: Configure Nginx reverse proxy with API key authentication
