import test from 'node:test';
import assert from 'node:assert/strict';
import type {CollectionEntry} from 'astro:content';
import {siteDirectory} from '../src/lib/site-directory.ts';
import {sitemapEntries} from '../src/lib/sitemap.ts';
import indexing from '../src/config/indexing.json' with {type:'json'};
test('search and HTML sitemap expose every public route without draft-only categories or private routes',()=>{
 const fixture=(slug:string,status:string,categories:string[])=>({id:slug,data:{slug,status,categories,title:slug,description:'Guide summary',tags:[],pubDate:new Date('2026-11-03')}} as unknown as CollectionEntry<'blog'>);
 const entries=[fixture('public-guide','published',['rectifier-basics']),fixture('secret-draft','draft',['private-category'])];
 const directory=siteDirectory(entries);
 assert.ok(directory.some(page=>page.href==='/search/'),'site search remains discoverable to users');
 assert.deepEqual(directory.filter(p=>!indexing.publicNoindexRoutes.includes(p.href)).map(p=>p.href).sort(),sitemapEntries(entries).map(p=>p.path).sort());
 assert.ok(!sitemapEntries(entries).some(page=>page.path==='/search/'),'internal search is excluded from the XML sitemap');
 assert.equal(new Set(directory.map(p=>p.href)).size,directory.length);
 assert.ok(directory.every(p=>p.title&&p.description&&!/secret|private-category|admin/.test(p.href)));
});
