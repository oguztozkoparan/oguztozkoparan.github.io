"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";
import {
  isUnlocked,
  onUnlock,
  unlock,
  type Achievement,
} from "@/lib/achievements";

type ToastItem = { key: number; achievement: Achievement };

const MAX_VISIBLE = 3;
const HOLD_MS = 4500;

function Toast({
  achievement,
  onDone,
}: {
  achievement: Achievement;
  onDone: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let tl: gsap.core.Timeline | null = null;
    let timer = 0;
    if (reduced) {
      el.style.opacity = "1";
      el.style.visibility = "visible";
      timer = window.setTimeout(onDone, HOLD_MS);
    } else {
      tl = gsap
        .timeline()
        .fromTo(
          el,
          { x: -28, autoAlpha: 0, clipPath: "inset(0% 100% 0% 0%)" },
          {
            x: 0,
            autoAlpha: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.55,
            ease: "power3.out",
          }
        )
        .to(el, {
          x: -20,
          autoAlpha: 0,
          duration: 0.4,
          ease: "power2.in",
          delay: HOLD_MS / 1000,
          onComplete: onDone,
        });
    }
    return () => {
      tl?.kill();
      window.clearTimeout(timer);
    };
  }, [onDone]);

  const Icon = achievement.icon;
  return (
    <div
      ref={ref}
      role="status"
      className="pointer-events-auto relative flex w-[calc(100vw-2rem)] max-w-sm items-center gap-3.5 overflow-hidden rounded-xl border border-line bg-panel/95 p-3.5 pl-4 opacity-0 shadow-2xl shadow-black/60 backdrop-blur-sm"
    >
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-[3px] bg-acid"
      />
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-acid/30 bg-acid/10 text-acid">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="label text-acid">Achievement unlocked</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-ink">
          {achievement.title}
        </p>
        <p className="truncate text-xs text-dim">{achievement.description}</p>
      </div>
    </div>
  );
}

export default function Achievements() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState<ToastItem[]>([]);
  const queueRef = useRef<ToastItem[]>([]);
  const keyRef = useRef(0);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // fresh unlocks arrive here (from direct unlock() calls anywhere)
  useEffect(
    () =>
      onUnlock((achievement) => {
        const item = { key: ++keyRef.current, achievement };
        setVisible((v) => {
          if (v.length < MAX_VISIBLE) return [...v, item];
          queueRef.current.push(item);
          return v;
        });
      }),
    []
  );

  // fire-and-forget contract for other features:
  // window.dispatchEvent(new CustomEvent("ot:achievement", { detail: { id } }))
  useEffect(() => {
    const onEvent = (e: Event) => {
      const id = (e as CustomEvent<{ id?: unknown }>).detail?.id;
      if (typeof id === "string") unlock(id);
    };
    window.addEventListener("ot:achievement", onEvent);
    return () => window.removeEventListener("ot:achievement", onEvent);
  }, []);

  // route-based triggers (this layer lives in the layout, so it is mounted
  // on /dos and /games even though the header UI hides itself there)
  useEffect(() => {
    if (pathname === "/dos") unlock("dungeon-delver");
    else if (pathname === "/games") unlock("arcade-initiate");

    if (pathname !== "/" || isUnlocked("grid-walker")) return;
    // "bottom 102%": the footer's bottom sits flush with the document end,
    // so it can never rise above the viewport bottom — the line must sit
    // slightly below the viewport for the trigger to be reachable
    const st = ScrollTrigger.create({
      trigger: "#contact",
      start: "bottom 102%",
      once: true,
      onEnter: () => unlock("grid-walker"),
    });
    return () => st.kill();
  }, [pathname]);

  const finish = useCallback((key: number) => {
    setVisible((v) => {
      const next = v.filter((t) => t.key !== key);
      while (next.length < MAX_VISIBLE && queueRef.current.length > 0) {
        next.push(queueRef.current.shift()!);
      }
      return next;
    });
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-none fixed bottom-4 left-4 z-[80] flex flex-col gap-3">
      {visible.map((t) => (
        <Toast
          key={t.key}
          achievement={t.achievement}
          onDone={() => finish(t.key)}
        />
      ))}
    </div>,
    document.body
  );
}
