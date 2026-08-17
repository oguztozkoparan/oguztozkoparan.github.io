"use client";

import { useState } from "react";
import { site } from "@/lib/data";

export default function ContactActions() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — the mailto button still works
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <a
        href={`mailto:${site.email}`}
        className="label rounded-full bg-acid px-6 py-3.5 font-bold text-void transition-transform duration-200 hover:scale-105"
      >
        Say hello ↗
      </a>
      <button
        type="button"
        onClick={copyEmail}
        className={`label rounded-full border px-6 py-3.5 transition-colors duration-200 ${
          copied
            ? "border-acid text-acid"
            : "border-line text-ink hover:border-acid/50"
        }`}
      >
        {copied ? "Copied ✓" : "Copy email"}
      </button>
    </div>
  );
}
