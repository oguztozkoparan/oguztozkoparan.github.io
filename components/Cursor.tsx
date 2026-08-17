"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsapConfig";

// vintage cursor setup: the pointer itself is a native pixel-art arrow /
// pointing hand (CSS, see globals.css). This component adds the motion —
// three fading pixel fragments trailing the pointer, with a burst on click.
export default function Cursor() {
  const t1Ref = useRef<HTMLDivElement>(null);
  const t2Ref = useRef<HTMLDivElement>(null);
  const t3Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const trail = [t1Ref.current!, t2Ref.current!, t3Ref.current!];

    // activates the pixel-art cursor styles in globals.css
    document.documentElement.classList.add("no-cursor");
    gsap.set(trail, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const movers = trail.map((el, i) => ({
      x: gsap.quickTo(el, "x", { duration: 0.12 + i * 0.09, ease: "power2.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.12 + i * 0.09, ease: "power2.out" }),
    }));

    const alphas = [0.5, 0.35, 0.22];
    let shown = false;
    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        trail.forEach((el, i) =>
          gsap.to(el, { autoAlpha: alphas[i], duration: 0.25, delay: i * 0.05 })
        );
      }
      for (const m of movers) {
        m.x(e.clientX);
        m.y(e.clientY);
      }
    };

    // pixel burst on press
    const onDown = () => {
      gsap.fromTo(
        trail,
        { scale: 2.1 },
        { scale: 1, duration: 0.45, stagger: 0.04, ease: "elastic.out(1.1, 0.5)" }
      );
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);

    return () => {
      document.documentElement.classList.remove("no-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[110] hidden mix-blend-difference [@media(pointer:fine)]:block">
      <div ref={t3Ref} className="absolute left-0 top-0 h-1 w-1 bg-white opacity-0" />
      <div ref={t2Ref} className="absolute left-0 top-0 h-1.5 w-1.5 bg-white opacity-0" />
      <div ref={t1Ref} className="absolute left-0 top-0 h-2 w-2 bg-white opacity-0" />
    </div>
  );
}
