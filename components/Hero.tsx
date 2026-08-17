"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsapConfig";
import { onPreloaderDone } from "@/lib/preloader";

const FRAME_COUNT = 48;
const frameSrc = (i: number) =>
  `/hero-seq/frame-${String(i + 1).padStart(3, "0")}.webp`;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const name = nameRef.current;
      const canvas = canvasRef.current;
      if (!section || !name || !canvas) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ---- frame-by-frame sequence ----
      const ctx = canvas.getContext("2d");
      const images: HTMLImageElement[] = [];
      const seq = { frame: 0 };

      const sizeCanvas = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = section.clientWidth * dpr;
        canvas.height = section.clientHeight * dpr;
      };

      const draw = () => {
        const img = images[Math.round(seq.frame)];
        if (!ctx || !img || !img.complete || !img.naturalWidth) return;
        const cw = canvas.width;
        const ch = canvas.height;
        const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
        const dw = img.naturalWidth * scale;
        const dh = img.naturalHeight * scale;
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      };

      sizeCanvas();

      const frameTotal = reduced ? 1 : FRAME_COUNT;
      for (let i = 0; i < frameTotal; i++) {
        const img = new Image();
        img.src = frameSrc(i);
        if (i === 0) img.onload = draw;
        images.push(img);
      }

      const onResize = () => {
        sizeCanvas();
        draw();
      };
      window.addEventListener("resize", onResize);

      const metaEls = section.querySelectorAll("[data-hero-meta]");

      if (!reduced) {
        // pin the hero and scrub the sequence + a slow content exit
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=130%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });
        tl.to(seq, {
          frame: FRAME_COUNT - 1,
          ease: "none",
          onUpdate: draw,
          duration: 1,
        })
          .to(
            innerRef.current,
            { yPercent: -8, autoAlpha: 0, ease: "power1.in", duration: 0.45 },
            0.55
          );

        // ---- intro ----
        gsap.set(metaEls, { autoAlpha: 0, y: 16 });
        gsap.set(name, { autoAlpha: 0 });

        Promise.all([document.fonts.ready, onPreloaderDone()]).then(() => {
          const split = SplitText.create(name, {
            type: "chars",
            mask: "chars",
          });
          gsap.set(name, { autoAlpha: 1 });

          gsap
            .timeline()
            .from(split.chars, {
              yPercent: 110,
              duration: 1.1,
              stagger: 0.032,
              ease: "power4.out",
            })
            .to(
              metaEls,
              { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" },
              0.5
            )
            .to(
              roleRef.current,
              {
                duration: 1.4,
                scrambleText: {
                  text: "Software Engineer — Ankara, Türkiye",
                  chars: "▮▯01<>/*",
                  speed: 0.6,
                },
              },
              0.6
            );

          ScrollTrigger.refresh();
        });
      }

      return () => {
        window.removeEventListener("resize", onResize);
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      {/* scroll-scrubbed frame sequence */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      />
      {/* legibility overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-base/90 via-base/55 to-base/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-line"
      />

      <div
        ref={innerRef}
        className="relative flex grow flex-col justify-between px-6 pb-8 pt-28 md:px-10 md:pt-32"
      >
        <div className="flex items-start justify-between">
          <p data-hero-meta className="label text-dim">
            Portfolio — v3.0.0
          </p>
          <p data-hero-meta className="label hidden text-dim sm:block">
            Interfaces, motion &amp; interactive experiments
          </p>
        </div>

        <div className="my-auto py-10">
          <h1
            ref={nameRef}
            className="display text-[17.5vw] text-ink lg:text-[15.5vw]"
          >
            Oguz
            <br />
            <span className="text-acid">Tozkoparan</span>
          </h1>
          <p
            ref={roleRef}
            className="label mt-6 min-h-4 text-dim md:mt-8 md:text-sm"
          >
            Software Engineer — Ankara, Türkiye
          </p>
        </div>

        <div className="flex items-end justify-between gap-8">
          <p data-hero-meta className="label flex items-center gap-3 text-dim">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-acid" />
            <span className="whitespace-nowrap">Scroll to explore</span>
          </p>
          <p
            data-hero-meta
            className="max-w-xs text-right text-sm leading-relaxed text-dim md:max-w-sm"
          >
            Precision-built interfaces and motion — engineered with care in
            Ankara.
          </p>
        </div>
      </div>
    </section>
  );
}
