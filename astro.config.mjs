import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import tailwindcss from '@tailwindcss/vite';
import { rm } from 'node:fs/promises';
import { site } from './src/config/site.config.ts';
import editorialImages from './scripts/rehype-editorial-images.mjs';
export default defineConfig({
 site:site.domain,output:'static',trailingSlash:'always',
 markdown:{processor:satteri({hastPlugins:[editorialImages]})},
 integrations:[{name:'review-sitemap-policy',hooks:{'astro:build:done':async({dir})=>{if(!site.indexable||site.defaultRobots==='noindex, follow')await rm(new URL('sitemap.xml',dir),{force:true});}}}],
 vite:{plugins:[tailwindcss()],build:{assetsInlineLimit:0}}
});
