"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsapConfig";

export default function Cursor() {
  const crossRef = useRef<HTMLDivElement>(null);
  const bracketsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const cross = crossRef.current!;
    const brackets = bracketsRef.current!;
    document.documentElement.classList.add("no-cursor");
    gsap.set([cross, brackets], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    gsap.set(brackets, { scale: 0.5 });

    const crossX = gsap.quickTo(cross, "x", { duration: 0.05, ease: "none" });
    const crossY = gsap.quickTo(cross, "y", { duration: 0.05, ease: "none" });
    const brX = gsap.quickTo(brackets, "x", { duration: 0.3, ease: "power2.out" });
    const brY = gsap.quickTo(brackets, "y", { duration: 0.3, ease: "power2.out" });

    let shown = false;
    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to(cross, { autoAlpha: 1, duration: 0.2 });
      }
      crossX(e.clientX);
      crossY(e.clientY);
      brX(e.clientX);
      brY(e.clientY);
    };

    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element && t.closest("a, button, [data-cursor]");

    const onOver = (e: PointerEvent) => {
      if (isInteractive(e.target)) {
        gsap.to(cross, { rotate: 45, scale: 1.25, duration: 0.35, ease: "power3.out" });
        gsap.to(brackets, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)" });
      }
    };

    const onOut = (e: PointerEvent) => {
      if (isInteractive(e.target)) {
        gsap.to(cross, { rotate: 0, scale: 1, duration: 0.35, ease: "power3.out" });
        gsap.to(brackets, { autoAlpha: 0, scale: 0.5, duration: 0.3, ease: "power3.out" });
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver);
    window.addEventListener("pointerout", onOut);

    return () => {
      document.documentElement.classList.remove("no-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[110] hidden mix-blend-difference [@media(pointer:fine)]:block">
      {/* crosshair — instant */}
      <div ref={crossRef} className="absolute left-0 top-0 opacity-0">
        <span className="absolute left-0 top-0 h-px w-4 -translate-x-1/2 -translate-y-1/2 bg-white" />
        <span className="absolute left-0 top-0 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-white" />
      </div>
      {/* corner brackets — lag behind, frame interactive targets */}
      <div
        ref={bracketsRef}
        className="absolute left-0 top-0 h-10 w-10 opacity-0"
      >
        <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-white" />
        <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-white" />
        <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-white" />
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-white" />
      </div>
    </div>
  );
}
