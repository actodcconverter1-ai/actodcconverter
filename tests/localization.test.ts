import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.ts';
import {collect,localize} from '../scripts/localization-core.mjs';

test('root is served unchanged for all countries and stored language preferences',async()=>{
 const env={ASSETS:{fetch:async(request:Request)=>new Response(new URL(request.url).pathname,{headers:{'Cache-Control':'public, max-age=0'}})}};
 for(const country of ['ES','DE','IN','JP','BR','SA','SE','US',undefined])for(const cookie of ['', 'site_language=es','site_language=de','site_language=ja','site_language=../../admin'])for(const method of ['GET','HEAD']){
  const request=new Request('https://actodcconverter.org/',{method,headers:{Cookie:cookie,'Accept-Language':'es-ES,es;q=0.9'}});Object.defineProperty(request,'cf',{value:{country}});
  const response=await worker.fetch(request,env);assert.equal(response.status,200);assert.equal(response.headers.get('Location'),null);assert.equal(await response.text(),'/');assert.equal(response.headers.get('Cache-Control'),'public, max-age=0');
 }
});

test('manual locale URLs and query strings reach the requested public asset unchanged',async()=>{
 const env={ASSETS:{fetch:async(request:Request)=>new Response(request.url)}};
 for(const path of ['/es/','/de/ac-to-dc-calculator/','/ar/','/blog/guide/','/?x=1','/search/?q=rectifier']){
  const url='https://actodcconverter.org'+path,request=new Request(url,{headers:{Cookie:'site_language=ja'}});Object.defineProperty(request,'cf',{value:{country:'ES'}});
  const response=await worker.fetch(request,env);assert.equal(response.status,200);assert.equal(response.headers.get('Location'),null);assert.equal(await response.text(),url);
 }
});

test('foreign-country and language preferences do not add a hop after the HTTPS 301',async()=>{
 const env={ASSETS:{fetch:async()=>new Response('English homepage')}};
 for(const origin of ['http://actodcconverter.org','http://www.actodcconverter.org','https://www.actodcconverter.org']){
  const request=new Request(origin+'/',{headers:{Cookie:'site_language=es'}});Object.defineProperty(request,'cf',{value:{country:'ES'}});
  const redirect=await worker.fetch(request,env);assert.equal(redirect.status,301);assert.equal(redirect.headers.get('Location'),'https://actodcconverter.org/');
  const target=new Request(redirect.headers.get('Location')!,{headers:{Cookie:'site_language=es'}});Object.defineProperty(target,'cf',{value:{country:'ES'}});
  const response=await worker.fetch(target,env);assert.equal(response.status,200);assert.equal(response.headers.get('Location'),null);assert.equal(await response.text(),'English homepage');
 }
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

test('language-specific editorial sections do not leak unprepared English copy into translated pages',()=>{
 const html='<html lang="en"><head><title>Hello world</title></head><body><p>Hello world</p><section data-editorial-locale="en"><h2>New English guidance</h2><p>Publication awaits translated editorial copy.</p></section></body></html>';
 assert.ok(!collect(html).has('New English guidance'));
 const es=localize(html,{code:'es',prefix:'/es',direction:'ltr'},{'Hello world':'Hola mundo'},'https://actodcconverter.org',new Set(['/']));
 assert.ok(es.includes('Hola mundo'));assert.ok(!es.includes('New English guidance'));assert.ok(!es.includes('data-editorial-locale'));
 const en=localize(html,{code:'en',prefix:'',direction:'ltr'},{'Hello world':'Hello world'},'https://actodcconverter.org',new Set(['/']));
 assert.ok(en.includes('New English guidance'));assert.ok(en.includes('Publication awaits translated editorial copy.'));
});
