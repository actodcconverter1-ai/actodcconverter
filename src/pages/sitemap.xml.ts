import type { APIRoute } from 'astro';
import { posts } from '../lib/posts';
import { canonical } from '../config/seo.config';
const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
export const GET: APIRoute = async () => {
  const entries = await posts();
  const routes = ['/', '/ac-to-dc-calculator/', '/full-wave-rectifier-calculator/', '/half-wave-rectifier-calculator/', '/blog/', '/about/', '/editorial/', '/contact/', '/privacy/', '/terms/', '/disclaimer/', ...entries.map(entry => `/blog/${entry.data.slug}/`), ...[...new Set(entries.flatMap(entry => entry.data.categories))].map(category => `/category/${category}/`)];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${escape(canonical(route))}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
