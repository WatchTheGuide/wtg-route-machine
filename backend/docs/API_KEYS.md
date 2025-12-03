# API Keys Management

## Overview

API keys are stored in a separate file (`/etc/nginx/api-keys.map`) to prevent losing them when updating the main Nginx configuration.

## Adding API Keys

1. **Generate a new API key:**

   ```bash
   ./backend/scripts/generate-api-key.sh client-name
   ```

2. **Add to the map file:**

   ```bash
   sudo nano /etc/nginx/api-keys.map
   ```

   Add line:

   ```
   "your-generated-key-here" "client-name";
   ```

3. **Reload Nginx:**
   ```bash
   sudo systemctl reload nginx
   ```

## File Location

- **Development:** `backend/nginx/api-keys.map`
- **Production:** `/etc/nginx/api-keys.map`

## Security

- Never commit production keys to Git
- Keep `/etc/nginx/api-keys.map` with restricted permissions:
  ```bash
  sudo chmod 600 /etc/nginx/api-keys.map
  sudo chown root:root /etc/nginx/api-keys.map
  ```

## Updating Nginx Configuration

When you update `osrm-api.conf`, your API keys in `/etc/nginx/api-keys.map` are **preserved** automatically by the deployment script.

## Example Keys

```
"dev-test-key-12345" "development";
"61bb903f104f6e155de37fa44c9c4d32..." "wtg-web-app";
"a1b2c3d4e5f6789..." "wtg-mobile-app";
```
