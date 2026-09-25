import { describe, expect, it } from 'vitest';
import { projectSchema } from './content-schema.mjs';

const valid = {
  title: 'Paper Houses',
  category: 'short',
  year: '2024',
  runtime: '14 min',
  role: 'Writer / Director',
  status: 'Completed',
  logline: 'Two brothers dismantle a house.',
  hero: { src: 'hero.jpg', alt: 'A house' },
};

const messages = (input) => {
  const r = projectSchema.safeParse(input);
  return r.success ? [] : r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
};

describe('projectSchema', () => {
  it('accepts a minimal project and defaults stills/videos', () => {
    const r = projectSchema.parse(valid);
    expect(r.stills).toEqual([]);
    expect(r.videos).toEqual([]);
  });

  it('rejects unknown keys and unknown categories', () => {
    expect(messages({ ...valid, extra: 1 }).join()).toMatch(/Unrecognized key/);
    expect(messages({ ...valid, category: 'documentary' })[0]).toMatch(/^category:/);
  });

  it('requires a 4-digit year and alt text', () => {
    expect(messages({ ...valid, year: '24' })[0]).toMatch(/4-digit/);
    expect(messages({ ...valid, hero: { src: 'a.jpg', alt: '' } })[0]).toMatch(/alt/);
  });

  it('rejects paths that escape the folder or have the wrong extension', () => {
    expect(messages({ ...valid, hero: { src: '../x.jpg', alt: 'x' } })[0]).toMatch(/relative/);
    expect(messages({ ...valid, hero: { src: 'a.mp4', alt: 'x' } })[0]).toMatch(/image/);
  });

  it('needs exactly one of src or url on a video', () => {
    const base = { ...valid };
    expect(messages({ ...base, videos: [{}] }).join()).toMatch(/exactly one/);
    expect(
      messages({
        ...base,
        videos: [{ src: 'a.mp4', url: 'https://player.vimeo.com/video/1' }],
      }).join(),
    ).toMatch(/exactly one/);
    expect(messages({ ...base, videos: [{ src: 'a.mp4' }] })).toEqual([]);
    expect(messages({ ...base, videos: [{ url: 'https://player.vimeo.com/video/1' }] })).toEqual(
      [],
    );
  });

  it('only allows https embeds on known hosts', () => {
    expect(messages({ ...valid, videos: [{ url: 'https://evil.example/v' }] }).join()).toMatch(
      /embed URL/,
    );
    expect(messages({ ...valid, videos: [{ url: 'http://player.vimeo.com/v' }] }).join()).toMatch(
      /embed URL/,
    );
  });
});
