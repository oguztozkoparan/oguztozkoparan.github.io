"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, Keyboard } from "lucide-react";
import SnakeGame from "./games/snake-game";
import MemoryGame from "./games/memory-game";
import ReactionGame from "./games/reaction-game";
import PuzzleGame from "./games/puzzle-game";
import TypingGame from "./games/typing-game";
import { SnakeIcon, BrainIcon, PuzzleIcon } from "./icons/custom-icons";

interface Game {
  id: string;
  index: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  difficulty: "Easy" | "Medium" | "Hard";
  category: "Arcade" | "Puzzle" | "Memory" | "Reaction" | "Skill";
  estimatedTime: string;
  component: React.ComponentType<{ onBack?: () => void }>;
}

const games: Game[] = [
  {
    id: "snake",
    index: "01",
    title: "Snake Classic",
    description:
      "Navigate the snake to eat food and grow longer without hitting walls or yourself",
    icon: SnakeIcon,
    difficulty: "Medium",
    category: "Arcade",
    estimatedTime: "2-5 min",
    component: SnakeGame,
  },
  {
    id: "memory",
    index: "02",
    title: "Memory Match",
    description: "Flip cards to find matching pairs and test your memory skills",
    icon: BrainIcon,
    difficulty: "Easy",
    category: "Memory",
    estimatedTime: "1-3 min",
    component: MemoryGame,
  },
  {
    id: "reaction",
    index: "03",
    title: "Reaction Test",
    description: "Test your reflexes by clicking when the color changes",
    icon: Zap,
    difficulty: "Easy",
    category: "Reaction",
    estimatedTime: "30 sec",
    component: ReactionGame,
  },
  {
    id: "puzzle",
    index: "04",
    title: "Slide Puzzle",
    description:
      "Arrange numbered tiles in order by sliding them into the empty space",
    icon: PuzzleIcon,
    difficulty: "Hard",
    category: "Puzzle",
    estimatedTime: "3-10 min",
    component: PuzzleGame,
  },
  {
    id: "typing",
    index: "05",
    title: "Typing Speed",
    description: "Test your typing speed and accuracy with random words",
    icon: Keyboard,
    difficulty: "Medium",
    category: "Skill",
    estimatedTime: "1 min",
    component: TypingGame,
  },
];

const categories = ["All", "Arcade", "Puzzle", "Memory", "Reaction", "Skill"];
const difficulties = ["All", "Easy", "Medium", "Hard"];

function FilterPills({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="label mb-3 text-dim">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`label rounded-full border px-4 py-2 transition-colors duration-200 ${
              value === option
                ? "border-acid bg-acid text-void"
                : "border-line text-dim hover:border-acid/50 hover:text-ink"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function GameHub() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const filteredGames = games.filter((game) => {
    const matchesCategory =
      selectedCategory === "All" || game.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "All" || game.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  const currentGame = games.find((game) => game.id === selectedGame);

  if (selectedGame && currentGame) {
    return (
      <div className="min-h-svh px-6 pb-16 pt-28 md:px-10 md:pt-32">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          type="button"
          onClick={() => setSelectedGame(null)}
          className="link-sweep label mb-10 inline-flex items-center gap-2 text-dim hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All games
        </motion.button>

        <currentGame.component onBack={() => setSelectedGame(null)} />
      </div>
    );
  }

  return (
    <div className="px-6 pb-24 pt-32 md:px-10 md:pt-40">
      {/* header */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <p className="label text-dim">
          <span className="text-acid">Playground</span> /{" "}
          {String(games.length).padStart(2, "0")} games
        </p>
        <h1 className="display mt-6 text-6xl text-ink md:text-8xl">
          Mini
          <br />
          <span className="text-acid">Games</span>
        </h1>
        <p className="mt-6 max-w-md text-dim">
          Challenge yourself with a collection of interactive mini-games. Test
          your skills, reflexes and strategy.
        </p>
      </motion.div>

      {/* filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-14 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"
      >
        <FilterPills
          label="Category"
          options={categories}
          value={selectedCategory}
          onChange={setSelectedCategory}
        />
        <FilterPills
          label="Difficulty"
          options={difficulties}
          value={selectedDifficulty}
          onChange={setSelectedDifficulty}
        />
      </motion.div>

      {/* grid */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence>
          {filteredGames.map((game, index) => (
            <motion.button
              key={game.id}
              type="button"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ delay: index * 0.06 }}
              onClick={() => setSelectedGame(game.id)}
              className="group flex h-full flex-col rounded-2xl border border-line bg-card p-6 text-left transition-colors duration-300 hover:border-acid/50 md:p-7"
            >
              <div className="flex items-start justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-line text-ink transition-colors duration-300 group-hover:border-acid/50 group-hover:text-acid">
                  <game.icon className="h-6 w-6" />
                </span>
                <span className="label text-acid">{game.index}</span>
              </div>

              <h2 className="display mt-6 text-3xl text-ink">{game.title}</h2>
              <p className="mt-3 grow text-sm leading-relaxed text-ink/75">
                {game.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
                <div className="flex flex-wrap gap-2">
                  <span className="label rounded-full border border-acid/40 px-3 py-1.5 text-acid">
                    {game.difficulty}
                  </span>
                  <span className="label rounded-full border border-line px-3 py-1.5 text-dim">
                    {game.category}
                  </span>
                  <span className="label rounded-full border border-line px-3 py-1.5 text-dim">
                    {game.estimatedTime}
                  </span>
                </div>
                <span
                  aria-hidden="true"
                  className="display text-2xl text-acid transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* empty state */}
      {filteredGames.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 rounded-2xl border border-line bg-panel px-8 py-16 text-center"
        >
          <h2 className="display text-3xl text-ink">No games found</h2>
          <p className="mt-3 text-dim">
            Try adjusting your filters to see more games.
          </p>
        </motion.div>
      )}

      {/* stats */}
      <div className="mt-20 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
        {[
          { k: "Games available", v: String(games.length).padStart(2, "0") },
          { k: "Difficulty levels", v: "03" },
          { k: "Categories", v: "05" },
        ].map((stat) => (
          <div key={stat.k} className="bg-panel px-6 py-6">
            <p className="label text-dim">{stat.k}</p>
            <p className="display mt-3 text-2xl text-ink md:text-3xl">
              {stat.v}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
