"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "@/components/Magnetic";
import { audio } from "@/lib/audio";

const MAX_HP = 100;

type DamageNumber = { id: number; x: number; y: number; value: number };
type Phase = "fight" | "burst" | "cleared";

/**
 * The 404 page's interactive layer: the glitching "404" is a soulslike
 * boss ("Sector Guardian") with a top-center HP bar. Clicking the
 * numerals deals damage until the sector is cleared. Purely a fun layer —
 * all the original 404 content and CTAs live here unchanged.
 */
export default function GuardianFight() {
  const [hp, setHp] = useState(MAX_HP);
  const [phase, setPhase] = useState<Phase>("fight");
  const [struck, setStruck] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  const arenaRef = useRef<HTMLDivElement>(null);
  const bossRef = useRef<HTMLHeadingElement>(null);
  const nextId = useRef(0);

  const fighting = phase === "fight";

  const slay = () => {
    setPhase("burst");
    // fire-and-forget — no listener is assumed to exist
    window.dispatchEvent(
      new CustomEvent("ot:achievement", { detail: { id: "guardian-slayer" } })
    );
    window.setTimeout(() => setPhase("cleared"), 720);
  };

  const strike = (x: number, y: number, fromKeyboard = false) => {
    if (!fighting) return;
    setStruck(true);

    // pointer strikes get the engine click via the site's global
    // interactive-click listener (the h1 carries data-cursor); keyboard
    // strikes bypass it, so play the gated click here
    if (fromKeyboard && localStorage.getItem("ot-sfx") === "1") audio.click();

    const value = 10 + Math.floor(Math.random() * 11); // 10–20 damage
    const id = nextId.current++;
    setDamageNumbers((list) => [...list, { id, x, y, value }]);
    window.setTimeout(() => {
      setDamageNumbers((list) => list.filter((n) => n.id !== id));
    }, 860);

    // brief hit flash on the numerals
    const boss = bossRef.current;
    if (boss) {
      boss.classList.remove("boss-hitflash");
      void boss.offsetWidth; // restart the animation
      boss.classList.add("boss-hitflash");
    }

    // tiny screen shake — skipped under reduced motion
    const arena = arenaRef.current;
    if (
      arena &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      arena.classList.remove("boss-shake");
      void arena.offsetWidth;
      arena.classList.add("boss-shake");
    }

    const next = Math.max(0, hp - value);
    setHp(next);
    if (next === 0) slay();
  };

  const onStrikeClick = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    strike(e.clientX - rect.left, e.clientY - rect.top);
  };

  const onStrikeKey = (e: React.KeyboardEvent<HTMLHeadingElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    const boss = bossRef.current;
    if (!boss) return;
    const rect = boss.getBoundingClientRect();
    strike(
      rect.width / 2 + (Math.random() * 60 - 30),
      rect.height / 2 + (Math.random() * 30 - 15),
      true
    );
  };

  const rage = phase !== "fight" ? 0 : hp <= 33 ? 2 : hp <= 66 ? 1 : 0;
  const hpPct = `${(hp / MAX_HP) * 100}%`;

  return (
    <div
      ref={arenaRef}
      className="relative z-10 flex grow flex-col items-center justify-center px-6 pb-16 pt-28 text-center"
    >
      {/* soulslike boss bar */}
      <div
        className={`absolute left-1/2 top-20 z-20 w-[min(36rem,calc(100%-3rem))] -translate-x-1/2 md:top-24 ${
          phase === "cleared" ? "boss-bar--cleared" : ""
        }`}
      >
        <p className="label mb-2 text-ink">
          {phase === "cleared" ? "Sector cleared" : "Sector Guardian"}
        </p>
        <div className="boss-frame">
          <div className="boss-track">
            <div className="boss-ghost" style={{ width: hpPct }} />
            <div className="boss-fill" style={{ width: hpPct }} />
            <div className="boss-ticks" aria-hidden="true" />
          </div>
        </div>
        <p
          aria-hidden={struck}
          className={`label mt-2 text-center text-dim transition-opacity duration-700 ${
            struck ? "opacity-0" : "opacity-100"
          }`}
        >
          Strike the guardian
        </p>
      </div>

      <p className="label text-dim">
        <span className="text-acid">Err 0x0404</span> / Sector not found
      </p>

      {/* the guardian itself */}
      <div className="relative">
        <h1
          ref={bossRef}
          data-text="404"
          data-rage={rage}
          data-cursor={fighting ? "" : undefined}
          role={fighting ? "button" : undefined}
          tabIndex={fighting ? 0 : undefined}
          aria-label={fighting ? "Strike the Sector Guardian" : undefined}
          onClick={onStrikeClick}
          onKeyDown={onStrikeKey}
          className={`glitch display mt-4 select-none text-[38vw] leading-none text-ink md:text-[24vw] ${
            phase === "burst" ? "boss-burst" : ""
          } ${phase === "cleared" ? "boss-settled" : ""}`}
        >
          404
        </h1>
        {damageNumbers.map((n) => (
          <span
            key={n.id}
            aria-hidden="true"
            className="boss-dmg font-mono font-bold text-ember"
            style={{ left: n.x, top: n.y }}
          >
            -{n.value}
          </span>
        ))}
      </div>

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

      {/* reward line — space is reserved so the CTAs never jump */}
      <p
        aria-hidden={phase !== "cleared"}
        className={`boss-reward label mt-8 text-acid ${
          phase === "cleared" ? "boss-reward--in" : ""
        }`}
      >
        The guardian falls. The path home is open.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
        <Magnetic>
          <Link
            href="/"
            className="pill-acid label block rounded-full bg-acid px-6 py-3.5 font-bold text-void"
          >
            Return to reality
          </Link>
        </Magnetic>
        <Magnetic>
          <Link
            href="/dos"
            className="pill-ghost label inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-ink"
          >
            Debug in terminal
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </Magnetic>
      </div>
    </div>
  );
}
