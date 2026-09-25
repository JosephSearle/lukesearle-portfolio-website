# Adding work

Full step-by-step (local, Vimeo and YouTube): [docs/runbooks/add-work-content.md](../../docs/runbooks/add-work-content.md).

From `site/`:

```sh
npm run new:project
```

Answer the prompts (title, category, year, runtime, role, status, logline, how many stills, video type).
It creates `content/work/<slug>/project.json` and prints the exact files to add next. Drop them into that
folder, then check everything:

```sh
npm run validate:content
```

The filter a piece appears under is its **category**: Features, Shorts, Commercials, Music videos or
In development. `npm run dev` and `npm run build` validate automatically and list every problem.

- Images: `.jpg .jpeg .png .webp .avif .svg`. Videos: `.mp4 .webm .mov` (stored with Git LFS).
- A video is either a local file or a Vimeo/YouTube embed URL, never both.
- Every image needs alt text (the prompts fill in a sensible default; edit `project.json` to improve it).
- Rules live in `lib/content-schema.mjs`; the prompts live in `templates/work/copier.yml`.

Copier is a Python tool. Install once with `pipx install copier` (or `brew install copier`).
