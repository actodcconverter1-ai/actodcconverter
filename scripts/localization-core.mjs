import {parse,serialize} from 'parse5';
export const norm=s=>s.replace(/\s+/g,' ').trim();
export const translatable=s=>/[A-Za-z]{2}/.test(s)&&!/^https?:|^[\d\s.,%µΩVAWHzkF+−√π=()/*^]+$/.test(s)&&!/^(?:[A-Za-zθΔη][A-Za-z0-9θΔη_]*\s*=)/.test(s)&&!/^AC to DC Converter\.?$/.test(s);
const skipped=new Set(['script','style','code','pre']);
export function inspect(html,visit){
 const doc=parse(html);
 function walk(node,skip=false){
  skip=skip||skipped.has(node.tagName)||node.attrs?.some(a=>a.name==='translate'&&a.value==='no');
  if(!skip&&node.nodeName==='#text'&&translatable(norm(node.value)))visit(node,'value',norm(node.value));
  if(!skip&&node.attrs)for(const a of node.attrs){if(['alt','aria-label','placeholder','title'].includes(a.name)&&translatable(a.value))visit(a,'value',norm(a.value));if(node.tagName==='meta'&&['description','og:title','og:description','twitter:title','twitter:description','og:image:alt','twitter:image:alt'].includes(node.attrs.find(x=>x.name==='name'||x.name==='property')?.value)&&a.name==='content')visit(a,'value',norm(a.value));}
  for(const child of node.childNodes??[])walk(child,skip);
 }
 walk(doc);return doc;
}
export function collect(html){const strings=new Set();inspect(html,(_n,_k,s)=>strings.add(s));const doc=parse(html);walk(doc,node=>{if(node.tagName==='script'&&attr(node,'type')==='application/ld+json')jsonStrings(JSON.parse(node.childNodes[0].value),s=>strings.add(s));});return strings;}
export function walk(node,fn){fn(node);for(const c of node.childNodes??[])walk(c,fn);}
export function attr(node,key,value){node.attrs??=[];const a=node.attrs.find(a=>a.name===key);if(value===undefined)return a?.value;if(a)a.value=value;else node.attrs.push({name:key,value});}
function jsonStrings(value,visit,key=''){if(typeof value==='string'&&['name','headline','description','text','featureList'].includes(key)&&translatable(value))return visit(norm(value));if(Array.isArray(value))return value.forEach(x=>jsonStrings(x,visit,key));if(value&&typeof value==='object')for(const [k,v] of Object.entries(value))jsonStrings(v,visit,k);}
export function localize(html,locale,dictionary,domain,paths){
 const translate=s=>{const key=norm(s);if(!translatable(key))return s;const value=dictionary[key];if(!value)throw Error('Missing '+locale.code+' translation: '+key.slice(0,100));return s.replace(key,()=>value);};
 const doc=inspect(html,(node,key,s)=>{node[key]=(node[key].match(/^\s*/)?.[0]??'')+translate(s)+(node[key].match(/\s*$/)?.[0]??'');});
 const url=s=>{if(!s.startsWith('/')&&!s.startsWith(domain))return s;const u=new URL(s,domain);if(u.origin!==domain||!paths.has(u.pathname))return s;return locale.prefix+u.pathname+u.search+u.hash;};
 function schema(value,key=''){if(typeof value==='string'){if(['url','@id','item'].includes(key)){const v=url(value);return v.startsWith('/')?domain+v:v;}if(key==='inLanguage')return locale.code;if(['name','headline','description','text','featureList'].includes(key))return translate(value);return value;}if(Array.isArray(value))return value.map(v=>schema(v,key));if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,schema(v,k)]));return value;}
 walk(doc,node=>{
  if(node.tagName==='html'){attr(node,'lang',locale.code);attr(node,'dir',locale.direction);}
  if(node.tagName==='a'&&!attr(node,'data-language'))attr(node,'href',url(attr(node,'href')??''));
  if(node.tagName==='form'&&attr(node,'action'))attr(node,'action',url(attr(node,'action')));
  if(node.tagName==='link'&&attr(node,'rel')==='canonical')attr(node,'href',domain+url(attr(node,'href')));
  if(node.tagName==='meta'&&attr(node,'property')==='og:url')attr(node,'content',domain+url(attr(node,'content')));
  if(node.tagName==='meta'&&attr(node,'property')==='og:locale')attr(node,'content',locale.ogLocale??locale.code);
  if(node.tagName==='nav'&&attr(node,'class')==='language-switcher')attr(node,'aria-label',locale.languageLabel??'Language');
  if(node.tagName==='script'&&attr(node,'type')==='application/ld+json')node.childNodes[0].value=JSON.stringify(schema(JSON.parse(node.childNodes[0].value))).replaceAll('<','\\u003c');
 });
 return serialize(doc);
}
