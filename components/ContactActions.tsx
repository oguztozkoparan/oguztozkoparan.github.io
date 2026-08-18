"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { site } from "@/lib/data";
import Magnetic from "@/components/Magnetic";

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
      <Magnetic>
        <a
          href={`mailto:${site.email}`}
          className="pill-acid label inline-flex items-center gap-2 rounded-full bg-acid px-6 py-3.5 font-bold text-void"
        >
          Say hello
          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
        </a>
      </Magnetic>
      <Magnetic>
        <button
          type="button"
          onClick={copyEmail}
          className={`label inline-flex items-center gap-2 rounded-full border px-6 py-3.5 transition-colors duration-200 ${
            copied ? "border-acid text-acid" : "pill-ghost border-line text-ink"
          }`}
        >
          {copied ? "Copied" : "Copy email"}
          {copied ? (
            <Check aria-hidden="true" className="h-3.5 w-3.5" />
          ) : (
            <Copy aria-hidden="true" className="h-3.5 w-3.5" />
          )}
        </button>
      </Magnetic>
    </div>
  );
}
