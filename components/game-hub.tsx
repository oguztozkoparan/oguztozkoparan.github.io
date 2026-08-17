"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Play, Trophy, Clock, Star, Gamepad2, Zap, Keyboard, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import MeshGradient from "./mesh-gradient"
import SnakeGame from "./games/snake-game"
import MemoryGame from "./games/memory-game"
import ReactionGame from "./games/reaction-game"
import PuzzleGame from "./games/puzzle-game"
import TypingGame from "./games/typing-game"
import { SnakeIcon, BrainIcon, PuzzleIcon } from "./icons/custom-icons"

interface Game {
  id: string
  title: string
  description: string
  icon: any
  difficulty: "Easy" | "Medium" | "Hard"
  category: "Arcade" | "Puzzle" | "Memory" | "Reaction" | "Skill"
  estimatedTime: string
  component: any
}

const games: Game[] = [
  {
    id: "snake",
    title: "SNAKE CLASSIC",
    description: "Navigate the snake to eat food and grow longer without hitting walls or yourself",
    icon: SnakeIcon,
    difficulty: "Medium",
    category: "Arcade",
    estimatedTime: "2-5 min",
    component: SnakeGame,
  },
  {
    id: "memory",
    title: "MEMORY MATCH",
    description: "Flip cards to find matching pairs and test your memory skills",
    icon: BrainIcon,
    difficulty: "Easy",
    category: "Memory",
    estimatedTime: "1-3 min",
    component: MemoryGame,
  },
  {
    id: "reaction",
    title: "REACTION TEST",
    description: "Test your reflexes by clicking when the color changes",
    icon: Zap,
    difficulty: "Easy",
    category: "Reaction",
    estimatedTime: "30 sec",
    component: ReactionGame,
  },
  {
    id: "puzzle",
    title: "SLIDE PUZZLE",
    description: "Arrange numbered tiles in order by sliding them into the empty space",
    icon: PuzzleIcon,
    difficulty: "Hard",
    category: "Puzzle",
    estimatedTime: "3-10 min",
    component: PuzzleGame,
  },
  {
    id: "typing",
    title: "TYPING SPEED",
    description: "Test your typing speed and accuracy with random words",
    icon: Keyboard,
    difficulty: "Medium",
    category: "Skill",
    estimatedTime: "1 min",
    component: TypingGame,
  },
]

const categories = ["All", "Arcade", "Puzzle", "Memory", "Reaction", "Skill"]
const difficulties = ["All", "Easy", "Medium", "Hard"]

export default function GameHub() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")

  const filteredGames = games.filter((game) => {
    const matchesCategory = selectedCategory === "All" || game.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || game.difficulty === selectedDifficulty
    return matchesCategory && matchesDifficulty
  })

  const currentGame = games.find((game) => game.id === selectedGame)

  if (selectedGame && currentGame) {
    return (
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
        <div className="fixed inset-0 pointer-events-none">
          <MeshGradient variant="hero" animated={true} opacity={0.3} />
        </div>

        <div className="relative z-10 p-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
            <Button
              onClick={() => setSelectedGame(null)}
              variant="ghost"
              className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-full px-6 py-3"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
          </motion.div>

          <currentGame.component onBack={() => setSelectedGame(null)} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <MeshGradient variant="hero" animated={true} opacity={0.4} />
        <motion.div className="opacity-30">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-400/5 dark:to-pink-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 dark:from-blue-400/5 dark:to-cyan-400/5 rounded-full blur-3xl" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-6xl md:text-8xl font-black mb-4 text-black dark:text-white leading-none">
                MINI
                <br />
                <span className="text-purple-600 dark:text-purple-400">GAMES</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
                Challenge yourself with our collection of interactive mini-games. Test your skills, reflexes, and
                strategy.
              </p>
            </div>

            <Link href="/">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-full px-6 py-3"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Portfolio
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-black text-black dark:text-white mb-3">CATEGORY</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 font-bold transition-all ${
                      selectedCategory === category
                        ? "bg-black dark:bg-white text-white dark:text-black"
                        : "backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <h3 className="text-sm font-black text-black dark:text-white mb-3">DIFFICULTY</h3>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <Button
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? "default" : "ghost"}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`rounded-full px-4 py-2 font-bold transition-all ${
                      selectedDifficulty === difficulty
                        ? "bg-black dark:bg-white text-white dark:text-black"
                        : "backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10"
                    }`}
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Games Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedGame(game.id)}
                className="cursor-pointer group"
              >
                <Card className="relative backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-8 rounded-3xl h-full overflow-hidden">
                  <MeshGradient variant="card" opacity={0.15} />

                  <div className="relative z-10">
                    {/* Game Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="inline-flex items-center justify-center w-16 h-16 bg-black/10 dark:bg-white/10 rounded-2xl mb-6 group-hover:bg-purple-600/20 dark:group-hover:bg-purple-400/20 transition-colors"
                    >
                      <game.icon className="h-8 w-8 text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                    </motion.div>

                    {/* Game Info */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-black text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {game.title}
                        </h3>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Play className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </motion.div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-sm">
                        {game.description}
                      </p>

                      {/* Game Meta */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            game.difficulty === "Easy"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                              : game.difficulty === "Medium"
                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                                : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          }`}
                        >
                          {game.difficulty}
                        </span>
                        <span className="text-xs font-bold bg-black/10 dark:bg-white/10 text-black dark:text-white px-3 py-1 rounded-full">
                          {game.category}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-2" />
                        {game.estimatedTime}
                      </div>
                    </div>

                    {/* Play Button */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                      <Button className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-black py-3 rounded-2xl group-hover:bg-purple-600 dark:group-hover:bg-purple-400 group-hover:text-white transition-all">
                        <Play className="h-4 w-4 mr-2" />
                        PLAY NOW
                      </Button>
                    </motion.div>
                  </div>

                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
                    layoutId={`hover-${game.id}`}
                  />
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Games Found */}
        {filteredGames.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="flex justify-center mb-4">
              <Search className="h-16 w-16 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-2xl font-black mb-2 text-black dark:text-white">No games found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters to see more games.</p>
          </motion.div>
        )}

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20"
        >
          <div className="relative">
            <MeshGradient variant="section" className="rounded-3xl" opacity={0.2} />
            <div className="relative z-10 grid md:grid-cols-3 gap-8">
              {[
                { icon: Trophy, label: "Games Available", value: games.length.toString() },
                { icon: Star, label: "Difficulty Levels", value: "3" },
                { icon: Gamepad2, label: "Categories", value: "5" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-8 rounded-3xl text-center">
                    <stat.icon className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                    <div className="text-3xl font-black text-black dark:text-white mb-2">{stat.value}</div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
