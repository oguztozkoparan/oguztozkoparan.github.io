"use client";

import { useEffect, useRef, useState } from "react";
import { audio, tracks } from "@/lib/audio";

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [sfxOn, setSfxOn] = useState(true);
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

  const togglePlay = () => {
    if (playing) {
      audio.stopMusic();
      setPlaying(false);
    } else {
      audio.playTrack(trackIndex);
      setPlaying(true);
    }
  };

  const nextTrack = () => {
    const next = (trackIndex + 1) % tracks.length;
    setTrackIndex(next);
    if (playing) audio.playTrack(next);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[45] flex items-center gap-4 rounded-full border border-line bg-void/75 px-5 py-3 backdrop-blur-md md:bottom-6 md:right-6">
      {/* play / pause + equalizer */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? "Pause music" : "Play music"}
        className="flex items-center gap-2.5"
      >
        <span className="flex h-3.5 items-end gap-[3px]" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-[3px] rounded-sm bg-acid ${playing ? "eq-bar" : "h-[4px]"}`}
              style={playing ? { animationDelay: `${i * 0.18}s` } : undefined}
            />
          ))}
        </span>
        <span className="label text-ink">{playing ? "Pause" : "Play"}</span>
      </button>

      <span aria-hidden="true" className="h-4 w-px bg-line" />

      {/* track switcher */}
      <button
        type="button"
        onClick={nextTrack}
        aria-label="Next track"
        className="group flex items-center gap-2"
        title="Switch track"
      >
        <span className="label text-dim transition-colors duration-200 group-hover:text-ink">
          {tracks[trackIndex].title}
        </span>
        <span
          aria-hidden="true"
          className="text-sm text-acid transition-transform duration-300 group-hover:translate-x-0.5"
        >
          ⏭
        </span>
      </button>

      <span aria-hidden="true" className="hidden h-4 w-px bg-line sm:block" />

      {/* ui sfx toggle */}
      <button
        type="button"
        onClick={() => setSfxOn((v) => !v)}
        aria-pressed={sfxOn}
        aria-label="Toggle interface sounds"
        className="hidden sm:block"
      >
        <span className={`label ${sfxOn ? "text-acid" : "text-dim line-through"}`}>
          SFX
        </span>
      </button>
    </div>
  );
}
