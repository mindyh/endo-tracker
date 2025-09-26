import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    hmr: {
      port: 3001, // Use a different port for HMR in dev containers
    },
    watch: {
      usePolling: true, // Enable polling for file changes in dev containers
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
