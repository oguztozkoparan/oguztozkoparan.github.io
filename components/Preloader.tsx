"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsapConfig";
import { markPreloaderDone, markPreloaderPresent } from "@/lib/preloader";

export default function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  if (typeof window !== "undefined") markPreloaderPresent();

  useGSAP(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // play once per session — client-side navigation back home skips it
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      sessionStorage.getItem("ot-preloaded")
    ) {
      overlay.style.display = "none";
      markPreloaderDone();
      return;
    }
    sessionStorage.setItem("ot-preloaded", "1");

    document.documentElement.style.overflow = "hidden";

    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        overlay.style.display = "none";
      },
    });

    tl.to(counter, {
      v: 100,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
        }
      },
    })
      .to(barRef.current, { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0)
      .to(
        [counterRef.current?.parentElement, barRef.current],
        { opacity: 0, duration: 0.3, ease: "power1.out" },
        1.55
      )
      .to(overlay, {
        yPercent: -100,
        duration: 0.85,
        ease: "power4.inOut",
        onStart: () => {
          document.documentElement.style.overflow = "";
          markPreloaderDone();
        },
      }, 1.7);
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-void px-6 py-6 md:px-10 md:py-8"
      aria-hidden="true"
    >
      <div className="label text-dim">Oguz Tozkoparan — Portfolio v3</div>
      <div className="flex items-end justify-between">
        <span className="label text-dim">Loading</span>
        <span className="display text-[22vw] leading-none text-ink md:text-[16vw]">
          <span ref={counterRef}>000</span>
          <span className="text-acid">%</span>
        </span>
      </div>
      <div
        ref={barRef}
        className="h-px w-full origin-left scale-x-0 bg-acid"
      />
    </div>
  );
}
