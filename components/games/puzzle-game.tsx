"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, RotateCcw, Trophy, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import MeshGradient from "../mesh-gradient"

interface PuzzleGameProps {
  onBack: () => void
}

type PuzzleState = number[]

const PUZZLE_SIZE = 4
const EMPTY_TILE = 0

export default function PuzzleGame({ onBack }: PuzzleGameProps) {
  const [puzzle, setPuzzle] = useState<PuzzleState>([])
  const [moves, setMoves] = useState(0)
  const [isWon, setIsWon] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [bestMoves, setBestMoves] = useState<number | null>(null)

  const createSolvedPuzzle = (): PuzzleState => {
    const solved = Array.from({ length: PUZZLE_SIZE * PUZZLE_SIZE }, (_, i) => i + 1)
    solved[solved.length - 1] = EMPTY_TILE
    return solved
  }

  const shufflePuzzle = (puzzle: PuzzleState): PuzzleState => {
    const shuffled = [...puzzle]

    // Perform 1000 random valid moves to ensure solvability
    for (let i = 0; i < 1000; i++) {
      const emptyIndex = shuffled.indexOf(EMPTY_TILE)
      const validMoves = getValidMoves(emptyIndex)

      if (validMoves.length > 0) {
        const randomMoveIndex = Math.floor(Math.random() * validMoves.length)
        const randomMove = validMoves[randomMoveIndex]

        // Swap empty tile with random valid neighbor
        ;[shuffled[emptyIndex], shuffled[randomMove]] = [shuffled[randomMove], shuffled[emptyIndex]]
      }
    }

    return shuffled
  }

  const getValidMoves = (emptyIndex: number): number[] => {
    const row = Math.floor(emptyIndex / PUZZLE_SIZE)
    const col = emptyIndex % PUZZLE_SIZE
    const validMoves: number[] = []

    // Up
    if (row > 0) validMoves.push(emptyIndex - PUZZLE_SIZE)
    // Down
    if (row < PUZZLE_SIZE - 1) validMoves.push(emptyIndex + PUZZLE_SIZE)
    // Left
    if (col > 0) validMoves.push(emptyIndex - 1)
    // Right
    if (col < PUZZLE_SIZE - 1) validMoves.push(emptyIndex + 1)

    return validMoves
  }

  const initializeGame = () => {
    const solved = createSolvedPuzzle()
    const shuffled = shufflePuzzle(solved)
    setPuzzle(shuffled)
    setMoves(0)
    setIsWon(false)
    setGameStarted(false)
  }

  const startGame = () => {
    setGameStarted(true)
  }

  const moveTile = (tileIndex: number) => {
    if (!gameStarted || isWon) return

    const emptyIndex = puzzle.indexOf(EMPTY_TILE)
    const validMoves = getValidMoves(emptyIndex)

    if (validMoves.includes(tileIndex)) {
      const newPuzzle = [...puzzle]
      ;[newPuzzle[emptyIndex], newPuzzle[tileIndex]] = [newPuzzle[tileIndex], newPuzzle[emptyIndex]]

      setPuzzle(newPuzzle)
      setMoves((prev) => prev + 1)
    }
  }

  const checkWin = (currentPuzzle: PuzzleState): boolean => {
    const solved = createSolvedPuzzle()
    return currentPuzzle.every((tile, index) => tile === solved[index])
  }

  // Check win condition
  useEffect(() => {
    if (gameStarted && checkWin(puzzle)) {
      setIsWon(true)
      setGameStarted(false)

      if (!bestMoves || moves < bestMoves) {
        setBestMoves(moves)
      }
    }
  }, [puzzle, gameStarted, moves, bestMoves])

  // Initialize game on mount
  useEffect(() => {
    initializeGame()
  }, [])

  const getTileNumber = (index: number) => {
    return puzzle[index] === EMPTY_TILE ? "" : puzzle[index].toString()
  }

  const isTileMovable = (index: number) => {
    if (!gameStarted) return false
    const emptyIndex = puzzle.indexOf(EMPTY_TILE)
    const validMoves = getValidMoves(emptyIndex)
    return validMoves.includes(index)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black mb-4 text-black dark:text-white">
            SLIDE <span className="text-orange-600 dark:text-orange-400">PUZZLE</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Arrange the numbered tiles in order by sliding them into the empty space.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-8 rounded-3xl">
              <div className="relative">
                <MeshGradient variant="card" opacity={0.1} />
                <div className="relative z-10">
                  <div
                    className="grid gap-2 bg-black/5 dark:bg-white/5 p-4 rounded-2xl mx-auto"
                    style={{
                      gridTemplateColumns: `repeat(${PUZZLE_SIZE}, 1fr)`,
                      width: "min(100%, 400px)",
                      aspectRatio: "1",
                    }}
                  >
                    {puzzle.map((tile, index) => (
                      <motion.div
                        key={index}
                        whileHover={{
                          scale: isTileMovable(index) ? 1.05 : 1,
                          y: isTileMovable(index) ? -2 : 0,
                        }}
                        whileTap={{ scale: isTileMovable(index) ? 0.95 : 1 }}
                        onClick={() => moveTile(index)}
                        className={`
                          aspect-square rounded-xl flex items-center justify-center text-2xl font-black
                          transition-all duration-200 select-none
                          ${
                            tile === EMPTY_TILE
                              ? "bg-transparent"
                              : isTileMovable(index)
                                ? "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer shadow-lg hover:shadow-xl"
                                : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                          }
                          ${!gameStarted && tile !== EMPTY_TILE ? "opacity-50" : ""}
                        `}
                      >
                        {getTileNumber(index)}
                      </motion.div>
                    ))}
                  </div>

                  {/* Win Overlay */}
                  {isWon && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-black/50 dark:bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                    >
                      <div className="text-center text-white dark:text-white">
                        <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
                        <h3 className="text-3xl font-black mb-2">PUZZLE SOLVED!</h3>
                        <p className="text-xl mb-6">Moves: {moves}</p>
                        <Button
                          onClick={initializeGame}
                          className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-2xl"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          New Puzzle
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
            {/* Stats */}
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-6 rounded-3xl">
              <h3 className="text-xl font-black mb-4 text-black dark:text-white">STATS</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Moves</span>
                  <span className="text-2xl font-black text-orange-600 dark:text-orange-400">{moves}</span>
                </div>

                {bestMoves && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Best</span>
                    <span className="text-xl font-black text-green-600 dark:text-green-400">{bestMoves}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-full ${
                      isWon
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        : gameStarted
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {isWon ? "Solved!" : gameStarted ? "Playing" : "Ready"}
                  </span>
                </div>
              </div>
            </Card>

            {/* Controls */}
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-6 rounded-3xl">
              <h3 className="text-xl font-black mb-4 text-black dark:text-white">CONTROLS</h3>
              <div className="space-y-3">
                {!gameStarted && !isWon && (
                  <Button
                    onClick={startGame}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-2xl"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    START PUZZLE
                  </Button>
                )}

                <Button
                  onClick={initializeGame}
                  variant="ghost"
                  className="w-full backdrop-blur-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white rounded-2xl py-3"
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  NEW PUZZLE
                </Button>

                <Button
                  onClick={() => setMoves(0)}
                  variant="ghost"
                  className="w-full backdrop-blur-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white rounded-2xl py-3"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  RESET MOVES
                </Button>
              </div>
            </Card>

            {/* Solution Preview */}
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-6 rounded-3xl">
              <h3 className="text-xl font-black mb-4 text-black dark:text-white">SOLUTION</h3>
              <div
                className="grid gap-1 bg-black/5 dark:bg-white/5 p-2 rounded-xl"
                style={{ gridTemplateColumns: `repeat(${PUZZLE_SIZE}, 1fr)` }}
              >
                {createSolvedPuzzle().map((tile, index) => (
                  <div
                    key={index}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center text-xs font-bold
                      ${
                        tile === EMPTY_TILE
                          ? "bg-transparent"
                          : "bg-green-200 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      }
                    `}
                  >
                    {tile === EMPTY_TILE ? "" : tile}
                  </div>
                ))}
              </div>
            </Card>

            {/* Instructions */}
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-6 rounded-3xl">
              <h3 className="text-xl font-black mb-4 text-black dark:text-white">HOW TO PLAY</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>• Click tiles next to empty space</p>
                <p>• Arrange numbers 1-15 in order</p>
                <p>• Empty space goes bottom-right</p>
                <p>• Solve in fewest moves!</p>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
