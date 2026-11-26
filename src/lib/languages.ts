import config from '../config/languages.json' with {type:'json'};
/** Single catalogue for footer language choices and locale routes. */
export const languages = config.languages;
export type Language = 'en'|'hi'|'es'|'ru'|'fr'|'de'|'it'|'pt'|'bn'|'ja'|'ko'|'ms'|'pl'|'id'|'ar'|'bg'|'tr'|'sv';
export function isLanguage(value:unknown):value is Language {
 return typeof value==='string'&&languages.some(language=>language.code===value);
}
export function languageForCountry(country:unknown):Language {
 const code=typeof country==='string'?country.toUpperCase():'';
 const language=languages.find(language=>language.countries.includes(code))?.code??config.defaultLanguage;
 return isLanguage(language)?language:'en';
}
/** A deliberate choice wins over approximate country inference. */
export function preferredLanguage(cookie:string|null,country:unknown):Language {
 const prefix=config.preferenceCookie+'=';
 const value=cookie?.split(';').map(part=>part.trim()).find(part=>part.startsWith(prefix))?.slice(prefix.length);
 return isLanguage(value)?value:languageForCountry(country);
}
export function languageDirection(language:Language):'rtl'|'ltr' {
 return languages.find(item=>item.code===language)?.direction==='rtl'?'rtl':'ltr';
}
