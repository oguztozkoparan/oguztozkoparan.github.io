"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, RotateCcw, Trophy, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface MemoryCard {
  id: number
  value: string
  isFlipped: boolean
  isMatched: boolean
}

interface MemoryGameProps {
  onBack?: () => void
}

const CARD_VALUES = ["🎮", "🎯", "🎨", "🎪", "🎭", "🎸", "🎺", "🎲"]

export default function MemoryGame({ onBack }: MemoryGameProps) {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [timer, setTimer] = useState(0)
  const [bestTime, setBestTime] = useState<number | null>(null)

  const initializeGame = () => {
    const shuffledCards = [...CARD_VALUES, ...CARD_VALUES]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }))

    setCards(shuffledCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setGameStarted(false)
    setGameWon(false)
    setTimer(0)
  }

  const startGame = () => {
    setGameStarted(true)
  }

  const flipCard = (cardId: number) => {
    if (!gameStarted || flippedCards.length >= 2) return

    const card = cards.find((c) => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)))

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1)

      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find((c) => c.id === firstId)
      const secondCard = cards.find((c) => c.id === secondId)

      if (firstCard?.value === secondCard?.value) {
        // Match found
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c)))
          setMatchedPairs((prev) => prev + 1)
          setFlippedCards([])
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c)))
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, gameWon])

  // Check win condition
  useEffect(() => {
    if (matchedPairs === CARD_VALUES.length && gameStarted) {
      setGameWon(true)
      setGameStarted(false)

      if (!bestTime || timer < bestTime) {
        setBestTime(timer)
      }
    }
  }, [matchedPairs, gameStarted, timer, bestTime])

  // Initialize game on mount
  useEffect(() => {
    initializeGame()
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black mb-4 text-ink">
            MEMORY <span className="text-acid">MATCH</span>
          </h1>
          <p className="text-dim">
            Flip cards to find matching pairs. Complete the puzzle in the fewest moves!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <Card className="border border-line bg-card p-8 rounded-2xl">
              <div className="relative">
                <div className="relative z-10">
                  <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                    {cards.map((card) => (
                      <motion.div
                        key={card.id}
                        whileHover={{ scale: gameStarted ? 1.05 : 1 }}
                        whileTap={{ scale: gameStarted ? 0.95 : 1 }}
                        onClick={() => flipCard(card.id)}
                        className={`
                          aspect-square rounded-2xl cursor-pointer relative overflow-hidden
                          ${gameStarted ? "hover:shadow-lg" : "cursor-not-allowed opacity-50"}
                        `}
                      >
                        <AnimatePresence mode="wait">
                          {card.isFlipped || card.isMatched ? (
                            <motion.div
                              key="front"
                              initial={{ rotateY: -90 }}
                              animate={{ rotateY: 0 }}
                              exit={{ rotateY: 90 }}
                              transition={{ duration: 0.3 }}
                              className={`
                                absolute inset-0 flex items-center justify-center text-4xl font-bold rounded-2xl
                                ${
                                  card.isMatched
                                    ? "border border-acid/40 border-2 border-green-500"
                                    : "border border-acid/40 border-2 border-blue-500"
                                }
                              `}
                            >
                              {card.value}
                            </motion.div>
                          ) : (
                            <motion.div
                              key="back"
                              initial={{ rotateY: -90 }}
                              animate={{ rotateY: 0 }}
                              exit={{ rotateY: 90 }}
                              transition={{ duration: 0.3 }}
                              className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center"
                            >
                              <div className="text-white text-2xl">?</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>

                  {/* Win Overlay */}
                  {gameWon && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-void/70 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                    >
                      <div className="text-center text-white dark:text-white">
                        <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
                        <h3 className="text-3xl font-black mb-2">CONGRATULATIONS!</h3>
                        <p className="text-xl mb-2">Time: {formatTime(timer)}</p>
                        <p className="text-lg mb-6">Moves: {moves}</p>
                        <Button
                          onClick={initializeGame}
                          className="bg-acid hover:bg-acid/90 text-void font-bold px-6 py-3 rounded-2xl"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Play Again
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Game Stats */}
          <div className="space-y-6">
            {/* Timer & Moves */}
            <Card className="border border-line bg-card p-6 rounded-2xl">
              <h3 className="text-xl font-black mb-4 text-ink">STATS</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-dim flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Time
                  </span>
                  <span className="text-2xl font-black text-acid">{formatTime(timer)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dim">Moves</span>
                  <span className="text-xl font-black text-ink">{moves}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dim">Pairs</span>
                  <span className="text-xl font-black text-acid">
                    {matchedPairs}/{CARD_VALUES.length}
                  </span>
                </div>
                {bestTime && (
                  <div className="flex justify-between items-center pt-2 border-t border-line">
                    <span className="text-dim">Best Time</span>
                    <span className="text-lg font-black text-acid">
                      {formatTime(bestTime)}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Controls */}
            <Card className="border border-line bg-card p-6 rounded-2xl">
              <h3 className="text-xl font-black mb-4 text-ink">CONTROLS</h3>
              <div className="space-y-3">
                {!gameStarted && !gameWon && (
                  <Button
                    onClick={startGame}
                    className="w-full bg-acid hover:bg-acid/90 text-void font-bold py-3 rounded-2xl"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    START GAME
                  </Button>
                )}

                <Button
                  onClick={initializeGame}
                  variant="ghost"
                  className="w-full backdrop-blur-xl bg-black/5 dark:bg-white/5 border border-line hover:bg-black/10 dark:hover:bg-white/10 text-ink rounded-2xl py-3"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  NEW GAME
                </Button>
              </div>
            </Card>

            {/* Instructions */}
            <Card className="border border-line bg-card p-6 rounded-2xl">
              <h3 className="text-xl font-black mb-4 text-ink">HOW TO PLAY</h3>
              <div className="space-y-2 text-sm text-dim">
                <p>• Click cards to flip them</p>
                <p>• Find matching pairs</p>
                <p>• Complete in fewest moves</p>
                <p>• Beat your best time!</p>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
