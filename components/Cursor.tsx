"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsapConfig";

// pixel-echo cursor: a solid pixel square leads, three fading pixels trail
// behind it like voxel fragments; on interactive targets the core rotates
// into a diamond and the trail tightens into orbit
export default function Cursor() {
  const coreRef = useRef<HTMLDivElement>(null);
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

    const core = coreRef.current!;
    const trail = [t1Ref.current!, t2Ref.current!, t3Ref.current!];
    const all = [core, ...trail];

    document.documentElement.classList.add("no-cursor");
    gsap.set(all, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const movers = all.map((el, i) => ({
      x: gsap.quickTo(el, "x", { duration: 0.05 + i * 0.075, ease: "power2.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.05 + i * 0.075, ease: "power2.out" }),
    }));

    const alphas = [1, 0.55, 0.4, 0.25];
    let shown = false;
    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        all.forEach((el, i) =>
          gsap.to(el, { autoAlpha: alphas[i], duration: 0.25, delay: i * 0.04 })
        );
      }
      for (const m of movers) {
        m.x(e.clientX);
        m.y(e.clientY);
      }
    };

    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element && t.closest("a, button, [data-cursor]");

    const onOver = (e: PointerEvent) => {
      if (!isInteractive(e.target)) return;
      gsap.to(core, {
        rotate: 45,
        scale: 1.9,
        duration: 0.35,
        ease: "back.out(2.5)",
      });
      gsap.to(trail, {
        scale: 0.55,
        rotate: 45,
        duration: 0.3,
        ease: "power3.out",
      });
    };

    const onOut = (e: PointerEvent) => {
      if (!isInteractive(e.target)) return;
      gsap.to(core, { rotate: 0, scale: 1, duration: 0.35, ease: "power3.out" });
      gsap.to(trail, { scale: 1, rotate: 0, duration: 0.3, ease: "power3.out" });
    };

    // pixel punch on press
    const onDown = () => {
      gsap.fromTo(
        core,
        { scale: 0.6 },
        { scale: 1, duration: 0.45, ease: "elastic.out(1.2, 0.4)" }
      );
      gsap.fromTo(
        trail,
        { scale: 1.6 },
        { scale: 1, duration: 0.4, stagger: 0.03, ease: "power3.out" }
      );
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver);
    window.addEventListener("pointerout", onOut);
    window.addEventListener("pointerdown", onDown);

    return () => {
      document.documentElement.classList.remove("no-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[110] hidden mix-blend-difference [@media(pointer:fine)]:block">
      <div ref={t3Ref} className="absolute left-0 top-0 h-1 w-1 bg-white opacity-0" />
      <div ref={t2Ref} className="absolute left-0 top-0 h-1.5 w-1.5 bg-white opacity-0" />
      <div ref={t1Ref} className="absolute left-0 top-0 h-2 w-2 bg-white opacity-0" />
      <div ref={coreRef} className="absolute left-0 top-0 h-2.5 w-2.5 bg-white opacity-0" />
    </div>
  );
}
