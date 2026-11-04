import { createServer } from 'node:http';
import { readFile, writeFile, rename, mkdir, readdir, stat, unlink } from 'node:fs/promises';
import { resolve, join, dirname, extname } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { adminApi, AdminError } from '../server/admin.ts';
const root=resolve('.');const port=Number(process.env.ADMIN_PORT??4322);const origin=`http://127.0.0.1:${port}`;
const safe=path=>{const target=resolve(root,path);if(!target.startsWith(root+'\\')&&!target.startsWith(root+'/'))throw new AdminError('Invalid path.');return target;};
const digest=buffer=>createHash('sha256').update(buffer).digest('hex');
let queue=Promise.resolve();
let buildState={status:'idle',output:'',exitCode:null};
const repo={
  async read(path){try{const buffer=await readFile(safe(path));return {content:buffer.toString('base64'),sha:digest(buffer)};}catch(error){if(error.code==='ENOENT')return null;throw error;}},
  async list(prefix){const walk=async dir=>{let entries;try{entries=await readdir(safe(dir),{withFileTypes:true});}catch(error){if(error.code==='ENOENT')return [];throw error;}return (await Promise.all(entries.map(async entry=>entry.isDirectory()?walk(dir.replace(/\/$/,'')+'/'+entry.name):{path:dir.replace(/\/$/,'')+'/'+entry.name,sha:(await repo.read(dir.replace(/\/$/,'')+'/'+entry.name)).sha,size:(await stat(safe(dir.replace(/\/$/,'')+'/'+entry.name))).size}))).flat();};return walk(prefix);},
  async commit(changes){const operation=queue.then(async()=>{
    const backups=new Map();for(const change of changes){const existing=await repo.read(change.path);if((existing?.sha??null)!==(change.expectedSha??null))throw new AdminError('File changed or already exists. Reload before saving.',409);backups.set(change.path,existing?.content??null);}
    try{for(const change of changes){const target=safe(change.path);if(change.content===null){await unlink(target);}else{await mkdir(dirname(target),{recursive:true});const temp=target+'.'+randomUUID()+'.tmp';await writeFile(temp,Buffer.from(change.content,'base64'));await rename(temp,target);}}}
    catch(error){for(const [path,content]of backups){if(content!==null)await writeFile(safe(path),Buffer.from(content,'base64'));else try{await unlink(safe(path));}catch{/* Newly created path may not exist. */}}throw error;}
    return 'local-'+randomUUID();
  });queue=operation.catch(()=>{});return operation;},
};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.xml':'application/xml','.txt':'text/plain','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.avif':'image/avif'};
const server=createServer(async(req,res)=>{
  try{
    if(req.headers.host!==`127.0.0.1:${port}`){res.writeHead(403);res.end('Host not allowed');return;}
    const url=new URL(req.url,origin);
    if(url.pathname.startsWith('/api/admin/')){
      let body='';for await(const chunk of req){body+=chunk;if(body.length>8_000_000){res.writeHead(413);res.end('Too large');return;}}
      const request=new Request(url,{method:req.method,headers:req.headers,body:['GET','HEAD'].includes(req.method)?undefined:body});
      if(url.pathname==='/api/admin/build'){
        if(request.headers.get('X-Admin-Request')!=='1'||(req.method==='POST'&&request.headers.get('Origin')!==origin)){res.writeHead(403);res.end('Forbidden');return;}
        if(req.method==='POST'&&buildState.status!=='running'){
          buildState={status:'running',output:'Building static website…\n',exitCode:null};
          const child=spawn(process.execPath,[join(root,'node_modules/astro/bin/astro.mjs'),'build'],{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe']});
          const output=chunk=>{buildState.output=(buildState.output+String(chunk)).slice(-20000);};child.stdout.on('data',output);child.stderr.on('data',output);
          child.on('error',error=>{buildState={status:'failed',output:error.message,exitCode:1};});child.on('close',code=>{buildState.status=code===0?'complete':'failed';buildState.exitCode=code;});
        }
        res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(buildState));return;
      }
      const response=await adminApi(request,repo,'local');res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));return;
    }
    let path=decodeURIComponent(url.pathname);if(path.includes('..')){res.writeHead(400);res.end('Invalid path');return;}
    // Serve newly uploaded repository media immediately, before the next static build.
    let target=path.startsWith('/images/')?safe('public'+path):safe('dist'+path);
    let status=200;try{if((await stat(target)).isDirectory())target=join(target,'index.html');await stat(target);}catch{target=safe('dist/404.html');status=404;}
    const content=await readFile(target);res.writeHead(status,{'Content-Type':mime[extname(target)]??'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'"});res.end(content);
  }catch(error){console.error(error.message);res.writeHead(500);res.end('Local server error');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Local editorial dashboard: ${origin}/admin/\nBound to loopback only. Saves change repository files; run npm run build to update public pages.`));
