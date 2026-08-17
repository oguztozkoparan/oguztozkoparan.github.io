import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Sector not found",
  description: "This sector of the grid was never mapped.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden">
      {/* shattered-sector backdrop */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/404.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,15,17,0.15)_0%,rgba(14,15,17,0.82)_100%)]"
      />
      <div aria-hidden="true" className="crt absolute inset-0 opacity-30" />

      <div className="relative z-10 flex grow flex-col items-center justify-center px-6 pb-16 pt-28 text-center">
        <p className="label text-dim">
          <span className="text-acid">Err 0x0404</span> / Sector not found
        </p>

        <h1
          data-text="404"
          className="glitch display mt-4 text-[38vw] leading-none text-ink md:text-[24vw]"
        >
          404
        </h1>

        {/* terminal readout */}
        <div className="mt-6 w-full max-w-md rounded-xl border border-line bg-void/80 p-5 text-left font-mono text-xs leading-6 text-dim md:text-sm">
          <p>
            <span className="text-acid">C:\&gt;</span> route --find
            &quot;this-page&quot;
          </p>
          <p>SCANNING THE GRID .......... 0 RESULTS</p>
          <p>
            REALITY.SYS: sector was unmade — or never
            <br />
            existed in this layer of the mind.
          </p>
          <p>
            <span className="text-acid">C:\&gt;</span>
            <span className="caret-blink ml-1 inline-block h-3.5 w-2 translate-y-0.5 bg-acid" />
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="label rounded-full bg-acid px-6 py-3.5 font-bold text-void transition-transform duration-200 hover:scale-105"
          >
            Return to reality
          </Link>
          <Link
            href="/dos"
            className="label inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-ink transition-colors duration-200 hover:border-acid/50"
          >
            Debug in terminal
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
