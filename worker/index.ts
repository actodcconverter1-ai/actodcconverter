import { adminApi } from '../server/admin.ts';
import { GitHubRepository } from '../server/github.ts';
import { authenticationRoute, authConfigured, sessionEmail, privateHeaders, type PasswordEnv } from './auth.ts';
export interface Env extends PasswordEnv { ASSETS:{fetch(request:Request):Promise<Response>}; GITHUB_OWNER?:string; GITHUB_REPO?:string; GITHUB_BRANCH?:string; GITHUB_TOKEN?:string; }
export default {
  async fetch(request:Request,env:Env):Promise<Response>{
    const url=new URL(request.url);
    const admin=url.pathname==='/admin'||url.pathname.startsWith('/admin/')||url.pathname.startsWith('/api/admin/');
    if(!admin)return env.ASSETS.fetch(request);
    const authResponse=await authenticationRoute(request,env);if(authResponse)return authResponse;
    const loginPage=['/admin/login','/admin/login/','/admin/login/index.html'].includes(url.pathname);
    const setupPage=['/admin/password-setup','/admin/password-setup/','/admin/password-setup/index.html'].includes(url.pathname);
    if(loginPage||setupPage){const result=await env.ASSETS.fetch(request);return new Response(result.body,{status:result.status,headers:{...Object.fromEntries(result.headers),...privateHeaders}});}
    const email=await sessionEmail(request,env);
    if(!email){
      if(url.pathname.startsWith('/api/admin/'))return Response.json({error:authConfigured(env)?'Please sign in to the dashboard.':'The owner must finish password setup.'},{status:authConfigured(env)?401:503,headers:privateHeaders});
      return new Response(null,{status:302,headers:{...privateHeaders,Location:new URL('/admin/login/',url.origin).href}});
    }
    if(url.pathname.startsWith('/api/admin/')){
      if(!env.GITHUB_TOKEN?.trim())return Response.json({error:'Repository access is not configured. Add the GITHUB_TOKEN runtime secret in this Worker’s Settings → Variables and Secrets, deploy, then retry.'},{status:503,headers:privateHeaders});
      try{return await adminApi(request,new GitHubRepository(env.GITHUB_OWNER??'',env.GITHUB_REPO??'',env.GITHUB_BRANCH??'main',env.GITHUB_TOKEN??''),'github');}
      catch{return Response.json({error:'GitHub editing is not configured.'},{status:503,headers:privateHeaders});}
    }
    const result=await env.ASSETS.fetch(request);return new Response(result.body,{status:result.status,headers:{...Object.fromEntries(result.headers),...privateHeaders}});
  },
};
