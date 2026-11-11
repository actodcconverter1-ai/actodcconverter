import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.ts';
import { canonicalRedirect } from '../worker/canonical.ts';

test('old host, www and HTTP redirect directly to canonical HTTPS with path and query', () => {
  for (const origin of ['http://actodcconverter.org', 'https://www.actodcconverter.org', 'http://www.actodcconverter.org', 'https://ac-to-dc-converter.actodcconverter1.workers.dev']) {
    const response = canonicalRedirect(new Request(origin + '/blog/ac-to-dc-formulas?utm_source=test&x=1&x=2'))!;
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('Location'), 'https://actodcconverter.org/blog/ac-to-dc-formulas/?utm_source=test&x=1&x=2');
  }
});
test('canonical requests and local/unknown hosts do not loop or redirect', () => {
  for (const url of ['https://actodcconverter.org/', 'https://actodcconverter.org/blog/ac-to-dc-formulas/', 'http://127.0.0.1:4322/', 'https://acdc.example/admin/', 'https://other.invalid/']) assert.equal(canonicalRedirect(new Request(url)), null);
});
test('index aliases normalize without changing assets or API endpoint paths', () => {
  assert.equal(canonicalRedirect(new Request('https://www.actodcconverter.org/about/index.html?q=a%20b'))!.headers.get('Location'), 'https://actodcconverter.org/about/?q=a%20b');
  assert.equal(canonicalRedirect(new Request('https://www.actodcconverter.org/images/logo/ac-dc-blue.svg'))!.headers.get('Location'), 'https://actodcconverter.org/images/logo/ac-dc-blue.svg');
  assert.equal(canonicalRedirect(new Request('https://actodcconverter.org/api/contact')), null);
});
test('unsafe methods preserve method with 308 and do not cache a private redirect', () => {
  const response = canonicalRedirect(new Request('http://actodcconverter.org/api/contact', {method:'POST'}))!;
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('Location'), 'https://actodcconverter.org/api/contact');
  assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
});
test('Worker redirects before auth, asset serving or contact writes', async () => {
  const env = {ASSETS:{fetch:async()=>{throw Error('Must not serve assets on alias');}}};
  for (const path of ['/admin/', '/api/admin/messages', '/api/contact', '/blog/ac-to-dc-formulas/']) {
    const response=await worker.fetch(new Request('https://www.actodcconverter.org'+path),env);
    assert.equal(response.status,301);
    assert.equal(response.headers.get('Location'),'https://actodcconverter.org'+path);
  }
});
