import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATEGORIES, SLUG_PATTERN } from '../lib/content-schema.mjs';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--'));
const catFlag = args.indexOf('--category');
const category = catFlag === -1 ? 'short' : args[catFlag + 1];
const keys = CATEGORIES.map((c) => c.key);

if (!slug || !SLUG_PATTERN.test(slug) || !keys.includes(category)) {
  console.error('Usage: npm run new:project -- <slug> [--category <category>]');
  console.error('  <slug>      lowercase kebab-case, e.g. paper-houses (becomes the URL)');
  console.error(`  <category>  one of: ${keys.join(', ')} (default: short)`);
  process.exit(1);
}

const dir = path.join(siteRoot, 'content', 'work', slug);
if (existsSync(dir)) {
  console.error(`content/work/${slug} already exists`);
  process.exit(1);
}

mkdirSync(path.join(dir, 'stills'), { recursive: true });
const template = {
  title: 'Title',
  category,
  year: String(new Date().getFullYear()),
  runtime: '00 min',
  role: 'Director',
  status: 'Completed',
  logline: 'One or two sentences about the film.',
  hero: { src: 'hero.jpg', alt: 'Describe the hero still' },
  stills: [{ src: 'stills/01.jpg', alt: 'Describe the still' }],
  videos: [{ title: 'Film', src: 'film.mp4', poster: 'poster.jpg' }],
};
writeFileSync(path.join(dir, 'project.json'), `${JSON.stringify(template, null, 2)}\n`);
console.log(`Created content/work/${slug}/project.json`);
console.log(
  'Next: fill in project.json, add the files it references, then run `npm run validate:content`.',
);
