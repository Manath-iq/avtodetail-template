// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

// Деплой: GitHub Pages, project site.
// SITE / BASE переопределяются переменными окружения в CI — при переносе на
// собственный домен клиента достаточно задать SITE=https://example.ru и BASE=/
const SITE = process.env.SITE ?? 'https://manath-iq.github.io';
const BASE = process.env.BASE ?? '/avtodetail-template';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  integrations: [preact({ compat: false })],
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: 'lightningcss',
    },
  },
  build: {
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
  image: {
    responsiveStyles: true,
  },
  prefetch: false,
});
