import type { APIRoute } from 'astro';
import { execFileSync } from 'node:child_process';
let commit='unknown';
try{commit=execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,'rev-parse','HEAD'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();}catch{/* No source revision available in a source-only export. */}
export const GET:APIRoute=()=>Response.json({commit,builtAt:new Date().toISOString()},{headers:{'Cache-Control':'no-store'}});
