import { SignJWT, jwtVerify, base64url } from 'jose';
export interface PasswordEnv {
  ADMIN_EMAILS?: string;
  ADMIN_PASSWORD_HASH?: string;
  ADMIN_SESSION_SECRET?: string;
  LOGIN_RATE_LIMITER?: { limit(options:{key:string}):Promise<{success:boolean}> };
}
const encoder=new TextEncoder();
const COOKIE='__Host-acdc_admin';
const SESSION_SECONDS=8*60*60;
const ISSUER='acdc-editorial';
export const privateHeaders={'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; connect-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'"};
const json=(value:unknown,status=200,headers:Record<string,string>={})=>Response.json(value,{status,headers:{...privateHeaders,...headers}});
const HASH_FORMAT=/^pbkdf2-sha256:100000:[A-Za-z0-9_-]{22}:[A-Za-z0-9_-]{43}$/;
export function authConfigured(env:PasswordEnv){return !!env.ADMIN_EMAILS&&HASH_FORMAT.test(env.ADMIN_PASSWORD_HASH??'')&&!!env.ADMIN_SESSION_SECRET&&env.ADMIN_SESSION_SECRET.length>=32&&!!env.LOGIN_RATE_LIMITER;}
function allowed(email:string,env:PasswordEnv){return (env.ADMIN_EMAILS??'').split(',').map(value=>value.trim().toLowerCase()).includes(email);}
async function passwordKey(env:PasswordEnv){return crypto.subtle.importKey('raw',encoder.encode(env.ADMIN_SESSION_SECRET!),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}
async function proof(env:PasswordEnv){const key=await passwordKey(env);return crypto.subtle.sign('HMAC',key,encoder.encode('acdc-password-verifier-v1:'+env.ADMIN_PASSWORD_HASH!));}
async function validPassword(password:string,env:PasswordEnv){
  const [,iterations,salt,hash]=env.ADMIN_PASSWORD_HASH!.split(':');
  const passwordMaterial=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);
  const candidate=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:base64url.decode(salt) as Uint8Array<ArrayBuffer>,iterations:Number(iterations)},passwordMaterial,256);
  const key=await passwordKey(env);
  const expectedMac=await crypto.subtle.sign('HMAC',key,base64url.decode(hash) as Uint8Array<ArrayBuffer>);
  return crypto.subtle.verify('HMAC',key,expectedMac,candidate);
}
export async function createSession(email:string,origin:string,env:PasswordEnv,now=Date.now()){
  const seconds=Math.floor(now/1000);
  return new SignJWT({pv:base64url.encode(new Uint8Array(await proof(env)))}).setProtectedHeader({alg:'HS256',typ:'JWT'}).setSubject(email).setIssuer(ISSUER).setAudience(origin).setIssuedAt(seconds).setExpirationTime(seconds+SESSION_SECONDS).setJti(crypto.randomUUID()).sign(encoder.encode(env.ADMIN_SESSION_SECRET!));
}
export async function sessionEmail(request:Request,env:PasswordEnv):Promise<string|null>{
  if(!authConfigured(env))return null;
  const cookie=request.headers.get('Cookie')?.split(';').map(part=>part.trim()).find(part=>part.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);
  if(!cookie||cookie.length>4096)return null;
  try{const {payload}=await jwtVerify(cookie,encoder.encode(env.ADMIN_SESSION_SECRET!),{algorithms:['HS256'],issuer:ISSUER,audience:new URL(request.url).origin,clockTolerance:5});
    if(typeof payload.sub!=='string'||!allowed(payload.sub,env)||typeof payload.iat!=='number'||payload.iat>Date.now()/1000+5||payload.pv!==base64url.encode(new Uint8Array(await proof(env))))return null;
    return payload.sub;
  }catch{return null;}
}
const cookieValue=(token:string,seconds:number)=>`${COOKIE}=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${seconds}`;
export async function authenticationRoute(request:Request,env:PasswordEnv):Promise<Response|null>{
  const url=new URL(request.url);
  if(url.pathname==='/api/admin/auth/status'){
    if(request.method!=='GET')return json({error:'Method not allowed.'},405);
    return json({ready:authConfigured(env),authenticated:!!(await sessionEmail(request,env))});
  }
  if(!['/api/admin/auth/login','/api/admin/auth/logout'].includes(url.pathname))return null;
  if(request.method!=='POST')return json({error:'Method not allowed.'},405);
  if(request.headers.get('Origin')!==url.origin||request.headers.get('X-Admin-Request')!=='1')return json({error:'Cross-origin authentication is not allowed.'},403);
  if(url.pathname.endsWith('/logout'))return json({ok:true},200,{'Set-Cookie':cookieValue('',0)});
  if(!authConfigured(env))return json({error:'The owner must finish the password secret configuration.'},503);
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'JSON required.'},415);
  const ip=request.headers.get('CF-Connecting-IP')??'local';
  const fingerprint=base64url.encode(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(url.host+'|'+ip))));
  const limit=await env.LOGIN_RATE_LIMITER!.limit({key:'editor-login:'+fingerprint});
  if(!limit.success)return json({error:'Too many attempts. Wait a minute and try again.'},429,{'Retry-After':'60'});
  let raw='';const reader=request.body?.getReader();const decoder=new TextDecoder();let size=0;
  if(reader){while(true){const chunk=await reader.read();if(chunk.done)break;size+=chunk.value.byteLength;if(size>2048){await reader.cancel();return json({error:'Request too large.'},413);}raw+=decoder.decode(chunk.value,{stream:true});}raw+=decoder.decode();}
  let data:{email?:unknown;password?:unknown};try{data=JSON.parse(raw);}catch{return json({error:'Enter your email and password.'},400);}
  if(typeof data?.email!=='string'||typeof data?.password!=='string'||data.email.length>254||data.password.length>256)return json({error:'Enter your email and password.'},400);
  const email=data.email.trim().toLowerCase();const correct=await validPassword(data.password,env);
  if(!correct||!allowed(email,env))return json({error:'Email or password is incorrect.'},401);
  const token=await createSession(email,url.origin,env);
  return json({ok:true},200,{'Set-Cookie':cookieValue(token,SESSION_SECONDS)});
}
