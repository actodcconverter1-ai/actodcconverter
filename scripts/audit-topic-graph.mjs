import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {join,relative} from 'node:path';
const root='dist';
const walk=async dir=>(await Promise.all((await readdir(dir,{withFileTypes:true})).map(entry=>entry.isDirectory()?walk(join(dir,entry.name)):join(dir,entry.name)))).flat();
const settings=JSON.parse(await readFile('src/config/editorial.json','utf8'));
const domain=new URL(settings.domain).origin;
const files=(await walk(root)).filter(file=>file.endsWith('.html')&&!relative(root,file).replaceAll('\\','/').startsWith('admin/'));
const pages=new Map();
for(const file of files){
 const name=relative(root,file).replaceAll('\\','/');
 if(name==='404.html')continue;
 pages.set('/'+name.replace(/index\.html$/,''),await readFile(file,'utf8'));
}
const errors=[];
const check=(condition,message)=>{if(!condition)errors.push(message);};
const decode=value=>value.replace(/&#(\d+);/g,(_,code)=>String.fromCodePoint(Number(code))).replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');
const text=value=>decode(value.replace(/<[^>]*>/g,'')).replace(/\s+/g,' ').trim();
const links=value=>[...value.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match=>decode(match[1]));
const section=html=>/<section\b[^>]*\bdata-related-spokes\b[^>]*>([\s\S]*?)<\/section>/.exec(html)?.[1]??'';
const toolPaths=['/ac-to-dc-calculator/','/full-wave-rectifier-calculator/','/half-wave-rectifier-calculator/'];
const spokes=[...pages.keys()].filter(path=>toolPaths.includes(path)||/^\/blog\/[^/]+\/$/.test(path));
const home=pages.get('/');
check(Boolean(home),'Homepage missing');
const homeLinks=new Set(links(section(home??'')));
for(const path of spokes)check(homeLinks.has(path),'Hub directory missing '+path);
let faqCount=0;
for(const [path,html] of pages){
 const head=/<head\b[^>]*>([\s\S]*?)<\/head>/.exec(html)?.[1]??'';
 const scripts=[...head.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
 const allScripts=[...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>/g)];
 check(scripts.length===1&&allScripts.length===1,path+': JSON-LD must be a single head graph');
 let graph=[];
 try{const data=JSON.parse(scripts[0]?.[1]??'null');check(data?.['@context']==='https://schema.org'&&Array.isArray(data?.['@graph']),path+': invalid schema graph');graph=data?.['@graph']??[];}
 catch{errors.push(path+': invalid JSON-LD');}
 const ids=graph.map(node=>node['@id']);
 check(ids.every(id=>typeof id==='string')&&new Set(ids).size===ids.length,path+': missing or duplicated schema IDs');
 const canonical=/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/.exec(head)?.[1];
 check(canonical===new URL(path,domain).href,path+': canonical is not self-referencing');
 if(path==='/'){
  for(const type of ['WebApplication','TechArticle','FAQPage'])check(graph.some(node=>node['@type']===type),'Hub missing '+type);
  const faq=graph.find(node=>node['@type']==='FAQPage');
  const visible=[...html.matchAll(/<details\b[^>]*class="hub-faq"[^>]*><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)].map(match=>[text(match[1]),text(match[2])]);
  faqCount=visible.length;
  check(visible.length>0&&JSON.stringify(visible)===JSON.stringify(faq?.mainEntity.map(item=>[item.name,item.acceptedAnswer.text])), 'FAQ schema differs from visible questions and answers');
 }
 if(path!=='/'){
  const crumb=graph.find(node=>node['@type']==='BreadcrumbList');
  const visibleNav=/<nav\b[^>]*aria-label="Breadcrumb"[^>]*>([\s\S]*?)<\/nav>/.exec(html)?.[1]??'';
  const visibleLabels=[...visibleNav.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(match=>text(match[1]));
  check(visibleLabels.length>=2&&JSON.stringify(visibleLabels)===JSON.stringify(crumb?.itemListElement.map(item=>item.name)),path+': visible/schema breadcrumbs differ');
  check(crumb?.itemListElement.at(-1)?.item===canonical,path+': breadcrumb final item differs from canonical');
  const page=graph.find(node=>node['@type']==='WebPage');
  check(page?.breadcrumb?.['@id']===crumb?.['@id'],path+': WebPage breadcrumb reference missing');
 }
 if(spokes.includes(path)){
  const expectedType=toolPaths.includes(path)?'WebApplication':'TechArticle';
  check(graph.some(node=>node['@type']===expectedType),path+': missing '+expectedType);
  const intro=/<p\b[^>]*class="spoke-intro"[^>]*>([\s\S]*?)<\/p>/.exec(html)?.[1]??'';
  check(links(intro).includes('/'),path+': opening paragraph missing hub backlink');
  const related=links(section(html));
  check(related.length>=4&&related.every(target=>target!==path&&spokes.includes(target)),path+': incomplete, self-referential or invalid related links');
  const navPosition=html.indexOf('aria-label="Breadcrumb"');
  check(navPosition>0&&navPosition<html.indexOf('<h1'),path+': breadcrumb must precede H1');
  const app=graph.find(node=>node['@type']==='WebApplication');
  if(app){const id=new URL(app.url).hash.slice(1);check(html.includes('id="'+id+'"'),path+': application URL fragment is absent');}
  const article=graph.find(node=>node['@type']==='TechArticle');
  if(article)check(text(/<h1\b[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1]??'')===article.headline,path+': article headline differs from visible H1');
 }
}
const activeSitemap=settings.indexable&&settings.defaultRobots==='index, follow';
const xml=activeSitemap?await readFile(join(root,'sitemap.xml'),'utf8'):'';
const urls=[...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)];
const sitemapPaths=[];
for(const [,entry] of urls){
 const loc=/<loc>([^<]+)<\/loc>/.exec(entry)?.[1];
 const priority=/<priority>([^<]+)<\/priority>/.exec(entry)?.[1];
 check(priority!==undefined&&Number(priority)>=0&&Number(priority)<=1,'Sitemap priority invalid: '+loc);
 const url=new URL(decode(loc??'https://invalid.invalid/'));
 check(url.origin===domain&&!url.search&&!url.hash,'Sitemap URL is not canonical: '+loc);
 sitemapPaths.push(url.pathname);
 const lastmod=/<lastmod>([^<]+)<\/lastmod>/.exec(entry)?.[1];
 if(lastmod)check(/^\d{4}-\d{2}-\d{2}$/.test(lastmod)&&!Number.isNaN(Date.parse(lastmod)),'Invalid lastmod: '+loc);
}
check(new Set(sitemapPaths).size===sitemapPaths.length,'Sitemap contains duplicate URLs');
if(activeSitemap)check(sitemapPaths.length===pages.size&&sitemapPaths.every(path=>pages.has(path)),'Sitemap does not exactly cover indexable public routes');
const report={publicPages:pages.size,spokes:spokes.length,homepageDirectoryLinks:homeLinks.size,visibleFaqs:faqCount,sitemapUrls:sitemapPaths.length,errors};
await mkdir('artifacts',{recursive:true});
await writeFile('artifacts/topic-graph-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if(errors.length)process.exit(1);
