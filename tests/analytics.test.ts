import test from 'node:test';
import assert from 'node:assert/strict';
import {analyticsCommands, analyticsPage, analyticsReferrer, readConsent, consentLifetime} from '../src/lib/analytics.ts';
test('analytics page context strips all query parameters and fragments', () => {
  assert.equal(analyticsPage('https://actodcconverter.org/ac-to-dc-calculator/?email=private%40example.com&voltage=12#password'), 'https://actodcconverter.org/ac-to-dc-calculator/');
});
test('private routes and non-web URLs are excluded from analytics context', () => {
  for (const url of ['https://actodcconverter.org/admin','https://actodcconverter.org/admin/login/','https://actodcconverter.org/api/contact','file:///private','javascript:alert(1)','not a URL']) assert.equal(analyticsPage(url),null);
});
test('referrer sends only an origin, excluding private path, query and fragment', () => {
  assert.equal(analyticsReferrer('https://referrer.example/private/customer?email=a#token'), 'https://referrer.example/');
  assert.equal(analyticsReferrer('file:///private'), '');
  assert.equal(analyticsReferrer(''), '');
});
test('consent expires and malformed or future preferences never authorize collection', () => {
  const now=100000000000;
  assert.equal(readConsent(JSON.stringify({choice:'granted',updatedAt:now-1}),now),'granted');
  assert.equal(readConsent(JSON.stringify({choice:'denied',updatedAt:now-1}),now),'denied');
  for (const value of [null,'broken','{}',JSON.stringify({choice:'granted',updatedAt:now+1}),JSON.stringify({choice:'granted',updatedAt:now-consentLifetime}),JSON.stringify({choice:'yes',updatedAt:now})]) assert.equal(readConsent(value,now),null);
});
test('tag initialization establishes clean URLs and suppresses auto views before configuration or consent grant', () => {
  const commands=analyticsCommands('G-FCMW7WN9P3','https://actodcconverter.org/about/?private=test#secret','https://source.example/account?private=test','About');
  assert.equal(commands[0][0],'set');
  const initial=commands[0][1] as Record<string,unknown>;
  assert.equal(initial.page_location,'https://actodcconverter.org/about/');
  assert.equal(initial.page_referrer,'https://source.example/');
  assert.equal(initial.send_page_view,false);
  assert.equal(initial.allow_google_signals,false);
  assert.equal(commands.filter(c=>c[0]==='event'&&c[1]==='page_view').length,1);
  assert.ok(commands.findIndex(c=>c[0]==='config')<commands.findIndex(c=>c[0]==='consent'&&c[1]==='update'));
  assert.deepEqual(analyticsCommands('bad-id','https://actodcconverter.org/','',''),[]);
  assert.deepEqual(analyticsCommands('G-FCMW7WN9P3','https://actodcconverter.org/admin/','',''),[]);
});
