// ---------------------------------------------------------------------------
// Web Audio engine: procedural UI sounds + generative ambient tracks.
// To use real music later: drop files into public/music/ and swap a track
// entry for { type: "file", src: "/music/song.mp3", ... } — see CONTENT.md.
// ---------------------------------------------------------------------------

type StopFn = () => void;

export type Track = {
  id: string;
  title: string;
} & (
  | { type: "procedural"; start: (ctx: AudioContext, out: GainNode) => StopFn }
  | { type: "file"; src: string }
);

const midiHz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

// --- track 1: dark ambient drone -------------------------------------------
function startVoidDrift(ctx: AudioContext, out: GainNode): StopFn {
  const chords = [45, 41, 48, 43]; // A F C G roots (low)
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 420;
  filter.connect(out);

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.06;
  lfoGain.gain.value = 180;
  lfo.connect(lfoGain).connect(filter.frequency);
  lfo.start();

  const voices = [0, 7.02, 12.04, -12].map((offset) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = offset === -12 ? "sine" : "sawtooth";
    osc.frequency.value = midiHz(chords[0] + offset);
    gain.gain.value = offset === -12 ? 0.09 : 0.035;
    osc.connect(gain).connect(filter);
    osc.start();
    return { osc, offset };
  });

  let step = 0;
  const interval = setInterval(() => {
    step = (step + 1) % chords.length;
    const t = ctx.currentTime;
    for (const v of voices) {
      v.osc.frequency.exponentialRampToValueAtTime(
        midiHz(chords[step] + v.offset),
        t + 4
      );
    }
  }, 9000);

  return () => {
    clearInterval(interval);
    lfo.stop();
    for (const v of voices) v.osc.stop();
  };
}

// --- track 2: slow synth arpeggio -------------------------------------------
function startGridRunner(ctx: AudioContext, out: GainNode): StopFn {
  const scale = [57, 60, 62, 64, 67, 69, 72, 76];
  const pattern = [0, 2, 4, 7, 4, 2, 5, 3, 0, 4, 6, 7, 5, 2, 1, 3];
  const stepDur = 0.19;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1600;
  filter.connect(out);

  let step = 0;
  let nextTime = ctx.currentTime + 0.1;

  const note = (
    freq: number,
    t: number,
    dur: number,
    type: OscillatorType,
    vol: number
  ) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(filter);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  };

  const interval = setInterval(() => {
    while (nextTime < ctx.currentTime + 0.35) {
      note(midiHz(scale[pattern[step % 16]]), nextTime, 0.3, "triangle", 0.055);
      if (step % 4 === 0) {
        note(midiHz(scale[0] - 24), nextTime, 0.5, "square", 0.04);
      }
      nextTime += stepDur;
      step++;
    }
  }, 120);

  return () => clearInterval(interval);
}

// --- track 3: quiet chiptune ------------------------------------------------
function startPixelForge(ctx: AudioContext, out: GainNode): StopFn {
  const melody = [72, 0, 76, 74, 0, 72, 79, 0, 77, 76, 0, 74, 72, 0, 67, 0];
  const bass = [48, 43, 45, 41];
  const stepDur = 0.24;

  let step = 0;
  let nextTime = ctx.currentTime + 0.1;

  const note = (
    freq: number,
    t: number,
    dur: number,
    type: OscillatorType,
    vol: number
  ) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(out);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  };

  const interval = setInterval(() => {
    while (nextTime < ctx.currentTime + 0.4) {
      const m = melody[step % melody.length];
      if (m) note(midiHz(m), nextTime, 0.2, "square", 0.028);
      if (step % 8 === 0) {
        note(midiHz(bass[(step / 8) % bass.length]), nextTime, 1.6, "triangle", 0.05);
      }
      nextTime += stepDur;
      step++;
    }
  }, 120);

  return () => clearInterval(interval);
}

export const tracks: Track[] = [
  { id: "void-drift", title: "Void Drift", type: "procedural", start: startVoidDrift },
  { id: "grid-runner", title: "Grid Runner", type: "procedural", start: startGridRunner },
  { id: "pixel-forge", title: "Pixel Forge", type: "procedural", start: startPixelForge },
];

// --- engine -----------------------------------------------------------------
class AudioEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private stopCurrent: StopFn | null = null;
  private fileEl: HTMLAudioElement | null = null;
  private baseVolume = 0.6;

  private ensure(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.baseVolume;
      this.musicGain.connect(this.ctx.destination);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.5;
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  // browsers keep the context suspended until a real user gesture
  // (click / key / touch — hover doesn't count). Attach one-shot unlock
  // listeners so the very first gesture of any kind wakes the engine.
  attachUnlock() {
    const unlock = () => this.ensure();
    for (const ev of ["pointerdown", "keydown", "touchstart"] as const) {
      window.addEventListener(ev, unlock, { once: true, passive: true });
    }
  }

  // run a sound now if the context is awake, or right after resume
  // finishes — this makes the first click audible instead of swallowed
  private whenRunning(fn: (ctx: AudioContext) => void) {
    const ctx = this.ensure();
    if (ctx.state === "running") {
      fn(ctx);
    } else {
      void ctx
        .resume()
        .then(() => fn(ctx))
        .catch(() => {});
    }
  }

  setMusicVolume(v: number) {
    this.baseVolume = Math.min(1, Math.max(0, v));
    if (this.ctx && this.musicGain) {
      this.musicGain.gain.setTargetAtTime(
        this.baseVolume,
        this.ctx.currentTime,
        0.05
      );
    }
  }

  playTrack(index: number) {
    this.whenRunning((ctx) => this.startTrack(ctx, index));
  }

  private startTrack(ctx: AudioContext, index: number) {
    this.stopMusic(0.4);
    const track = tracks[index % tracks.length];
    const out = ctx.createGain();
    out.gain.setValueAtTime(0, ctx.currentTime);
    out.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.2);
    out.connect(this.musicGain!);

    if (track.type === "procedural") {
      const stop = track.start(ctx, out);
      this.stopCurrent = () => {
        stop();
        out.disconnect();
      };
    } else {
      const el = new Audio(track.src);
      el.loop = true;
      const src = ctx.createMediaElementSource(el);
      src.connect(out);
      void el.play();
      this.fileEl = el;
      this.stopCurrent = () => {
        el.pause();
        src.disconnect();
        out.disconnect();
        this.fileEl = null;
      };
    }
  }

  stopMusic(fade = 0.6) {
    const stop = this.stopCurrent;
    if (!stop || !this.ctx || !this.musicGain) return;
    this.stopCurrent = null;
    const g = this.musicGain.gain;
    g.cancelScheduledValues(this.ctx.currentTime);
    g.setValueAtTime(g.value, this.ctx.currentTime);
    g.linearRampToValueAtTime(0.0001, this.ctx.currentTime + fade);
    setTimeout(() => {
      stop();
      if (this.ctx && this.musicGain) {
        this.musicGain.gain.setValueAtTime(this.baseVolume, this.ctx.currentTime);
      }
    }, fade * 1000 + 60);
  }

  // --- procedural UI sounds ---
  click() {
    this.whenRunning((ctx) => {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(680, t);
      osc.frequency.exponentialRampToValueAtTime(240, t + 0.08);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      osc.connect(gain).connect(this.sfxGain!);
      osc.start(t);
      osc.stop(t + 0.1);
    });
  }

  hover() {
    const ctx = this.ensure();
    // a hover is not a user gesture — if the context is still locked,
    // skip quietly instead of queueing stale blips
    if (ctx.state !== "running") return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 1350;
    gain.gain.setValueAtTime(0.028, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc.connect(gain).connect(this.sfxGain!);
    osc.start(t);
    osc.stop(t + 0.06);
  }
}

export const audio = new AudioEngine();
