document.addEventListener('click',function(event){
 var link=event.target.closest('a[data-language]');
 if(link)document.cookie='site_language='+encodeURIComponent(link.dataset.language)+'; Path=/; Max-Age=31536000; SameSite=Lax; Secure';
});
var locale=document.documentElement.lang;
var roots=Array.from(document.querySelectorAll('[data-converter],[data-contact-status],[data-contact-form] button'));
if(locale!=='en'&&roots.length&&/^[a-z]{2}$/.test(locale))fetch('/translations/'+locale+'.json').then(function(r){if(!r.ok)throw Error('Translation unavailable');return r.json();}).then(function(dictionary){
 function translate(){for(var root of roots){var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);var node;while((node=walker.nextNode())){var text=node.nodeValue.trim();for(var phrase of ['enter a valid number from','enter a value from'])if(text.includes(phrase)&&dictionary[phrase]){text=text.replace(phrase,dictionary[phrase]);if(dictionary.to)text=text.replace(/ to /g,' '+dictionary.to+' ');var colon=text.indexOf(': ');if(colon>0&&dictionary[text.slice(0,colon)])text=dictionary[text.slice(0,colon)]+text.slice(colon);node.nodeValue=text;}if(Object.prototype.hasOwnProperty.call(dictionary,text)&&dictionary[text]!==text)node.nodeValue=node.nodeValue.replace(text,function(){return dictionary[text];});}}}
 translate();for(var root of roots)new MutationObserver(translate).observe(root,{childList:true,subtree:true});
}).catch(function(){/* Static translated content and calculator remain available. */});
