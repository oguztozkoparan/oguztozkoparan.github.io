"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { gsap, SplitText } from "@/lib/gsapConfig";
import { site, socials } from "@/lib/data";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const bigRef = useRef<HTMLHeadingElement>(null);
  const lenis = useLenis();
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const big = bigRef.current;
      if (!section || !big) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      document.fonts.ready.then(() => {
        const split = SplitText.create(big, { type: "chars", mask: "chars" });
        gsap.from(split.chars, {
          yPercent: 110,
          duration: 0.9,
          stagger: 0.035,
          ease: "power4.out",
          scrollTrigger: {
            trigger: big,
            start: "top 80%",
            once: true,
          },
        });
      });

      gsap.from(section.querySelectorAll("[data-contact-reveal]"), {
        y: 32,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.08,
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
    <footer
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden px-6 pb-8 pt-28 md:px-10 md:pt-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-64 left-1/2 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-acid/[0.06] blur-3xl"
      />

      <p className="label text-dim">
        <span className="text-acid">04</span> / Contact
      </p>

      <a
        href={`mailto:${site.email}`}
        className="group mt-10 block"
        aria-label={`Email ${site.name}`}
      >
        <h2
          ref={bigRef}
          className="display text-[19vw] text-ink transition-colors duration-500 group-hover:text-acid lg:text-[17vw]"
        >
          Let&apos;s Talk
        </h2>
      </a>

      <div className="mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <a
          data-contact-reveal
          href={`mailto:${site.email}`}
          className="link-sweep w-fit text-xl font-medium text-ink md:text-3xl"
        >
          {site.email}
        </a>
        <p data-contact-reveal className="max-w-xs text-sm leading-relaxed text-dim">
          Open to interesting projects, collaborations and good coffee — remote
          or in Ankara.
        </p>
      </div>

      <div className="mt-20 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
        {socials.map((social) => (
          <a
            key={social.label}
            data-contact-reveal
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between bg-panel px-6 py-6 transition-colors duration-300 hover:bg-card"
          >
            <div>
              <p className="label text-dim">{social.label}</p>
              <p className="mt-2 font-medium text-ink">{social.handle}</p>
            </div>
            <span
              aria-hidden="true"
              className="text-xl text-dim transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-acid"
            >
              ↗
            </span>
          </a>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
        <p className="label text-dim">
          © {year} {site.name} — {site.location}
        </p>
        <button
          type="button"
          onClick={() => lenis?.scrollTo(0) ?? window.scrollTo({ top: 0 })}
          className="link-sweep label text-ink"
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
