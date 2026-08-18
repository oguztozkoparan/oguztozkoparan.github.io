// ---------------------------------------------------------------------------
// Soulslike achievement registry. unlock(id) is idempotent — already-earned
// ids (persisted in localStorage "ot-achievements") do nothing. Fresh unlocks
// persist, chime (SFX opt-in respected) and notify subscribers so the toast
// layer in components/Achievements.tsx can announce them.
//
// Two entry points, same result:
//   import { unlock } from "@/lib/achievements";  unlock("cheat-code");
//   window.dispatchEvent(new CustomEvent("ot:achievement",
//     { detail: { id: "fate-reader" } }));        // fire-and-forget
// ---------------------------------------------------------------------------

import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Eye,
  Footprints,
  Gamepad2,
  Joystick,
  Pickaxe,
  Swords,
  Volume2,
} from "lucide-react";
import { audio } from "@/lib/audio";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const achievements: Achievement[] = [
  {
    id: "grid-walker",
    title: "Grid Walker",
    description: "Rode the grid all the way down.",
    icon: Footprints,
  },
  {
    id: "dungeon-delver",
    title: "Dungeon Delver",
    description: "Found the terminal beneath the site.",
    icon: Pickaxe,
  },
  {
    id: "arcade-initiate",
    title: "Arcade Initiate",
    description: "Stepped into the game chamber.",
    icon: Gamepad2,
  },
  {
    id: "cheat-code",
    title: "Cheat Code",
    description: "You know the old ways.",
    icon: Joystick,
  },
  {
    id: "spellcaster",
    title: "Spellcaster",
    description: "Opened the command grimoire.",
    icon: BookOpen,
  },
  {
    id: "sound-awakened",
    title: "Sound Awakened",
    description: "Gave the grid a voice.",
    icon: Volume2,
  },
  {
    id: "fate-reader",
    title: "Fate Reader",
    description: "Turned a card and read what was written.",
    icon: Eye,
  },
  {
    id: "guardian-slayer",
    title: "Guardian Slayer",
    description: "Felled the sector guardian.",
    icon: Swords,
  },
];

const LS_KEY = "ot-achievements";

export function getUnlocked(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
    return Array.isArray(raw)
      ? raw.filter((v): v is string => typeof v === "string")
      : [];
  } catch {
    return [];
  }
}

export function isUnlocked(id: string): boolean {
  return getUnlocked().includes(id);
}

type UnlockListener = (achievement: Achievement) => void;
const listeners = new Set<UnlockListener>();

export function onUnlock(fn: UnlockListener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function unlock(id: string) {
  if (typeof window === "undefined") return;
  const achievement = achievements.find((a) => a.id === id);
  if (!achievement) return;
  const unlocked = getUnlocked();
  if (unlocked.includes(id)) return; // idempotent
  localStorage.setItem(LS_KEY, JSON.stringify([...unlocked, id]));
  audio.unlockChime();
  for (const fn of listeners) fn(achievement);
}
