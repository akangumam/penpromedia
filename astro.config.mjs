import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Static output (SSG) — default for Astro
  output: 'static',
  build: {
    format: 'file',
  },

  // Dev server config
  server: {
    port: 3000,
  },
});
