"use client";

import { useRef } from "react";
import { Sparkle } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";
import { marqueeItems } from "@/lib/data";

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.to(track, {
      xPercent: -50,
      duration: 22,
      ease: "none",
      repeat: -1,
    });

    // scroll velocity nudges the marquee speed
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-1, 1, self.getVelocity() / 2500);
        gsap.to(tween, {
          timeScale: 1 + v * 2,
          duration: 0.4,
          overwrite: true,
        });
      },
    });

    return () => {
      st.kill();
      tween.kill();
    };
  }, []);

  const row = (
    <>
      {marqueeItems.map((item) => (
        <span key={item} className="flex items-center gap-6 pr-6 md:gap-10 md:pr-10">
          <span className="display whitespace-nowrap text-4xl md:text-6xl">
            {item}
          </span>
          <Sparkle
            aria-hidden="true"
            className="h-5 w-5 shrink-0 fill-current md:h-7 md:w-7"
          />
        </span>
      ))}
    </>
  );

  return (
    <section
      aria-label="Skills marquee"
      className="relative -rotate-1 border-y border-[#0e0f11]/20 bg-acid py-4 text-[#0e0f11] md:py-5"
    >
      <div ref={trackRef} className="flex w-max">
        <div className="flex">{row}</div>
        <div className="flex" aria-hidden="true">
          {row}
        </div>
      </div>
    </section>
  );
}
