"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsapConfig";
import { onPreloaderDone } from "@/lib/preloader";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const name = nameRef.current;
      if (!section || !name) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const metaEls = section.querySelectorAll("[data-hero-meta]");

      if (reduced) return;

      gsap.set(metaEls, { autoAlpha: 0, y: 16 });
      gsap.set(name, { autoAlpha: 0 });

      Promise.all([document.fonts.ready, onPreloaderDone()]).then(() => {
        const split = SplitText.create(name, {
          type: "chars",
          mask: "chars",
        });
        gsap.set(name, { autoAlpha: 1 });

        const tl = gsap.timeline();
        tl.from(split.chars, {
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
                text: "Software Engineer — Orion's Gate Studio",
                chars: "▮▯01<>/*",
                speed: 0.6,
              },
            },
            0.6
          );

        // slow parallax out
        gsap.to(name, {
          yPercent: -12,
          autoAlpha: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "bottom 90%",
            end: "bottom 30%",
            scrub: true,
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh flex-col justify-between overflow-hidden px-6 pb-8 pt-28 md:px-10 md:pt-32"
    >
      {/* ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-acid/[0.07] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-line"
      />

      <div className="flex items-start justify-between">
        <p data-hero-meta className="label text-dim">
          Portfolio — v3.0.0
        </p>
        <p data-hero-meta className="label hidden text-dim sm:block">
          Building games &amp; web experiences
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
          Software Engineer — Orion&apos;s Gate Studio
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
          Precision-built interfaces, game worlds and motion — from Ankara to
          the edge of the Orion arm.
        </p>
      </div>
    </section>
  );
}
