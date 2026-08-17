"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/gsapConfig";

const LABELS: Record<string, string> = {
  "/": "Home",
  "/work": "Work",
  "/about": "About",
  "/blog": "Blog",
  "/contact": "Contact",
  "/dos": "DOS Terminal",
  "/games": "Mini Games",
};

function labelFor(path: string) {
  if (LABELS[path]) return LABELS[path];
  if (path.startsWith("/blog/")) return "Blog";
  return "Loading";
}

// route-change curtain: intercepts internal link clicks, wipes a panel up
// over the page with the destination name, navigates underneath, then
// lifts the panel on arrival
export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const coveringRef = useRef(false);

  // exit: intercept clicks in the capture phase (before next/link handles them)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const target = e.target as Element | null;
      const a = target?.closest?.("a");
      if (!a || a.target === "_blank") return;
      const href = a.getAttribute("href") ?? "";
      if (!href.startsWith("/") || href.startsWith("//")) return;
      const url = new URL(href, window.location.origin);
      if (url.pathname === window.location.pathname) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      e.preventDefault();
      const overlay = overlayRef.current;
      const label = labelRef.current;
      if (!overlay || !label) return;

      coveringRef.current = true;
      label.textContent = labelFor(url.pathname);

      gsap
        .timeline()
        .set(overlay, {
          clipPath: "inset(100% 0% 0% 0%)",
          visibility: "visible",
        })
        .to(overlay, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.5,
          ease: "power4.inOut",
        })
        .fromTo(
          label,
          { autoAlpha: 0, yPercent: 60 },
          { autoAlpha: 1, yPercent: 0, duration: 0.35, ease: "power3.out" },
          0.22
        )
        .add(() => router.push(url.pathname + url.hash));
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // entrance: lift the curtain once the new route has rendered
  useEffect(() => {
    if (!coveringRef.current) return;
    coveringRef.current = false;
    const overlay = overlayRef.current;
    const label = labelRef.current;
    if (!overlay || !label) return;

    gsap
      .timeline({ delay: 0.12 })
      .to(label, { autoAlpha: 0, yPercent: -60, duration: 0.3, ease: "power3.in" })
      .to(
        overlay,
        {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.55,
          ease: "power4.inOut",
        },
        0.1
      )
      .set(overlay, { visibility: "hidden" });
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="invisible fixed inset-0 z-[95] flex items-center justify-center bg-void [clip-path:inset(100%_0%_0%_0%)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/4 h-[28rem] w-[28rem] rounded-full bg-acid/[0.06] blur-3xl"
      />
      <div className="overflow-hidden">
        <span
          ref={labelRef}
          className="display block text-6xl text-ink md:text-8xl"
        >
          Loading
        </span>
      </div>
      <span className="label absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-3 text-dim">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-acid" />
        Traversing the grid
      </span>
    </div>
  );
}
