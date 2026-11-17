import test from 'node:test';
import assert from 'node:assert/strict';
import {languages,languageForCountry,preferredLanguage,languageDirection,isLanguage} from '../src/lib/languages.ts';
test('requested language catalogue has 18 unique supported languages',()=>{
  assert.equal(languages.length,18);assert.equal(new Set(languages.map(item=>item.code)).size,18);
  assert.equal(isLanguage('en'),true);assert.equal(isLanguage('xx'),false);
});
test('country inference selects local language and safely defaults to English',()=>{
  for(const [country,language] of Object.entries({IN:'hi',BD:'bn',MX:'es',BR:'pt',JP:'ja',KR:'ko',MY:'ms',ID:'id',SA:'ar',SE:'sv',BG:'bg',TR:'tr',US:'en',GB:'en',PK:'en'}))assert.equal(languageForCountry(country),language);
  assert.equal(languageForCountry('de'),'de');assert.equal(languageForCountry(undefined),'en');assert.equal(languageForCountry('XX'),'en');
});
test('manual choice wins and invalid cookie values never become a locale',()=>{
  assert.equal(preferredLanguage('other=1; site_language=en','IN'),'en');
  assert.equal(preferredLanguage('site_language=ja','US'),'ja');
  assert.equal(preferredLanguage('site_language=javascript:alert(1)','DE'),'de');
  assert.equal(preferredLanguage(null,'FR'),'fr');
});
test('Arabic uses right-to-left layout',()=>{
  assert.equal(languageDirection('ar'),'rtl');assert.equal(languageDirection('hi'),'ltr');
});
