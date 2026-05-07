import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.einqr.app',
  appName: 'EinQR',
  webDir: 'dist/client',
  server: {
    url: 'http://192.168.140.1:4321', // Reemplaza XX con tu IP (ejecuta ipconfig)
    cleartext: true
  }
};

export default config;
