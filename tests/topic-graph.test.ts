import test from 'node:test';
import assert from 'node:assert/strict';
import type {CollectionEntry} from 'astro:content';
import {buildSpokes,calculatorSpokes,relatedSpokes} from '../src/lib/topic-graph.ts';
import {breadcrumbsForPath,breadcrumbSchema} from '../src/lib/breadcrumbs.ts';
import {webApplication,techArticle,faqPage,serializeJsonLd} from '../src/lib/structured-data.ts';
import {sitemapEntries,renderSitemap} from '../src/lib/sitemap.ts';
import {homepageFaqs} from '../src/config/homepage-faq.ts';

const article=(slug:string,status='published',categories=['rectifier-basics'])=>({id:slug,data:{slug,status,title:slug.replaceAll('-',' '),description:'Defined educational model',categories,tags:['ripple'],pubDate:new Date('2026-11-03'),updatedDate:new Date('2026-11-13')}} as unknown as CollectionEntry<'blog'>);
test('catalog includes published guides and calculators without leaking drafts',()=>{
 const spokes=buildSpokes([article('bridge-formulas'),article('private-draft','draft')]);
 assert.equal(spokes.length,calculatorSpokes.length+1);
 assert.ok(spokes.some(spoke=>spoke.href==='/blog/bridge-formulas/'));
 assert.ok(!spokes.some(spoke=>spoke.href.includes('private-draft')));
 assert.equal(new Set(spokes.map(spoke=>spoke.href)).size,spokes.length);
});
test('related links exclude the current route, include real tools and rank shared topics',()=>{
 const spokes=buildSpokes([article('bridge-formulas'),article('unrelated-applications','published',['applications']),article('bridge-ripple')]);
 const links=relatedSpokes('/blog/bridge-formulas/',spokes,3);
 assert.equal(links.length,3);
 assert.ok(links.every(link=>link.href!=='/blog/bridge-formulas/'&&spokes.includes(link)));
 assert.equal(links.filter(link=>link.kind==='calculator').length,2);
 assert.equal(links[2].href,'/blog/bridge-ripple/');
 assert.deepEqual(relatedSpokes('/missing/',spokes),[]);
});
test('guide and tool breadcrumbs have a section parent and canonical current item',()=>{
 for(const [path,title,section] of [['/blog/bridge-formulas/','Bridge formulas','Guides'],['/half-wave-rectifier-calculator/','Half-wave calculator','Calculators']]){
  const items=breadcrumbsForPath(path,title),schema=breadcrumbSchema(items,path);
  assert.equal(items.length,3);assert.equal(items[1].label,section);
  assert.equal(items[2].label,title);assert.equal(items[2].href,undefined);
  assert.deepEqual(schema.itemListElement.map(item=>item.position),[1,2,3]);
  assert.ok(schema.itemListElement[2].item.endsWith(path));
 }
 assert.deepEqual(breadcrumbsForPath('/','Home'),[]);
});
test('schema models factual application/article content and exactly the shared visible FAQs',()=>{
 const app=webApplication('/','AC to DC converter calculator','Defined models',['Rectifier','Filter']);
 assert.equal(app['@type'],'WebApplication');assert.equal(app.isAccessibleForFree,true);
 assert.ok(!('aggregateRating' in app));assert.ok(app.url.endsWith('/#calculator'));
 const articleNode=techArticle('/blog/bridge-formulas/','Bridge formulas','Defined models');
 assert.equal(articleNode['@type'],'TechArticle');assert.ok(articleNode.mainEntityOfPage['@id'].endsWith('/blog/bridge-formulas/#webpage'));
 const faq=faqPage('/',homepageFaqs);
 assert.deepEqual(faq.mainEntity.map(item=>[item.name,item.acceptedAnswer.text]),homepageFaqs.map(item=>[...item]));
});
test('JSON-LD preserves user text while preventing an HTML script terminator',()=>{
 const input={headline:'</script><script>alert("x")</script> & model'};
 const serialized=serializeJsonLd(input);
 assert.ok(!serialized.includes('<'));assert.deepEqual(JSON.parse(serialized),input);
});
test('sitemap covers hub, calculators, published guides and categories with valid priorities',()=>{
 const entries=sitemapEntries([article('bridge-formulas'),article('draft-guide','draft')]);
 assert.equal(new Set(entries.map(entry=>entry.path)).size,entries.length);
 assert.equal(entries.find(entry=>entry.path==='/')?.priority,1);
 for(const tool of calculatorSpokes)assert.ok(entries.some(entry=>entry.path===tool.href));
 assert.ok(entries.some(entry=>entry.path==='/calculators/'));
 assert.ok(entries.some(entry=>entry.path==='/category/rectifier-basics/'));
 assert.ok(!entries.some(entry=>/draft|admin|404/.test(entry.path)));
 assert.ok(entries.every(entry=>entry.priority>=0&&entry.priority<=1));
 assert.equal(entries.find(entry=>entry.path==='/blog/bridge-formulas/')?.lastmod,'2026-11-13');
 const xml=renderSitemap(entries);assert.ok(xml.includes('<priority>1.0</priority>'));assert.ok(xml.includes('<lastmod>2026-11-13</lastmod>'));
});
