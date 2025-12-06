import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.watchtheguide.routemachine',
  appName: 'WTG Route Machine',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      backgroundColor: '#ff6600',
      style: 'LIGHT',
    },
  },
};

export default config;
