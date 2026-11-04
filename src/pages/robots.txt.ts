import type { APIRoute } from 'astro';
import { site } from '../config/site.config';
export const GET: APIRoute = () => new Response(`User-agent: *\n${site.indexable ? 'Allow: /\nDisallow: /admin/\nDisallow: /api/' : 'Disallow: /'}\nSitemap: ${site.domain}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
