# Production Configuration

## Setting up API Key

1. Generate a production API key on the server:

   ```bash
   ./backend/scripts/generate-api-key.sh wtg-web-app
   ```

2. Update `frontend/js/config.js`:

   ```javascript
   production: {
     enabled: true,
     baseUrl: 'https://osrm.watchtheguide.com/api',
     apiKey: 'YOUR_GENERATED_API_KEY_HERE', // Replace with actual key
   }
   ```

3. Add the API key to Nginx configuration on the server:
   ```bash
   sudo nano /etc/nginx/api-keys.map
   # Add: "YOUR_GENERATED_API_KEY_HERE" "wtg-web-app";
   sudo systemctl reload nginx
   ```

## Switching Between Development and Production

### Use Production API (default):

```javascript
production: {
  enabled: true,  // Production mode
  ...
}
```

### Use Local Development:

```javascript
production: {
  enabled: false,  // Switches to development config
  ...
}
development: {
  enabled: true,
  baseUrl: 'http://localhost',
  ports: {
    foot: 5001,
    bicycle: 5002,
    car: 5003,
  },
}
```

## Testing

### Test production API:

```bash
# From browser console:
console.log(CONFIG.getOsrmUrl('foot'));
// Should return: https://osrm.watchtheguide.com/api/foot

console.log(CONFIG.getHeaders());
// Should return: { 'X-API-Key': 'your-api-key' }
```

### Test route calculation:

1. Open the web app
2. Select city (Kraków)
3. Add waypoints on the map
4. Select profile (foot, bicycle, car)
5. Calculate route

The app should now use the production HTTPS API with SSL.

## Security Notes

- Never commit the production API key to Git
- Use environment variables or build-time configuration for production deployments
- Rotate API keys periodically
- Monitor API usage in Nginx logs: `/var/log/nginx/access.log`
