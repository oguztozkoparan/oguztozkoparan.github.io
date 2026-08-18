import type { Metadata } from "next";
import GameHub from "@/components/game-hub";

export const metadata: Metadata = {
  title: "Mini Games",
  description:
    "Five browser mini-games — snake, memory, reaction, sliding puzzle and typing speed.",
  alternates: { canonical: "/games" },
};

export default function GamesPage() {
  return <GameHub />;
}
