"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { unlock } from "@/lib/achievements";

const LS_CRT = "ot-crt";
const KONAMI = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

function applyCrt(on: boolean) {
  document.documentElement.classList.toggle("crt-mode", on);
  localStorage.setItem(LS_CRT, on ? "1" : "0");
  window.dispatchEvent(new CustomEvent("ot:crt", { detail: { on } }));
}

// Owns CRT mode: Konami code (↑↑↓↓←→←→BA) toggles it and earns the
// cheat-code achievement; the command palette flips the same state by
// dispatching "ot:crt-toggle". State change is broadcast as "ot:crt".
export default function CheatCodes() {
  const [mounted, setMounted] = useState(false);
  const [crtOn, setCrtOn] = useState(false);
  const crtRef = useRef(false);

  // restore persisted mode
  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem(LS_CRT) === "1") {
      crtRef.current = true;
      document.documentElement.classList.add("crt-mode");
      setCrtOn(true);
    }
  }, []);

  useEffect(() => {
    // side effects (class, storage, event dispatch) run in the DOM event
    // handler — never inside a React state updater
    const toggle = () => {
      const next = !crtRef.current;
      crtRef.current = next;
      applyCrt(next);
      setCrtOn(next);
    };

    let progress = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (key === KONAMI[progress]) {
        progress += 1;
        if (progress === KONAMI.length) {
          progress = 0;
          toggle();
          unlock("cheat-code");
        }
      } else {
        progress = key === KONAMI[0] ? 1 : 0;
      }
    };

    const onToggleEvent = () => toggle();

    window.addEventListener("keydown", onKey);
    window.addEventListener("ot:crt-toggle", onToggleEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("ot:crt-toggle", onToggleEvent);
    };
  }, []);

  if (!mounted || !crtOn) return null;

  // above page content, below the command palette (z-75) and toasts (z-80)
  return createPortal(
    <div aria-hidden="true" className="crt-overlay" />,
    document.body
  );
}
