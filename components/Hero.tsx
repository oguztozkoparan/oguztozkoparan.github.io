"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ArrowDown } from "lucide-react";
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
  const particlesRef = useRef<HTMLCanvasElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const webRef = useRef<HTMLDivElement>(null);
  const forgeRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);

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

      // ---- soft drifting particles ----
      const pCanvas = particlesRef.current;
      const pCtx = pCanvas?.getContext("2d");
      type Particle = {
        x: number;
        y: number;
        r: number;
        speed: number;
        sway: number;
        phase: number;
        alpha: number;
        violet: boolean;
      };
      let particles: Particle[] = [];

      const sizeParticles = () => {
        if (!pCanvas) return;
        pCanvas.width = section.clientWidth;
        pCanvas.height = section.clientHeight;
        particles = Array.from({ length: 64 }, () => ({
          x: Math.random() * pCanvas.width,
          y: Math.random() * pCanvas.height,
          r: 0.6 + Math.random() * 1.7,
          speed: 8 + Math.random() * 22,
          sway: 0.2 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          alpha: 0.12 + Math.random() * 0.35,
          violet: Math.random() < 0.6,
        }));
      };

      const drawParticles = (time: number, delta: number) => {
        if (!pCanvas || !pCtx) return;
        const w = pCanvas.width;
        const h = pCanvas.height;
        pCtx.clearRect(0, 0, w, h);
        pCtx.globalCompositeOperation = "lighter";
        for (const p of particles) {
          p.y -= (p.speed * delta) / 1000;
          if (p.y < -4) {
            p.y = h + 4;
            p.x = Math.random() * w;
          }
          const x = p.x + Math.sin(time * p.sway + p.phase) * 18;
          const pulse = 0.75 + 0.25 * Math.sin(time * 0.8 + p.phase);
          pCtx.beginPath();
          pCtx.arc(x, p.y, p.r, 0, Math.PI * 2);
          pCtx.fillStyle = p.violet
            ? `rgba(167, 139, 250, ${p.alpha * pulse})`
            : `rgba(247, 247, 248, ${p.alpha * 0.7 * pulse})`;
          pCtx.fill();
        }
      };

      if (!reduced) {
        sizeParticles();
        gsap.ticker.add(drawParticles);
      }

      const onResize = () => {
        sizeCanvas();
        draw();
        if (!reduced) sizeParticles();
      };
      window.addEventListener("resize", onResize);

      const brand = document.getElementById("site-brand");
      const metaEls = section.querySelectorAll("[data-hero-meta]");
      const codeLines = gsap.utils.toArray<HTMLElement>("[data-hero-code]");
      const web = webRef.current;
      const forge = forgeRef.current;
      const wipe = wipeRef.current;
      const finaleLines = gsap.utils.toArray<HTMLElement>("[data-finale-line]");
      const finaleMeta = gsap.utils.toArray<HTMLElement>("[data-finale-meta]");

      if (reduced) {
        gsap.set([wipe], { autoAlpha: 0 });
        if (brand) gsap.set(brand, { autoAlpha: 1 });
        return () => {
          window.removeEventListener("resize", onResize);
        };
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
      gsap.set(finaleLines, { yPercent: 115 });
      gsap.set(finaleMeta, { autoAlpha: 0, y: 24 });
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

        // final — canvas wipe into the full-bleed typographic closer
        .to(
          wipe,
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.13, ease: "power2.inOut" },
          0.83
        )
        .to(
          finaleLines,
          { yPercent: 0, duration: 0.1, stagger: 0.035, ease: "power4.out" },
          0.88
        )
        .to(
          finaleMeta,
          { autoAlpha: 1, y: 0, duration: 0.07, stagger: 0.03, ease: "power3.out" },
          0.94
        );

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

      return () => {
        window.removeEventListener("resize", onResize);
        gsap.ticker.remove(drawParticles);
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      {/* clipped video window — expands on scroll */}
      <div ref={clipRef} data-cursor-aseprite className="absolute inset-0">
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
        {/* soft drifting particles */}
        <canvas
          ref={particlesRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
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

      {/* final: canvas wipe into a full-bleed typographic closer */}
      <div
        ref={wipeRef}
        className="absolute inset-0 z-10 flex flex-col justify-between bg-void [clip-path:inset(100%_0%_0%_0%)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroNarrative.finale.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-void/70"
        />

        <div className="relative flex items-start justify-between px-6 pt-28 md:px-10 md:pt-32">
          <p data-finale-meta className="label flex items-center gap-3 text-dim">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-acid" />
            {heroNarrative.finale.label}
          </p>
        </div>

        <div className="relative px-6 pb-10 md:px-10 md:pb-14">
          <div className="overflow-hidden">
            <h2
              data-finale-line
              className="display text-[13vw] leading-[0.95] text-ink md:text-[10vw]"
            >
              {heroNarrative.finale.lineSolid}
            </h2>
          </div>
          <div className="overflow-hidden">
            <h2
              data-finale-line
              className="display text-[13vw] leading-[0.95] text-transparent [-webkit-text-stroke:2px_#a78bfa] md:text-[10vw]"
            >
              {heroNarrative.finale.lineOutline}
            </h2>
          </div>

          <div className="mt-8 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p data-finale-meta className="label text-dim">
              {heroNarrative.finale.meta}
            </p>
            <a
              data-finale-meta
              href={heroNarrative.finale.href}
              className="label inline-flex w-fit items-center gap-2 rounded-full bg-acid px-5 py-3 font-bold text-void transition-transform duration-200 hover:scale-105"
            >
              {heroNarrative.finale.cta}
              <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
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
