"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsapConfig";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** how strongly the element chases the cursor (0–1) */
  strength?: number;
  /** max translation in px on each axis */
  maxOffset?: number;
};

/**
 * Magnetic hover wrapper for primary pills/CTAs. Translates the wrapped
 * element toward the cursor and springs back on leave. Transform-only
 * (no layout shift), inert on touch devices and under
 * prefers-reduced-motion. Usage: <Magnetic><a ... /></Magnetic>
 */
export default function Magnetic({
  children,
  className,
  strength = 0.3,
  maxOffset = 14,
}: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!window.matchMedia("(pointer: fine)").matches) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const clamp = gsap.utils.clamp(-maxOffset, maxOffset);
      const spring = { duration: 1, ease: "elastic.out(1, 0.35)" } as const;
      const xTo = gsap.quickTo(el, "x", spring);
      const yTo = gsap.quickTo(el, "y", spring);

      const onMove = (e: PointerEvent) => {
        // untransformed center: subtract the current magnet offset so the
        // pull stays stable while the element is already displaced
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2 - Number(gsap.getProperty(el, "x"));
        const cy = rect.top + rect.height / 2 - Number(gsap.getProperty(el, "y"));
        xTo(clamp((e.clientX - cx) * strength));
        yTo(clamp((e.clientY - cy) * strength));
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={`inline-block ${className ?? ""}`}>
      {children}
    </span>
  );
}
