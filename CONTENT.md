# Content editing guide

Everything user-visible on this site is editable without touching components.

## 1. Site copy — `lib/data.ts`

One file holds all text and structure:

| Object | Controls |
|---|---|
| `site` | Name, role, location, public email, canonical URL |
| `socials` | Footer social cards (label, handle, href) |
| `about` | About intro/outro paragraphs, 3 fact tiles, about image |
| `projects` | Work cards — see below |
| `capabilities` | The 4 capability rows and their tag lists |
| `heroNarrative` | Hero: sub-header, code lines, Web Engine / Game Forge panel items, finale card |
| `marqueeItems` | The purple marquee band items |

### Adding / editing a project

```ts
{
  id: "my-project",              // unique; picks SVG fallback art in components/ProjectVisual.tsx
  image: "/images/my-project.webp", // optional — put the file in public/images/
  index: "05",                   // corner number
  title: "My Project",
  description: "One or two sentences.",
  status: "Live",                // small badge text
  tags: ["Next.js", "..."],
  href: "https://…",             // or null for no link
}
```

If `image` is omitted the card falls back to the built-in SVG artwork (add a new `if (id === "my-project")` block in `components/ProjectVisual.tsx` for custom SVG art).

## 2. Blog — `content/blog/*.md`

One markdown file per post. Filename = URL slug (`hello-world.md` → `/blog/hello-world`).

```markdown
---
title: "Post title"
description: "One-sentence summary (also used for SEO)."
date: "2026-08-18"
tags: ["GSAP", "Next.js"]
---

Markdown body. Headings, code fences, lists, links, images all work.
```

Posts are sorted by `date` (newest first). Reading time is computed automatically. The list page, sitemap and JSON-LD update on the next build — nothing else to do.

## 3. Hero video sequence — `public/hero-seq/`

The hero scrubs 96 WebP frames named `frame-001.webp` … `frame-096.webp`. To swap the footage:

```bash
# extract every 3rd frame from a 12s/24fps video → 96 frames
ffmpeg -i new-video.mp4 -vf "select='not(mod(n,3))',scale=1280:720" \
  -vsync vfr -frames:v 96 frames/frame-%03d.png
for f in frames/*.png; do cwebp -q 66 "$f" -o "public/hero-seq/$(basename "${f%.png}").webp"; done
```

If you change the frame count, update `FRAME_COUNT` in `components/Hero.tsx`.

## 4. Images — `public/images/`

Project covers and the about visual. Keep the aesthetic consistent (dark, isometric pixel-art, purple/cyan). The generation prompt style block that produced the current set:

> Cinematic dark fantasy meets sci-fi pixel art, 2D isometric composition: [SUBJECT]. Deep obsidian background with volumetric fog, cold crimson, eerie purple and neon cyan rim lighting, micro particles, ultra-precise technical aesthetic, no readable text.

Convert to WebP before committing: `cwebp -resize 1200 0 -q 78 in.png -o out.webp`

## 5. Retro apps — `/dos` and `/games`

The v2 DOS terminal and mini-games hub live on as full-screen pages (the site header hides itself there — they ship their own chrome).

- **Terminal content**: the virtual file system (RESUME.TXT, CONTACT.TXT, folders…) is defined inside `components/dos-terminal.tsx` — search for `RESUME.TXT` to edit file contents or add new virtual files.
- **Games**: each game is a self-contained component in `components/games/`. To add one, create the component, register it in `components/game-hub.tsx` (games array + switch).

## 6. Theme

Colors and fonts are Tailwind tokens in `app/globals.css` under `@theme`. The single accent color is `--color-acid` (currently violet `#a78bfa`) — change it once and the marquee, buttons, glows and SVG art (`components/ProjectVisual.tsx` `ACID` const) follow.

## Build & deploy

```bash
npm run dev     # local dev
npm run build   # static export to out/
```

Merge to `master` and push — GitHub Actions builds and deploys to GitHub Pages automatically.
