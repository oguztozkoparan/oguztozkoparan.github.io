"use client";

import { useEffect } from "react";

// activates the retro pixel cursor set (see globals.css) on fine pointers
export default function Cursor() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.documentElement.classList.add("no-cursor");
    return () => document.documentElement.classList.remove("no-cursor");
  }, []);

  return null;
}
