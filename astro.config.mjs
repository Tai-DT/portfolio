// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://taido.dev',
  output: 'server',
  adapter: cloudflare({
    platformProxy: { enabled: true, remoteBindings: false },
    imageService: 'passthrough',
  }),
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', vi: 'vi', jp: 'ja' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
