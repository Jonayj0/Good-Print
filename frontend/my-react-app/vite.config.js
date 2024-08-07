import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración extendida de Vite para una aplicación React
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3005,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});




