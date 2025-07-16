"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import MeshGradient from "../mesh-gradient"

interface Position {
  x: number
  y: number
}

interface SnakeGameProps {
  onBack: () => void
}

const GRID_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_FOOD = { x: 15, y: 15 }
const INITIAL_DIRECTION = { x: 0, y: -1 }

export default function SnakeGame({ onBack }: SnakeGameProps) {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [food, setFood] = useState<Position>(INITIAL_FOOD)
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION)
  const [gameRunning, setGameRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  const generateFood = useCallback((): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
    } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [snake])

  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(INITIAL_FOOD)
    setDirection(INITIAL_DIRECTION)
    setGameRunning(false)
    setGameOver(false)
    setScore(0)
  }

  const startGame = () => {
    if (gameOver) resetGame()
    setGameRunning(true)
  }

  const pauseGame = () => {
    setGameRunning(false)
  }

  const moveSnake = useCallback(() => {
    if (!gameRunning || gameOver) return

    setSnake((currentSnake) => {
      const newSnake = [...currentSnake]
      const head = { ...newSnake[0] }

      head.x += direction.x
      head.y += direction.y

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true)
        setGameRunning(false)
        return currentSnake
      }

      // Check self collision
      if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true)
        setGameRunning(false)
        return currentSnake
      }

      newSnake.unshift(head)

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => {
          const newScore = prev + 10
          if (newScore > highScore) {
            setHighScore(newScore)
          }
          return newScore
        })
        setFood(generateFood())
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [direction, food, gameRunning, gameOver, generateFood, highScore])

  // Game loop
  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150)
    return () => clearInterval(gameInterval)
  }, [moveSnake])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return

      switch (e.key) {
        case "ArrowUp":
          if (direction.y !== 1) setDirection({ x: 0, y: -1 })
          break
        case "ArrowDown":
          if (direction.y !== -1) setDirection({ x: 0, y: 1 })
          break
        case "ArrowLeft":
          if (direction.x !== 1) setDirection({ x: -1, y: 0 })
          break
        case "ArrowRight":
          if (direction.x !== -1) setDirection({ x: 1, y: 0 })
          break
        case " ":
          e.preventDefault()
          gameRunning ? pauseGame() : startGame()
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [direction, gameRunning])

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black mb-4 text-black dark:text-white">
            SNAKE <span className="text-green-600 dark:text-green-400">CLASSIC</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Use arrow keys to control the snake. Eat food to grow and avoid hitting walls or yourself!
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
                    className="grid gap-1 bg-black/5 dark:bg-white/5 p-4 rounded-2xl mx-auto"
                    style={{
                      gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                      width: "min(100%, 400px)",
                      aspectRatio: "1",
                    }}
                  >
                    {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                      const x = index % GRID_SIZE
                      const y = Math.floor(index / GRID_SIZE)
                      const isSnake = snake.some((segment) => segment.x === x && segment.y === y)
                      const isHead = snake[0]?.x === x && snake[0]?.y === y
                      const isFood = food.x === x && food.y === y

                      return (
                        <div
                          key={index}
                          className={`
                            aspect-square rounded-sm transition-all duration-150
                            ${
                              isSnake
                                ? isHead
                                  ? "bg-green-600 dark:bg-green-400 shadow-lg"
                                  : "bg-green-500 dark:bg-green-500"
                                : isFood
                                  ? "bg-red-500 dark:bg-red-400 shadow-lg animate-pulse"
                                  : "bg-gray-200 dark:bg-gray-800"
                            }
                          `}
                        />
                      )
                    })}
                  </div>

                  {/* Game Over Overlay */}
                  {gameOver && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-black/50 dark:bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                    >
                      <div className="text-center text-white dark:text-white">
                        <h3 className="text-3xl font-black mb-4">GAME OVER</h3>
                        <p className="text-xl mb-6">Score: {score}</p>
                        <Button
                          onClick={startGame}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-2xl"
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

          {/* Game Controls */}
          <div className="space-y-6">
            {/* Score */}
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-6 rounded-3xl">
              <h3 className="text-xl font-black mb-4 text-black dark:text-white">SCORE</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Current</span>
                  <span className="text-2xl font-black text-green-600 dark:text-green-400">{score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Best</span>
                  <span className="text-xl font-black text-black dark:text-white">{highScore}</span>
                </div>
              </div>
            </Card>

            {/* Controls */}
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-6 rounded-3xl">
              <h3 className="text-xl font-black mb-4 text-black dark:text-white">CONTROLS</h3>
              <div className="space-y-3">
                <Button
                  onClick={gameRunning ? pauseGame : startGame}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-2xl"
                  disabled={gameOver}
                >
                  {gameRunning ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      PAUSE
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      {gameOver ? "PLAY AGAIN" : "START"}
                    </>
                  )}
                </Button>

                <Button
                  onClick={resetGame}
                  variant="ghost"
                  className="w-full backdrop-blur-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white rounded-2xl py-3"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  RESET
                </Button>
              </div>
            </Card>

            {/* Instructions */}
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-6 rounded-3xl">
              <h3 className="text-xl font-black mb-4 text-black dark:text-white">HOW TO PLAY</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>• Use arrow keys to move</p>
                <p>• Eat red food to grow</p>
                <p>• Avoid walls and yourself</p>
                <p>• Press SPACE to pause</p>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
