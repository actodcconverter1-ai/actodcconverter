import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { site } from './src/config/site.config.ts';
export default defineConfig({ site: site.domain, output: 'static', trailingSlash: 'always', vite: { plugins: [tailwindcss()], build: { assetsInlineLimit: 0 } } });
