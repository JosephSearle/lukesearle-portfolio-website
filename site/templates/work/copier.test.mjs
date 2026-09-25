import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { CATEGORIES } from '../../lib/content-schema.mjs';
import { buildIndex } from '../../scripts/build-content-index.mjs';

const templateDir = path.dirname(fileURLToPath(import.meta.url));
const hasCopier = spawnSync('copier', ['--version'], { stdio: 'ignore' }).status === 0;

describe('work copier template', () => {
  it('offers exactly the schema categories, in order', () => {
    const config = parse(readFileSync(path.join(templateDir, 'copier.yml'), 'utf8'));
    expect(Object.values(config.category.choices)).toEqual(CATEGORIES.map((c) => c.key));
    expect(Object.keys(config.category.choices)).toEqual(CATEGORIES.map((c) => c.label));
  });

  describe.skipIf(!hasCopier)('generation', () => {
    let siteRoot;
    beforeEach(() => {
      siteRoot = mkdtempSync(path.join(os.tmpdir(), 'copier-'));
    });
    afterEach(() => rmSync(siteRoot, { recursive: true, force: true }));

    const run = (data) => {
      const args = ['copy', '--defaults', '--quiet', templateDir, path.join(siteRoot, 'content/work')];
      for (const [k, v] of Object.entries(data)) args.push('-d', `${k}=${v}`);
      return spawnSync('copier', args, { encoding: 'utf8' });
    };
    const base = {
      title: 'Salt & "Sea"',
      year: '2025',
      runtime: '12 min',
      logline: 'It’s a film.',
      category: 'short',
    };
    const touch = (slug, files) => {
      for (const f of files) {
        const p = path.join(siteRoot, 'content/work', slug, f);
        mkdirSync(path.dirname(p), { recursive: true });
        writeFileSync(p, 'x');
      }
    };

    it('produces a project the schema accepts once the listed files are added', () => {
      const r = run({ ...base, stills: 2, video_kind: 'file' });
      expect(r.status, r.stderr).toBe(0);
      touch('salt-sea', ['hero.jpg', 'stills/01.jpg', 'stills/02.jpg', 'film.mp4', 'poster.jpg']);
      const { projects } = buildIndex({ siteRoot, check: true });
      expect(projects[0]).toMatchObject({ slug: 'salt-sea', title: 'Salt & "Sea"', category: 'short' });
      expect(projects[0].stills).toHaveLength(2);
    });

    it('supports an embed and no stills', () => {
      const r = run({ ...base, stills: 0, video_kind: 'embed', video_url: 'https://player.vimeo.com/video/1' });
      expect(r.status, r.stderr).toBe(0);
      touch('salt-sea', ['hero.jpg']);
      const { projects } = buildIndex({ siteRoot, check: true });
      expect(projects[0].videos[0].url).toBe('https://player.vimeo.com/video/1');
    });

    it('rejects an embed URL on an unknown host', () => {
      const r = run({ ...base, video_kind: 'embed', video_url: 'https://evil.example/v' });
      expect(r.status).not.toBe(0);
    });
  });
});
