# Add a piece of work (local video, Vimeo or YouTube)

**Type:** runbook. Follow it top to bottom.
**Audience:** whoever maintains the site's content. You do not need to know how the site is built, but you do need to be comfortable with a terminal and Git.
**Where you'll find this:** linked from the repo `README.md` and from `site/content/README.md`.

## When to use this

You want a new film, commercial, music video or in-development project to appear on the site, under one of the filters: Features, Shorts, Commercials, Music videos, In development.

Pick **one** way to show the video:

| Format | Use it when | Where the video lives |
|---|---|---|
| **A. Local file** | You own the final file and want it hosted with the site | In this repo (Git LFS), served from the site |
| **B. Vimeo** | The film is already on Vimeo | On Vimeo; the site embeds it |
| **C. YouTube** | The film is already on YouTube | On YouTube; the site embeds it |

Every project also needs a **hero image** (and optionally still images), whichever format you choose.

## Prerequisites (one-time setup)

Check each of these before starting. If one fails, fix it first.

1. **Repo and Node.** You have the repo cloned and `cd site && npm ci` has been run. Check: `node -v` prints v20 or newer.
2. **Copier.** Check: `copier --version` prints a version. If not: `pipx install copier` (or `brew install copier`).
3. **Git LFS** (format A only). Check: `git lfs version` prints a version. Then run `git lfs install` once.
4. **ffmpeg** (format A only, to compress video and make a poster). Check: `ffmpeg -version`. If not: `brew install ffmpeg`.
5. **Access.** You can push a branch and open a pull request on the GitHub repo. To make the site live you also need the repo to have the `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` secrets set (ask the repo admin).

## Steps that are the same for all three formats

### 1. Start a branch

```sh
git checkout main && git pull
git checkout -b content/<slug>        # e.g. content/paper-houses
```

### 2. Prepare the images

- **Hero image** (required): a still from the film, ideally wide (16:9 or wider). It is the picture on the work grid and the top of the project page.
- **Still images** (optional): as many as you like, roughly 16:9.
- Allowed types: `.jpg .jpeg .png .webp .avif .svg`. Keep each under about 500 KB (export as JPG at ~2000px wide).
- Write a short alt text for each image ("A woman stands at a harbour wall at dawn"). Alt text is required.

### 3. Generate the project folder

From `site/`:

```sh
npm run new:project
```

Answer the prompts:

| Prompt | What to enter |
|---|---|
| Title | The film's title |
| Slug | Accept the suggestion (lowercase, dashes). It becomes the folder name and the URL `/work/<slug>` |
| Category | Pick one; this decides which filter it appears under |
| Year | 4 digits, e.g. `2025` |
| Runtime | e.g. `14 min`, `60 sec`, `Feature` |
| Role | e.g. `Director` or `Writer / Director` |
| Status | e.g. `Completed`, `Released`, `Festival run`, `In development` |
| Logline | One or two sentences |
| Number of stills | How many extra stills you'll add (0 to 20) |
| How will the film be shown? | Choose the format: **Local video file**, **Vimeo or YouTube embed**, or **No video yet** |
| Embed URL | Only asked for the embed option. See format B or C below |

Expected result: it prints `Created content/work/<slug>/project.json` and a list of files to add.

### 4. Add the images

Copy your hero to `site/content/work/<slug>/hero.jpg` and stills to `site/content/work/<slug>/stills/01.jpg`, `02.jpg` and so on, matching the list the command printed. If you use a different name or extension (for example `hero.png`), open `project.json` and change the matching `"src"` value, so it names the file exactly.

## Format A: local video file

1. **Compress the video** to a web-friendly MP4 (H.264 + AAC). From the folder containing your source file:

   ```sh
   ffmpeg -i source.mov -c:v libx264 -crf 23 -preset slow -c:a aac -movflags +faststart film.mp4
   ```

   Expected: a `film.mp4` that plays in a browser. Check its size with `ls -lh film.mp4`. Aim for well under 500 MB; ask the repo admin first if it's larger, because Git LFS storage is limited.
2. **Make a poster image** (the frame shown before play). Pick a time in seconds after `-ss`:

   ```sh
   ffmpeg -i film.mp4 -ss 5 -frames:v 1 poster.jpg
   ```

3. **Put both in the project folder:** `site/content/work/<slug>/film.mp4` and `site/content/work/<slug>/poster.jpg`.
4. **Check it is tracked by LFS.** After you `git add` in the Publish step, `git lfs ls-files` must list `film.mp4`. If it is missing, `git lfs install` was not run; run it and `git add` again.

Allowed video types: `.mp4 .webm .mov`.

## Format B: Vimeo

1. Open the video on Vimeo. In **Settings, Privacy**, set **Where can this be embedded?** to allow embedding (Anywhere, or add this site's domain). Vimeo's privacy options change over time; if embedding is blocked, check that the video's privacy setting allows embedding on this site's domain.
2. Get the **player URL**: it is `https://player.vimeo.com/video/<number>`, where `<number>` is the digits in the video's normal address (`vimeo.com/123456789` gives `https://player.vimeo.com/video/123456789`). For an unlisted video the address has a code (`vimeo.com/123456789/abcdef1234`): use `https://player.vimeo.com/video/123456789?h=abcdef1234`.
3. When `npm run new:project` asks for the **Embed URL**, paste that player URL.

Do **not** paste the normal `vimeo.com/...` page address; the prompt will reject it.

## Format C: YouTube

1. Open the video on YouTube. Make sure it is **Public** or **Unlisted** and that **Allow embedding** is on (YouTube Studio, the video's details, Show more).
2. Get the **embed URL**: it is `https://www.youtube.com/embed/<video-id>`, where `<video-id>` is the code after `v=` in the normal address (`youtube.com/watch?v=abc123XYZ_-` gives `https://www.youtube.com/embed/abc123XYZ_-`). The privacy-enhanced host `https://www.youtube-nocookie.com/embed/<video-id>` also works.
3. When `npm run new:project` asks for the **Embed URL**, paste that embed URL.

**Common mistake:** pasting the normal `youtube.com/watch?v=...` address. It looks valid to the site's checks, but the video will show as a blank or refused frame in the browser. Always use the `/embed/` form.

## Steps that are the same for all three formats

### 5. Check the content

From `site/`:

```sh
npm run validate:content
```

Expected: `Validated N project(s).` and exit code 0.

If it fails, it prints a list like:

```
- "paper-houses/project.json": referenced file "hero.jpg" does not exist
```

Read each line: it names the project and what is wrong (a missing file, an unrecognised field, a wrong category, a bad embed URL). Fix that in `site/content/work/<slug>/` and run it again until it passes. Nothing else will build until it passes, and that includes `npm run dev`.

### 6. Look at it locally

```sh
npm run dev
```

Open the address it prints (usually http://localhost:3000; if that port is busy it prints another). Check: the project appears on the work grid, the right filter tab shows it, the project page shows the hero and stills, and the video plays (local file, Vimeo or YouTube). Stop the server with Ctrl+C.

### 7. Publish

From the repo root:

```sh
git add site/content/work/<slug>
git status                # confirm only your project folder is listed
git commit -m "content: add <title>"
git push -u origin content/<slug>
```

Open a pull request into `main` on GitHub. Wait for the **CI** checks to go green (lint, typecheck, unit tests, content validation, end-to-end). When merged into `main`, the site is deployed by Vercel.

Expected: within a few minutes of the merge, the project is live under its filter.

## If it doesn't work

| Problem | Try this |
|---|---|
| `npm run new:project` says Copier is missing | Install it (`pipx install copier`) and run again |
| `Content validation failed` | Read the list; fix each named file or field; re-run `npm run validate:content` |
| An image or video is missing from the built site | Confirm the file name in `project.json` matches the real file exactly, including capitals and extension |
| Vimeo or YouTube shows a blank or "refused to connect" frame | Embedding is disabled for that video, or the URL is not the embed form. Fix in the platform's settings, or use the correct URL in `project.json` |
| `git lfs ls-files` doesn't list your video | Run `git lfs install`, then `git add` the video again |
| CI fails on the pull request | Open the failed check on GitHub and read the message. If a content check failed, you will see the same list as in step 5. If the failure is not about content, hand the link to the repo admin |
| Site did not update after merge | Check the latest deployment in Vercel. If it did not run or failed, escalate to the repo admin |

**Escalate to:** the repo admin (whoever manages GitHub settings and Vercel for this site). Give them the pull request link and the exact error text.

## Editing or removing work later

- **Edit:** change `site/content/work/<slug>/project.json` (or replace a file), run `npm run validate:content`, then repeat step 7.
- **Remove:** delete the folder `site/content/work/<slug>/`, run `npm run validate:content`, then repeat step 7. The URL `/work/<slug>` will stop existing.
- **Switch a project between formats** (for example local file to Vimeo): in `project.json`, change the entry in `videos` to `{ "title": "...", "url": "<embed URL>" }` and delete `film.mp4` and `poster.jpg`. An entry is either a local `"src"` or an embed `"url"`, never both.
- **More than one video** (for example a trailer on YouTube and the film as a local file): add more entries to the `videos` list in `project.json`, mixing formats freely. The Copier prompts only create the first one.

## Related links

- Field rules and allowed values: `site/lib/content-schema.mjs`
- The prompts used in step 3: `site/templates/work/copier.yml`
- Short version of this process: `site/content/README.md`
- CI: `.github/workflows/ci.yml`
