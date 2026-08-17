"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { audio, tracks } from "@/lib/audio";

export default function SoundControl() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [sfxOn, setSfxOn] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const sfxOnRef = useRef(sfxOn);
  sfxOnRef.current = sfxOn;
  const lastHover = useRef(0);

  // global UI sounds: click blip + hover tick on interactive elements
  useEffect(() => {
    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element && t.closest("a, button, [data-cursor]");

    const onFirstPointer = () => audio.warmUp();
    const onClick = (e: MouseEvent) => {
      if (sfxOnRef.current && isInteractive(e.target)) audio.click();
    };
    const onOver = (e: PointerEvent) => {
      if (!sfxOnRef.current || !isInteractive(e.target)) return;
      const now = performance.now();
      if (now - lastHover.current < 80) return;
      lastHover.current = now;
      audio.hover();
    };

    window.addEventListener("pointerdown", onFirstPointer, { once: true });
    window.addEventListener("click", onClick);
    window.addEventListener("pointerover", onOver);
    return () => {
      window.removeEventListener("pointerdown", onFirstPointer);
      window.removeEventListener("click", onClick);
      window.removeEventListener("pointerover", onOver);
    };
  }, []);

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selectTrack = (i: number) => {
    if (playing && i === trackIndex) {
      audio.stopMusic();
      setPlaying(false);
      return;
    }
    setTrackIndex(i);
    audio.playTrack(i);
    setPlaying(true);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Sound and music"
        className="flex items-center gap-2.5"
      >
        <span className="flex h-3 items-end gap-[3px]" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-[2.5px] rounded-sm bg-acid ${
                playing ? "eq-bar" : "h-[3px]"
              }`}
              style={playing ? { animationDelay: `${i * 0.18}s` } : undefined}
            />
          ))}
        </span>
        <span className="label hidden text-ink md:block">Sound</span>
      </button>

      {/* dropdown panel — opens only on demand, below the bar */}
      <div
        className={`absolute right-0 top-full mt-4 w-64 origin-top-right rounded-xl border border-line bg-void/95 p-2 shadow-2xl shadow-black/40 transition-all duration-200 ${
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <p className="label px-3 pb-2 pt-2 text-dim">Ambient tracks</p>
        {tracks.map((track, i) => {
          const active = playing && i === trackIndex;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => selectTrack(i)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors duration-200 hover:bg-panel ${
                active ? "bg-panel" : ""
              }`}
            >
              <span className="flex items-baseline gap-3">
                <span className="label text-acid">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`label ${active ? "text-acid" : "text-ink"}`}
                >
                  {track.title}
                </span>
              </span>
              {active ? (
                <span className="flex h-3 items-end gap-[2.5px]" aria-hidden="true">
                  {[0, 1, 2].map((b) => (
                    <span
                      key={b}
                      className="eq-bar w-[2.5px] rounded-sm bg-acid"
                      style={{ animationDelay: `${b * 0.18}s` }}
                    />
                  ))}
                </span>
              ) : (
                <Play aria-hidden="true" className="h-3 w-3 text-dim" />
              )}
            </button>
          );
        })}

        <div className="mx-3 my-2 h-px bg-line" />

        <button
          type="button"
          onClick={() => setSfxOn((v) => !v)}
          aria-pressed={sfxOn}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-panel"
        >
          <span className="label text-ink">Interface sounds</span>
          <span className={`label ${sfxOn ? "text-acid" : "text-dim"}`}>
            {sfxOn ? "On" : "Off"}
          </span>
        </button>
      </div>
    </div>
  );
}
