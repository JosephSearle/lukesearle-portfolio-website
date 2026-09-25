import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SLUG_PATTERN, projectSchema, referencedFiles } from '../lib/content-schema.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = path.resolve(here, '..');

/**
 * Validates content/work/<slug>/project.json and (unless `check`) copies referenced media to
 * public/media/<slug>/ and writes generated/work-index.json. Throws one error listing every problem.
 */
export function buildIndex({ siteRoot = defaultSiteRoot, check = false } = {}) {
  const workRoot = path.join(siteRoot, 'content', 'work');
  const errors = [];
  const projects = [];

  const slugs = existsSync(workRoot)
    ? readdirSync(workRoot, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
        .sort()
    : [];

  for (const slug of slugs) {
    const dir = path.join(workRoot, slug);
    const label = `${slug}/project.json`;
    if (!SLUG_PATTERN.test(slug)) {
      errors.push(`- "${slug}": folder name must be lowercase kebab-case (letters, digits, "-")`);
      continue;
    }
    const file = path.join(dir, 'project.json');
    if (!existsSync(file)) {
      errors.push(`- "${label}": file is missing`);
      continue;
    }
    let raw;
    try {
      raw = JSON.parse(readFileSync(file, 'utf8'));
    } catch (err) {
      errors.push(`- "${label}": invalid JSON (${err.message})`);
      continue;
    }
    const parsed = projectSchema.safeParse(raw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const where = issue.path.length ? `${issue.path.join('.')}: ` : '';
        errors.push(`- "${label}": ${where}${issue.message}`);
      }
      continue;
    }
    const project = parsed.data;
    const missing = referencedFiles(project).filter((f) => !existsSync(path.join(dir, f)));
    for (const f of missing) errors.push(`- "${label}": referenced file "${f}" does not exist`);
    if (missing.length) continue;
    projects.push({ slug, dir, project });
  }

  if (errors.length) {
    throw new Error(`Content validation failed:\n${errors.join('\n')}`);
  }

  const url = (slug, rel) => `/media/${slug}/${rel}`;
  const index = projects
    .map(({ slug, project: p }) => ({
      slug,
      title: p.title,
      category: p.category,
      year: p.year,
      runtime: p.runtime,
      role: p.role,
      status: p.status,
      logline: p.logline,
      hero: { src: url(slug, p.hero.src), alt: p.hero.alt },
      stills: p.stills.map((s) => ({ src: url(slug, s.src), alt: s.alt })),
      videos: p.videos.map((v) => ({
        title: v.title,
        src: v.src ? url(slug, v.src) : undefined,
        url: v.url,
        poster: v.poster ? url(slug, v.poster) : undefined,
      })),
    }))
    .sort((a, b) => b.year.localeCompare(a.year) || a.title.localeCompare(b.title));

  if (!check) {
    const mediaRoot = path.join(siteRoot, 'public', 'media');
    rmSync(mediaRoot, { recursive: true, force: true });
    for (const { slug, dir, project } of projects) {
      for (const f of referencedFiles(project)) {
        const dest = path.join(mediaRoot, slug, f);
        mkdirSync(path.dirname(dest), { recursive: true });
        cpSync(path.join(dir, f), dest);
      }
    }
    const generated = path.join(siteRoot, 'generated');
    mkdirSync(generated, { recursive: true });
    writeFileSync(
      path.join(generated, 'work-index.json'),
      `${JSON.stringify({ projects: index }, null, 2)}\n`,
    );
  }

  return { projects: index };
}

function main() {
  const check = process.argv.includes('--check');
  try {
    const { projects } = buildIndex({ check });
    console.log(
      check
        ? `Validated ${projects.length} project(s).`
        : `Built content index with ${projects.length} project(s).`,
    );
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
