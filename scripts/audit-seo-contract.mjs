import{readFile,writeFile}from'node:fs/promises';import{parse}from'parse5';
const origin='https://actodcconverter.org';
const paths=[...new Set([...((await readFile('dist/sitemap.xml','utf8')).matchAll(/<loc>([^<]+)<\/loc>/g))].map(m=>{const u=new URL(m[1]);if(u.origin!==origin||u.search||u.hash)throw Error('Noncanonical sitemap URL '+u);return u.pathname;}))];
const errors=[];const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
for(const path of paths){const nodes=[];const walk=n=>{nodes.push(n);for(const c of n.childNodes??[])walk(c);};walk(parse(await readFile('dist'+path+'index.html','utf8')));const check=(ok,m)=>{if(!ok)errors.push(path+': '+m);};
 for(const n of nodes)for(const key of ['src','href','srcset','content']){const value=attr(n,key);if(value&&/http:\/\/actodcconverter\.org|https?:\/\/www\.actodcconverter\.org|http:\/\/[^\s,]+/.test(value)&&!(n.tagName==='a'&&key==='href'))check(false,'insecure/alias asset or metadata: '+value);if(n.tagName==='a'&&value&&/^http:\/\/actodcconverter\.org|^https?:\/\/www\.actodcconverter\.org/.test(value))check(false,'noncanonical internal link');}
 const graphs=nodes.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json').flatMap(n=>JSON.parse(text(n))['@graph']??[]);check(graphs.some(n=>n['@type']==='Organization'),'Organization missing');check(!graphs.some(n=>[].concat(n['@type']??[]).includes('FAQPage')),'FAQPage not permitted');
 const base=path.replace(/^\/(hi|es|ru|fr|de|it|pt|bn|ja|ko|ms|pl|id|ar|bg|tr|sv)(?=\/)/,'');
 if(base!=='/')check(graphs.some(n=>n['@type']==='BreadcrumbList'),'inner breadcrumb missing');
 if(/^\/blog\/[^/]+\/$/.test(base)){const article=graphs.find(n=>[].concat(n['@type']??[]).includes('Article'));check(article?.datePublished&&article?.dateModified,'Article dates missing');}
 if(['/','/ac-to-dc-calculator/','/half-wave-rectifier-calculator/','/full-wave-rectifier-calculator/'].includes(base))check(graphs.some(n=>n['@type']==='WebApplication'&&n.isAccessibleForFree===true),'free browser WebApplication missing');
}
const report={indexablePages:paths.length,errors};await writeFile('artifacts/seo-contract-audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(errors.length)process.exitCode=1;
