import { AdminError, type Repository, type Change } from './admin.ts';
export class GitHubRepository implements Repository {
  private owner:string; private repo:string; private branch:string; private token:string;
  constructor(owner:string,repo:string,branch:string,token:string) {
    this.owner=owner;this.repo=repo;this.branch=branch;this.token=token.trim();
    if(!/^[a-zA-Z0-9_.-]+$/.test(owner)||!/^[a-zA-Z0-9_.-]+$/.test(repo)||!branch||!token)throw new AdminError('GitHub repository is not configured.',503);
  }
  private async api(path:string,method='GET',body?:unknown) {
    const response=await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}${path}`,{method,headers:{Authorization:`Bearer ${this.token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'ACDC-Editorial','Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(20000)});
    if(response.status===401||response.status===403)throw new AdminError('GitHub access was refused. Check that the runtime token is active and has Contents read/write permission for this repository.',502);
    if(response.status===404)return null;
    if(!response.ok)throw new AdminError(response.status===409||response.status===422?'Repository changed. Reload before saving.':'GitHub request failed. Check repository access and limits.',response.status===409||response.status===422?409:502);
    return response.json();
  }
  async list(prefix:string) {
    const result=await this.api(`/git/trees/${encodeURIComponent(this.branch)}?recursive=1`);if(!result)throw new AdminError(`Cannot read ${this.owner}/${this.repo} on branch ${this.branch}. Verify the token's selected repository, Contents permission, and branch name.`,503);if(result.truncated)throw new AdminError('Repository tree is too large for this dashboard.',503);
    return result.tree.filter((file:{type:string;path:string})=>file.type==='blob'&&file.path.startsWith(prefix)).map((file:{path:string;sha:string;size:number})=>({path:file.path,sha:file.sha,size:file.size}));
  }
  async read(path:string) {
    const result=await this.api(`/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(this.branch)}`);
    if(!result)return null;if(result.type!=='file')throw new AdminError('Unsupported repository file.',400);
    // The Contents API omits inline content for files above 1 MB. Media uploads
    // still fit our 5 MB bound, so read their actual bytes through Git Blobs.
    const blob=result.encoding==='base64'?result:await this.api(`/git/blobs/${result.sha}`);
    if(!blob||blob.encoding!=='base64')throw new AdminError('Unsupported repository encoding.',400);
    return {content:blob.content.replace(/\s/g,''),sha:result.sha};
  }
  async commit(changes:Change[],message:string) {
    const ref=await this.api(`/git/ref/heads/${encodeURIComponent(this.branch)}`);if(!ref)throw new AdminError('Repository branch not found.',503);
    const head=await this.api(`/git/commits/${ref.object.sha}`);
    for(const change of changes){const current=await this.read(change.path);if((current?.sha??null)!==(change.expectedSha??null))throw new AdminError('This file changed or already exists. Reload before saving.',409);}
    const entries=await Promise.all(changes.map(async change=>({path:change.path,mode:'100644',type:'blob',sha:change.content===null?null:(await this.api('/git/blobs','POST',{content:change.content,encoding:'base64'})).sha})));
    const tree=await this.api('/git/trees','POST',{base_tree:head.tree.sha,tree:entries});const commit=await this.api('/git/commits','POST',{message,tree:tree.sha,parents:[ref.object.sha]});
    await this.api(`/git/refs/heads/${encodeURIComponent(this.branch)}`,'PATCH',{sha:commit.sha,force:false});return commit.sha;
  }
}
