# oguztozkoparan.com

Personal portfolio of **Oguz Tozkoparan** — v3.0.0.

A single-page, motion-driven site: black canvas, acid-lime accents, oversized display type and scroll choreography.

## Stack

- [Next.js](https://nextjs.org) (App Router, static export)
- [Tailwind CSS v4](https://tailwindcss.com)
- [GSAP](https://gsap.com) — ScrollTrigger, SplitText, ScrambleText
- [Lenis](https://lenis.darkroom.engineering) — smooth scrolling

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Outputs a fully static site to `out/`.

## Deploy

Pushed to `master` → GitHub Actions builds and deploys to GitHub Pages with the custom domain `oguztozkoparan.com` (see `public/CNAME`).
