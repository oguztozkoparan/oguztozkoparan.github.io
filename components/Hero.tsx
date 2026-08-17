"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";
import { onPreloaderDone } from "@/lib/preloader";
import { heroNarrative, site } from "@/lib/data";
import ProjectVisual from "@/components/ProjectVisual";

const FRAME_COUNT = 96;
const frameSrc = (i: number) =>
  `/hero-seq/frame-${String(i + 1).padStart(3, "0")}.webp`;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bigWordRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const canvas = canvasRef.current;
      const bigWord = bigWordRef.current;
      if (!section || !canvas || !bigWord) return;

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

      const brand = document.getElementById("site-brand");
      const words = gsap.utils.toArray<HTMLElement>("[data-hero-word]");
      const metaEls = section.querySelectorAll("[data-hero-meta]");
      const card = cardRef.current;

      if (reduced) {
        // static: brand + card visible, no pin, no morph
        gsap.set(bigWord, { autoAlpha: 0.1 });
        gsap.set(card, { autoAlpha: 1 });
        if (brand) gsap.set(brand, { autoAlpha: 1 });
        return () => window.removeEventListener("resize", onResize);
      }

      // idle loop of the "raw data" opening while the user hasn't scrolled yet
      const idle = gsap.fromTo(
        seq,
        { frame: 0 },
        {
          frame: 7,
          duration: 1.8,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          onUpdate: draw,
          paused: true,
        }
      );

      gsap.set(card, { autoAlpha: 0 });
      gsap.set(words, { autoAlpha: 0, y: 60 });
      if (brand) gsap.set(brand, { autoAlpha: 0 });

      // morph target: big word's top-left lands on the header brand,
      // then crossfades into the real brand element
      let r0 = bigWord.getBoundingClientRect();
      let rb = brand?.getBoundingClientRect() ?? r0;
      gsap.set(bigWord, { transformOrigin: "left top" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=280%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => {
            r0 = bigWord.getBoundingClientRect();
            rb = brand?.getBoundingClientRect() ?? r0;
          },
          onUpdate: (self) => {
            if (self.progress < 0.003) idle.play();
            else idle.pause();
          },
        },
      });

      // 0 → 1: video scrub over the whole pin
      tl.to(
        seq,
        { frame: FRAME_COUNT - 1, ease: "none", duration: 1, onUpdate: draw },
        0
      )
        // bottom meta fades away immediately
        .to(metaEls, { autoAlpha: 0, y: 20, duration: 0.08 }, 0)
        // 1. DÜŞÜNCE. shrinks, sharpens and flies onto the header brand…
        .to(
          bigWord,
          {
            x: () => rb.left - r0.left,
            y: () => rb.top - r0.top,
            scale: () => rb.height / Math.max(r0.height, 1),
            opacity: 1,
            ease: "power1.inOut",
            duration: 0.3,
          },
          0.02
        )
        // …and becomes the name
        .to(bigWord, { autoAlpha: 0, duration: 0.04 }, 0.3);
      if (brand) tl.to(brand, { autoAlpha: 1, duration: 0.05 }, 0.31);

      // 2. Analiz. / Yapı. / Gerçeklik. stagger in and out with the video
      const slots = [0.38, 0.52, 0.66];
      words.forEach((word, i) => {
        tl.to(word, { autoAlpha: 1, y: 0, duration: 0.07, ease: "power2.out" }, slots[i])
          .to(word, { autoAlpha: 0, y: -50, duration: 0.07, ease: "power2.in" }, slots[i] + 0.1);
      });

      // 3. finale: the project card assembles out of the interface eruption
      tl.fromTo(
        card,
        { autoAlpha: 0, y: 80, scale: 0.85, rotateX: 14 },
        { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, duration: 0.18, ease: "power2.out" },
        0.8
      );

      // intro after the preloader: the big word emerges at opacity .1
      // (no SplitText mask here — it would clip Turkish diacritics like Ü/Ş)
      gsap.set(bigWord, { autoAlpha: 0 });
      Promise.all([document.fonts.ready, onPreloaderDone()]).then(() => {
        gsap
          .timeline()
          .fromTo(
            bigWord,
            { autoAlpha: 0, y: 60, letterSpacing: "0.08em" },
            {
              autoAlpha: 0.1,
              y: 0,
              letterSpacing: "-0.01em",
              duration: 1.4,
              ease: "power3.out",
            }
          )
          .to(
            metaEls,
            { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" },
            0.6
          );
        ScrollTrigger.refresh();
      });
      gsap.set(metaEls, { autoAlpha: 0, y: 16 });

      return () => window.removeEventListener("resize", onResize);
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
      {/* legibility vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,15,17,0.25)_0%,rgba(14,15,17,0.78)_100%)]"
      />

      {/* 1. the thought */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <h1
          ref={bigWordRef}
          className="display text-[16vw] text-ink opacity-10 will-change-transform"
        >
          {heroNarrative.bigWord}
        </h1>
      </div>

      {/* 2. the layers */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[22%] flex flex-col items-center">
        {heroNarrative.words.map((word) => (
          <span
            key={word}
            data-hero-word
            className="display absolute text-5xl text-ink md:text-7xl"
          >
            {word}
          </span>
        ))}
      </div>

      {/* 3. the finale card */}
      <div className="absolute inset-0 flex items-center justify-center [perspective:1200px]">
        <div
          ref={cardRef}
          className="w-[86vw] max-w-md overflow-hidden rounded-2xl border border-line bg-card/80 opacity-0 shadow-2xl shadow-acid/10 backdrop-blur-md"
        >
          <div className="aspect-[3/2]">
            <ProjectVisual id="portfolio" />
          </div>
          <div className="flex flex-col gap-4 border-t border-line p-6">
            <p className="label text-dim">{heroNarrative.card.label}</p>
            <h2 className="display text-3xl text-ink">
              {heroNarrative.card.title}
            </h2>
            <a
              href={heroNarrative.card.href}
              className="label mt-2 w-fit rounded-full bg-acid px-5 py-3 font-bold text-[#0e0f11] transition-transform duration-200 hover:scale-105"
            >
              {heroNarrative.card.cta} ↓
            </a>
          </div>
        </div>
      </div>

      {/* bottom meta */}
      <div className="absolute inset-x-6 bottom-8 flex items-end justify-between gap-8 md:inset-x-10">
        <p data-hero-meta className="label flex items-center gap-3 text-dim">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-acid" />
          <span className="whitespace-nowrap">Scroll to explore</span>
        </p>
        <p data-hero-meta className="label text-right text-dim">
          {site.role} — {site.location}
        </p>
      </div>
    </section>
  );
}
