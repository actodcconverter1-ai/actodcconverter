import {SignJWT,jwtVerify,base64url} from 'jose';
interface ContactStatement {bind(...values:(string|number|null)[]):ContactStatement;first<T>():Promise<T|null>;all<T>():Promise<{results:T[]}>;run():Promise<{meta:{changes?:number}}>;}
export interface ContactEnv {CONTACT_DB?:{prepare(sql:string):ContactStatement};CONTACT_DATA_KEY?:string;CONTACT_RATE_LIMITER?:{limit(options:{key:string}):Promise<{success:boolean}>};}
const encoder=new TextEncoder();const headers={'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff'};
const json=(data:unknown,status=200)=>Response.json(data,{status,headers});
const ready=(env:ContactEnv)=>!!env.CONTACT_DB&&!!env.CONTACT_DATA_KEY&&env.CONTACT_DATA_KEY.length>=32&&!!env.CONTACT_RATE_LIMITER;
const signingKey=(env:ContactEnv)=>encoder.encode('acdc-contact-challenge:'+env.CONTACT_DATA_KEY!);
async function encryptionKey(env:ContactEnv){const bytes=await crypto.subtle.digest('SHA-256',encoder.encode('acdc-contact-storage:'+env.CONTACT_DATA_KEY!));return crypto.subtle.importKey('raw',bytes,'AES-GCM',false,['encrypt','decrypt']);}
export async function encryptContact(data:unknown,id:string,env:ContactEnv){const iv=crypto.getRandomValues(new Uint8Array(12));const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:encoder.encode(id)},await encryptionKey(env),encoder.encode(JSON.stringify(data)));return 'v1.'+base64url.encode(iv)+'.'+base64url.encode(new Uint8Array(encrypted));}
export async function decryptContact(ciphertext:string,id:string,env:ContactEnv){const[version,iv,body]=ciphertext.split('.');if(version!=='v1'||!iv||!body)throw new Error('Invalid encrypted record.');const bytes=await crypto.subtle.decrypt({name:'AES-GCM',iv:base64url.decode(iv) as Uint8Array<ArrayBuffer>,additionalData:encoder.encode(id)},await encryptionKey(env),base64url.decode(body) as Uint8Array<ArrayBuffer>);return JSON.parse(new TextDecoder().decode(bytes));}
async function payload(request:Request,max=24000){if(!request.headers.get('Content-Type')?.startsWith('application/json'))throw new Error('Send the form as JSON.');const reader=request.body?.getReader();let text='',size=0;const decoder=new TextDecoder();if(reader)while(true){const{value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>max){await reader.cancel();throw new Error('The message is too large.');}text+=decoder.decode(value,{stream:true});}text+=decoder.decode();let data;try{data=JSON.parse(text);}catch{throw new Error('Check the form and try again.');}if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('Check the form and try again.');return data;}
const validText=(value:unknown,min:number,max:number,label:string)=>{if(typeof value!=='string'||value.trim().length<min||value.length>max||[...value].some(char=>{const code=char.charCodeAt(0);return code<32&&![9,10,13].includes(code);}))throw new Error(`${label}: use ${min}–${max} characters.`);return value.trim();};
export async function purgeContact(env:ContactEnv,now=Date.now()){if(env.CONTACT_DB)await env.CONTACT_DB.prepare('DELETE FROM contact_messages WHERE created_at < ?').bind(new Date(now-30*86400000).toISOString()).run();}
export async function contactRoute(request:Request,env:ContactEnv,now=Date.now()):Promise<Response>{
 const url=new URL(request.url);if(!ready(env))return json({error:'Contact delivery is temporarily unavailable. Please try again later.'},503);
 try{
  if(url.pathname==='/api/contact/challenge'&&request.method==='GET'){
   const token=await new SignJWT({purpose:'contact'}).setProtectedHeader({alg:'HS256'}).setIssuer('acdc-contact').setAudience(url.origin).setIssuedAt(Math.floor(now/1000)).setExpirationTime(Math.floor(now/1000)+600).setJti(crypto.randomUUID()).sign(signingKey(env));return json({token,minimumWaitSeconds:3});
  }
  if(url.pathname!=='/api/contact'||request.method!=='POST')return json({error:'Method not allowed.'},405);
  if(request.headers.get('Origin')!==url.origin||request.headers.get('X-Contact-Request')!=='1')return json({error:'Use the contact form on this website.'},403);
  const ip=request.headers.get('CF-Connecting-IP')??'local';const key=base64url.encode(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(url.host+'|'+ip))));
  if(!(await env.CONTACT_RATE_LIMITER!.limit({key:'contact:'+key})).success)return json({error:'Too many messages. Please wait a minute and try again.'},429);
  let data;try{data=await payload(request);}catch(error){return json({error:error instanceof Error?error.message:'Check the form.'},400);}
  if(typeof data.website!=='string'||data.website)return json({error:'The form could not be accepted.'},400);
  if(data.consent!==true)return json({error:'Confirm that you have read the privacy notice.'},400);
  let token;try{token=(await jwtVerify(String(data.token??''),signingKey(env),{algorithms:['HS256'],issuer:'acdc-contact',audience:url.origin,currentDate:new Date(now)})).payload;}catch{return json({error:'This form session expired. Reload the contact form and try again.'},400);}
  if(token.purpose!=='contact'||typeof token.iat!=='number'||now/1000-token.iat<3||now/1000-token.iat>600||typeof token.jti!=='string')return json({error:'Please allow a few seconds before sending, or reload an expired form.'},400);
  let message;try{const name=validText(data.name,2,100,'Name'),email=validText(data.email,3,254,'Email'),subject=validText(data.subject,4,150,'Subject'),body=validText(data.message,20,5000,'Message');if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||/[\r\n]/.test(email))throw new Error('Enter a valid reply email.');message={name,email,subject,message:body};}catch(error){return json({error:error instanceof Error?error.message:'Check the form fields.'},400);}
  await purgeContact(env,now);
  if(await env.CONTACT_DB!.prepare('SELECT id FROM contact_messages WHERE id = ?').bind(token.jti).first())return json({ok:true,id:token.jti,duplicate:true});
  const cipher=await encryptContact(message,token.jti,env);
  const saved=await env.CONTACT_DB!.prepare('INSERT OR IGNORE INTO contact_messages (id,created_at,ciphertext) SELECT ?,?,? WHERE (SELECT COUNT(*) FROM contact_messages) < 1000').bind(token.jti,new Date(now).toISOString(),cipher).run();
  if(saved.meta.changes!==1){if(await env.CONTACT_DB!.prepare('SELECT id FROM contact_messages WHERE id = ?').bind(token.jti).first())return json({ok:true,id:token.jti,duplicate:true});return json({error:'The inbox is temporarily full. Please try again later.'},503);}
  return json({ok:true,id:token.jti},201);
 }catch{return json({error:'The message could not be delivered. Please try again later.'},503);}
}
export async function adminContactRoute(request:Request,env:ContactEnv):Promise<Response>{
 if(!ready(env))return json({error:'The private contact inbox is not configured.'},503);
 const url=new URL(request.url);if(request.headers.get('X-Admin-Request')!=='1')return json({error:'Admin request header required.'},403);
 try{
  if(request.method==='GET'){
   const archived=url.searchParams.get('archived')==='1'?1:0;
   const records=await env.CONTACT_DB!.prepare('SELECT id,created_at,ciphertext,archived FROM contact_messages WHERE archived = ? AND created_at >= ? ORDER BY created_at DESC,id DESC LIMIT 50').bind(archived,new Date(Date.now()-30*86400000).toISOString()).all<{id:string;created_at:string;ciphertext:string;archived:number}>();
   const messages=await Promise.all(records.results.map(async row=>({id:row.id,createdAt:row.created_at,archived:!!row.archived,...await decryptContact(row.ciphertext,row.id,env)})));return json({messages,retentionDays:30,limit:50});
  }
  if(request.method!=='PUT')return json({error:'Method not allowed.'},405);
  if(request.headers.get('Origin')!==url.origin)return json({error:'Cross-origin writes are not allowed.'},403);
  const data=await payload(request,1000);if(typeof data.id!=='string'||!/^[0-9a-f-]{36}$/.test(data.id)||typeof data.archived!=='boolean')return json({error:'Invalid message selection.'},400);
  const result=await env.CONTACT_DB!.prepare('UPDATE contact_messages SET archived = ? WHERE id = ?').bind(data.archived?1:0,data.id).run();return result.meta.changes?json({ok:true}):json({error:'Message not found.'},404);
 }catch{return json({error:'The inbox could not be loaded or updated.'},503);}
}
