import type {CollectionEntry} from 'astro:content';
import {canonical} from '../config/seo.config.ts';
import {architectureUpdated,calculatorSpokes} from './topic-graph.ts';
export interface SitemapEntry {path:string;priority:number;lastmod?:string;}
export function sitemapEntries(entries:CollectionEntry<'blog'>[]):SitemapEntry[] {
  const published=entries.filter(entry=>entry.data.status==='published');
  const modified=(entry:CollectionEntry<'blog'>)=>new Date(Math.max(
    entry.data.pubDate.valueOf(),(entry.data.updatedDate??entry.data.pubDate).valueOf(),Date.parse(architectureUpdated),
  )).toISOString().slice(0,10);
  return [
    {path:'/',priority:1,lastmod:architectureUpdated},
    {path:'/calculators/',priority:.9,lastmod:architectureUpdated},
    ...calculatorSpokes.map(spoke=>({path:spoke.href,priority:.9,lastmod:architectureUpdated})),
    {path:'/blog/',priority:.8,lastmod:architectureUpdated},
    ...published.map(entry=>({path:`/blog/${entry.data.slug}/`,priority:.8,lastmod:modified(entry)})),
    ...[...new Set(published.flatMap(entry=>entry.data.categories))].sort().map(category=>({path:`/category/${category}/`,priority:.6,lastmod:architectureUpdated})),
    ...['about','editorial','contact'].map(route=>({path:`/${route}/`,priority:.3})),
    ...['privacy','terms','disclaimer'].map(route=>({path:`/${route}/`,priority:.2})),
  ];
}
export function renderSitemap(entries:SitemapEntry[]):string {
  const escape=(value:string)=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map(entry=>`<url><loc>${escape(canonical(entry.path))}</loc>${entry.lastmod?`<lastmod>${entry.lastmod}</lastmod>`:''}<priority>${entry.priority.toFixed(1)}</priority></url>`).join('')}</urlset>`;
}
