import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {parse,parseFragment,serialize} from 'parse5';
import {localize,walk,attr,norm} from './localization-core.mjs';
import ts from 'typescript';
const config=JSON.parse(await readFile('src/config/languages.json','utf8'));
const settings=JSON.parse(await readFile('src/config/editorial.json','utf8'));
const domain=new URL(settings.domain).origin;
const xml=await readFile('dist/sitemap.xml','utf8');
const paths=new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname));
const seoTitles=JSON.parse(await readFile('src/i18n/seo-titles.json','utf8'));
const seoDescriptions=JSON.parse(await readFile('src/i18n/seo-descriptions.json','utf8'));
const pageHeadings=JSON.parse(await readFile('src/i18n/page-headings.json','utf8'));
const headingText=value=>typeof value==='string'?norm(value):value&&typeof value.lead==='string'&&typeof value.detail==='string'?norm(value.lead+' '+value.detail):'';
const localizedPaths=new Set(config.languages.flatMap(locale=>[...paths].map(path=>locale.prefix+path)));
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
 for(const locale of config.languages){
  const translated=locale.code==='en'?source:localize(source,locale,dictionaries.get(locale.code),domain,paths);
  const doc=parse(translated);let head;
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
  const visibleFaqs=[];const nodeText=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(nodeText).join('');
  walk(doc,n=>{if(n.tagName==='head')head=n;if(n.tagName==='a'&&attr(n,'data-language')===locale.code)attr(n,'aria-current','page');if(n.tagName==='details'&&attr(n,'class')==='hub-faq'){const q=n.childNodes.find(c=>c.tagName==='summary');const a=n.childNodes.find(c=>c.tagName==='p');if(q&&a)visibleFaqs.push({'@type':'Question',name:nodeText(q),acceptedAnswer:{'@type':'Answer',text:nodeText(a)}});}});
  if(visibleFaqs.length)walk(doc,n=>{if(n.tagName==='script'&&attr(n,'type')==='application/ld+json'){const data=JSON.parse(n.childNodes[0].value);const faq=data['@graph'].find(item=>item['@type']==='FAQPage');if(faq)faq.mainEntity=visibleFaqs;n.childNodes[0].value=JSON.stringify(data).replaceAll('<','\\u003c');}});
  const alternates=parseFragment(config.languages.map(l=>`<link rel="alternate" hreflang="${l.code}" href="${domain}${l.prefix}${path}">`).join('')+`<link rel="alternate" hreflang="x-default" href="${domain}${path}">`);
  for(const n of alternates.childNodes){n.parentNode=head;head.childNodes.push(n);}
  const dir='dist'+locale.prefix+path;await mkdir(dir,{recursive:true});await writeFile(dir+'index.html',serialize(doc));
 }
}
const extra=config.languages.filter(l=>l.code!=='en').map(l=>[...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m=>'<url>'+m[1].replace(/<loc>([^<]+)<\/loc>/,(_,u)=>'<loc>'+domain+l.prefix+new URL(u).pathname+'</loc>')+'</url>').join('')).join('');
await writeFile('dist/sitemap.xml',xml.replace('</urlset>',extra+'</urlset>'));
const runtimeKeys=new Set(['enter a valid number from','enter a value from','to','Check the inputs.']);
for(const file of ['src/calculators/converter.ts','src/scripts/converter-client.ts']){const source=ts.createSourceFile(file,await readFile(file,'utf8'),ts.ScriptTarget.Latest,true);const visit=n=>{if(ts.isStringLiteral(n))runtimeKeys.add(n.text);ts.forEachChild(n,visit);};visit(source);}
const contactScript=(await readFile('src/components/ContactForm.astro','utf8')).match(/<script>([\s\S]*?)<\/script>/)?.[1]??'';
const contactAst=ts.createSourceFile('contact.ts',contactScript,ts.ScriptTarget.Latest,true);const addContact=n=>{if(ts.isStringLiteral(n))runtimeKeys.add(n.text);ts.forEachChild(n,addContact);};addContact(contactAst);
const contactWorker=await readFile('worker/contact.ts','utf8');const workerAst=ts.createSourceFile('worker.ts',contactWorker,ts.ScriptTarget.Latest,true);const start=contactWorker.indexOf('export async function contactRoute'),end=contactWorker.indexOf('export async function adminContactRoute');const addError=n=>{if(ts.isStringLiteral(n)&&n.getStart(workerAst)>start&&n.getStart(workerAst)<end&&((ts.isPropertyAssignment(n.parent)&&n.parent.name.getText(workerAst)==='error')||(ts.isNewExpression(n.parent)&&n.parent.expression.getText(workerAst)==='Error')))runtimeKeys.add(n.text);ts.forEachChild(n,addError);};addError(workerAst);
await mkdir('dist/translations',{recursive:true});for(const [code,dict]of dictionaries)await writeFile('dist/translations/'+code+'.json',JSON.stringify(Object.fromEntries(Object.entries(dict).filter(([key])=>runtimeKeys.has(key)))));
console.log('Built '+paths.size*config.languages.length+' indexable pages in '+config.languages.length+' languages.');
