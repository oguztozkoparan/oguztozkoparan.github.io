---
title: "Designing with AI video: my Higgsfield workflow"
description: "Prompting cinematic footage, extracting frames, and art-directing a website around generated video — what worked and what didn't."
date: "2026-08-16"
tags: ["AI", "Higgsfield", "Design"]
---

The hero footage on this site — a crimson pixel rune pulling back into a voxel altar — was generated from a text prompt. Getting from "generate me something cool" to footage you can actually build a website on took a few iterations. Notes from the process.

## Write the prompt like a director, not a keyword list

What finally worked was structuring the prompt in four blocks — style, subject, lighting, camera:

> *Style:* cinematic dark fantasy meets sci-fi pixel art, high-contrast atmospheric rendering.
> *Subject:* an intricate 2D isometric structure emerging from pitch-black volumetric fog…
> *Lighting:* cold crimson, eerie purple, neon cyan rim lighting.
> *Camera:* a slow, continuous isometric pull-back, one single take, no cuts.

The two most load-bearing phrases for scroll-scrubbing: **"one single take, no cuts"** (a cut ruins a scrubbed timeline) and **"slow, deliberate camera"** (fast motion falls apart when frames are sampled at 8 fps).

## Match the palette to your design system, not the other way around

My first render used the colors from a reference brief — reds, blues, greens. It looked great in isolation and wrong under the site's violet UI. Regenerating with "deep violets, electric purple, indigo-blue" cost one more render and saved the whole composition. Decide your design tokens first; make the footage obey them.

## Frames beat video files

I never ship the MP4. The video becomes 96 WebP frames drawn onto a canvas:

- **Total control** — scroll position maps 1:1 to a frame index, forwards and backwards.
- **Smaller** — dark footage at WebP q66 lands around 3&nbsp;MB, less than the source video.
- **No autoplay policies** — a canvas is just pixels; nothing for mobile browsers to block.

## Keep the receipts

Every generation records its prompt and job ID next to the asset. When a section needs a matching visual later (project covers, about imagery), reusing the exact style block keeps the whole site coherent — the difference between "AI-generated assets" and an art-directed system.
