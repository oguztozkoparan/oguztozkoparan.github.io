"use client";

import Link from "next/link";
import Magnetic from "@/components/Magnetic";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden">
      {/* cracked-core backdrop */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/error.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,15,17,0.15)_0%,rgba(14,15,17,0.85)_100%)]"
      />
      <div aria-hidden="true" className="crt absolute inset-0 opacity-30" />

      <div className="relative z-10 flex grow flex-col items-center justify-center px-6 pb-16 pt-28 text-center">
        <p className="label text-dim">
          <span className="text-[#f87171]">Kernel panic</span> / Unhandled
          exception
        </p>

        <h1
          data-text="ERROR"
          className="glitch display mt-4 text-[18vw] leading-none text-ink md:text-[13vw]"
        >
          ERROR
        </h1>

        {/* crash dump */}
        <div className="mt-6 w-full max-w-md rounded-xl border border-line bg-void/80 p-5 text-left font-mono text-xs leading-6 text-dim md:text-sm">
          <p>
            <span className="text-[#f87171]">FATAL:</span> REALITY.SYS crashed
            at layer 0x03
          </p>
          <p className="truncate">
            CAUSE: {error?.message || "unknown disturbance in the grid"}
          </p>
          {error?.digest && <p>DUMP: {error.digest}</p>}
          <p>
            HINT: rebooting reality usually
            <br />
            restores the simulation.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Magnetic>
            <button
              type="button"
              onClick={() => reset()}
              className="pill-acid label block rounded-full bg-acid px-6 py-3.5 font-bold text-void"
            >
              Reboot reality
            </button>
          </Magnetic>
          <Magnetic>
            <Link
              href="/"
              className="pill-ghost label block rounded-full border border-line px-6 py-3.5 text-ink"
            >
              Evacuate home
            </Link>
          </Magnetic>
        </div>
      </div>
    </main>
  );
}
