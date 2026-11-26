/** Derive FAQ markup only from explicitly marked, visible question/answer pairs. */
export function visibleFaqs(doc) {
 const pairs=[];
 const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
 const text=n=>attr(n,'aria-hidden')==='true'||['script','style'].includes(n.tagName)?'':n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('')+(['p','li','div','br'].includes(n.tagName)?' ':'');
 const normalize=n=>text(n).replace(/\s+/g,' ').trim();
 function walk(n){
  if(n.tagName==='details'&&(attr(n,'data-schema-faq')!==undefined||attr(n,'class')?.split(/\s+/).includes('hub-faq'))){
   const summary=n.childNodes.find(c=>c.tagName==='summary');
   const name=summary?normalize(summary):'';
   const answer=(n.childNodes??[]).filter(c=>c!==summary).map(normalize).filter(Boolean).join(' ');
   if(name&&answer)pairs.push({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text:answer}});
  }
  for(const c of n.childNodes??[])walk(c);
 }walk(doc);return pairs;
}
export function syncFaqSchema(doc,canonical,language){
 const pairs=visibleFaqs(doc);
 function walk(n){
  if(n.tagName==='script'&&n.attrs?.some(a=>a.name==='type'&&a.value==='application/ld+json')){
   const data=JSON.parse(n.childNodes[0].value);
   if(Array.isArray(data['@graph'])){
    data['@graph']=data['@graph'].filter(item=>![].concat(item['@type']??[]).includes('FAQPage'));
    if(pairs.length)data['@graph'].push({'@type':'FAQPage','@id':canonical+'#faq',url:canonical,inLanguage:language,isPartOf:{'@id':canonical+'#webpage'},mainEntity:pairs});
    n.childNodes[0].value=JSON.stringify(data).replaceAll('<','\\u003c');
   }
  }
  for(const c of n.childNodes??[])walk(c);
 }walk(doc);
}
