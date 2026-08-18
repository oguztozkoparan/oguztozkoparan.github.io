"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Liquid hover ripple for project card images.
 *
 * Pure 2D canvas: the image is drawn once (object-cover crop) into an
 * offscreen buffer, then each frame every affected pixel is re-sampled with a
 * radial sinusoidal displacement expanding from the cursor entry point.
 * rAF runs only while ripples are alive; all buffers are preallocated.
 * Touch / coarse pointers and prefers-reduced-motion get the plain image.
 */

const MAX_PIXELS = 480_000; // internal canvas resolution cap
const MAX_RIPPLES = 3;
const MIN_AMP = 0.15; // px — below this a ripple is considered settled

// sine lookup table (index wraps via bitmask, valid for negative phases too)
const SIN_N = 4096;
const SIN_MASK = SIN_N - 1;
const SIN_SCALE = SIN_N / (Math.PI * 2);
const SIN_LUT = new Float32Array(SIN_N);
for (let i = 0; i < SIN_N; i++) SIN_LUT[i] = Math.sin((i / SIN_N) * Math.PI * 2);

// exp(-u) lookup for u in [0, 6)
const EXP_N = 1024;
const EXP_U_MAX = 6;
const EXP_LUT = new Float32Array(EXP_N);
for (let i = 0; i < EXP_N; i++) EXP_LUT[i] = Math.exp(-(i / EXP_N) * EXP_U_MAX);

// ripple parameters, in CSS px / ms (scaled to internal px at spawn)
const ENTRY = {
  amp: 11, // displacement amplitude
  wavelength: 110,
  phaseSpeed: 0.26, // px/ms — how fast crests travel outward
  frontSpeed: 0.9, // px/ms — expanding wavefront
  feather: 80, // wavefront edge softness
  decayR: 240, // spatial exponential falloff radius
  life: 820, // ms — settles within spec's 600–900ms
};
const MINI = {
  amp: 4,
  wavelength: 64,
  phaseSpeed: 0.22,
  frontSpeed: 0.55,
  feather: 48,
  decayR: 130,
  life: 520,
};
const MINI_INTERVAL = 110; // ms between move-spawned ripples
const MINI_MIN_DIST = 18; // css px cursor travel before a new mini ripple

type RippleParams = typeof ENTRY;

type Fx = {
  w: number;
  h: number;
  cssW: number;
  cssH: number;
  scale: number; // internal px per css px
  ctx: CanvasRenderingContext2D;
  src: Uint32Array;
  dstData: ImageData;
  dst: Uint32Array;
  // per-slot ripple state (struct of arrays, preallocated)
  on: Uint8Array;
  dist: Float32Array[]; // per-slot distance field from ripple center
  cx: Float32Array;
  cy: Float32Array;
  start: Float64Array;
  amp0: Float32Array;
  life: Float32Array;
  k: Float32Array;
  omega: Float32Array;
  frontV: Float32Array;
  featherInv: Float32Array;
  decayR: Float32Array;
  // per-frame compacted actives (scratch, preallocated)
  fAmp: Float32Array;
  fPhase: Float32Array;
  fFrontR: Float32Array;
  fMaxR: Float32Array;
  fCx: Float32Array;
  fCy: Float32Array;
  fK: Float32Array;
  fFeatherInv: Float32Array;
  fExpScale: Float32Array;
  fDist: Float32Array[];
  fTouch: Uint8Array;
};

function allowedPointer() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function RippleImage({
  src,
  alt,
  loading,
}: {
  src: string;
  alt: string;
  loading?: "lazy" | "eager";
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<Fx | null>(null);
  const rafRef = useRef(0);
  const hoveringRef = useRef(false);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);
  const lastSpawnRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const failedRef = useRef(false);
  const [live, setLive] = useState(false);

  const initFx = useCallback((): Fx | null => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !img.complete || !img.naturalWidth) return null;

    const cssW = img.clientWidth;
    const cssH = img.clientHeight;
    if (!cssW || !cssH) return null;

    let scale = Math.min(window.devicePixelRatio || 1, 2);
    if (cssW * cssH * scale * scale > MAX_PIXELS) {
      scale = Math.sqrt(MAX_PIXELS / (cssW * cssH));
    }
    const w = Math.max(1, Math.round(cssW * scale));
    const h = Math.max(1, Math.round(cssH * scale));

    canvas.width = w;
    canvas.height = h;

    // draw the object-cover crop of the natural image into the buffers
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const octx = off.getContext("2d", { willReadFrequently: true });
    const ctx = canvas.getContext("2d");
    if (!octx || !ctx) return null;

    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const cover = Math.max(cssW / nw, cssH / nh);
    const sw = cssW / cover;
    const sh = cssH / cover;
    octx.drawImage(img, (nw - sw) / 2, (nh - sh) / 2, sw, sh, 0, 0, w, h);

    let srcData: ImageData;
    try {
      srcData = octx.getImageData(0, 0, w, h);
    } catch {
      failedRef.current = true; // tainted canvas — leave the plain image
      return null;
    }

    const dstData = ctx.createImageData(w, h);
    const n = w * h;
    const fx: Fx = {
      w,
      h,
      cssW,
      cssH,
      scale,
      ctx,
      src: new Uint32Array(srcData.data.buffer),
      dstData,
      dst: new Uint32Array(dstData.data.buffer),
      on: new Uint8Array(MAX_RIPPLES),
      dist: Array.from({ length: MAX_RIPPLES }, () => new Float32Array(n)),
      cx: new Float32Array(MAX_RIPPLES),
      cy: new Float32Array(MAX_RIPPLES),
      start: new Float64Array(MAX_RIPPLES),
      amp0: new Float32Array(MAX_RIPPLES),
      life: new Float32Array(MAX_RIPPLES),
      k: new Float32Array(MAX_RIPPLES),
      omega: new Float32Array(MAX_RIPPLES),
      frontV: new Float32Array(MAX_RIPPLES),
      featherInv: new Float32Array(MAX_RIPPLES),
      decayR: new Float32Array(MAX_RIPPLES),
      fAmp: new Float32Array(MAX_RIPPLES),
      fPhase: new Float32Array(MAX_RIPPLES),
      fFrontR: new Float32Array(MAX_RIPPLES),
      fMaxR: new Float32Array(MAX_RIPPLES),
      fCx: new Float32Array(MAX_RIPPLES),
      fCy: new Float32Array(MAX_RIPPLES),
      fK: new Float32Array(MAX_RIPPLES),
      fFeatherInv: new Float32Array(MAX_RIPPLES),
      fExpScale: new Float32Array(MAX_RIPPLES),
      fDist: new Array<Float32Array>(MAX_RIPPLES),
      fTouch: new Uint8Array(MAX_RIPPLES),
    };
    fxRef.current = fx;
    return fx;
  }, []);

  const spawn = useCallback(
    (fx: Fx, cxCss: number, cyCss: number, p: RippleParams, now: number) => {
      // pick a free slot, else the oldest
      let slot = -1;
      let oldest = 0;
      let oldestT = Infinity;
      for (let s = 0; s < MAX_RIPPLES; s++) {
        if (!fx.on[s]) {
          slot = s;
          break;
        }
        if (fx.start[s] < oldestT) {
          oldestT = fx.start[s];
          oldest = s;
        }
      }
      if (slot === -1) slot = oldest;

      const sc = fx.scale;
      const cx = cxCss * sc;
      const cy = cyCss * sc;
      const d = fx.dist[slot];
      const w = fx.w;
      const h = fx.h;
      let i = 0;
      for (let y = 0; y < h; y++) {
        const dy2 = (y - cy) * (y - cy);
        for (let x = 0; x < w; x++, i++) {
          const dx = x - cx;
          d[i] = Math.sqrt(dx * dx + dy2);
        }
      }

      fx.on[slot] = 1;
      fx.cx[slot] = cx;
      fx.cy[slot] = cy;
      fx.start[slot] = now;
      fx.amp0[slot] = p.amp * sc;
      fx.life[slot] = p.life;
      fx.k[slot] = (Math.PI * 2) / (p.wavelength * sc);
      fx.omega[slot] = fx.k[slot] * p.phaseSpeed * sc;
      fx.frontV[slot] = p.frontSpeed * sc;
      fx.featherInv[slot] = 1 / (p.feather * sc);
      fx.decayR[slot] = p.decayR * sc;
    },
    []
  );

  const stopLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    canvasRef.current?.classList.remove("is-on");
  }, []);

  const frame = useCallback(
    (now: number) => {
      rafRef.current = 0;
      const fx = fxRef.current;
      const canvas = canvasRef.current;
      if (!fx || !canvas) return;

      // compact live ripples into the per-frame scratch arrays
      let n = 0;
      for (let s = 0; s < MAX_RIPPLES; s++) {
        if (!fx.on[s]) continue;
        const t = now - fx.start[s];
        const p = t / fx.life[s];
        if (p >= 1) {
          fx.on[s] = 0;
          continue;
        }
        const e = 1 - p;
        const amp = fx.amp0[s] * e * e; // quadratic ease-out settle
        if (amp < MIN_AMP) {
          fx.on[s] = 0;
          continue;
        }
        const frontR = fx.frontV[s] * t;
        const R = fx.decayR[s];
        // radius beyond which decayed displacement is invisible
        const cut = R * Math.log((amp / MIN_AMP) * 2);
        fx.fAmp[n] = amp;
        fx.fPhase[n] = fx.omega[s] * t;
        fx.fFrontR[n] = frontR;
        fx.fMaxR[n] = Math.min(frontR, cut);
        fx.fCx[n] = fx.cx[s];
        fx.fCy[n] = fx.cy[s];
        fx.fK[n] = fx.k[s];
        fx.fFeatherInv[n] = fx.featherInv[s];
        fx.fExpScale[n] = EXP_N / (EXP_U_MAX * R);
        fx.fDist[n] = fx.dist[s];
        n++;
      }

      if (n === 0) {
        // everything settled — reveal the plain image again
        stopLoop();
        return;
      }

      const { w, h, src, dst } = fx;
      dst.set(src);

      // rows touched by any ripple
      let yLo = h;
      let yHi = 0;
      for (let j = 0; j < n; j++) {
        const lo = Math.max(0, (fx.fCy[j] - fx.fMaxR[j]) | 0);
        const hi = Math.min(h, Math.ceil(fx.fCy[j] + fx.fMaxR[j]));
        if (lo < yLo) yLo = lo;
        if (hi > yHi) yHi = hi;
      }

      for (let y = yLo; y < yHi; y++) {
        // per-row: which ripples touch it, and the union x-range
        let xLo = w;
        let xHi = 0;
        let any = 0;
        for (let j = 0; j < n; j++) {
          const dy = y - fx.fCy[j];
          const mr = fx.fMaxR[j];
          if (dy > mr || dy < -mr) {
            fx.fTouch[j] = 0;
            continue;
          }
          fx.fTouch[j] = 1;
          any = 1;
          const lo = (fx.fCx[j] - mr) | 0;
          const hi = Math.ceil(fx.fCx[j] + mr);
          if (lo < xLo) xLo = lo;
          if (hi > xHi) xHi = hi;
        }
        if (!any) continue;
        if (xLo < 0) xLo = 0;
        if (xHi > w) xHi = w;

        const rowBase = y * w;
        for (let x = xLo; x < xHi; x++) {
          let ox = 0;
          let oy = 0;
          const i = rowBase + x;
          for (let j = 0; j < n; j++) {
            if (!fx.fTouch[j]) continue;
            const d = fx.fDist[j][i];
            if (d >= fx.fMaxR[j] || d < 1) continue;
            let wnd = (fx.fFrontR[j] - d) * fx.fFeatherInv[j];
            if (wnd <= 0) continue;
            if (wnd > 1) wnd = 1;
            else wnd = wnd * wnd * (3 - 2 * wnd);
            const decay = EXP_LUT[(d * fx.fExpScale[j]) | 0];
            const s =
              fx.fAmp[j] *
              SIN_LUT[(((fx.fK[j] * d - fx.fPhase[j]) * SIN_SCALE) | 0) & SIN_MASK] *
              decay *
              wnd;
            const inv = s / d;
            ox += (x - fx.fCx[j]) * inv;
            oy += (y - fx.fCy[j]) * inv;
          }
          if (ox !== 0 || oy !== 0) {
            let sx = Math.round(x - ox);
            let sy = Math.round(y - oy);
            if (sx < 0) sx = 0;
            else if (sx >= w) sx = w - 1;
            if (sy < 0) sy = 0;
            else if (sy >= h) sy = h - 1;
            dst[i] = src[sy * w + sx];
          }
        }
      }

      fx.ctx.putImageData(fx.dstData, 0, 0);
      canvas.classList.add("is-on");
      rafRef.current = requestAnimationFrame(frame);
    },
    [stopLoop]
  );

  const ensureLoop = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(frame);
  }, [frame]);

  const activateFromPending = useCallback(() => {
    const point = pendingRef.current;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!point || !img || !canvas) return;
    pendingRef.current = null;

    let fx = fxRef.current;
    if (!fx || fx.cssW !== img.clientWidth || fx.cssH !== img.clientHeight) {
      fx = initFx();
    }
    if (!fx) return;

    // rect is transform-aware, so this maps correctly mid hover-scale
    const rect = canvas.getBoundingClientRect();
    const x = ((point.x - rect.left) / rect.width) * fx.cssW;
    const y = ((point.y - rect.top) / rect.height) * fx.cssH;
    const now = performance.now();
    spawn(fx, x, y, ENTRY, now);
    lastSpawnRef.current = now;
    lastPosRef.current = { x: point.x, y: point.y };
    hoveringRef.current = true;
    ensureLoop();
  }, [ensureLoop, initFx, spawn]);

  useEffect(() => {
    if (live) activateFromPending();
  }, [live, activateFromPending]);

  useEffect(() => stopLoop, [stopLoop]);

  const onPointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" || failedRef.current || !allowedPointer()) return;
    const img = imgRef.current;
    if (!img || !img.complete || !img.naturalWidth) return;
    pendingRef.current = { x: e.clientX, y: e.clientY };
    if (live) activateFromPending();
    else setLive(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!hoveringRef.current || !fxRef.current || e.pointerType === "touch") return;
    const now = performance.now();
    const last = lastPosRef.current;
    const dx = e.clientX - last.x;
    const dy = e.clientY - last.y;
    if (
      now - lastSpawnRef.current < MINI_INTERVAL ||
      dx * dx + dy * dy < MINI_MIN_DIST * MINI_MIN_DIST
    ) {
      return;
    }
    const canvas = canvasRef.current;
    const fx = fxRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * fx.cssW;
    const y = ((e.clientY - rect.top) / rect.height) * fx.cssH;
    spawn(fx, x, y, MINI, now);
    lastSpawnRef.current = now;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    ensureLoop();
  };

  const onPointerLeave = () => {
    hoveringRef.current = false;
    const fx = fxRef.current;
    if (fx) fx.on.fill(0);
    stopLoop();
  };

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        onPointerEnter={onPointerEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {live && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
        >
          <canvas ref={canvasRef} className="ripple-canvas" />
        </div>
      )}
    </>
  );
}
