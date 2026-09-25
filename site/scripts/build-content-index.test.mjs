import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildIndex } from './build-content-index.mjs';

let siteRoot;

beforeEach(() => {
  siteRoot = mkdtempSync(path.join(os.tmpdir(), 'content-'));
});
afterEach(() => rmSync(siteRoot, { recursive: true, force: true }));

function writeProject(slug, overrides = {}, files = ['hero.jpg']) {
  const dir = path.join(siteRoot, 'content', 'work', slug);
  mkdirSync(dir, { recursive: true });
  const project = {
    title: slug,
    category: 'short',
    year: '2024',
    runtime: '10 min',
    role: 'Director',
    status: 'Completed',
    logline: 'Logline.',
    hero: { src: 'hero.jpg', alt: 'Hero' },
    ...overrides,
  };
  writeFileSync(path.join(dir, 'project.json'), JSON.stringify(project));
  for (const f of files) {
    mkdirSync(path.dirname(path.join(dir, f)), { recursive: true });
    writeFileSync(path.join(dir, f), 'x');
  }
}

describe('buildIndex', () => {
  it('indexes a valid project, copies media and sorts newest first', () => {
    writeProject('older', { year: '2020' });
    writeProject('newer', { year: '2025', videos: [{ src: 'film.mp4' }] }, [
      'hero.jpg',
      'film.mp4',
    ]);
    const { projects } = buildIndex({ siteRoot });
    expect(projects.map((p) => p.slug)).toEqual(['newer', 'older']);
    expect(projects[0].videos[0].src).toBe('/media/newer/film.mp4');
    expect(existsSync(path.join(siteRoot, 'public/media/newer/film.mp4'))).toBe(true);
    const written = JSON.parse(
      readFileSync(path.join(siteRoot, 'generated/work-index.json'), 'utf8'),
    );
    expect(written.projects).toHaveLength(2);
  });

  it('writes nothing in check mode', () => {
    writeProject('one');
    buildIndex({ siteRoot, check: true });
    expect(existsSync(path.join(siteRoot, 'generated'))).toBe(false);
  });

  it('lists every problem in one itemized error', () => {
    writeProject('Bad_Slug');
    writeProject('bad-category', { category: 'nope' });
    writeProject('missing-file', { hero: { src: 'gone.jpg', alt: 'x' } }, []);
    let message = '';
    try {
      buildIndex({ siteRoot });
    } catch (err) {
      message = err.message;
    }
    expect(message).toMatch(/- "Bad_Slug": folder name/);
    expect(message).toMatch(/- "bad-category\/project.json": category:/);
    expect(message).toMatch(
      /- "missing-file\/project.json": referenced file "gone.jpg" does not exist/,
    );
  });

  it('reports a folder without project.json and invalid JSON', () => {
    mkdirSync(path.join(siteRoot, 'content/work/empty'), { recursive: true });
    mkdirSync(path.join(siteRoot, 'content/work/broken'), { recursive: true });
    writeFileSync(path.join(siteRoot, 'content/work/broken/project.json'), '{');
    expect(() => buildIndex({ siteRoot })).toThrow(/"broken\/project.json": invalid JSON/);
    expect(() => buildIndex({ siteRoot })).toThrow(/"empty\/project.json": file is missing/);
  });
});
