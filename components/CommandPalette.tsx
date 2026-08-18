"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Command as CommandIcon,
  CornerDownLeft,
  Moon,
  Music,
  Navigation,
  Search,
  Volume2,
} from "lucide-react";
import { gsap } from "@/lib/gsapConfig";
import { audio, isSfxOn, setSfx, tracks } from "@/lib/audio";
import { achievements, getUnlocked, onUnlock, unlock } from "@/lib/achievements";

const LS_TRACK = "ot-track";

type Command = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  keepOpen?: boolean;
  run: () => void;
};

const GROUP_ORDER = ["Navigate", "Sound", "Modes", "Achievements"];

const GROUP_ICONS: Record<string, typeof Navigation> = {
  Navigate: Navigation,
  Sound: Volume2,
  Modes: Moon,
  Achievements: BookOpen,
};

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "DOS Terminal", href: "/dos" },
  { label: "Games", href: "/games" },
];

export default function CommandPalette() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"commands" | "achievements">("commands");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [sfxOn, setSfxOn] = useState(false);
  const [crtOn, setCrtOn] = useState(false);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => setMounted(true), []);

  const openPalette = useCallback(() => {
    unlock("spellcaster"); // idempotent — only the first-ever open counts
    setQuery("");
    setSelected(0);
    setView("commands");
    setSfxOn(isSfxOn());
    setCrtOn(document.documentElement.classList.contains("crt-mode"));
    setUnlockedIds(getUnlocked());
    setOpen(true);
  }, []);

  // ⌘K / Ctrl+K, plus the header's ghost button ("ot:palette")
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (openRef.current) setOpen(false);
        else openPalette();
      }
    };
    const onOpenEvent = () => openPalette();
    window.addEventListener("keydown", onKey);
    window.addEventListener("ot:palette", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("ot:palette", onOpenEvent);
    };
  }, [openPalette]);

  // stay in sync while open (palette toggles + external toggles)
  useEffect(() => {
    const onSfx = (e: Event) =>
      setSfxOn(!!(e as CustomEvent<{ on?: boolean }>).detail?.on);
    const onCrt = (e: Event) =>
      setCrtOn(!!(e as CustomEvent<{ on?: boolean }>).detail?.on);
    window.addEventListener("ot:sfx", onSfx);
    window.addEventListener("ot:crt", onCrt);
    return () => {
      window.removeEventListener("ot:sfx", onSfx);
      window.removeEventListener("ot:crt", onCrt);
    };
  }, []);

  // refresh the achievements list live while open (a toast can land mid-browse)
  useEffect(() => {
    if (!open) return;
    return onUnlock(() => setUnlockedIds(getUnlocked()));
  }, [open]);

  // entrance animation — plain opacity (never visibility) so the input
  // stays focusable from the first frame
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced || !panelRef.current || !backdropRef.current) return;
    const tl = gsap
      .timeline()
      .fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" }
      )
      .fromTo(
        panelRef.current,
        { opacity: 0, y: 14, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power3.out" },
        0.05
      );
    return () => {
      tl.kill();
    };
  }, [open]);

  const playTrack = useCallback((index: number) => {
    const i = ((index % tracks.length) + tracks.length) % tracks.length;
    localStorage.setItem(LS_TRACK, String(i));
    audio.playTrack(i);
  }, []);

  const commands = useMemo<Command[]>(() => {
    const list: Command[] = NAV_LINKS.map((l) => ({
      id: `nav-${l.href}`,
      group: "Navigate",
      label: l.label,
      hint: l.href,
      run: () => router.push(l.href),
    }));

    list.push({
      id: "sfx-toggle",
      group: "Sound",
      label: "Toggle SFX",
      hint: sfxOn ? "on" : "off",
      keepOpen: true,
      run: () => setSfx(!isSfxOn()),
    });
    list.push({
      id: "next-track",
      group: "Sound",
      label: "Next track",
      keepOpen: true,
      run: () => {
        const current = parseInt(localStorage.getItem(LS_TRACK) ?? "0", 10);
        playTrack((Number.isNaN(current) ? 0 : current) + 1);
      },
    });
    tracks.forEach((t, i) => {
      list.push({
        id: `track-${t.id}`,
        group: "Sound",
        label: `Play ${t.title}`,
        hint: String(i + 1).padStart(2, "0"),
        keepOpen: true,
        run: () => playTrack(i),
      });
    });

    list.push({
      id: "crt-toggle",
      group: "Modes",
      label: "Toggle CRT mode",
      hint: crtOn ? "on" : "off",
      keepOpen: true,
      run: () => window.dispatchEvent(new CustomEvent("ot:crt-toggle")),
    });

    list.push({
      id: "achievements-view",
      group: "Achievements",
      label: "View achievements",
      hint: `${unlockedIds.length} / ${achievements.length}`,
      keepOpen: true,
      run: () => {
        setUnlockedIds(getUnlocked());
        setView("achievements");
      },
    });

    return list;
  }, [router, sfxOn, crtOn, unlockedIds.length, playTrack]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)
    );
  }, [commands, query]);

  // clamp selection when the filtered list shrinks
  useEffect(() => {
    setSelected((s) => Math.min(s, Math.max(0, filtered.length - 1)));
  }, [filtered.length]);

  const close = useCallback(() => setOpen(false), []);

  const runCommand = useCallback(
    (cmd: Command) => {
      cmd.run();
      if (!cmd.keepOpen) close();
    },
    [close]
  );

  // Escape lives on window: in the achievements view the search input is
  // unmounted, focus falls back to <body>, and panel-level keydown never fires
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      if (view === "achievements") setView("commands");
      else close();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, view, close]);

  // refocus the search input when coming back from the achievements view
  useEffect(() => {
    if (open && view === "commands") inputRef.current?.focus();
  }, [open, view]);

  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (view !== "commands") return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => (filtered.length ? (s + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) =>
        filtered.length ? (s - 1 + filtered.length) % filtered.length : 0
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[selected];
      if (cmd) runCommand(cmd);
    }
  };

  // keep the highlighted row in view while arrowing through
  useEffect(() => {
    if (view !== "commands") return;
    const el = listRef.current?.querySelector('[data-selected="true"]');
    el?.scrollIntoView({ block: "nearest" });
  }, [selected, view]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[75] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]"
      onKeyDown={onPanelKeyDown}
    >
      <div
        ref={backdropRef}
        aria-hidden="true"
        className="absolute inset-0 bg-void/75 backdrop-blur-sm"
        onClick={close}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command grimoire"
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl shadow-black/60"
      >
        {/* acid seam along the top edge */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-acid to-transparent"
        />

        {view === "commands" ? (
          <>
            <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
              <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-acid" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(0);
                }}
                placeholder="Whisper a command…"
                aria-label="Search commands"
                className="w-full bg-transparent font-mono text-sm text-ink outline-none placeholder:text-dim"
              />
              <span className="label hidden shrink-0 rounded border border-line px-1.5 py-0.5 text-dim sm:block">
                esc
              </span>
            </div>

            <div ref={listRef} className="max-h-[46vh] overflow-y-auto p-2">
              {GROUP_ORDER.map((group) => {
                const items = filtered.filter((c) => c.group === group);
                if (items.length === 0) return null;
                const GroupIcon = GROUP_ICONS[group];
                return (
                  <div key={group}>
                    <p className="label flex items-center gap-1.5 px-3 pb-1.5 pt-3 text-dim">
                      <GroupIcon aria-hidden="true" className="h-3 w-3" />
                      {group}
                    </p>
                    {items.map((cmd) => {
                      const i = filtered.indexOf(cmd);
                      const active = i === selected;
                      return (
                        <button
                          key={cmd.id}
                          type="button"
                          data-selected={active}
                          onClick={() => runCommand(cmd)}
                          onMouseMove={() => setSelected(i)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors duration-150 ${
                            active ? "bg-card" : ""
                          }`}
                        >
                          <span
                            className={`text-sm ${
                              active ? "text-acid" : "text-ink"
                            }`}
                          >
                            {cmd.label}
                          </span>
                          <span className="flex items-center gap-2">
                            {cmd.hint && (
                              <span className="label text-dim">{cmd.hint}</span>
                            )}
                            {active && (
                              <CornerDownLeft
                                aria-hidden="true"
                                className="h-3.5 w-3.5 text-acid"
                              />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="px-3 py-8 text-center font-mono text-sm text-dim">
                  The grimoire holds no such spell.
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 border-t border-line px-4 py-2.5">
              <span className="label text-dim">↑↓ move</span>
              <span className="label text-dim">↵ cast</span>
              <span className="label ml-auto flex items-center gap-1 text-dim">
                <CommandIcon aria-hidden="true" className="h-3 w-3" />K
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
              <button
                type="button"
                onClick={() => setView("commands")}
                className="label flex items-center gap-2 text-dim transition-colors duration-200 hover:text-ink"
              >
                <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
                Back
              </button>
              <p className="label text-dim">
                <span className="text-acid">{unlockedIds.length}</span> /{" "}
                {achievements.length} unlocked
              </p>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {achievements.map((a) => {
                const earned = unlockedIds.includes(a.id);
                const Icon = a.icon;
                return (
                  <div
                    key={a.id}
                    className={`flex items-center gap-3.5 rounded-lg px-3 py-2.5 ${
                      earned ? "" : "opacity-45"
                    }`}
                  >
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${
                        earned
                          ? "border-acid/30 bg-acid/10 text-acid"
                          : "border-line bg-card text-dim"
                      }`}
                    >
                      <Icon
                        aria-hidden="true"
                        className="h-[1.125rem] w-[1.125rem]"
                      />
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold ${
                          earned ? "text-ink" : "text-dim"
                        }`}
                      >
                        {a.title}
                      </p>
                      <p className="truncate text-xs text-dim">
                        {earned ? a.description : "???"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
