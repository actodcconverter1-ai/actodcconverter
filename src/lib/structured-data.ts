import {canonical} from '../config/seo.config.ts';
export function serializeJsonLd(value:unknown):string {
  return JSON.stringify(value).replaceAll('<','\\u003c');
}
export const editorialId=canonical('/editorial/')+'#organization';
export function webApplication(path:string,name:string,description:string,features:string[],fragment='calculator') {
  return {'@type':'WebApplication','@id':canonical(path)+'#application',name,description,url:canonical(path)+'#'+fragment,
    applicationCategory:'UtilitiesApplication',operatingSystem:'Any',browserRequirements:'JavaScript is required for new calculations.',
    isAccessibleForFree:true,featureList:features,isPartOf:{'@id':canonical(path)+'#webpage'},publisher:{'@id':editorialId}};
}
export function techArticle(path:string,title:string,description:string,extra:Record<string,unknown>={}) {
  return {'@type':'TechArticle','@id':canonical(path)+'#article',headline:title,description,
    mainEntityOfPage:{'@id':canonical(path)+'#webpage'},author:{'@id':editorialId},publisher:{'@id':editorialId},
    inLanguage:'en',...extra};
}
/** A technical guide published as a blog post is both types of Article. */
export function blogPosting(path:string,title:string,description:string,extra:Record<string,unknown>={}) {
  return {...techArticle(path,title,description,extra),'@type':['Article','TechArticle','BlogPosting']};
}
