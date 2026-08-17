"use client";

import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { Flame, Map, Sparkles, Swords, type LucideIcon } from "lucide-react";
import { gsap, SplitText } from "@/lib/gsapConfig";
import { hobbies, type HobbyRelic } from "@/lib/data";

const RELIC_ICONS: Record<string, LucideIcon> = {
  souls: Flame,
  manga: Swords,
  myth: Map,
};

// deterministic ember field (no Math.random — keeps SSR output stable)
const EMBERS = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 137.5 + 9) % 100}%`,
  size: 2 + ((i * 7) % 4),
  t: 7 + ((i * 13) % 70) / 10,
  d: -((i * 17) % 90) / 10,
  dx: (i % 2 === 0 ? 1 : -1) * (12 + ((i * 29) % 42)),
  a: 0.3 + ((i * 11) % 45) / 100,
  violet: i % 3 === 0,
}));

function RelicCard({ relic }: { relic: HobbyRelic }) {
  const Icon = RELIC_ICONS[relic.id] ?? Sparkles;

  return (
    <article
      data-relic
      className="relic group relative aspect-[3/4] overflow-hidden rounded-2xl border border-line bg-card"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={relic.image}
        alt={relic.alt}
        loading="lazy"
        className="relic-img absolute inset-0 h-full w-full object-cover"
      />
      {/* pointer-following torchlight */}
      <div aria-hidden="true" className="relic-torch absolute inset-0" />
      {/* readability scrim */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-void via-void/40 via-45% to-void/5"
      />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 md:p-6">
        <p className="label flex items-center gap-2 text-ink/90">
          <Icon aria-hidden="true" className="h-3.5 w-3.5 text-ember" />
          {relic.tag}
        </p>
        <span className="label text-dim">{relic.numeral}</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <h3 className="display text-3xl text-ink md:text-4xl">{relic.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/75">
          {relic.description}
        </p>

        <div className="mt-5 flex gap-x-8 border-t border-ink/10 pt-4">
          {relic.stats.map((stat) => (
            <div key={stat.k}>
              <p className="label text-dim">{stat.k}</p>
              <p className="label mt-1.5 text-ink">{stat.v}</p>
            </div>
          ))}
        </div>

        <p className="label mt-5 text-ember/90">
          † message: &ldquo;{relic.whisper}&rdquo;
        </p>
      </div>
    </article>
  );
}

export default function Hobbies() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const eclipseRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // heading + closing quote: masked char reveals
      document.fonts.ready.then(() => {
        [
          { el: headingRef.current, start: "top 80%" },
          { el: quoteRef.current, start: "top 82%" },
        ].forEach(({ el, start }) => {
          if (!el) return;
          const split = SplitText.create(el, { type: "chars", mask: "chars" });
          gsap.from(split.chars, {
            yPercent: 110,
            duration: 0.9,
            stagger: 0.03,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start, once: true },
          });
        });

        if (introRef.current) {
          const lines = SplitText.create(introRef.current, {
            type: "lines",
            mask: "lines",
          });
          gsap.from(lines.lines, {
            yPercent: 110,
            duration: 0.9,
            stagger: 0.09,
            ease: "power4.out",
            scrollTrigger: {
              trigger: introRef.current,
              start: "top 82%",
              once: true,
            },
          });
        }
      });

      // relic cards rise like drawn tarot
      gsap.from(section.querySelectorAll("[data-relic]"), {
        y: 90,
        rotation: (i: number) => (i % 2 === 0 ? -2.5 : 2.5),
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section.querySelector("[data-relic-grid]"),
          start: "top 75%",
          once: true,
        },
      });

      gsap.from(section.querySelectorAll("[data-hobby-reveal]"), {
        y: 32,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 65%", once: true },
      });

      // eclipse drifts as the section scrolls by
      if (eclipseRef.current) {
        gsap.fromTo(
          eclipseRef.current,
          { yPercent: -14 },
          {
            yPercent: 16,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // desktop only: pointer tilt + torchlight tracking on the relics
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        gsap.utils.toArray<HTMLElement>("[data-relic]").forEach((card) => {
          gsap.set(card, { transformPerspective: 900 });
          const rotX = gsap.quickTo(card, "rotationX", {
            duration: 0.5,
            ease: "power2.out",
          });
          const rotY = gsap.quickTo(card, "rotationY", {
            duration: 0.5,
            ease: "power2.out",
          });

          card.addEventListener("pointermove", (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            card.style.setProperty("--mx", `${px * 100}%`);
            card.style.setProperty("--my", `${py * 100}%`);
            rotY((px - 0.5) * 7);
            rotX((0.5 - py) * 7);
          });
          card.addEventListener("pointerleave", () => {
            rotX(0);
            rotY(0);
          });
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="hobbies"
      className="relative overflow-hidden px-6 py-28 md:px-10 md:py-40"
    >
      {/* crimson eclipse behind the heading */}
      <div
        ref={eclipseRef}
        aria-hidden="true"
        className="eclipse-ring pointer-events-none absolute -top-24 right-[-14rem] h-[36rem] w-[36rem] rounded-full md:right-[-8rem] lg:right-[4vw]"
      />
      {/* low ember wash at the section base */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[28rem] bg-[radial-gradient(60%_100%_at_50%_100%,rgba(240,101,94,0.07),transparent_70%)]"
      />

      <p className="label mb-14 text-dim">
        <span className="text-acid">04</span> / {hobbies.label}
      </p>

      <div className="relative">
        <h2
          ref={headingRef}
          className="display text-6xl text-ink md:text-8xl lg:text-[7.5vw]"
        >
          {hobbies.headingSolid}{" "}
          <span className="text-transparent [-webkit-text-stroke:2px_#f0655e]">
            {hobbies.headingOutline}
          </span>
        </h2>
        <p
          ref={introRef}
          className="mt-8 max-w-2xl text-xl font-medium leading-snug text-ink md:text-2xl"
        >
          {hobbies.intro}
        </p>
        <p
          data-hobby-reveal
          className="mt-4 max-w-xl text-sm leading-relaxed text-dim md:text-base"
        >
          {hobbies.outro}
        </p>
      </div>

      <div
        data-relic-grid
        className="relative mt-16 grid gap-6 md:mt-20 md:grid-cols-3"
      >
        {hobbies.relics.map((relic) => (
          <RelicCard key={relic.id} relic={relic} />
        ))}
      </div>

      {/* closing quote over the blade-field panorama */}
      <figure
        data-hobby-reveal
        className="relative mt-20 overflow-hidden rounded-2xl border border-line bg-card md:mt-24"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hobbies.quote.image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/45 to-void/30"
        />
        <blockquote className="relative px-6 py-16 text-center md:py-24">
          <p ref={quoteRef} className="display text-5xl md:text-7xl lg:text-8xl">
            <span className="block text-ink">{hobbies.quote.solid}</span>
            <span className="mt-2 block text-transparent [-webkit-text-stroke:2px_#f0655e]">
              {hobbies.quote.outline}
            </span>
          </p>
          <figcaption className="label mt-10 text-dim">
            — {hobbies.quote.meta}
          </figcaption>
        </blockquote>
      </figure>

      {/* rising embers */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55vh] overflow-hidden motion-reduce:hidden"
      >
        {EMBERS.map((ember, i) => (
          <span
            key={i}
            className="ember"
            style={
              {
                left: ember.left,
                width: `${ember.size}px`,
                height: `${ember.size}px`,
                background: ember.violet ? "#a78bfa" : "#f0655e",
                boxShadow: ember.violet
                  ? "0 0 6px 1px rgba(167,139,250,0.45)"
                  : "0 0 6px 1px rgba(240,101,94,0.5)",
                "--ember-t": `${ember.t}s`,
                "--ember-d": `${ember.d}s`,
                "--ember-dx": `${ember.dx}px`,
                "--ember-a": ember.a,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </section>
  );
}
