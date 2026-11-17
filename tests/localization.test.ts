import test from 'node:test';
import assert from 'node:assert/strict';
import {languageRedirect} from '../worker/language.ts';
import {collect,localize} from '../scripts/localization-core.mjs';
test('first homepage visit uses trusted edge country and temporary private redirect',()=>{
 const r=new Request('https://actodcconverter.org/');Object.defineProperty(r,'cf',{value:{country:'ES'}});
 const response=languageRedirect(r)!;assert.equal(response.status,302);assert.equal(response.headers.get('Location'),'https://actodcconverter.org/es/');assert.equal(response.headers.get('Cache-Control'),'private, no-store');
});
test('explicit locale, deep links, queries, private routes and unsafe methods stay stable',()=>{
 for(const path of ['/es/','/blog/guide/','/?x=1','/admin/','/api/contact']){const r=new Request('https://actodcconverter.org'+path);Object.defineProperty(r,'cf',{value:{country:'ES'}});assert.equal(languageRedirect(r),null);}
 assert.equal(languageRedirect(new Request('https://actodcconverter.org/',{method:'POST'})),null);
 const r=new Request('https://actodcconverter.org/',{headers:{Cookie:'site_language=en','CF-IPCountry':'ES'}});Object.defineProperty(r,'cf',{value:{country:'ES'}});assert.equal(languageRedirect(r),null);
 assert.equal(languageRedirect(new Request('https://actodcconverter.org/',{headers:{'CF-IPCountry':'ES'}})),null);
});
test('localized HTML escapes translation, preserves formulas and localizes canonical/internal links',()=>{
 const html='<html lang="en"><head><title>Calculate output</title><link rel="canonical" href="https://actodcconverter.org/"></head><body><p>Hello <a href="/about/">About</a> world</p><code>Vavg = 2Vpk/π</code></body></html>';
 assert.ok(collect(html).has('Calculate output'));assert.ok(!collect(html).has('Vavg = 2Vpk/π'));
 const dict={'Calculate output':'Calcular salida',Hello:'Hola',About:'Acerca de',world:'mundo'};
 const out=localize(html,{code:'es',prefix:'/es',direction:'ltr'},dict,'https://actodcconverter.org',new Set(['/','/about/']));
 assert.ok(out.includes('href="https://actodcconverter.org/es/"'));assert.ok(out.includes('Hola <a href="/es/about/">Acerca de</a> mundo'));assert.ok(out.includes('Vavg = 2Vpk/π'));
 assert.throws(()=>localize(html,{code:'es',prefix:'/es',direction:'ltr'},{},'https://actodcconverter.org',new Set(['/'])),/Missing es translation/);
});
test('explanatory prose containing formulas is translated while pure equations stay intact',()=>{
 const strings=collect('<p>For a sine wave, Vpk = √2 Vrms.</p><p>Vpk = √2 Vrms</p>');
 assert.ok(strings.has('For a sine wave, Vpk = √2 Vrms.'));
 assert.ok(!strings.has('Vpk = √2 Vrms'));
});
test('translation text cannot inject HTML elements or event handlers',()=>{
 const out=localize('<html><head><title>Hello world</title></head><body><p>Hello world</p></body></html>',{code:'es',prefix:'/es',direction:'ltr'},{'Hello world':'<img src=x onerror=alert(1)>'},'https://actodcconverter.org',new Set(['/']));
 assert.ok(!out.includes('<img'));
 assert.ok(out.includes('&lt;img'));
});
