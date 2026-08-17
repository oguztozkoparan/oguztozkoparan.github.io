"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Play, RotateCcw, Zap, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ReactionGameProps {
  onBack?: () => void
}

type GameState = "waiting" | "ready" | "go" | "clicked" | "tooEarly"

export default function ReactionGame({ onBack }: ReactionGameProps) {
  const [gameState, setGameState] = useState<GameState>("waiting")
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [bestTime, setBestTime] = useState<number | null>(null)
  const [attempts, setAttempts] = useState<number[]>([])
  const [countdown, setCountdown] = useState(0)

  const startTimeRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const startGame = () => {
    setGameState("ready")
    setReactionTime(null)

    // Random delay between 2-6 seconds
    const delay = Math.random() * 4000 + 2000

    timeoutRef.current = setTimeout(() => {
      setGameState("go")
      startTimeRef.current = Date.now()
    }, delay)
  }

  const handleClick = () => {
    if (gameState === "ready") {
      // Clicked too early
      setGameState("tooEarly")
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    } else if (gameState === "go") {
      // Good click
      const endTime = Date.now()
      const reaction = endTime - startTimeRef.current
      setReactionTime(reaction)
      setGameState("clicked")

      // Update attempts and best time
      const newAttempts = [...attempts, reaction]
      setAttempts(newAttempts)

      if (!bestTime || reaction < bestTime) {
        setBestTime(reaction)
      }
    }
  }

  const resetGame = () => {
    setGameState("waiting")
    setReactionTime(null)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const resetStats = () => {
    setAttempts([])
    setBestTime(null)
    resetGame()
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const getAverageTime = () => {
    if (attempts.length === 0) return null
    return Math.round(attempts.reduce((sum, time) => sum + time, 0) / attempts.length)
  }

  const getStateMessage = () => {
    switch (gameState) {
      case "waiting":
        return "Click START to begin"
      case "ready":
        return "Wait for GREEN..."
      case "go":
        return "CLICK NOW!"
      case "clicked":
        return `${reactionTime}ms - ${getReactionRating(reactionTime!)}`
      case "tooEarly":
        return "Too early! Wait for green."
      default:
        return ""
    }
  }

  const getReactionRating = (time: number) => {
    if (time < 200) return "Lightning Fast! ⚡"
    if (time < 300) return "Excellent! 🎯"
    if (time < 400) return "Good! 👍"
    if (time < 500) return "Average 👌"
    return "Try again! 🐌"
  }

  const getStateColor = () => {
    switch (gameState) {
      case "waiting":
        return "bg-gray-400 dark:bg-gray-600"
      case "ready":
        return "bg-red-500 dark:bg-red-600"
      case "go":
        return "bg-green-500 dark:bg-green-600"
      case "clicked":
        return "bg-blue-500 dark:bg-blue-600"
      case "tooEarly":
        return "bg-orange-500 dark:bg-orange-600"
      default:
        return "bg-gray-400 dark:bg-gray-600"
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black mb-4 text-ink">
            REACTION <span className="text-acid">TEST</span>
          </h1>
          <p className="text-dim">Test your reflexes! Click when the screen turns green.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Game Area */}
          <div className="lg:col-span-2">
            <Card className="border border-line bg-card p-8 rounded-2xl">
              <div className="relative">
                <div className="relative z-10">
                  <motion.div
                    onClick={handleClick}
                    whileHover={{ scale: gameState === "go" || gameState === "ready" ? 1.02 : 1 }}
                    whileTap={{ scale: gameState === "go" || gameState === "ready" ? 0.98 : 1 }}
                    className={`
                      w-full aspect-square max-w-md mx-auto rounded-2xl flex flex-col items-center justify-center
                      transition-all duration-300 cursor-pointer select-none
                      ${getStateColor()}
                      ${gameState === "go" || gameState === "ready" ? "hover:shadow-2xl" : ""}
                    `}
                  >
                    <div className="text-center text-white">
                      {gameState === "go" && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-4">
                          <Zap className="h-16 w-16 mx-auto" />
                        </motion.div>
                      )}

                      {gameState === "ready" && (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                          className="mb-4"
                        >
                          <Clock className="h-16 w-16 mx-auto" />
                        </motion.div>
                      )}

                      <h2 className="text-2xl md:text-4xl font-black mb-2">
                        {gameState === "clicked" && reactionTime
                          ? `${reactionTime}ms`
                          : gameState === "go"
                            ? "CLICK!"
                            : gameState === "ready"
                              ? "WAIT..."
                              : gameState === "tooEarly"
                                ? "TOO EARLY!"
                                : "READY?"}
                      </h2>

                      <p className="text-lg opacity-90">{getStateMessage()}</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats & Controls */}
          <div className="space-y-6">
            {/* Current Stats */}
            <Card className="border border-line bg-card p-6 rounded-2xl">
              <h3 className="text-xl font-black mb-4 text-ink">STATS</h3>
              <div className="space-y-3">
                {reactionTime && (
                  <div className="flex justify-between items-center">
                    <span className="text-dim">Last</span>
                    <span className="text-2xl font-black text-acid">{reactionTime}ms</span>
                  </div>
                )}

                {bestTime && (
                  <div className="flex justify-between items-center">
                    <span className="text-dim">Best</span>
                    <span className="text-xl font-black text-acid">{bestTime}ms</span>
                  </div>
                )}

                {getAverageTime() && (
                  <div className="flex justify-between items-center">
                    <span className="text-dim">Average</span>
                    <span className="text-lg font-black text-ink">{getAverageTime()}ms</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-dim">Attempts</span>
                  <span className="text-lg font-black text-acid">{attempts.length}</span>
                </div>
              </div>
            </Card>

            {/* Controls */}
            <Card className="border border-line bg-card p-6 rounded-2xl">
              <h3 className="text-xl font-black mb-4 text-ink">CONTROLS</h3>
              <div className="space-y-3">
                <Button
                  onClick={startGame}
                  disabled={gameState === "ready" || gameState === "go"}
                  className="w-full bg-acid hover:bg-acid/90 text-void font-bold py-3 rounded-2xl disabled:opacity-50"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {gameState === "ready" || gameState === "go" ? "IN PROGRESS..." : "START TEST"}
                </Button>

                <Button
                  onClick={resetGame}
                  variant="ghost"
                  className="w-full backdrop-blur-xl bg-black/5 dark:bg-white/5 border border-line hover:bg-black/10 dark:hover:bg-white/10 text-ink rounded-2xl py-3"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  RESET
                </Button>

                {attempts.length > 0 && (
                  <Button
                    onClick={resetStats}
                    variant="ghost"
                    className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl py-3"
                  >
                    Clear Stats
                  </Button>
                )}
              </div>
            </Card>

            {/* Reaction Time Guide */}
            <Card className="border border-line bg-card p-6 rounded-2xl">
              <h3 className="text-xl font-black mb-4 text-ink">REACTION GUIDE</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-dim">&lt; 200ms</span>
                  <span className="text-acid font-bold">Lightning ⚡</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dim">200-300ms</span>
                  <span className="text-acid font-bold">Excellent 🎯</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dim">300-400ms</span>
                  <span className="text-acid font-bold">Good 👍</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dim">400-500ms</span>
                  <span className="text-acid font-bold">Average 👌</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dim">&gt; 500ms</span>
                  <span className="text-red-600 dark:text-red-400 font-bold">Slow 🐌</span>
                </div>
              </div>
            </Card>

            {/* Instructions */}
            <Card className="border border-line bg-card p-6 rounded-2xl">
              <h3 className="text-xl font-black mb-4 text-ink">HOW TO PLAY</h3>
              <div className="space-y-2 text-sm text-dim">
                <p>• Click START to begin</p>
                <p>• Wait for the green signal</p>
                <p>• Click as fast as possible</p>
                <p>• Don't click on red!</p>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
