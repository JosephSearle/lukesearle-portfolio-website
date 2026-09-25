import { z } from 'zod';

/** Filter categories. Order here is the order of the filter tabs. */
export const CATEGORIES = [
  { key: 'feature', label: 'Features' },
  { key: 'short', label: 'Shorts' },
  { key: 'commercial', label: 'Commercials' },
  { key: 'music', label: 'Music videos' },
  { key: 'dev', label: 'In development' },
];

export const CATEGORY_KEYS = /** @type {[string, ...string[]]} */ (CATEGORIES.map((c) => c.key));

export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg'];
export const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov'];
export const VIDEO_EMBED_HOSTS = [
  'player.vimeo.com',
  'www.youtube-nocookie.com',
  'www.youtube.com',
];

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const extOf = (p) => {
  const i = p.lastIndexOf('.');
  return i === -1 ? '' : p.slice(i).toLowerCase();
};

/** A file inside the project's own folder: relative, no "..", no URL scheme. */
const relativePath = z
  .string()
  .min(1)
  .refine((p) => !p.startsWith('/') && !p.includes('..') && !p.includes(':') && !p.includes('\\'), {
    message: 'must be a relative path inside the project folder (no "/", "..", "\\" or ":")',
  });

const imagePath = relativePath.refine((p) => IMAGE_EXTENSIONS.includes(extOf(p)), {
  message: `must be an image (${IMAGE_EXTENSIONS.join(', ')})`,
});

const videoPath = relativePath.refine((p) => VIDEO_EXTENSIONS.includes(extOf(p)), {
  message: `must be a video (${VIDEO_EXTENSIONS.join(', ')})`,
});

const image = z
  .object({
    src: imagePath,
    alt: z.string().min(1, 'alt text is required'),
  })
  .strict();

const embedUrl = z
  .string()
  .url()
  .refine(
    (u) => {
      try {
        const { protocol, hostname } = new URL(u);
        return protocol === 'https:' && VIDEO_EMBED_HOSTS.includes(hostname);
      } catch {
        return false;
      }
    },
    { message: `must be an https embed URL on: ${VIDEO_EMBED_HOSTS.join(', ')}` },
  );

const video = z
  .object({
    title: z.string().min(1).optional(),
    src: videoPath.optional(),
    url: embedUrl.optional(),
    poster: imagePath.optional(),
  })
  .strict()
  .refine((v) => (v.src === undefined) !== (v.url === undefined), {
    message: 'set exactly one of "src" (local file) or "url" (embed)',
  });

export const projectSchema = z
  .object({
    title: z.string().min(1),
    category: z.enum(CATEGORY_KEYS),
    year: z.string().regex(/^\d{4}$/, 'must be a 4-digit year, e.g. "2025"'),
    runtime: z.string().min(1),
    role: z.string().min(1),
    status: z.string().min(1),
    logline: z.string().min(1),
    hero: image,
    stills: z.array(image).default([]),
    videos: z.array(video).default([]),
  })
  .strict();

/** All local file references in a parsed project, for existence checks and copying. */
export function referencedFiles(project) {
  const files = [project.hero.src, ...project.stills.map((s) => s.src)];
  for (const v of project.videos) {
    if (v.src) files.push(v.src);
    if (v.poster) files.push(v.poster);
  }
  return [...new Set(files)];
}
