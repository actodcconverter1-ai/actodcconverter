import { parse, stringify } from 'yaml';
export interface RepoFile { path: string; sha: string; size?: number; }
export interface Change { path: string; content: string | null; expectedSha?: string | null; }
export interface Repository { list(prefix: string): Promise<RepoFile[]>; read(path: string): Promise<{ content: string; sha: string } | null>; commit(changes: Change[], message: string): Promise<string>; }
export interface Ad { id: string; name: string; enabled: boolean; placement: 'header'|'sidebar'|'article-top'|'article-bottom'|'footer'; title: string; text: string; image: string; imageAlt: string; href: string; startDate: string; endDate: string; }
export class AdminError extends Error { status:number; constructor(message:string,status=400){super(message);this.status=status;} }
export const SETTINGS_PATH = 'src/config/editorial.json';
const BLOG_PREFIX = 'src/content/blog/';
const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function wordCount(markdown: string): number { return markdown.replace(/```[\s\S]*?```/g,' ').replace(/!?\[([^\]]*)\]\([^)]*\)/g,'$1').replace(/<[^>]*>/g,' ').match(/[\p{L}\p{N}]+(?:[’'−-][\p{L}\p{N}]+)*/gu)?.length ?? 0; }
export function splitPost(source: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(source);
  if (!match) throw new AdminError('Post must have YAML frontmatter.');
  const data = parse(match[1]) as Record<string, unknown>;
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new AdminError('Invalid post metadata.');
  return { data, body: match[2] };
}
function text(value: unknown, label: string, max = 500, min = 1): string {
  if (typeof value !== 'string' || value.trim().length < min || value.length > max) throw new AdminError(`${label}: use ${min}–${max} characters.`);
  return value.trim();
}
function safeUrl(value: unknown, label: string, local = false, optional = false): string {
  const raw = text(value, label, 2048, optional ? 0 : 1);
  if (!raw && optional) return '';
  if (local && /^\/images\/[a-zA-Z0-9/_ .-]+$/.test(raw) && !raw.includes('..')) return raw;
  let parsed: URL; try { parsed = new URL(raw); } catch { throw new AdminError(`${label}: enter a valid HTTPS URL${local ? ' or /images/ path' : ''}.`); }
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw new AdminError(`${label}: only HTTPS is supported.`);
  return parsed.href;
}
function date(value: unknown, label: string): string {
  const raw = text(value, label, 30);
  const valueDate = new Date(raw);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw) || !Number.isFinite(valueDate.valueOf()) || valueDate.toISOString().slice(0,10) !== raw) throw new AdminError(`${label}: use a valid YYYY-MM-DD date.`);
  return raw;
}
export function validatePost(data: Record<string, unknown>, body: unknown) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new AdminError('Post metadata must be an object.');
  const slug = text(data.slug, 'Slug', 100); if (!validSlug.test(slug)) throw new AdminError('Slug: use lowercase letters, numbers, and hyphens.');
  const status = data.status ?? 'draft'; if (!['draft','published','trash'].includes(String(status))) throw new AdminError('Invalid post status.');
  const published = status === 'published';
  const markdown = text(body, 'Article', 150000, published ? 1 : 0);
  if (/<\/?(?:script|iframe|object|embed|style|form|input|link|meta)\b|\bon\w+\s*=|javascript\s*:|data\s*:\s*text\/html/i.test(markdown)) throw new AdminError('Unsafe HTML or script URLs are not allowed in articles.');
  const categories = data.categories; const tags = data.tags;
  if (!Array.isArray(categories) || !categories.length || categories.length > 10 || !categories.every(item=>typeof item==='string'&&validSlug.test(item))) throw new AdminError('Add 1–10 lowercase category slugs.');
  if (!Array.isArray(tags) || tags.length > 20 || !tags.every(item=>typeof item==='string'&&item.length<=80)) throw new AdminError('Tags: use up to 20 short text values.');
  const image = safeUrl(data.image ?? '', 'Featured image', true, !published);
  if (image && !image.startsWith('/images/')) throw new AdminError('Use a repository media image for the featured image.');
  const result: Record<string, unknown> = { title:text(data.title,'Title',150),slug,description:text(data.description ?? '','Description',300,published?1:0),image,imageAlt:text(data.imageAlt ?? '','Image alt',300,published?1:0),author:text(data.author,'Author',100),pubDate:date(data.pubDate,'Publication date'),categories,tags,seoTitle:text(data.seoTitle ?? '','SEO title',150,published?1:0),metaDescription:text(data.metaDescription ?? '','Meta description',300,published?1:0),status };
  if (data.updatedDate) { result.updatedDate=date(data.updatedDate,'Updated date'); if (String(result.updatedDate)<String(result.pubDate)) throw new AdminError('Updated date cannot precede publication.'); }
  return { data:result,body:markdown+'\n', words:wordCount(markdown) };
}
export function validateSettings(input: Record<string, unknown>) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new AdminError('Settings must be an object.');
  const s: Record<string, unknown> = {};
  for (const key of ['name','wordmark','description','socialImageAlt','seoTitleSuffix']) s[key]=text(input[key],key,key==='description'?300:150);
  const domain=new URL(safeUrl(input.domain,'Domain')); if(domain.pathname!=='/'||domain.search||domain.hash)throw new AdminError('Domain must be an origin without a path.'); s.domain=domain.origin;
  for(const key of ['logo','favicon','socialImage']) { s[key]=safeUrl(input[key],key,true);if(!String(s[key]).startsWith('/images/'))throw new AdminError(`${key}: use repository media.`); }
  for(const key of ['primaryColor','accentColor']) { const color=text(input[key],key,7);if(!/^#[a-f0-9]{6}$/i.test(color))throw new AdminError(`${key}: use #RRGGBB.`);s[key]=color; }
  s.contactEmail=text(input.contactEmail??'','Contact email',254,0); if(s.contactEmail&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s.contactEmail)))throw new AdminError('Invalid contact email.');
  s.issueUrl=safeUrl(input.issueUrl??'','Issue URL',false,true);
  s.twitterHandle=text(input.twitterHandle??'','Social handle',16,0);if(s.twitterHandle&&!/^@[a-zA-Z0-9_]{1,15}$/.test(String(s.twitterHandle)))throw new AdminError('Invalid social handle.');
  if(typeof input.indexable!=='boolean')throw new AdminError('Indexing must be true or false.');s.indexable=input.indexable;
  if(!['index, follow','noindex, follow'].includes(String(input.defaultRobots)))throw new AdminError('Invalid robots setting.');s.defaultRobots=input.defaultRobots;
  if(!Array.isArray(input.ads)||input.ads.length>30)throw new AdminError('Ads must be a list of up to 30 items.');
  const ids=new Set();s.ads=input.ads.map((entry:Record<string,unknown>)=>{
    const id=text(entry.id,'Ad ID',80);if(!validSlug.test(id)||ids.has(id))throw new AdminError('Ad IDs must be unique slugs.');ids.add(id);
    const placement=String(entry.placement);if(!['header','sidebar','article-top','article-bottom','footer'].includes(placement))throw new AdminError('Invalid ad placement.');
    if(typeof entry.enabled!=='boolean')throw new AdminError('Ad enabled must be true or false.');
    const startDate=entry.startDate?date(entry.startDate,'Ad start'):'';const endDate=entry.endDate?date(entry.endDate,'Ad end'):'';
    if(startDate&&endDate&&endDate<startDate)throw new AdminError('Ad end must not precede start.');
    return {id,name:text(entry.name,'Ad name',100),enabled:entry.enabled,placement,title:text(entry.title,'Ad title',150),text:text(entry.text??'','Ad text',300,0),image:safeUrl(entry.image??'','Ad image',true,true),imageAlt:text(entry.imageAlt??'','Ad image alt',300,0),href:safeUrl(entry.href,'Ad destination'),startDate,endDate};
  });return s;
}
function mediaPath(name:string) { if(!/^public\/images\/[a-zA-Z0-9/_. -]+$/.test(name)||name.includes('..')||! /\.(png|jpe?g|webp|avif|svg)$/i.test(name))throw new AdminError('Invalid media path.');return name; }
export function encodeBase64(bytes:Uint8Array):string { let raw='';for(let i=0;i<bytes.length;i+=8192)raw+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(raw); }
export function decodeBase64(raw:string):Uint8Array { try {return Uint8Array.from(atob(raw),c=>c.charCodeAt(0));}catch{throw new AdminError('Invalid base64 data.');} }
const encodeText=(value:string)=>encodeBase64(new TextEncoder().encode(value));
export const decodeText=(value:string)=>new TextDecoder().decode(decodeBase64(value));
export async function adminApi(request:Request,repo:Repository,mode:'local'|'github'):Promise<Response> {
  const response=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
  try {
    if(request.headers.get('X-Admin-Request')!=='1')throw new AdminError('Admin request header required.',403);
    const url=new URL(request.url); const action=url.pathname.slice('/api/admin/'.length);
    if(!['GET','PUT','POST','DELETE'].includes(request.method))throw new AdminError('Method not allowed.',405);
    if(request.method!=='GET'&&request.headers.get('Origin')!==url.origin)throw new AdminError('Cross-origin writes are not allowed.',403);
    if(request.method!=='GET'&&!request.headers.get('Content-Type')?.startsWith('application/json'))throw new AdminError('JSON content type required.',415);
    let raw='';
    if(request.method!=='GET'&&request.body){
      const reader=request.body.getReader();const decoder=new TextDecoder();let size=0;
      while(true){const chunk=await reader.read();if(chunk.done)break;size+=chunk.value.byteLength;if(size>8_000_000){await reader.cancel();throw new AdminError('Request too large.',413);}raw+=decoder.decode(chunk.value,{stream:true});}raw+=decoder.decode();
    }
    let payload:Record<string,unknown>={};if(raw){try{payload=JSON.parse(raw);}catch{throw new AdminError('Invalid JSON.');}}
    if(action==='session'&&request.method==='GET')return response({mode,message:mode==='local'?'Changes save to this local repository. Rebuild to update the public site.':'Changes commit to GitHub. Cloudflare Workers Builds publishes after checks pass.'});
    if(action==='posts'&&request.method==='GET'){
      const files=(await repo.list(BLOG_PREFIX)).filter(file=>file.path.endsWith('.md'));
      const posts=await Promise.all(files.map(async file=>{const saved=await repo.read(file.path);if(!saved)return null;const post=splitPost(decodeText(saved.content));return {...post,path:file.path,sha:saved.sha,words:wordCount(post.body)};}));
      return response({posts:posts.filter(Boolean)});
    }
    if(action==='posts'&&request.method==='PUT'){
      const post=validatePost(payload.data as Record<string,unknown>,payload.body);const path=BLOG_PREFIX+post.data.slug+'.md';
      const oldPath=String(payload.path??path);if(!oldPath.startsWith(BLOG_PREFIX)||!validSlug.test(oldPath.slice(BLOG_PREFIX.length,-3))||!oldPath.endsWith('.md'))throw new AdminError('Invalid post path.');
      const imagePath='public'+post.data.image;if(post.data.image && !(await repo.read(imagePath)))throw new AdminError('Featured image does not exist in media library.');
      const content=encodeText('---\n'+stringify(post.data)+'---\n\n'+post.body);
      const changes:Change[]=[{path,content,expectedSha:oldPath===path?(payload.sha as string|null)??null:null}];
      if(oldPath!==path)changes.push({path:oldPath,content:null,expectedSha:payload.sha as string});
      const revision=await repo.commit(changes,`Save ${post.data.status} post: ${post.data.title}`);return response({revision,post:await repo.read(path),path,words:post.words});
    }
    if(action==='settings'&&request.method==='GET'){const saved=await repo.read(SETTINGS_PATH);if(!saved)throw new AdminError('Settings file missing.',404);return response({settings:JSON.parse(decodeText(saved.content)),sha:saved.sha});}
    if(action==='settings'&&request.method==='PUT'){
      const settings=validateSettings(payload.settings as Record<string,unknown>);
      for(const key of ['logo','favicon','socialImage'])if(!(await repo.read('public'+settings[key])))throw new AdminError(`${key} is missing from media library.`);
      for(const ad of settings.ads as Ad[])if(ad.image&&!(await repo.read('public'+ad.image)))throw new AdminError(`Ad image missing: ${ad.image}`);
      const revision=await repo.commit([{path:SETTINGS_PATH,content:encodeText(JSON.stringify(settings,null,2)+'\n'),expectedSha:payload.sha as string}], 'Update site settings and ad placements');return response({revision,sha:(await repo.read(SETTINGS_PATH))?.sha});
    }
    if(action==='media'&&request.method==='GET')return response({media:(await repo.list('public/images/')).filter(file=>/\.(png|jpe?g|webp|avif|svg)$/i.test(file.path)).map(file=>({...file,url:file.path.slice(6)}))});
    if(action==='media-file'&&request.method==='GET'){
      const path=mediaPath(url.searchParams.get('path')??'');const saved=await repo.read(path);if(!saved)throw new AdminError('Image not found.',404);
      const type=path.endsWith('.svg')?'image/svg+xml':path.endsWith('.webp')?'image/webp':/\.jpe?g$/.test(path)?'image/jpeg':path.endsWith('.avif')?'image/avif':'image/png';
      return new Response(decodeBase64(saved.content).buffer as ArrayBuffer,{headers:{'Content-Type':type,'Cache-Control':'private, no-store','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; sandbox"}});
    }
    if(action==='media'&&request.method==='POST'){
      const name=text(payload.name,'Filename',120).toLowerCase();if(!/^[a-z0-9][a-z0-9._-]*\.(png|jpe?g|webp|avif)$/.test(name))throw new AdminError('Upload PNG, JPG, WebP, or AVIF with a simple descriptive filename.');
      const bytes=decodeBase64(String(payload.content??''));if(!bytes.length||bytes.length>5*1024*1024)throw new AdminError('Images must be 1 byte to 5 MB.');
      const ascii=(start:number,end:number)=>String.fromCharCode(...bytes.slice(start,end));
      const valid=name.endsWith('.png')?bytes[0]===137&&ascii(1,4)==='PNG':/\.jpe?g$/.test(name)?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:name.endsWith('.webp')?ascii(0,4)==='RIFF'&&ascii(8,12)==='WEBP':ascii(4,8)==='ftyp'&&/avif|avis/.test(ascii(8,40));
      if(!valid)throw new AdminError('Image bytes do not match the file extension.');
      const path='public/images/uploads/'+name;const revision=await repo.commit([{path,content:encodeBase64(bytes),expectedSha:null}],`Upload media: ${name}`);return response({revision,url:path.slice(6),path});
    }
    if(action==='media'&&request.method==='DELETE'){
      const path=mediaPath(String(payload.path));const saved=await repo.read(path);if(!saved)throw new AdminError('Media not found.',404);const publicUrl=path.slice(6);
      const paths=[...(await repo.list(BLOG_PREFIX)).filter(file=>file.path.endsWith('.md')).map(file=>file.path),SETTINGS_PATH];
      for(const candidate of paths){const item=await repo.read(candidate);if(item&&decodeText(item.content).includes(publicUrl))throw new AdminError(`Image is referenced by ${candidate}; replace that reference first.`,409);}
      const trashPath='.content-trash/media/'+Date.now()+'-'+path.split('/').pop();
      const revision=await repo.commit([{path:trashPath,content:saved.content,expectedSha:null},{path,content:null,expectedSha:payload.sha as string}],`Trash unused media: ${path}`);return response({revision,trashPath});
    }
    if(action==='trash-media'&&request.method==='GET')return response({media:await repo.list('.content-trash/media/')});
    if(action==='restore-media'&&request.method==='POST'){
      const path=String(payload.path);if(!/^\.content-trash\/media\/\d+-[a-zA-Z0-9._-]+$/.test(path))throw new AdminError('Invalid trash path.');const saved=await repo.read(path);if(!saved)throw new AdminError('Trash item missing.',404);
      const target='public/images/uploads/'+path.split('/').pop()!.replace(/^\d+-/,'');
      const revision=await repo.commit([{path:target,content:saved.content,expectedSha:null},{path,content:null,expectedSha:saved.sha}], 'Restore media from trash');return response({revision,url:target.slice(6)});
    }
    throw new AdminError('Admin endpoint not found.',404);
  }catch(error){return response({error:error instanceof AdminError?error.message:'The operation could not be completed. Check server configuration and retry.'},error instanceof AdminError?error.status:500);}
}
