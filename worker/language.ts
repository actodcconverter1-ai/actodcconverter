import {languages,preferredLanguage} from '../src/lib/languages.ts';
const locales=new Set(languages.filter(l=>l.code!=='en').map(l=>l.code));
/** Explicit language URLs are stable. Geography affects only a first homepage visit. */
export function languageRedirect(request:Request):Response|null {
 const url=new URL(request.url);
 if(!['GET','HEAD'].includes(request.method)||url.pathname!=='/'||url.search)return null;
 const country=(request as Request&{cf?:{country?:string}}).cf?.country;
 const language=preferredLanguage(request.headers.get('Cookie'),country);
 if(language==='en'||!locales.has(language))return null;
 return new Response(null,{status:302,headers:{Location:url.origin+'/'+language+'/', 'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
}
