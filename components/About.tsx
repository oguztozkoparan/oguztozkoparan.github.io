"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsapConfig";
import { about } from "@/lib/data";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const intro = introRef.current;
      if (!section || !intro) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      document.fonts.ready.then(() => {
        const split = SplitText.create(intro, { type: "lines", mask: "lines" });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 0.9,
          stagger: 0.09,
          ease: "power4.out",
          scrollTrigger: {
            trigger: intro,
            start: "top 78%",
            once: true,
          },
        });
      });

      gsap.from(section.querySelectorAll("[data-about-reveal]"), {
        y: 32,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 55%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="px-6 py-28 md:px-10 md:py-40"
    >
      <div className="grid gap-10 md:grid-cols-[220px_1fr]">
        <p className="label text-dim">
          <span className="text-acid">01</span> / About
        </p>

        <div>
          <p
            ref={introRef}
            className="max-w-4xl text-2xl font-medium leading-snug text-ink md:text-4xl"
          >
            {about.intro}
          </p>
          <p
            data-about-reveal
            className="mt-8 max-w-xl text-base leading-relaxed text-dim md:text-lg"
          >
            {about.outro}
          </p>

          <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
            {about.facts.map((fact) => (
              <div
                key={fact.k}
                data-about-reveal
                className="bg-panel px-6 py-6"
              >
                <p className="label text-dim">{fact.k}</p>
                <p className="display mt-3 text-2xl text-ink md:text-3xl">
                  {fact.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
