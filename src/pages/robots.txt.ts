import type { APIRoute } from 'astro';import{site}from'../config/site.config';
export const GET:APIRoute=()=>new Response(`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n${site.indexable&&site.defaultRobots==='index, follow'?`Sitemap: ${site.domain}/sitemap.xml\n`:''}`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
