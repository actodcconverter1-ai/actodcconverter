import {readFile,writeFile} from 'node:fs/promises';
import {parse} from 'parse5';
const sitemap=await readFile('dist/sitemap.xml','utf8');
const paths=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const errors=[];let guides=0;let homes=0;
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const text=n=>['script','style','noscript'].includes(n.tagName)?'':n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join(' ');
const hasType=(node,type)=>[].concat(node?.['@type']??[]).includes(type);
for(const path of paths){const base=path.replace(/^\/(hi|es|ru|fr|de|it|pt|bn|ja|ko|ms|pl|id|ar|bg|tr|sv)(?=\/)/,'');if(base!=='/'&&!/^\/blog\/[^/]+\/$/.test(base))continue;
 const nodes=[];const walk=n=>{nodes.push(n);for(const c of n.childNodes??[])walk(c);};walk(parse(await readFile('dist'+path+'index.html','utf8')));
 const graph=nodes.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json').flatMap(n=>JSON.parse(n.childNodes.map(c=>c.value??'').join(''))['@graph']??[]);
 const canonical=nodes.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical');const url=attr(canonical,'href');
 const article=graph.find(n=>hasType(n,'TechArticle'));const times=nodes.filter(n=>n.tagName==='time').map(n=>attr(n,'datetime'));
 const check=(valid,message)=>{if(!valid)errors.push(path+': '+message);};
 check(nodes.some(n=>n.tagName==='a'&&attr(n,'rel')?.split(' ').includes('author')),'linked author absent');
 const shares=nodes.filter(n=>n.tagName==='a'&&attr(n,'data-share-platform'));check(shares.length===3,'three sharing choices required');
 for(const share of shares){const target=new URL(attr(share,'href'));const key=attr(share,'data-share-platform')==='facebook'?'u':'url';check(target.searchParams.get(key)===url,'sharing destination differs from localized canonical');check(attr(share,'target')==='_blank'&&attr(share,'rel')?.includes('noopener'),'sharing links require safe new tab');}
 if(base==='/'){homes++;check(hasType(article,'TechArticle')&&!hasType(article,'BlogPosting'),'homepage guide must not be classified as a blog post');check(times.includes(article?.dateModified),'visible guide update differs from schema');
  if(path==='/'){const body=nodes.find(n=>n.tagName==='body');const first100=text(body).replace(/\s+/g,' ').trim().split(' ').slice(0,100).join(' ');check(/ac to dc converter/i.test(first100),'primary phrase absent from first 100 visible words');check(nodes.some(n=>n.tagName==='strong'&&text(n).trim().toLowerCase()==='ac to dc converter'),'opening keyword emphasis missing');const images=nodes.filter(n=>n.tagName==='img');check(images.every(n=>attr(n,'alt')?.trim()),'homepage image lacks descriptive alt');check(images.some(n=>attr(n,'src')?.includes('ac-to-dc-converter')&&/ac to dc converter/i.test(attr(n,'alt')??'')),'relevant image name/alt missing');const title=text(nodes.find(n=>n.tagName==='title'));check(title==='AC to DC Converter: Calculator & Guide (2026)','homepage calculator title mismatch');check(text(nodes.find(n=>n.tagName==='h1')).trim()==='AC to DC Converter: Calculator, Circuits and How It Works','homepage H1 mismatch');const brand=nodes.find(n=>n.tagName==='a'&&attr(n,'class')==='brand');check(text(brand).trim()==='AC to DC Converter','exact header brand mismatch');}
 }else{guides++;check(hasType(article,'BlogPosting'),'technical blog missing BlogPosting co-type');check(times.includes(article?.datePublished)&&times.includes(article?.dateModified),'publication/update times differ from article schema');const crumb=graph.find(n=>hasType(n,'BreadcrumbList'));check(crumb?.itemListElement?.length>=3&&crumb.itemListElement.at(-1).item===url,'guide breadcrumb/schema incomplete');check(nodes.some(n=>n.tagName==='nav'&&attr(n,'class')?.split(' ').includes('breadcrumbs')),'visible guide breadcrumb absent');}
}
const report={homepageLocales:homes,articleLocales:guides,errors};await writeFile('artifacts/onpage-audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(errors.length)process.exitCode=1;
