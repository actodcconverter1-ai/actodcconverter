import test from 'node:test';
import assert from 'node:assert/strict';
import { GitHubRepository } from '../server/github.ts';
const repo=()=>new GitHubRepository('dedicated-owner','ac-dc-site','main','test-only-token');
const response=(value:unknown,status=200)=>Response.json(value,{status});
async function mocked(handler:typeof fetch,action:()=>Promise<void>){const original=globalThis.fetch;globalThis.fetch=handler;try{await action();}finally{globalThis.fetch=original;}}

test('GitHub masked 404 explains token access as well as branch configuration',async()=>{
  await mocked(async()=>response({},404),async()=>{await assert.rejects(()=>repo().list('src/content/blog/'),error=>error instanceof Error&&error.message.includes("token's selected repository, Contents permission")&&error.message.includes('dedicated-owner/ac-dc-site'));});
});
test('repository images larger than 1 MB use the Git Blobs fallback',async()=>{
  const calls:string[]=[];
  await mocked(async input=>{const url=String(input);calls.push(url);return url.includes('/contents/')?response({type:'file',encoding:'none',content:'',sha:'image-sha'}):response({encoding:'base64',content:'aW1hZ2U=\n'});},async()=>{assert.deepEqual(await repo().read('public/images/uploads/large.webp'),{content:'aW1hZ2U=',sha:'image-sha'});});
  assert.equal(calls.length,2);assert.match(calls[1],/\/git\/blobs\/image-sha$/);
});
test('repository conflicts prevent blob creation and branch updates',async()=>{
  const methods:string[]=[];
  await mocked(async(input,init)=>{const url=String(input);methods.push(init?.method??'GET');if(url.includes('/git/ref/'))return response({object:{sha:'head'}});if(url.endsWith('/git/commits/head'))return response({tree:{sha:'tree'}});return response({type:'file',encoding:'base64',content:'bmV3',sha:'new-sha'});},async()=>{await assert.rejects(()=>repo().commit([{path:'src/content/blog/guide.md',content:'b2xk',expectedSha:'old-sha'}],'save'),error=>error instanceof Error&&error.message.includes('Reload'));});
  assert.ok(methods.every(method=>method==='GET'));
});
test('multi-file repository transaction creates one non-force branch advance',async()=>{
  const writes:{url:string;body:Record<string,unknown>}[]=[];
  await mocked(async(input,init)=>{const url=String(input);const method=init?.method??'GET';if(method==='GET'){if(url.includes('/git/ref/'))return response({object:{sha:'parent'}});if(url.endsWith('/git/commits/parent'))return response({tree:{sha:'base-tree'}});return response({},404);}const body=JSON.parse(String(init?.body)) as Record<string,unknown>;writes.push({url,body});if(url.endsWith('/git/blobs'))return response({sha:'blob-'+writes.length});if(url.endsWith('/git/trees'))return response({sha:'new-tree'});if(url.endsWith('/git/commits'))return response({sha:'new-commit'});return response({object:{sha:'new-commit'}});},async()=>{assert.equal(await repo().commit([{path:'first.md',content:'YQ==',expectedSha:null},{path:'second.md',content:'Yg==',expectedSha:null}],'Save two files'),'new-commit');});
  const tree=writes.find(item=>item.url.endsWith('/git/trees'))!;assert.equal((tree.body.tree as unknown[]).length,2);
  const commit=writes.find(item=>item.url.endsWith('/git/commits'))!;assert.deepEqual(commit.body.parents,['parent']);
  const advances=writes.filter(item=>item.url.includes('/git/refs/'));assert.equal(advances.length,1);assert.equal(advances[0].body.force,false);
});
