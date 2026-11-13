import type { APIRoute } from 'astro';
import { posts } from '../lib/posts';
import {sitemapEntries,renderSitemap} from '../lib/sitemap';
export const GET: APIRoute = async () => new Response(renderSitemap(sitemapEntries(await posts())),{headers:{'Content-Type':'application/xml; charset=utf-8'}});
