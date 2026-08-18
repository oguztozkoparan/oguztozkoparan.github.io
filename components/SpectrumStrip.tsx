"use client";

// ---------------------------------------------------------------------------
// Live audio visualizers fed by the engine's AnalyserNode (lib/audio.ts).
// One shared rAF ticker drives the bottom-edge strip and every LiveEq
// instance; it only runs while at least one visualizer is mounted, and
// visualizers only mount while music is actually playing.
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { audio } from "@/lib/audio";

type FrameFn = (data: Uint8Array) => void;

const subscribers = new Set<FrameFn>();
let rafId = 0;
let freqData: Uint8Array<ArrayBuffer> | null = null;

function frame() {
  rafId = 0;
  if (subscribers.size === 0) return;
  const analyser = audio.getAnalyser();
  if (analyser) {
    if (!freqData || freqData.length !== analyser.frequencyBinCount) {
      freqData = new Uint8Array(analyser.frequencyBinCount);
    }
    analyser.getByteFrequencyData(freqData);
    for (const fn of subscribers) fn(freqData);
  }
  rafId = requestAnimationFrame(frame);
}

function subscribe(fn: FrameFn): () => void {
  subscribers.add(fn);
  if (!rafId) rafId = requestAnimationFrame(frame);
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0 && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

// log-spaced frequency range the bars cover (the tracks live below ~8 kHz)
const FMIN = 40;
const FMAX = 8000;

function bandLevel(data: Uint8Array, binHz: number, f0: number, f1: number) {
  const b0 = Math.max(0, Math.floor(f0 / binHz));
  const b1 = Math.min(data.length, Math.max(b0 + 1, Math.ceil(f1 / binHz)));
  let sum = 0;
  for (let b = b0; b < b1; b++) sum += data[b];
  return sum / ((b1 - b0) * 255);
}

// --- bottom-edge spectrum strip ---------------------------------------------
export default function SpectrumStrip({ playing }: { playing: boolean }) {
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!playing || reduced || !mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    let width = 0;
    let height = 0;
    let levels = new Float32Array(0);
    let grad: CanvasGradient | null = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(24, Math.floor(width / 6));
      if (levels.length !== n) levels = new Float32Array(n);
      // violet body rising into a subtle ember tip — only tall bars reach it
      grad = ctx2d.createLinearGradient(0, height, 0, 0);
      grad.addColorStop(0, "rgba(167, 139, 250, 0.22)");
      grad.addColorStop(0.6, "rgba(167, 139, 250, 0.62)");
      grad.addColorStop(1, "rgba(240, 101, 94, 0.72)");
    };
    resize();
    window.addEventListener("resize", resize);

    const logRatio = Math.log(FMAX / FMIN);
    const unsubscribe = subscribe((data) => {
      const analyser = audio.getAnalyser();
      if (!analyser || !grad) return;
      const binHz = analyser.context.sampleRate / analyser.fftSize;
      const n = levels.length;
      const slot = width / n;
      const barW = Math.min(2.5, slot * 0.5);
      const maxH = height - 2;
      ctx2d.clearRect(0, 0, width, height);
      ctx2d.fillStyle = grad;
      for (let i = 0; i < n; i++) {
        const f0 = FMIN * Math.exp((logRatio * i) / n);
        const f1 = FMIN * Math.exp((logRatio * (i + 1)) / n);
        const v = Math.pow(bandLevel(data, binHz, f0, f1), 0.8);
        // instant attack, slow peak falloff
        levels[i] = v > levels[i] ? v : Math.max(0, levels[i] - 0.022);
        const h = levels[i] * maxH;
        if (h < 0.5) continue;
        ctx2d.fillRect(i * slot + (slot - barW) / 2, height - h, barW, h);
      }
    });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", resize);
    };
  }, [playing, reduced, mounted]);

  if (!mounted || reduced) return null;

  return createPortal(
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`spectrum-strip ${playing ? "spectrum-strip-on" : ""}`}
    />,
    document.body
  );
}

// --- tiny live EQ (player UI) ------------------------------------------------
const EQ_BANDS: [number, number][] = [
  [40, 250],
  [250, 1200],
  [1200, 4000],
];

export function LiveEq({ small = false }: { small?: boolean }) {
  const reduced = useReducedMotion();
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const levels = useRef([0, 0, 0]);

  useEffect(() => {
    if (reduced) return;
    return subscribe((data) => {
      const analyser = audio.getAnalyser();
      if (!analyser) return;
      const binHz = analyser.context.sampleRate / analyser.fftSize;
      for (let i = 0; i < EQ_BANDS.length; i++) {
        const v = Math.pow(bandLevel(data, binHz, EQ_BANDS[i][0], EQ_BANDS[i][1]), 0.75);
        const prev = levels.current[i];
        levels.current[i] = v > prev ? v : Math.max(0, prev - 0.05);
        const el = barsRef.current[i];
        if (el) {
          el.style.transform = `scaleY(${(0.15 + levels.current[i] * 0.85).toFixed(3)})`;
        }
      }
    });
  }, [reduced]);

  return (
    <span
      className={`flex items-end ${small ? "h-3 gap-[2.5px]" : "h-4 gap-[3px]"}`}
      aria-hidden="true"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          ref={(el) => {
            barsRef.current[i] = el;
          }}
          className={`spectrum-eq-bar rounded-sm bg-acid ${
            small ? "w-[2.5px]" : "w-[3px]"
          }`}
        />
      ))}
    </span>
  );
}
