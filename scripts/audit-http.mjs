import{execFileSync}from'node:child_process';
import{mkdir,writeFile}from'node:fs/promises';
const curl=process.platform==='win32'?'curl.exe':'curl';
const origin='https://actodcconverter.org';
const rows=[];
for(const host of ['http://actodcconverter.org','http://www.actodcconverter.org','https://www.actodcconverter.org']){
 for(const path of ['/','/blog/full-wave-bridge-rectifier-explained/','/ac-to-dc-calculator?audit=canonical&x=1&x=2']){
  const url=host+path;const raw=execFileSync(curl,['-sS','-I','-L','--max-redirs','3','--max-time','30',url],{encoding:'utf8'});
  const responses=raw.split(/(?=HTTP\/\S+ \d{3})/).filter(s=>/^HTTP\//.test(s));
  const status=responses.map(s=>Number(/^HTTP\/\S+ (\d+)/.exec(s)[1]));
  const location=/^location:\s*(.+)$/im.exec(responses[0])?.[1].trim();
  const target=origin+(path.startsWith('/ac-to-dc-calculator?')?path.replace('calculator?','calculator/?'):path);
  const ok=status.length===2&&status[0]===301&&status[1]===200&&location===target;
  rows.push({url,status,location,ok});if(!ok)process.exitCode=1;
 }
}
const missing=await fetch(origin+'/seo-audit-intentionally-missing-20261119/',{redirect:'manual'});
const search=await fetch(origin+'/search/');const searchHtml=await search.text();
const https=await fetch(origin+'/',{headers:{Cookie:'site_language=en'}});
const checks={missing404:missing.status===404,searchNoindex:/<meta[^>]*name="robots"[^>]*content="noindex, follow"/.test(searchHtml),hsts:https.headers.get('strict-transport-security')==='max-age=31536000'};
if(Object.values(checks).some(ok=>!ok))process.exitCode=1;
await mkdir('artifacts',{recursive:true});const report={checkedAt:new Date().toISOString(),rows,checks};
await writeFile('artifacts/http-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
