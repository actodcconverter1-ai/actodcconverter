import ts from 'typescript';
import {readFile,readdir,writeFile,mkdir} from 'node:fs/promises';
import {collect} from './localization-core.mjs';
const config=JSON.parse(await readFile('src/config/languages.json','utf8'));
const walk=async dir=>(await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?walk(dir+'/'+e.name):dir+'/'+e.name))).flat();
const strings=new Set();
for(const file of await walk('dist'))if(file.endsWith('.html')&&!file.includes('/admin/')&&!file.endsWith('/404.html')&&!/^dist\/(hi|es|ru|fr|de|it|pt|bn|ja|ko|ms|pl|id|ar|bg|tr|sv)\//.test(file))for(const s of collect(await readFile(file,'utf8')))strings.add(s);
for(const file of ['src/calculators/converter.ts','src/scripts/converter-client.ts']){const source=ts.createSourceFile(file,await readFile(file,'utf8'),ts.ScriptTarget.Latest,true);const visit=node=>{if(ts.isStringLiteral(node)&&/[A-Za-z]+\s+[A-Za-z]/.test(node.text)&&!node.text.includes(' = '))strings.add(node.text);ts.forEachChild(node,visit);};visit(source);}
const contact=(await readFile('src/components/ContactForm.astro','utf8')).match(/<script>([\s\S]*?)<\/script>/)?.[1]??'';const contactAst=ts.createSourceFile('contact.ts',contact,ts.ScriptTarget.Latest,true);const addContact=n=>{if(ts.isStringLiteral(n)&&/[A-Za-z]+\s+[A-Za-z]/.test(n.text))strings.add(n.text);ts.forEachChild(n,addContact);};addContact(contactAst);
const contactWorker=await readFile('worker/contact.ts','utf8');const workerAst=ts.createSourceFile('contact.ts',contactWorker,ts.ScriptTarget.Latest,true);const start=contactWorker.indexOf('export async function contactRoute'),end=contactWorker.indexOf('export async function adminContactRoute');const addError=n=>{if(ts.isStringLiteral(n)&&n.getStart(workerAst)>start&&n.getStart(workerAst)<end&&((ts.isPropertyAssignment(n.parent)&&n.parent.name.getText(workerAst)==='error')||(ts.isNewExpression(n.parent)&&n.parent.expression.getText(workerAst)==='Error')))strings.add(n.text);ts.forEachChild(n,addError);};addError(workerAst);
for(const s of ['enter a valid number from','enter a value from','to','Check the inputs.','Sending…'])strings.add(s);
const privacyCopy=JSON.parse(await readFile('src/config/localization-copy.json','utf8'));for(const value of Object.values(privacyCopy).flat())strings.add(value);
await mkdir('src/i18n',{recursive:true});
await writeFile('src/i18n/en.json',JSON.stringify(Object.fromEntries([...strings].sort().map(s=>[s,s])),null,2)+'\n');
console.log('Source strings: '+strings.size);
if(process.argv.includes('--extract-only'))process.exit(0);
async function translate(text,language,raw=true){
 const numbers=[];const protectedText=text.replace(/\d+(?:[.,]\d+)*/g,n=>{numbers.push(n);return 'ZXQNUM'+(numbers.length-1).toString(26).replace(/[0-9a-p]/g,c=>String.fromCharCode(65+parseInt(c,26)))+'QXZ';});
 const u=new URL('https://translate.googleapis.com/translate_a/single');for(const [k,v]of Object.entries({client:'gtx',sl:'en',tl:language,dt:'t',q:raw?text:protectedText}))u.searchParams.set(k,v);
 const r=await fetch(u,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('Translation HTTP '+r.status+'; Retry-After: '+r.headers.get('Retry-After'));
 const data=await r.json();let result=data[0].map(s=>s[0]??'').join('');
 if(raw){const clean=s=>s.replace(/[\u0660-\u0669\u06f0-\u06f9\u0966-\u096f\u09e6-\u09ef]/g,c=>String(c.charCodeAt(0)-(c.charCodeAt(0)>=0x9e6?0x9e6:c.charCodeAt(0)>=0x966?0x966:c.charCodeAt(0)>=0x6f0?0x6f0:0x660))).replace(/(?<=\d)[ \u00a0\u202f]+(?=\d)/g,'').replaceAll('٫','.').replaceAll('٬',',');const original=clean(text).match(/\d+(?:[.,]\d+)*/g)??[];const actual=clean(result).match(/\d+(?:[.,]\d+)*/g)??[];const required=original.map(n=>n.replace(/[.,]/g,''));const remaining=actual.map(n=>n.replace(/[.,]/g,''));const words=['zero','one','two','three','four','five','six','seven','eight','nine','ten'];const ordinals=['zeroth','first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth'];for(const number of required){const i=remaining.indexOf(number);if(i<0)throw Error('Numeric value missing: '+JSON.stringify({text,result,original,actual}));remaining.splice(i,1);}for(const extra of remaining)if(![words[Number(extra)],ordinals[Number(extra)]].filter(Boolean).some(w=>new RegExp('\\b'+w+'\\b','i').test(text)))throw Error('Unexpected numeric value: '+JSON.stringify({text,result,original,actual}));return result;}
 if(numbers.some((_,i)=>!result.includes('ZXQNUM'+i.toString(26).replace(/[0-9a-p]/g,c=>String.fromCharCode(65+parseInt(c,26)))+'QXZ')))return translate(text,language,true);
 numbers.forEach((n,i)=>{const token='ZXQNUM'+i.toString(26).replace(/[0-9a-p]/g,c=>String.fromCharCode(65+parseInt(c,26)))+'QXZ';if(!result.includes(token))throw Error('Numeric placeholder changed');result=result.replaceAll(token,n);});
 return result;
}
const selected=process.argv.slice(2);const locales=config.languages.filter(l=>l.code!=='en'&&(!selected.length||selected.includes(l.code)));
let next=0;const needsReview=[];
async function job(){while(next<locales.length){const locale=locales[next++];let dict={};try{dict=JSON.parse(await readFile('src/i18n/'+locale.code+'.json','utf8'));}catch{/* First batch. */}
 const pending=[...strings].sort().filter(s=>!dict[s]);console.log(locale.code+': '+pending.length+' pending');
 for(let i=0;i<pending.length;){
  const batch=[];let size=0;while(i<pending.length&&batch.length<20&&size+pending[i].length<3500){batch.push(pending[i++]);size+=batch.at(-1).length+1;}if(!batch.length)batch.push(pending[i++]);
  let translated;for(let retry=0;retry<3;retry++){try{translated=await translate(batch.join('\n'),locale.code);break;}catch(e){if(/HTTP (429|403)/.test(e.message))throw e;if(retry===2){translated=null;break;}await new Promise(r=>setTimeout(r,2000));}}
  const lines=translated?.split('\n');
  if(lines?.length===batch.length&&lines.every(s=>s.trim()))batch.forEach((s,j)=>{dict[s]=lines[j];});
  else for(const s of batch){try{dict[s]=await translate(s,locale.code);}catch(error){if(/HTTP (429|403)/.test(error.message))throw error;needsReview.push({language:locale.code,source:s,error:error.message});await writeFile('artifacts/translation-review-'+(selected.join('-')||'all')+'.json',JSON.stringify(needsReview,null,2));console.log(locale.code+' review needed: '+s.slice(0,60));}}
  await writeFile('src/i18n/'+locale.code+'.json',JSON.stringify(dict,null,2)+'\n');console.log(locale.code+' '+i+'/'+pending.length);
  await new Promise(r=>setTimeout(r,1200));
 }

 await writeFile('src/i18n/'+locale.code+'.json',JSON.stringify(dict,null,2)+'\n');console.log(locale.code+' complete');
}}
await job();
