import sharp from 'sharp';
import { resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../public/', import.meta.url));
const cache = new Map();
// Native Satteri visitors record mutations through the context API.
export default {
  name: 'editorial-image-dimensions',
  element: {
    filter: ['img'],
    async visit(node, ctx) {
      const src = String(node.properties?.src ?? '');
      if (!src.startsWith('/images/')) return;
      const file = resolve(root, src.slice(1));
      const local = relative(root, file);
      if (local.startsWith('..') || isAbsolute(local)) throw new Error('Image path outside public root');
      if (!cache.has(file)) cache.set(file, sharp(file).metadata());
      const dimensions = await cache.get(file);
      if (!dimensions.width || !dimensions.height) throw new Error('Image dimensions missing: ' + src);
      for (const [key, value] of Object.entries({ width: dimensions.width, height: dimensions.height, loading: 'lazy', decoding: 'async' })) ctx.setProperty(node, key, value);
    },
  },
};
