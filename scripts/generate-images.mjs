import { mkdir, writeFile, readdir } from 'node:fs/promises';
import sharp from 'sharp';
for (const folder of ['logo', 'calculators', 'blogs', 'icons']) await mkdir(`public/images/${folder}`, { recursive: true });
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" rx="11" fill="#175fb5"/><path d="M6 22Q11 3 16 22T26 22M27 13H35M27 27H35" fill="none" stroke="#ffffff" stroke-width="2.3"/></svg>`;
await writeFile('public/images/logo/ac-dc.svg', icon);
await writeFile('public/images/icons/favicon.svg', icon);
const illustrations = [
  ['calculators/ac-dc-overview.webp', 'AC TO DC', 'The circuit defines the result.', 'RMS input → rectifier → average output', 'overview'],
];
for (const [file, eyebrow, title, subtitle, type] of illustrations) {
  const points = Array.from({ length: 361 }, (_, i) => { const x = 100 + i * 2.1; let y = 300 - 65 * Math.sin(i * Math.PI / 60); if (type === 'ripple') y = 240 + (i % 60) * 0.9; if (type === 'models') y = 320 - 80 * Math.abs(Math.sin(i * Math.PI / 90)); return `${x},${y}`; }).join(' ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 960 540"><rect width="960" height="540" fill="#eaf0de"/><g stroke="#d6dfc6" stroke-width="1">${Array.from({ length: 20 }, (_, i) => `<path d="M${i * 50} 200V430"/>`).join('')}<path d="M70 240H890M70 300H890M70 360H890M70 420H890"/></g><text x="65" y="73" font-family="Arial,sans-serif" font-size="14" letter-spacing="3" fill="#42663c">${eyebrow}</text><text x="65" y="137" font-family="Arial,sans-serif" font-size="38" font-weight="bold" fill="#214c32">${title}</text><polyline points="${points}" stroke="#176349" stroke-width="3" fill="none"/><text x="65" y="485" font-family="Arial,sans-serif" font-size="19" fill="#536b48">${subtitle}</text><text x="837" y="74" font-family="Arial,sans-serif" font-size="14" fill="#536b48">AC/DC</text></svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 86 }).toFile(`public/images/${file}`);
}
// PNG social card: broad crawler support, repository-local asset.
await sharp('public/images/calculators/ac-dc-overview.webp').png().toFile('public/images/calculators/ac-dc-social.png');
for(const file of (await readdir('assets/illustrations')).filter(file=>file.endsWith('.svg'))) await sharp('assets/illustrations/'+file).webp({quality:86}).toFile('public/images/blogs/'+file.replace(/\.svg$/,'.webp'));
console.log('Generated logo, favicon, social card, and repository article illustrations.');
