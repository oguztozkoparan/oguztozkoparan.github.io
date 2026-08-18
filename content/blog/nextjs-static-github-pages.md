---
title: "Shipping a static Next.js site to GitHub Pages"
description: "output: 'export', a CNAME file and one GitHub Actions workflow — everything needed to host a modern Next.js app for free on your own domain."
date: "2026-08-17"
tags: ["Next.js", "GitHub Pages", "CI/CD"]
---

This site is a fully static Next.js app served by GitHub Pages on a custom domain. No servers, no fees, no cold starts. The setup is smaller than you'd think.

## 1. Static export

```js
// next.config.mjs
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
};
```

`next build` now writes plain HTML/CSS/JS to `out/`. Everything dynamic must happen at build time — `generateStaticParams` for dynamic routes, client components for interactivity.

## 2. Custom domain

Two pieces:

- `public/CNAME` containing `oguztozkoparan.com` — it gets copied into `out/` on every build, so Pages keeps the domain binding.
- An apex `A`/`ALIAS` record at the DNS provider pointing at GitHub Pages.

Because the site lives at the domain root, you don't need `basePath` or `assetPrefix` at all.

## 3. The workflow

```yaml
on:
  push:
    branches: [master]
jobs:
  build:
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm install && npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./out }
  deploy:
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
```

Push to `master`, wait a minute, done.

## Gotchas

- **Fonts**: `next/font/google` downloads fonts at build time, so CI needs network access (it has it) and your pages ship zero layout shift.
- **Sitemap and robots**: `app/sitemap.ts` and `app/robots.ts` work with static export as long as you mark them `force-static`.
- **404s**: Pages serves `404.html` automatically — Next generates it for you.
