---
title: "Building a scroll-scrubbed video hero with GSAP and Next.js"
description: "How I turned an AI-generated video into a 96-frame WebP sequence and choreographed it with ScrollTrigger — pin, scrub, clip-path and a canvas wipe."
date: "2026-08-18"
tags: ["GSAP", "Next.js", "Canvas"]
---

The hero of this site doesn't autoplay a video — it *scrubs* one. As you scroll, the camera pulls back through a pixel-art structure frame by frame, perfectly in sync with your thumb. Here's the whole pipeline.

## Why frames instead of `<video>`

Seeking a `<video>` element from scroll events is unreliable: keyframe intervals make `currentTime` jumps stutter, and mobile Safari throttles seeking hard. The classic award-site trick is an **image sequence on a canvas**:

- Extract N frames from the video
- Preload them as `Image` objects
- Draw the right frame on scroll

```ts
const seq = { frame: 0 };

gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: "top top",
    end: "+=320%",
    pin: true,
    scrub: 1,
  },
}).to(seq, {
  frame: FRAME_COUNT - 1,
  ease: "none",
  onUpdate: draw, // canvas drawImage with cover-fit math
});
```

`scrub: 1` gives the animation a one-second catch-up, which makes wheel input feel weighted instead of jittery.

## The frame pipeline

The source is a 12-second, 1080p AI-generated video. From there:

```bash
ffmpeg -i hero.mp4 -vf "select='not(mod(n,3))',scale=1280:720" \
  -vsync vfr -frames:v 96 frames/frame-%03d.png
cwebp -q 66 frame-001.png -o frame-001.webp
```

96 frames at 1280×720, WebP quality 66 — about 3.4&nbsp;MB total. Dark, foggy footage compresses beautifully.

## Layering the choreography

The video is only the floor. On top of it, one master timeline drives:

1. A **clip-path window** that expands from a rounded inset to full-bleed
2. **Code lines** that stagger in from the left like a matrix pass
3. Two **glass panels** that split the screen — web engineering on the left, game development on the right
4. A **canvas wipe** that slides up and hands you the featured project card

Every layer is just a `.to()` positioned on the same 0→1 progress axis, so everything stays in sync no matter how fast you scroll — forwards or backwards.

## Small details that matter

- **Idle loop**: before the first scroll, the sequence ping-pongs through the first 8 frames so the page never feels frozen.
- **`prefers-reduced-motion`**: the pin never gets created; visitors get a static composition.
- **DPR cap**: the canvas renders at `min(devicePixelRatio, 1.5)` — retina sharpness without 4x fill cost.
