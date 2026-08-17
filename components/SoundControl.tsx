"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Maximize2,
  Pause,
  Play,
  Search,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";
import { audio, tracks } from "@/lib/audio";

const LS_SFX = "ot-sfx";
const LS_VOLUME = "ot-volume";
const LS_TRACK = "ot-track";

function Eq({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`flex items-end ${small ? "h-3 gap-[2.5px]" : "h-4 gap-[3px]"}`}
      aria-hidden="true"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`eq-bar rounded-sm bg-acid ${small ? "w-[2.5px]" : "w-[3px]"}`}
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </span>
  );
}

export default function SoundControl() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [sfxOn, setSfxOn] = useState(false); // off by default — user opts in
  const [volume, setVolume] = useState(0.6);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const sfxOnRef = useRef(sfxOn);
  sfxOnRef.current = sfxOn;
  const lastHover = useRef(0);

  // restore saved preferences
  useEffect(() => {
    if (localStorage.getItem(LS_SFX) === "1") setSfxOn(true);
    const v = parseFloat(localStorage.getItem(LS_VOLUME) ?? "");
    if (!Number.isNaN(v)) {
      setVolume(v);
      audio.setMusicVolume(v);
    }
    const t = parseInt(localStorage.getItem(LS_TRACK) ?? "", 10);
    if (!Number.isNaN(t) && t >= 0 && t < tracks.length) setTrackIndex(t);
  }, []);

  const toggleSfx = () => {
    setSfxOn((v) => {
      localStorage.setItem(LS_SFX, v ? "0" : "1");
      return !v;
    });
  };

  const changeVolume = (v: number) => {
    setVolume(v);
    audio.setMusicVolume(v);
    localStorage.setItem(LS_VOLUME, String(v));
  };

  // global UI sounds (only when the user has opted in)
  useEffect(() => {
    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element && t.closest("a, button, [data-cursor]");

    audio.attachUnlock();
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

    window.addEventListener("click", onClick);
    window.addEventListener("pointerover", onOver);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("pointerover", onOver);
    };
  }, []);

  // close on outside click / Escape
  useEffect(() => {
    if (!open && !expanded) return;
    const onDown = (e: PointerEvent) => {
      if (
        open &&
        rootRef.current &&
        !rootRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      setExpanded(false);
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, expanded]);

  const playIndex = (i: number) => {
    const idx = (i + tracks.length) % tracks.length;
    setTrackIndex(idx);
    localStorage.setItem(LS_TRACK, String(idx));
    audio.playTrack(idx);
    setPlaying(true);
  };

  const selectTrack = (i: number) => {
    if (playing && i === trackIndex) {
      audio.stopMusic();
      setPlaying(false);
      return;
    }
    playIndex(i);
  };

  const togglePlay = () => {
    if (playing) {
      audio.stopMusic();
      setPlaying(false);
    } else {
      playIndex(trackIndex);
    }
  };

  const filtered = tracks
    .map((t, i) => ({ ...t, i }))
    .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Sound and music"
        className="flex items-center gap-2.5"
      >
        {playing ? (
          <Eq small />
        ) : (
          <span className="flex h-3 items-end gap-[2.5px]" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-[3px] w-[2.5px] rounded-sm bg-acid" />
            ))}
          </span>
        )}
        <span className="label hidden text-ink md:block">Sound</span>
      </button>

      {/* quick dropdown */}
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
              data-cursor-alt
              onClick={() => selectTrack(i)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors duration-200 hover:bg-panel ${
                active ? "bg-panel" : ""
              }`}
            >
              <span className="flex items-baseline gap-3">
                <span className="label text-acid">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`label ${active ? "text-acid" : "text-ink"}`}>
                  {track.title}
                </span>
              </span>
              {active ? (
                <Eq small />
              ) : (
                <Play aria-hidden="true" className="h-3 w-3 text-dim" />
              )}
            </button>
          );
        })}

        <div className="mx-3 my-2 h-px bg-line" />

        <button
          type="button"
          onClick={toggleSfx}
          aria-pressed={sfxOn}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-panel"
        >
          <span className="label text-ink">Interface sounds</span>
          <span className={`label ${sfxOn ? "text-acid" : "text-dim"}`}>
            {sfxOn ? "On" : "Off"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setExpanded(true);
          }}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-panel"
        >
          <span className="label text-ink">Full player</span>
          <Maximize2 aria-hidden="true" className="h-3.5 w-3.5 text-dim" />
        </button>
      </div>

      {/* detailed player modal — portaled to body so header transforms
          don't hijack its fixed positioning */}
      {expanded &&
        createPortal(
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close player"
            onClick={() => setExpanded(false)}
            className="absolute inset-0 bg-void/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-line bg-panel p-6 shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between">
              <p className="label text-dim">
                <span className="text-acid">Sound</span> / System
              </p>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Close"
                className="rounded-lg p-1.5 text-dim transition-colors hover:bg-card hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* search */}
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-line bg-void px-4 py-3">
              <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-dim" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tracks…"
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-dim"
              />
            </div>

            {/* track list */}
            <div className="mt-4 max-h-64 overflow-y-auto">
              {filtered.map((track) => {
                const active = playing && track.i === trackIndex;
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => selectTrack(track.i)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition-colors duration-200 hover:bg-card ${
                      active ? "bg-card" : ""
                    }`}
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="label text-acid">
                        {String(track.i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          active ? "text-acid" : "text-ink"
                        }`}
                      >
                        {track.title}
                      </span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="label text-dim">
                        {track.type === "procedural" ? "Generative" : "File"}
                      </span>
                      {active ? (
                        <Eq small />
                      ) : (
                        <Play aria-hidden="true" className="h-3.5 w-3.5 text-dim" />
                      )}
                    </span>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-dim">
                  No tracks match “{query}”.
                </p>
              )}
            </div>

            {/* now playing + transport */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-void px-4 py-3.5">
              <div className="min-w-0">
                <p className="label text-dim">Now playing</p>
                <p
                  className={`mt-1 truncate text-sm font-medium ${
                    playing ? "text-acid" : "text-dim"
                  }`}
                >
                  {playing ? tracks[trackIndex].title : "—"}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => playIndex(trackIndex - 1)}
                  aria-label="Previous track"
                  className="rounded-lg p-2 text-dim transition-colors hover:bg-card hover:text-ink"
                >
                  <SkipBack className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={playing ? "Pause" : "Play"}
                  className="rounded-full bg-acid p-2.5 text-void transition-transform hover:scale-105"
                >
                  {playing ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => playIndex(trackIndex + 1)}
                  aria-label="Next track"
                  className="rounded-lg p-2 text-dim transition-colors hover:bg-card hover:text-ink"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* volume + sfx */}
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex grow items-center gap-3">
                <span className="label shrink-0 text-dim">Volume</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(e) => changeVolume(parseFloat(e.target.value))}
                  className="h-1 w-full accent-acid"
                />
              </label>
              <button
                type="button"
                onClick={toggleSfx}
                aria-pressed={sfxOn}
                className={`label w-fit rounded-full border px-4 py-2 transition-colors duration-200 ${
                  sfxOn
                    ? "border-acid text-acid"
                    : "border-line text-dim hover:text-ink"
                }`}
              >
                SFX {sfxOn ? "On" : "Off"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
