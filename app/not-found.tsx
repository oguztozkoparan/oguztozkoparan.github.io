import type { Metadata } from "next";
import GuardianFight from "@/components/GuardianFight";

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

      <GuardianFight />
    </main>
  );
}
