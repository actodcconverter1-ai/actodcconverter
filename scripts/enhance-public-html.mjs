import {readdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse,serialize} from 'parse5';
/** Apply the declared external-reference policy before translation/extraction. */
export async function enhancePublicHtml(root,domain){
 root=root instanceof URL?fileURLToPath(root):root;
 const origin=new URL(domain).origin;
 async function visit(dir){for(const entry of await readdir(dir,{withFileTypes:true})){if(entry.name==='admin')continue;const path=join(dir,entry.name);if(entry.isDirectory()){await visit(path);continue;}if(!entry.name.endsWith('.html'))continue;
  const doc=parse(await readFile(path,'utf8'));
  const walk=node=>{if(node.tagName==='a'){const href=node.attrs?.find(a=>a.name==='href')?.value;if(href&&/^https?:\/\//.test(href)&&new URL(href).origin!==origin){for(const [name,value]of [['target','_blank'],['rel','noopener noreferrer']]){const current=node.attrs.find(a=>a.name===name);if(current)current.value=name==='rel'?[...new Set([...current.value.split(/\s+/),...value.split(' ')])].join(' '):value;else node.attrs.push({name,value});}}}for(const child of node.childNodes??[])walk(child);};walk(doc);await writeFile(path,serialize(doc));
 }}await visit(root);
}
