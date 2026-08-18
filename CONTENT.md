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
| `hobbies` | The "After Dark" hobbies section — see below |
| `heroNarrative` | Hero: sub-header, code lines, Web Engine / Game Forge panel items, finale card |
| `marqueeItems` | The purple marquee band items |

### Editing the hobbies section ("04 / Side quests")

`hobbies` in `lib/data.ts` drives the whole section:

- `label`, `headingSolid` + `headingOutline` (the outline word renders with a crimson stroke), `intro`, `outro`.
- `relics` — the three artifact cards. Each has a `title`, `description`, portrait
  `image` (~3:4, in `public/images/hobbies/`), `alt` text, a small `tag` verb,
  a roman `numeral`, two flavor `stats` and a `whisper` (the soulslike
  "player message" at the card foot). The card icon is picked by `id` in
  `components/Hobbies.tsx` (`RELIC_ICONS` map — lucide icons).
- `quote` — the closing display quote (`solid` + `outline` lines), its `meta`
  caption and the panorama backdrop `image`.

Card artwork prompts followed the site's generation style block but leaned
painterly instead of isometric pixel art (same obsidian/crimson/violet palette):

> Cinematic dark fantasy painting, epic vertical composition: [SUBJECT].
> Deep obsidian background with volumetric fog, cold crimson ember light,
> eerie purple and faint neon cyan rim lighting, micro particles,
> ultra-precise painterly detail, no readable text.

The crimson accent used here is the `--color-ember` token in `app/globals.css`.

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

## 6. Music & sounds — `lib/audio.ts`

Sound lives in the navbar (SOUND). All audio is **off by default** — user choices persist in localStorage (`ot-sfx`, `ot-volume`, `ot-track`). The quick dropdown lists tracks and toggles interface sounds; "Full player" opens the detailed modal with search, track list, transport (prev/play/next) and a volume slider. UI click/hover sounds are procedural (Web Audio).

**To use real music**: drop files into `public/music/` and replace (or extend) the `tracks` array in `lib/audio.ts`:

```ts
export const tracks: Track[] = [
  { id: "my-song", title: "My Song", type: "file", src: "/music/my-song.mp3" },
  // keep or delete the procedural ones:
  { id: "void-drift", title: "Void Drift", type: "procedural", start: startVoidDrift },
];
```

`type: "file"` entries loop automatically and get the same fade-in/out as procedural ones. Titles show up in the player; the ⏭ button cycles through whatever is in the array.

## 7. Hobbies shelf — "After Dark"

The hobbies section (04) is a horizontal snap-scroll shelf — it never overflows the layout, no matter how many hobbies you add. To add one:

1. Append an object to `hobbies.relics` in `lib/data.ts`:

```ts
{
  id: "music",                    // unique; add an icon for it in components/Hobbies.tsx RELIC_ICONS (falls back to a sparkle)
  numeral: "IV",                  // card corner numeral
  tag: "Music",                   // explicit hobby tag, top-left of the card
  kicker: "What I listen to",     // plain-language line above the title
  title: "Doom Synthwave",        // display title
  description: "One or two evocative sentences.",
  image: "/images/hobbies/music.webp",  // 3:4 portrait in public/images/hobbies/
  alt: "Describe the artwork",
  stats: [ { k: "Hours", v: "Too many" }, { k: "Mood", v: "Obsidian" } ],
  whisper: "turn it up",          // the soulslike player-message at the card foot
  lore: "Two or three first-person sentences shown on the card's BACK when it's clicked (tarot flip).",
}
```

2. Drop a ~3:4 portrait WebP into `public/images/hobbies/` (generation style: the dark-fantasy prompt block below, `cwebp -resize 900 0 -q 76`). Cards get the torchlight hover automatically.

Prompt style used for the current artwork: *"Cinematic dark fantasy [illustration/pixel art], portrait composition: [SUBJECT — generic archetypes only, no trademarked characters]. Deep obsidian blacks, cold crimson rim light, faint violet mist, epic grim mood, no readable text."*

## 8. Cursors

The cursor set is **original HiDPI vector art drawn for this site** (16 cursors, standard 24px size, dark body + white outline + violet accents — no third-party assets, so no licensing concerns). Each cursor is an SVG data URI in `app/globals.css` (rasterized by the browser at the display's pixel ratio, so it's crisp on retina) with a 24px PNG fallback and a CSS-keyword last resort. Role map: arrow = default, hand = links/buttons, pen = mailto links, I-beam = inputs (thin variant on blog prose), help = `[title]` elements, ring-slash = disabled controls, spinner = preloader, move = the horizontal shelves, dropper = hero artwork layer, violet arrow = sound-track rows, plus `.cursor-ew/ns/nwse/nesw` resize utilities. To tweak a design: edit its SVG in `scripts/cursors/gen_modern.py`, run it, rasterize fallbacks, then `python3 scripts/cursors/patch_css_modern.py` (a legacy pixel-art generator also lives in `scripts/cursors/gen.py`).

## 9. Theme

Colors and fonts are Tailwind tokens in `app/globals.css` under `@theme`. The single accent color is `--color-acid` (currently violet `#a78bfa`) — change it once and the marquee, buttons, glows and SVG art (`components/ProjectVisual.tsx` `ACID` const) follow.

## 10. Interactions & easter eggs

- **Achievements** — titles/descriptions/icons live in `lib/achievements.ts` (not `lib/data.ts`). Unlocks persist in localStorage `ot-achievements`. Anything on the site can award one by dispatching `window.dispatchEvent(new CustomEvent("ot:achievement", { detail: { id } }))`.
- **Command palette** — ⌘K / Ctrl+K (or the ⌘K chip in the navbar). Commands are defined in `components/CommandPalette.tsx`; it also lists achievement progress.
- **CRT mode** — the Konami code (↑↑↓↓←→←→BA) or the palette's "Toggle CRT mode" turns on a site-wide scanline overlay; persists in localStorage `ot-crt`.
- **404 boss fight** — the "Sector Guardian" on the 404 page; copy lives in `components/GuardianFight.tsx`.
- **Hobby card backs** — the tarot-flip lore texts are the `lore` field in §7.
- **Spectrum strip** — the bottom-edge visualizer appears automatically while music plays; nothing to configure.

## Build & deploy

```bash
npm run dev     # local dev
npm run build   # static export to out/
```

Merge to `master` and push — GitHub Actions builds and deploys to GitHub Pages automatically.
