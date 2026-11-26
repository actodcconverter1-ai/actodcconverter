import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parse,serialize} from 'parse5';
import {readFileSync} from 'node:fs';
import {homepageFaqs} from '../src/config/homepage-faq.ts';
import {syncFaqSchema,visibleFaqs} from '../scripts/faq-schema.mjs';
test('homepage FAQ JSON stays identical to the twelve visible source answers',()=>{
 const faq=JSON.parse(readFileSync(new URL('../src/data/faqpage-schema.json',import.meta.url),'utf8'));
 assert.equal(faq['@type'],'FAQPage');assert.equal(faq.mainEntity.length,12);
 assert.deepEqual(faq.mainEntity.map((q:{name:string;acceptedAnswer:{text:string}})=>[q.name,q.acceptedAnswer.text]),homepageFaqs);
});
test('FAQ graph uses complete localized visible answers and excludes calculator help',()=>{
 const doc=parse(`<head><script type="application/ld+json">{"@graph":[{"@type":"WebPage"}]}</script></head><body><details class="workbench-help"><summary>Help</summary><p>Not a FAQ.</p></details><details data-schema-faq><summary>¿Qué es DC?<span aria-hidden="true">+</span></summary><p>Corriente <strong>continua</strong>.</p><p>Consulte <a href="/es/">la guía</a>.</p></details></body>`);
 syncFaqSchema(doc,'https://actodcconverter.org/es/','es');
 const html=serialize(doc),data=JSON.parse(html.match(/application\/ld\+json">(.*?)<\/script>/s)![1]);
 const faq=data['@graph'][1];assert.equal(faq.inLanguage,'es');assert.equal(faq['@id'],'https://actodcconverter.org/es/#faq');
 assert.deepEqual(faq.mainEntity,[{'@type':'Question',name:'¿Qué es DC?',acceptedAnswer:{'@type':'Answer',text:'Corriente continua. Consulte la guía.'}}]);
 syncFaqSchema(doc,'https://actodcconverter.org/es/','es');assert.equal((serialize(doc).match(/"@type":"FAQPage"/g)??[]).length,1);
});
test('empty pairs and pages without FAQs never receive FAQPage markup',()=>{
 const doc=parse('<script type="application/ld+json">{"@graph":[{"@type":"BlogPosting"},{"@type":"FAQPage"}]}</script><details data-schema-faq><summary>Question only?</summary></details>');
 assert.deepEqual(visibleFaqs(doc),[]);syncFaqSchema(doc,'https://actodcconverter.org/blog/example/','en');
 assert.doesNotMatch(serialize(doc),/FAQPage/);assert.match(serialize(doc),/BlogPosting/);
});
