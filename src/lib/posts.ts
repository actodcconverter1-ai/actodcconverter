import { getCollection } from 'astro:content';
export async function posts() {
  const entries = await getCollection('blog');
  if (new Set(entries.map(entry => entry.data.slug)).size !== entries.length) throw new Error('Blog slugs must be unique.');
  return entries.filter(entry => entry.data.status === 'published').sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
