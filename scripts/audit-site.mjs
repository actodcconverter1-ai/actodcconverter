import { readdir, readFile, access, stat, mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
const root = resolve('dist');
async function walk(dir) { const entries = await readdir(dir, { withFileTypes: true }); return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(join(dir, entry.name)) : join(dir, entry.name)))).flat(); }
const files = await walk(root); const htmlFiles = files.filter(file => file.endsWith('.html'));
const pages = new Map(); const errors = []; const titles = new Set(); const descriptions = new Set();
for (const file of htmlFiles) pages.set(file, await readFile(file, 'utf8'));
const attr = (tag, name) => new RegExp(`(?:^|\\s)${name}="([^"]*)"`).exec(tag)?.[1];
function fail(file, text) { errors.push(`${file.slice(root.length + 1)}: ${text}`); }
async function targetFile(pathname) { const clean = decodeURIComponent(pathname); if (clean.includes('..')) throw new Error('Traversal path'); const exact = join(root, clean); try { if ((await stat(exact)).isFile()) return exact; } catch { /* Try directory route. */ } return join(exact, 'index.html'); }
for (const [file, html] of pages) {
  if (file.startsWith(join(root, 'admin') + (process.platform === 'win32' ? '\\' : '/'))) {
    if (!html.includes('noindex, nofollow')) fail(file, 'admin must be noindex');
    continue;
  }
  const title = /<title>([^<]+)<\/title>/.exec(html)?.[1];
  const meta = [...html.matchAll(/<meta\b[^>]*>/g)].map(match => match[0]);
  const description = meta.find(tag => attr(tag, 'name') === 'description');
  const desc = description && attr(description, 'content');
  if (!title || titles.has(title)) fail(file, 'missing or duplicate title'); titles.add(title);
  if (!desc || descriptions.has(desc)) fail(file, 'missing or duplicate description'); descriptions.add(desc);
  if ((html.match(/<h1\b/g) ?? []).length !== 1) fail(file, 'must contain exactly one h1');
  if (!html.includes('rel="canonical"')) fail(file, 'missing canonical');
  for (const key of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image', 'og:image:alt']) if (!meta.some(tag => attr(tag, 'property') === key)) fail(file, `missing ${key}`);
  for (const key of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) if (!meta.some(tag => attr(tag, 'name') === key)) fail(file, `missing ${key}`);
  for (const match of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) { try { JSON.parse(match[1]); } catch { fail(file, 'invalid JSON-LD'); } }
  for (const match of html.matchAll(/<img\b[^>]*>/g)) { for (const name of ['src', 'alt', 'width', 'height']) if (attr(match[0], name) === undefined) fail(file, `image missing ${name}`); }
  let previous = 0; for (const match of html.matchAll(/<h([1-6])\b/g)) { const level = Number(match[1]); if (level > previous + 1) fail(file, `heading jumps h${previous} to h${level}`); previous = level; }
  for (const match of html.matchAll(/<(?:a|link|img|script)\b[^>]*(?:href|src)="([^"\s]+)"[^>]*>/g)) {
    const url = match[1]; if (!url.startsWith('/') && !url.startsWith('#')) continue;
    const parsed = new URL(url, 'https://audit.invalid' + (file.slice(root.length).replaceAll('\\', '/').replace(/index\.html$/, '')));
    const target = url.startsWith('#') ? file : await targetFile(parsed.pathname);
    try { await access(target); } catch { fail(file, `missing internal target ${url}`); continue; }
    if (parsed.hash && target.endsWith('.html')) { const text = pages.get(target) ?? await readFile(target, 'utf8'); if (!text.includes(`id="${decodeURIComponent(parsed.hash.slice(1))}"`)) fail(file, `missing fragment ${url}`); }
  }
}
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
for (const pathname of sitemapPaths) { try { await access(await targetFile(pathname)); } catch { errors.push(`Sitemap missing page: ${pathname}`); } }
if (sitemapPaths.includes('/404/')) errors.push('404 must not be in sitemap');
if (sitemapPaths.some(path => path.startsWith('/admin/'))) errors.push('Admin must not be in sitemap');
const adminPages=htmlFiles.filter(file=>file.startsWith(join(root,'admin')+(process.platform==='win32'?'\\':'/')));
if (sitemapPaths.length !== htmlFiles.length - adminPages.length - 1) errors.push('Sitemap does not cover every public HTML page');
for (const file of ['robots.txt', '_headers', '404.html']) { try { await access(join(root, file)); } catch { errors.push(`Missing ${file}`); } }
const publicScriptPaths = new Set([...pages].filter(([file]) => !adminPages.includes(file)).flatMap(([,html]) => [...html.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map(match => join(root,match[1]))));
const jsBytes = (await Promise.all([...publicScriptPaths].map(async file => (await stat(file)).size))).reduce((a,b)=>a+b,0);
for (const [file, html] of pages) for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) if (!match[1].includes('application/ld+json') && !match[1].includes('src=') && match[2].trim()) fail(file, 'Executable inline script blocked by CSP');
if (jsBytes > 50000) errors.push(`Client JS exceeds 50 KB budget: ${jsBytes}`);
const report = { pages: htmlFiles.length, sitemapEntries: sitemapPaths.length, clientJavaScriptBytes: jsBytes, errors };
await mkdir('artifacts', { recursive: true }); await writeFile('artifacts/site-audit.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2)); if (errors.length) process.exit(1);
