"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsapConfig";
import { capabilities } from "@/lib/data";

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(section.querySelectorAll("[data-cap-row]"), {
        y: 56,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="px-6 py-28 md:px-10 md:py-40"
    >
      <p className="label mb-14 text-dim">
        <span className="text-acid">03</span> / Capabilities
      </p>

      <div>
        {capabilities.map((cap, i) => (
          <div
            key={cap.index}
            data-cap-row
            className={`cap-row grid grid-cols-[3rem_1fr] items-baseline gap-4 border-t border-line px-2 py-8 md:grid-cols-[6rem_1fr_minmax(0,22rem)] md:px-4 md:py-10 ${
              i === capabilities.length - 1 ? "border-b" : ""
            }`}
          >
            <span className="label text-dim">{cap.index}</span>
            <h3 className="display text-3xl text-ink sm:text-5xl md:text-6xl">
              {cap.title}
            </h3>
            <p className="label col-span-2 mt-3 leading-relaxed text-dim md:col-span-1 md:mt-0 md:text-right">
              {cap.items.join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
