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
    document.documentElement.classList.add("is-loading");

    // the counter sweeps to 84% and holds until the page is actually loaded;
    // a minimum display time keeps the animation readable on fast loads and
    // a cap keeps slow assets from trapping the user
    const MIN_MS = 1500;
    const MAX_WAIT_MS = 6000;

    const counter = { v: 0 };
    const drawCounter = () => {
      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
      }
    };

    gsap.to(counter, {
      v: 84,
      duration: 1.3,
      ease: "power2.out",
      onUpdate: drawCounter,
    });
    gsap.to(barRef.current, { scaleX: 0.84, duration: 1.3, ease: "power2.out" });

    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });
    const cap = new Promise<void>((r) => setTimeout(r, MAX_WAIT_MS));
    const minHold = new Promise<void>((r) => setTimeout(r, MIN_MS));

    let cancelled = false;
    Promise.all([Promise.race([loaded, cap]), minHold]).then(() => {
      if (cancelled || !overlayRef.current) return;
      gsap
        .timeline({
          onComplete: () => {
            overlay.style.display = "none";
          },
        })
        .to(counter, { v: 100, duration: 0.4, ease: "power2.inOut", onUpdate: drawCounter })
        .to(barRef.current, { scaleX: 1, duration: 0.4, ease: "power2.inOut" }, 0)
        .to(
          [counterRef.current?.parentElement, barRef.current],
          { opacity: 0, duration: 0.3, ease: "power1.out" },
          0.45
        )
        .to(overlay, {
          yPercent: -100,
          duration: 0.85,
          ease: "power4.inOut",
          onStart: () => {
            document.documentElement.style.overflow = "";
            document.documentElement.classList.remove("is-loading");
            markPreloaderDone();
          },
        }, 0.6);
    });

    return () => {
      cancelled = true;
    };
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
