import {readFile,writeFile} from 'node:fs/promises';
import {parse} from 'parse5';
import {walk,attr,norm} from './localization-core.mjs';
const config=JSON.parse(await readFile('src/config/languages.json','utf8'));
const domain=new URL(JSON.parse(await readFile('src/config/editorial.json','utf8')).domain).origin;
const seoTitles=JSON.parse(await readFile('src/i18n/seo-titles.json','utf8'));
const seoDescriptions=JSON.parse(await readFile('src/i18n/seo-descriptions.json','utf8'));
const pageHeadings=JSON.parse(await readFile('src/i18n/page-headings.json','utf8'));
const primarySectionHeadings=JSON.parse(await readFile('src/i18n/primary-section-headings.json','utf8'));
const {publicNoindexRoutes}=JSON.parse(await readFile('src/config/indexing.json','utf8'));
const xml=await readFile('dist/sitemap.xml','utf8');const indexableUrls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const noindexUrls=config.languages.flatMap(l=>publicNoindexRoutes.map(path=>domain+l.prefix+path));
const urls=[...new Set([...indexableUrls,...noindexUrls])];const known=new Set(urls.map(u=>new URL(u).pathname));
const errors=[];const fail=(p,s)=>errors.push(p+': '+s);const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const titleRoutes=new Map();
const primaryHeadingRoutes=new Map();
for(const url of urls){const path=new URL(url).pathname;const locale=config.languages.find(l=>l.prefix&&path.startsWith(l.prefix+'/'))??config.languages[0];
 const html=await readFile('dist'+path+'index.html','utf8');const doc=parse(html);let canonical,lang,dir,title,graph,mainHeading;const alternates=new Map();const breadcrumbs=[];let links=0;
 walk(doc,n=>{if(n.tagName==='html'){lang=attr(n,'lang');dir=attr(n,'dir');}if(n.tagName==='title'&&!title)title=text(n);if(n.tagName==='h1')mainHeading=text(n);if(n.tagName==='link'&&attr(n,'rel')==='canonical')canonical=attr(n,'href');if(n.tagName==='link'&&attr(n,'rel')==='alternate')alternates.set(attr(n,'hreflang'),attr(n,'href'));if(n.tagName==='script'&&attr(n,'type')==='application/ld+json')graph=JSON.parse(text(n))['@graph'];if(n.tagName==='nav'&&attr(n,'class')?.includes('breadcrumbs'))walk(n,c=>{if(c.tagName==='li')breadcrumbs.push(norm(text(c)));});if(n.tagName==='a'){const href=attr(n,'href');if(href?.startsWith('/')&&!href.startsWith('//')){const u=new URL(href,domain);if(!u.pathname.split('/').at(-1).includes('.')&&!known.has(u.pathname)&&!u.pathname.startsWith('/api/'))fail(path,'missing internal route '+href);links++;}}});
 if(canonical!==url)fail(path,'canonical mismatch');if(lang!==locale.code)fail(path,'language mismatch');if((dir??'ltr')!==locale.direction)fail(path,'direction mismatch');if(!title||!mainHeading)fail(path,'missing title/H1');
 const titleKey=norm(title??'').normalize('NFC').toLowerCase();
 if(titleRoutes.has(titleKey))fail(path,'duplicate title also used at '+titleRoutes.get(titleKey));
 else titleRoutes.set(titleKey,path);
 const base=locale.prefix?path.slice(locale.prefix.length):path;
 if(['/search/','/sitemap/'].includes(base)){
  const headingId=base==='/search/'?'search-results-heading':'public-pages-heading';let headingFound=false,listFound=false;
  walk(doc,n=>{if(n.tagName==='h2'&&attr(n,'id')===headingId&&norm(text(n)))headingFound=true;if(n.tagName==='ul'&&attr(n,'aria-labelledby')===headingId)listFound=true;});
  if(!headingFound||!listFound)fail(path,'utility directory requires a visible H2 labelling its results list');
 }
 const noindex=publicNoindexRoutes.includes(base);
 let robots;walk(doc,n=>{if(n.tagName==='meta'&&attr(n,'name')==='robots')robots=attr(n,'content');});
 if(noindex){if(robots!=='noindex, follow')fail(path,'utility page must be noindex, follow');if(indexableUrls.includes(url))fail(path,'noindex page is in XML sitemap');if([...alternates.keys()].some(key=>key!==undefined))fail(path,'noindex page must not advertise indexable language alternates');}
 else{if(robots!=='index, follow')fail(path,'indexable page robots mismatch');for(const l of config.languages)if(alternates.get(l.code)!==domain+l.prefix+base)fail(path,'invalid hreflang '+l.code);if(alternates.get('x-default')!==domain+base)fail(path,'missing x-default');}
 const page=graph?.find(n=>n['@type']==='WebPage');if(page?.url!==url)fail(path,'schema page URL mismatch');
 if(title?.length>60)fail(path,'title exceeds the site editorial budget of 60 characters');
 if(title&&title.length<30)fail(path,'title is below the site editorial target of 30 characters');
 if(mainHeading&&norm(mainHeading).length>70)fail(path,'H1 exceeds the site editorial budget of 70 characters');
 walk(doc,n=>{if(n.tagName==='h2'&&norm(text(n)).length>70)fail(path,'H2 exceeds the site editorial budget of 70 characters: '+norm(text(n)));});
 let firstSectionHeading;walk(doc,n=>{if(firstSectionHeading===undefined&&n.tagName==='h2')firstSectionHeading=norm(text(n));});
 if(primarySectionHeadings[path]&&firstSectionHeading!==primarySectionHeadings[path])fail(path,'configured primary H2 mismatch');
 if(firstSectionHeading){const key=firstSectionHeading.normalize('NFC').toLowerCase();if(primaryHeadingRoutes.has(key))fail(path,'primary H2 also used at '+primaryHeadingRoutes.get(key));else primaryHeadingRoutes.set(key,path);}
 const configuredHeading=pageHeadings[path];
 if(configuredHeading&&norm(mainHeading)!==norm(typeof configuredHeading==='string'?configuredHeading:configuredHeading.lead+' '+configuredHeading.detail))fail(path,'configured page heading mismatch');
 if(configuredHeading&&typeof configuredHeading==='object')walk(doc,n=>{if(n.tagName==='h1'&&!n.childNodes.some(child=>child.tagName==='span'&&norm(text(child))===norm(configuredHeading.detail)))fail(path,'styled homepage heading detail missing');});
 if(seoTitles[path]&&title!==seoTitles[path])fail(path,'configured SEO title mismatch');
 if(seoTitles[path]&&page?.name!==title)fail(path,'schema page name differs from concise SEO title');
 walk(doc,n=>{if(n.tagName==='meta'&&(attr(n,'property')==='og:title'||attr(n,'name')==='twitter:title'))if(attr(n,'content')!==title)fail(path,'social title differs from document title');});
 let description;walk(doc,n=>{if(n.tagName==='meta'&&attr(n,'name')==='description')description=attr(n,'content');});
 if(description?.length>155)fail(path,'description exceeds the site editorial budget of 155 characters');
 if(seoDescriptions[path]&&description!==seoDescriptions[path])fail(path,'configured SEO description mismatch');
 if(seoDescriptions[path]&&page?.description!==description)fail(path,'schema page description differs from meta description');
 walk(doc,n=>{if(n.tagName==='meta'&&(attr(n,'property')==='og:description'||attr(n,'name')==='twitter:description'))if(attr(n,'content')!==description)fail(path,'social description differs from meta description');});
 const article=graph?.find(n=>[].concat(n['@type']??[]).includes('TechArticle'));if(article&&base.startsWith('/blog/')&&base!=='/blog/'&&norm(article.headline)!==norm(mainHeading))fail(path,'article headline mismatch');
 if(article&&configuredHeading&&norm(article.headline)!==norm(mainHeading))fail(path,'edited H1 and article schema headline mismatch');
 const crumb=graph?.find(n=>n['@type']==='BreadcrumbList');if(crumb&&JSON.stringify(breadcrumbs)!==JSON.stringify(crumb.itemListElement.map(i=>norm(i.name))))fail(path,'breadcrumb text mismatch');
 if(!links)fail(path,'no internal links');
}
const report={languages:config.languages.length,pages:urls.length,indexablePages:indexableUrls.length,noindexPages:noindexUrls.length,errors};await writeFile('artifacts/localization-audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(errors.length)process.exit(1);
