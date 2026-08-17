"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsapConfig";
import { onPreloaderDone } from "@/lib/preloader";
import { heroNarrative, site } from "@/lib/data";

const FRAME_COUNT = 96;
const frameSrc = (i: number) =>
  `/hero-seq/frame-${String(i + 1).padStart(3, "0")}.webp`;

const CYAN = "#67e8f9";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const webRef = useRef<HTMLDivElement>(null);
  const forgeRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const canvas = canvasRef.current;
      const clip = clipRef.current;
      const name = nameRef.current;
      if (!section || !canvas || !clip || !name) return;

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
      const metaEls = section.querySelectorAll("[data-hero-meta]");
      const codeLines = gsap.utils.toArray<HTMLElement>("[data-hero-code]");
      const web = webRef.current;
      const forge = forgeRef.current;
      const wipe = wipeRef.current;
      const card = cardRef.current;

      if (reduced) {
        gsap.set([wipe], { autoAlpha: 0 });
        if (brand) gsap.set(brand, { autoAlpha: 1 });
        return () => window.removeEventListener("resize", onResize);
      }

      // idle loop of the foggy opening while the user hasn't scrolled yet
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

      // initial states
      gsap.set(clip, {
        clipPath: "inset(12% 18% 12% 18% round 20px)",
        willChange: "clip-path",
      });
      gsap.set(codeLines, { x: -70, autoAlpha: 0 });
      gsap.set(web, { xPercent: -130, autoAlpha: 0 });
      gsap.set(forge, { xPercent: 130, autoAlpha: 0 });
      gsap.set(wipe, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(card, { y: 50, autoAlpha: 0 });
      if (brand) gsap.set(brand, { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=320%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress < 0.003) idle.play();
            else idle.pause();
          },
        },
      });

      tl.to(
        seq,
        { frame: FRAME_COUNT - 1, ease: "none", duration: 1, onUpdate: draw },
        0
      )
        .to(metaEls, { autoAlpha: 0, y: 20, duration: 0.05 }, 0)

        // phase 1 — the unfolding grid
        .to(
          clip,
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            duration: 0.26,
            ease: "power1.inOut",
          },
          0.02
        )
        .to(
          centerRef.current,
          { scale: 0.9, autoAlpha: 0, y: -50, duration: 0.16, ease: "power1.in" },
          0.14
        )
        .to(
          codeLines,
          { x: 0, autoAlpha: 1, stagger: 0.018, duration: 0.09, ease: "power2.out" },
          0.26
        )
        .to(codeRef.current, { autoAlpha: 0, x: 50, duration: 0.08 }, 0.46)

        // phase 2 — web & game mechanics split
        .to(web, { xPercent: 0, autoAlpha: 1, duration: 0.13, ease: "power2.out" }, 0.52)
        .to(forge, { xPercent: 0, autoAlpha: 1, duration: 0.13, ease: "power2.out" }, 0.56)
        .to(
          "[data-web-item]",
          { autoAlpha: 1, y: 0, stagger: 0.012, duration: 0.05 },
          0.62
        )
        .to(
          "[data-forge-item]",
          { autoAlpha: 1, y: 0, stagger: 0.012, duration: 0.05 },
          0.66
        )
        .to([web, forge], { autoAlpha: 0, y: -40, duration: 0.08 }, 0.8)

        // final — smooth canvas wipe into the featured project
        .to(
          wipe,
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.14, ease: "power2.inOut" },
          0.84
        )
        .to(card, { y: 0, autoAlpha: 1, duration: 0.09, ease: "power2.out" }, 0.9);

      gsap.set("[data-web-item], [data-forge-item]", { autoAlpha: 0, y: 22 });
      if (brand) tl.to(brand, { autoAlpha: 1, duration: 0.06 }, 0.9);

      // intro after the preloader
      gsap.set([name, subRef.current], { autoAlpha: 0 });
      gsap.set(metaEls, { autoAlpha: 0, y: 16 });
      Promise.all([document.fonts.ready, onPreloaderDone()]).then(() => {
        const split = SplitText.create(name, { type: "chars", mask: "chars" });
        gsap.set(name, { autoAlpha: 1 });
        gsap
          .timeline()
          .from(split.chars, {
            yPercent: 110,
            duration: 1.0,
            stagger: 0.03,
            ease: "power4.out",
          })
          .set(subRef.current, { autoAlpha: 1 }, 0.55)
          .to(
            subRef.current,
            {
              duration: 1.2,
              scrambleText: {
                text: heroNarrative.sub,
                chars: "▮▯01<>/*",
                speed: 0.6,
              },
            },
            0.55
          )
          .to(
            metaEls,
            { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" },
            0.7
          );
        ScrollTrigger.refresh();
      });

      return () => window.removeEventListener("resize", onResize);
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      {/* clipped video window — expands on scroll */}
      <div ref={clipRef} className="absolute inset-0">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        />
        <div aria-hidden="true" className="crt absolute inset-0 opacity-40" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,15,17,0.12)_0%,rgba(14,15,17,0.72)_100%)]"
        />
      </div>

      {/* static state: name + sub */}
      <div
        ref={centerRef}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
      >
        <h1
          ref={nameRef}
          className="display text-[15vw] text-ink lg:text-[11.5vw]"
        >
          Oguz
          <br />
          Tozkoparan
        </h1>
        <p ref={subRef} className="label min-h-4 text-dim md:text-sm">
          {heroNarrative.sub}
        </p>
      </div>

      {/* phase 1: code & shader pass */}
      <div
        ref={codeRef}
        className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 md:left-10"
      >
        {heroNarrative.codeLines.map((line) => (
          <p
            key={line}
            data-hero-code
            className="whitespace-pre font-mono text-xs leading-6 text-[#67e8f9]/85 md:text-sm md:leading-7"
          >
            {line}
          </p>
        ))}
      </div>

      {/* phase 2: web engine (left) */}
      <div className="absolute left-1/2 top-[30%] w-[84vw] max-w-sm -translate-x-1/2 -translate-y-1/2 md:left-10 md:top-1/2 md:translate-x-0 lg:w-[30vw]">
        <div
          ref={webRef}
          className="rounded-2xl border border-acid/40 bg-panel/70 p-6 shadow-[0_0_50px_rgba(167,139,250,0.16)] backdrop-blur-md"
        >
          <p className="label text-dim">
            <span className="text-acid">01</span> / {heroNarrative.webEngine.title}
          </p>
          <ul className="mt-4 space-y-2">
            {heroNarrative.webEngine.items.map((item) => (
              <li
                key={item}
                data-web-item
                className="border-l border-acid/50 pl-3 text-sm text-ink/85"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* phase 2: game forge (right) */}
      <div className="absolute left-1/2 top-[70%] w-[84vw] max-w-sm -translate-x-1/2 -translate-y-1/2 md:left-auto md:right-10 md:top-1/2 md:translate-x-0 lg:w-[30vw]">
        <div
          ref={forgeRef}
          className="rounded-2xl border border-[#67e8f9]/40 bg-panel/70 p-6 shadow-[0_0_50px_rgba(103,232,249,0.14)] backdrop-blur-md"
        >
          <p className="label text-dim">
            <span style={{ color: CYAN }}>02</span> / {heroNarrative.gameForge.title}
          </p>
          <ul className="mt-4 space-y-2">
            {heroNarrative.gameForge.items.map((item) => (
              <li
                key={item}
                data-forge-item
                className="border-l border-[#67e8f9]/50 pl-3 text-sm text-ink/85"
              >
                {item}
              </li>
            ))}
          </ul>
          <svg
            viewBox="0 0 120 60"
            aria-hidden="true"
            className="mt-5 h-12 w-24"
          >
            {[
              [30, 28],
              [60, 14],
              [60, 42],
              [90, 28],
            ].map(([cx, cy], i) => (
              <g key={i} transform={`translate(${cx} ${cy})`}>
                <path
                  d="M 0 -10 L 14 -2 L 0 6 L -14 -2 Z"
                  fill={i === 1 ? CYAN : "none"}
                  stroke={i === 1 ? CYAN : "rgba(247,247,248,0.35)"}
                  strokeWidth="1"
                />
                <path
                  d="M -14 -2 L -14 8 L 0 16 L 0 6 Z"
                  fill="none"
                  stroke="rgba(247,247,248,0.25)"
                  strokeWidth="1"
                />
                <path
                  d="M 14 -2 L 14 8 L 0 16 L 0 6 Z"
                  fill="none"
                  stroke="rgba(247,247,248,0.25)"
                  strokeWidth="1"
                />
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* final: smooth canvas wipe into the featured project */}
      <div
        ref={wipeRef}
        className="absolute inset-0 z-10 flex items-center justify-center bg-[#101114]/95 backdrop-blur-sm [clip-path:inset(100%_0%_0%_0%)]"
      >
        <div
          ref={cardRef}
          className="w-[86vw] max-w-md overflow-hidden rounded-2xl border border-line bg-card shadow-2xl shadow-acid/10"
        >
          <div className="aspect-[3/2]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/portfolio.webp"
              alt="Featured project artwork"
              className="h-full w-full object-cover"
            />
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
