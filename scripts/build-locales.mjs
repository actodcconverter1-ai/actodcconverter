import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {parse,parseFragment,serialize} from 'parse5';
import {syncFaqSchema} from './faq-schema.mjs';
import {localize,walk,attr,norm} from './localization-core.mjs';
import ts from 'typescript';
import{formatResult}from'../src/lib/result-presentation.ts';
import{architectureUpdated}from'../src/lib/topic-graph.ts';
const arabicEditorial=JSON.parse(await readFile('src/i18n/arabic-editorial.json','utf8'));
const config=JSON.parse(await readFile('src/config/languages.json','utf8'));
const settings=JSON.parse(await readFile('src/config/editorial.json','utf8'));
const domain=new URL(settings.domain).origin;
const xml=await readFile('dist/sitemap.xml','utf8');
const {publicNoindexRoutes}=JSON.parse(await readFile('src/config/indexing.json','utf8'));
const indexablePaths=new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname));
const paths=new Set([...indexablePaths,...publicNoindexRoutes]);
const seoTitles=JSON.parse(await readFile('src/i18n/seo-titles.json','utf8'));
const seoDescriptions=JSON.parse(await readFile('src/i18n/seo-descriptions.json','utf8'));
// Keep approved translations on their existing description source when English alone is revised.
const descriptionBaselines=JSON.parse(await readFile('src/config/localization-description-baselines.json','utf8'));
const pageHeadings=JSON.parse(await readFile('src/i18n/page-headings.json','utf8'));
const sectionHeadings=JSON.parse(await readFile('src/i18n/section-headings.json','utf8'));
const primarySectionHeadings=JSON.parse(await readFile('src/i18n/primary-section-headings.json','utf8'));
const headingText=value=>typeof value==='string'?norm(value):value&&typeof value.lead==='string'&&typeof value.detail==='string'?norm(value.lead+' '+value.detail):'';
const elementText=node=>node.nodeName==='#text'?node.value:(node.childNodes??[]).map(elementText).join('');
for(const [code,headings]of Object.entries(sectionHeadings)){
 if(!config.languages.some(locale=>locale.code===code))throw Error('Unknown section-heading language: '+code);
 for(const [original,replacement]of Object.entries(headings))if(!original.trim()||typeof replacement!=='string'||!replacement.trim()||replacement!==norm(replacement)||replacement.length>70)throw Error('Invalid section heading: '+code+': '+original);
}
const localizedPaths=new Set(config.languages.flatMap(locale=>[...paths].map(path=>locale.prefix+path)));
for(const [path,heading]of Object.entries(primarySectionHeadings))if(!localizedPaths.has(path)||typeof heading!=='string'||!heading.trim()||heading!==norm(heading)||heading.length>70)throw Error('Invalid primary section heading: '+path);
for(const [path,title] of Object.entries(seoTitles)){
 if(!localizedPaths.has(path))throw Error('Unknown SEO title route: '+path);
 if(typeof title!=='string'||!title.trim()||title!==title.trim()||title.length<30||title.length>60)throw Error('Invalid concise SEO title: '+path);
}
for(const [path,description] of Object.entries(seoDescriptions)){
 if(!localizedPaths.has(path))throw Error('Unknown SEO description route: '+path);
 if(typeof description!=='string'||!description.trim()||description!==description.trim()||description.length>155)throw Error('Invalid concise SEO description: '+path);
}
for(const [path,heading] of Object.entries(pageHeadings)){
 if(!localizedPaths.has(path))throw Error('Unknown heading route: '+path);
 const text=headingText(heading);
 if(!text||text.length>70)throw Error('Invalid concise page heading: '+path);
}
const sourceDictionary=JSON.parse(await readFile('src/i18n/en.json','utf8'));
const dictionaries=new Map();for(const l of config.languages)if(l.code!=='en'){const dictionary=JSON.parse(await readFile('src/i18n/'+l.code+'.json','utf8'));const missing=Object.keys(sourceDictionary).filter(key=>typeof dictionary[key]!=='string'||!dictionary[key].trim());if(missing.length)throw Error(l.code+': '+missing.length+' missing translation entries');dictionaries.set(l.code,dictionary);}
for(const path of paths){
 const source=await readFile('dist'+path+'index.html','utf8');
 let translationSource=source;
 if(descriptionBaselines[path]){
  const doc=parse(source);let originalDescription;
  walk(doc,n=>{if(n.tagName==='meta'&&attr(n,'name')==='description')originalDescription=attr(n,'content');});
  walk(doc,n=>{
   if(n.tagName==='meta'&&(['description','twitter:description'].includes(attr(n,'name'))||attr(n,'property')==='og:description'))attr(n,'content',descriptionBaselines[path]);
   if(n.tagName==='script'&&attr(n,'type')==='application/ld+json'){
    const data=JSON.parse(n.childNodes[0].value);
    for(const item of data['@graph']??[])if(item.description===originalDescription)item.description=descriptionBaselines[path];
    n.childNodes[0].value=JSON.stringify(data).replaceAll('<','\\u003c');
   }
  });
  translationSource=serialize(doc);
 }
 for(const locale of config.languages){
  const translated=locale.code==='en'?source:localize(translationSource,locale,dictionaries.get(locale.code),domain,paths);
  const doc=parse(translated);let head;
  if(locale.code==='ar'&&arabicEditorial[path])walk(doc,n=>{for(const[cls,html]of Object.entries(arabicEditorial[path]))if(attr(n,'class')?.split(/\s+/).includes(cls)){n.childNodes=parseFragment(html).childNodes;for(const c of n.childNodes)c.parentNode=n;}});
  if(locale.code!=='en')walk(doc,n=>{let p=n.parentNode;while(p&&!attr(p,'class')?.split(/\s+/).includes('metric-grid'))p=p.parentNode;if(n.tagName==='dd'&&p||attr(n,'data-localized-result')!==undefined){const m=elementText(n).match(/^([<>]?)([\d,.]+)(.*)$/);if(m){const value=Number(m[2].replaceAll(',',''));n.childNodes=[{nodeName:'#text',value:m[1]+formatResult(value,locale.code)+m[3],parentNode:n}];}}});
  const primarySectionHeading=primarySectionHeadings[locale.prefix+path];
  if(primarySectionHeading){
   let first;
   walk(doc,node=>{if(!first&&node.tagName==='h2')first=node;});
   if(!first)throw Error('Primary section heading requires an H2: '+locale.prefix+path);
   let card=first.parentNode;
   while(card&&!attr(card,'class')?.split(/\s+/).includes('article-card'))card=card.parentNode;
   if(card){
    const grid=card.parentNode;
    if(!attr(grid,'class')?.split(/\s+/).includes('article-grid')||!grid.parentNode)throw Error('Missing category grid for primary heading: '+locale.prefix+path);
    const parent=grid.parentNode;
    const heading={nodeName:'h2',tagName:'h2',namespaceURI:first.namespaceURI,attrs:[],childNodes:[],parentNode:parent};
    heading.childNodes.push({nodeName:'#text',value:primarySectionHeading,parentNode:heading});
    parent.childNodes.splice(parent.childNodes.indexOf(grid),0,heading);
   }else{
    if(first.childNodes.some(node=>node.nodeName!=='#text'))throw Error('Unsupported primary-heading markup: '+locale.prefix+path);
    first.childNodes=[{nodeName:'#text',value:primarySectionHeading,parentNode:first}];
   }
  }
  walk(doc,node=>{
   if(!['h2','h3'].includes(node.tagName))return;
   const children=node.childNodes??[];
   const link=children.length===1&&children[0].tagName==='a'?children[0]:undefined;
   let replacement=node.tagName==='h2'?sectionHeadings[locale.code]?.[norm(elementText(node))]:undefined;
   if(!replacement&&link){
    let card=node.parentNode;
    while(card&&!attr(card,'class')?.split(/\s+/).includes('article-card'))card=card.parentNode;
    if(card){const target=new URL(attr(link,'href')??'',domain+locale.prefix+path);if(target.origin===domain&&pageHeadings[target.pathname])replacement=headingText(pageHeadings[target.pathname]);}
   }
   if(!replacement)return;
   if(!link&&children.some(child=>child.nodeName!=='#text'))throw Error('Unsupported section-heading markup: '+locale.prefix+path);
   const container=link??node;
   container.childNodes=[{nodeName:'#text',value:replacement,parentNode:container}];
  });
  const pageHeading=pageHeadings[locale.prefix+path];
  if(pageHeading){
   const headline=headingText(pageHeading);let count=0;
   walk(doc,node=>{
    if(node.tagName==='h1'){
     count++;
     if(typeof pageHeading==='string')node.childNodes=[{nodeName:'#text',value:headline,parentNode:node}];
     else{
      const detail=node.childNodes.find(child=>child.tagName==='span');
      if(!detail)throw Error('Missing styled heading detail: '+locale.prefix+path);
      detail.childNodes=[{nodeName:'#text',value:norm(pageHeading.detail),parentNode:detail}];
      node.childNodes=[{nodeName:'#text',value:norm(pageHeading.lead)+' ',parentNode:node},detail];
     }
    }
    if(node.tagName==='script'&&attr(node,'type')==='application/ld+json'){
     const data=JSON.parse(node.childNodes[0].value);
     for(const item of data['@graph']??[])if([].concat(item['@type']??[]).some(type=>['TechArticle','BlogPosting'].includes(type)))item.headline=headline;
     node.childNodes[0].value=JSON.stringify(data).replaceAll('<','\\u003c');
    }
   });
   if(count!==1)throw Error('Heading override requires exactly one H1: '+locale.prefix+path);
  }
  const seoTitle=seoTitles[locale.prefix+path];
  if(seoTitle)walk(doc,node=>{
   if(node.tagName==='title')node.childNodes=[{nodeName:'#text',value:seoTitle,parentNode:node}];
   if(node.tagName==='meta'&&(attr(node,'property')==='og:title'||attr(node,'name')==='twitter:title'))attr(node,'content',seoTitle);
   if(node.tagName==='script'&&attr(node,'type')==='application/ld+json'){
    const data=JSON.parse(node.childNodes[0].value);
    for(const item of data['@graph']??[])if(item['@type']==='WebPage')item.name=seoTitle;
    node.childNodes[0].value=JSON.stringify(data).replaceAll('<','\\u003c');
   }
  });
  const seoDescription=seoDescriptions[locale.prefix+path];
  if(seoDescription){
   let previousDescription;
   walk(doc,node=>{if(node.tagName==='meta'&&attr(node,'name')==='description')previousDescription=attr(node,'content');});
   walk(doc,node=>{
    if(node.tagName==='meta'&&(['description','twitter:description'].includes(attr(node,'name'))||attr(node,'property')==='og:description'))attr(node,'content',seoDescription);
    if(node.tagName==='script'&&attr(node,'type')==='application/ld+json'){
     const data=JSON.parse(node.childNodes[0].value);
     for(const item of data['@graph']??[])if(item['@type']==='WebPage'||item.description===previousDescription)item.description=seoDescription;
     node.childNodes[0].value=JSON.stringify(data).replaceAll('<','\\u003c');
    }
   });
  }
  if(locale.code!=='en')walk(doc,n=>{if(n.tagName==='footer'){const note=parseFragment('<p class="translation-note" style="max-width:1100px;margin:16px auto;padding:0 24px;font-size:0.8rem">Translation</p>').childNodes[0];note.childNodes[0].value=locale.translationNotice;note.parentNode=n;n.childNodes.push(note);}});
  walk(doc,n=>{if(n.tagName==='head')head=n;if(n.tagName==='a'&&attr(n,'data-language')===locale.code)attr(n,'aria-current','page');});
  syncFaqSchema(doc,domain+locale.prefix+path,locale.code);
  const alternates=parseFragment(config.languages.map(l=>`<link rel="alternate" hreflang="${l.code}" href="${domain}${l.prefix}${path}">`).join('')+`<link rel="alternate" hreflang="x-default" href="${domain}${path}">`);
  if(indexablePaths.has(path))for(const n of alternates.childNodes){n.parentNode=head;head.childNodes.push(n);}
  const dir='dist'+locale.prefix+path;await mkdir(dir,{recursive:true});await writeFile(dir+'index.html',serialize(doc));
 }
}
const englishOnlyUpdates=new Set(['/calculators/','/full-wave-rectifier-calculator/','/half-wave-rectifier-calculator/']);
const extra=config.languages.filter(l=>l.code!=='en').map(l=>[...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m=>{
 const path=new URL(/<loc>([^<]+)<\/loc>/.exec(m[1])[1]).pathname;
 let entry=m[1].replace(/<loc>([^<]+)<\/loc>/,'<loc>'+domain+l.prefix+path+'</loc>');
 // Those localized bodies did not receive the English editorial expansion.
 if(englishOnlyUpdates.has(path))entry=entry.replace(/<lastmod>[^<]+<\/lastmod>/,'<lastmod>'+architectureUpdated+'</lastmod>');
 return '<url>'+entry+'</url>';
}).join('')).join('');
await writeFile('dist/sitemap.xml',xml.replace('</urlset>',extra+'</urlset>'));
const runtimeKeys=new Set(['enter a valid number from','enter a value from','to','Check the inputs.']);
for(const file of ['src/calculators/converter.ts','src/scripts/converter-client.ts','src/lib/result-presentation.ts']){const source=ts.createSourceFile(file,await readFile(file,'utf8'),ts.ScriptTarget.Latest,true);const visit=n=>{if(ts.isStringLiteral(n))runtimeKeys.add(n.text);ts.forEachChild(n,visit);};visit(source);}
const contactScript=(await readFile('src/components/ContactForm.astro','utf8')).match(/<script>([\s\S]*?)<\/script>/)?.[1]??'';
const contactAst=ts.createSourceFile('contact.ts',contactScript,ts.ScriptTarget.Latest,true);const addContact=n=>{if(ts.isStringLiteral(n))runtimeKeys.add(n.text);ts.forEachChild(n,addContact);};addContact(contactAst);
const contactWorker=await readFile('worker/contact.ts','utf8');const workerAst=ts.createSourceFile('worker.ts',contactWorker,ts.ScriptTarget.Latest,true);const start=contactWorker.indexOf('export async function contactRoute'),end=contactWorker.indexOf('export async function adminContactRoute');const addError=n=>{if(ts.isStringLiteral(n)&&n.getStart(workerAst)>start&&n.getStart(workerAst)<end&&((ts.isPropertyAssignment(n.parent)&&n.parent.name.getText(workerAst)==='error')||(ts.isNewExpression(n.parent)&&n.parent.expression.getText(workerAst)==='Error')))runtimeKeys.add(n.text);ts.forEachChild(n,addError);};addError(workerAst);
await mkdir('dist/translations',{recursive:true});for(const [code,dict]of dictionaries)await writeFile('dist/translations/'+code+'.json',JSON.stringify(Object.fromEntries(Object.entries(dict).filter(([key])=>runtimeKeys.has(key)))));
console.log('Built '+paths.size*config.languages.length+' public pages in '+config.languages.length+' languages; '+indexablePaths.size*config.languages.length+' indexable.');
