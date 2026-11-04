import { createRemoteJWKSet, jwtVerify } from 'jose';
import { adminApi } from '../server/admin.ts';
import { GitHubRepository } from '../server/github.ts';
interface Env { ASSETS:{fetch(request:Request):Promise<Response>}; ACCESS_TEAM_DOMAIN?:string; ACCESS_AUD?:string; ADMIN_EMAILS?:string; GITHUB_OWNER?:string; GITHUB_REPO?:string; GITHUB_BRANCH?:string; GITHUB_TOKEN?:string; }
const keys=new Map<string,ReturnType<typeof createRemoteJWKSet>>();
export default {
  async fetch(request:Request,env:Env):Promise<Response>{
    const url=new URL(request.url);const admin=url.pathname==='/admin'||url.pathname.startsWith('/admin/')||url.pathname.startsWith('/api/admin/');
    if(!admin)return env.ASSETS.fetch(request);
    if(!env.ACCESS_TEAM_DOMAIN||!env.ACCESS_AUD||!env.ADMIN_EMAILS)return new Response('Admin access is not configured.',{status:503,headers:{'Cache-Control':'no-store'}});
    const team=env.ACCESS_TEAM_DOMAIN.replace(/^https:\/\//,'').replace(/\/$/,'');if(!/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(team))return new Response('Invalid access configuration.',{status:503});
    const issuer='https://'+team;
    try{
      const token=request.headers.get('Cf-Access-Jwt-Assertion');if(!token)throw new Error('Missing token');
      let key=keys.get(issuer);if(!key){key=createRemoteJWKSet(new URL(issuer+'/cdn-cgi/access/certs'));keys.set(issuer,key);}
      const {payload}=await jwtVerify(token,key,{issuer,audience:env.ACCESS_AUD,algorithms:['RS256']});
      if(typeof payload.email!=='string'||!env.ADMIN_EMAILS.split(',').map(email=>email.trim().toLowerCase()).includes(payload.email.toLowerCase()))throw new Error('Unauthorized editor');
    }catch{return new Response('Sign in through the configured Cloudflare Access application.',{status:401,headers:{'Cache-Control':'no-store'}});}
    if(url.pathname.startsWith('/api/admin/')){
      try{return await adminApi(request,new GitHubRepository(env.GITHUB_OWNER??'',env.GITHUB_REPO??'',env.GITHUB_BRANCH??'main',env.GITHUB_TOKEN??''),'github');}
      catch{return Response.json({error:'GitHub editing is not configured.'},{status:503,headers:{'Cache-Control':'no-store'}});}
    }
    const result=await env.ASSETS.fetch(request);const headers=new Headers(result.headers);headers.set('Cache-Control','private, no-store');headers.set('X-Robots-Tag','noindex, nofollow');return new Response(result.body,{status:result.status,headers});
  },
};
