import settings from '../src/config/editorial.json' with { type: 'json' };

const legacyHost = 'ac-to-dc-converter.actodcconverter1.workers.dev';

/** Canonicalize only this site's public hosts; local development stays local. */
export function canonicalRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  const canonical = new URL(settings.domain);
  if (!settings.indexable || ![canonical.hostname, 'www.' + canonical.hostname, legacyHost].includes(url.hostname)) return null;
  const target = new URL(url);
  target.protocol = canonical.protocol;
  target.host = canonical.host;
  // Match Astro's directory routes in the same hop, preserving query parameters.
  if (!target.pathname.startsWith('/api/')) {
    target.pathname = target.pathname.replace(/\/index\.html$/, '/');
    if (!target.pathname.endsWith('/') && !target.pathname.split('/').at(-1)!.includes('.')) target.pathname += '/';
  }
  if (target.href === url.href) return null;
  const safeMethod = request.method === 'GET' || request.method === 'HEAD';
  return new Response(null, { status: safeMethod ? 301 : 308, headers: {
    Location: target.href,
    'Cache-Control': safeMethod ? 'public, max-age=3600' : 'private, no-store',
    'X-Content-Type-Options': 'nosniff',
  } });
}
