"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Play, RotateCcw, Keyboard, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import MeshGradient from "../mesh-gradient"

interface TypingGameProps {
  onBack: () => void
}

const WORD_LIST = [
  "the",
  "quick",
  "brown",
  "fox",
  "jumps",
  "over",
  "lazy",
  "dog",
  "pack",
  "my",
  "box",
  "with",
  "five",
  "dozen",
  "liquor",
  "jugs",
  "how",
  "vexingly",
  "quick",
  "daft",
  "zebras",
  "jump",
  "waltz",
  "bad",
  "nymph",
  "for",
  "jigs",
  "vex",
  "bright",
  "wizard",
  "form",
  "jinx",
  "code",
  "type",
  "fast",
  "keys",
  "word",
  "test",
  "speed",
  "time",
  "game",
  "play",
  "react",
  "next",
  "web",
  "dev",
  "css",
  "html",
  "javascript",
  "typescript",
  "node",
  "build",
  "design",
  "modern",
  "clean",
  "simple",
  "elegant",
  "beautiful",
  "awesome",
]

const GAME_DURATION = 60 // seconds

export default function TypingGame({ onBack }: TypingGameProps) {
  const [words, setWords] = useState<string[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentInput, setCurrentInput] = useState("")
  const [gameStarted, setGameStarted] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [correctWords, setCorrectWords] = useState(0)
  const [incorrectWords, setIncorrectWords] = useState(0)
  const [totalChars, setTotalChars] = useState(0)
  const [correctChars, setCorrectChars] = useState(0)
  const [bestWPM, setBestWPM] = useState<number | null>(null)
  const [bestAccuracy, setBestAccuracy] = useState<number | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  const generateWords = () => {
    const shuffled = [...WORD_LIST].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 50) // Generate 50 random words
  }

  const initializeGame = () => {
    const newWords = generateWords()
    setWords(newWords)
    setCurrentWordIndex(0)
    setCurrentInput("")
    setGameStarted(false)
    setGameEnded(false)
    setTimeLeft(GAME_DURATION)
    setCorrectWords(0)
    setIncorrectWords(0)
    setTotalChars(0)
    setCorrectChars(0)
  }

  const startGame = () => {
    setGameStarted(true)
    inputRef.current?.focus()
  }

  const endGame = () => {
    setGameStarted(false)
    setGameEnded(true)

    const wpm = Math.round((correctWords / GAME_DURATION) * 60)
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0

    if (!bestWPM || wpm > bestWPM) {
      setBestWPM(wpm)
    }

    if (!bestAccuracy || accuracy > bestAccuracy) {
      setBestAccuracy(accuracy)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!gameStarted) return

    const value = e.target.value
    setCurrentInput(value)

    const currentWord = words[currentWordIndex]
    if (!currentWord) return

    // Check if word is completed (space or exact match)
    if (value.endsWith(" ") || value === currentWord) {
      const typedWord = value.replace(" ", "")
      const isCorrect = typedWord === currentWord

      if (isCorrect) {
        setCorrectWords((prev) => prev + 1)
        setCorrectChars((prev) => prev + currentWord.length)
      } else {
        setIncorrectWords((prev) => prev + 1)
      }

      setTotalChars((prev) => prev + typedWord.length)
      setCurrentInput("")
      setCurrentWordIndex((prev) => prev + 1)
    }
  }

  const getCurrentWordStatus = () => {
    const currentWord = words[currentWordIndex]
    if (!currentWord) return { correct: "", incorrect: "", remaining: "" }

    const input = currentInput.replace(" ", "")
    let correct = ""
    let incorrect = ""
    let remaining = currentWord

    for (let i = 0; i < Math.min(input.length, currentWord.length); i++) {
      if (input[i] === currentWord[i]) {
        correct += currentWord[i]
      } else {
        incorrect += currentWord[i]
        break
      }
    }

    remaining = currentWord.slice(correct.length + incorrect.length)

    return { correct, incorrect, remaining }
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStarted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, timeLeft])

  // Initialize game on mount
  useEffect(() => {
    initializeGame()
  }, [])

  const calculateWPM = () => {
    const elapsed = GAME_DURATION - timeLeft
    return elapsed > 0 ? Math.round((correctWords / elapsed) * 60) : 0
  }

  const calculateAccuracy = () => {
    return totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const { correct, incorrect, remaining } = getCurrentWordStatus()

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black mb-4 text-black dark:text-white">
            TYPING <span className="text-cyan-600 dark:text-cyan-400">SPEED</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test your typing speed and accuracy. Type the words as fast and accurately as possible!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Game Area */}
          <div className="lg:col-span-2">
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-8 rounded-3xl">
              <div className="relative">
                <MeshGradient variant="card" opacity={0.1} />
                <div className="relative z-10">
                  {/* Words Display */}
                  <div className="bg-black/5 dark:bg-white/5 p-6 rounded-2xl mb-6 min-h-[200px]">
                    <div className="flex flex-wrap gap-2 text-lg leading-relaxed">
                      {words.slice(0, currentWordIndex + 10).map((word, index) => {
                        if (index < currentWordIndex) {
                          return (
                            <span key={index} className="text-green-600 dark:text-green-400 font-medium">
                              {word}
                            </span>
                          )
                        } else if (index === currentWordIndex) {
                          return (
                            <span key={index} className="relative">
                              <span className="text-green-600 dark:text-green-400 font-medium">{correct}</span>
                              <span className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 font-medium">
                                {incorrect}
                              </span>
                              <span className="text-black dark:text-white font-medium">{remaining}</span>
                              {gameStarted && (
                                <motion.span
                                  animate={{ opacity: [1, 0, 1] }}
                                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                                  className="absolute -right-1 top-0 w-0.5 h-6 bg-blue-600 dark:bg-blue-400"
                                />
                              )}
                            </span>
                          )
                        } else {
                          return (
                            <span key={index} className="text-gray-400 dark:text-gray-600 font-medium">
                              {word}
                            </span>
                          )
                        }
                      })}
                    </div>
                  </div>

                  {/* Input Field */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={handleInputChange}
                    disabled={!gameStarted || gameEnded}
                    placeholder={gameStarted ? "Start typing..." : "Click START to begin"}
                    className="w-full px-6 py-4 backdrop-blur-xl bg-white/40 dark:bg-black/40 border border-black/20 dark:border-white/20 rounded-2xl text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 text-lg disabled:opacity-50"
                  />

                  {/* Game Over Overlay */}
                  {gameEnded && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-black/50 dark:bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                    >
                      <div className="text-center text-white dark:text-white">
                        <Keyboard className="h-16 w-16 mx-auto mb-4 text-cyan-400" />
                        <h3 className="text-3xl font-black mb-4">TIME'S UP!</h3>
                        <div className="space-y-2 mb-6">
                          <p className="text-xl">
                            WPM: <span className="font-black text-cyan-400">{calculateWPM()}</span>
                          </p>
                          <p className="text-xl">
                            Accuracy: <span className="font-black text-green-400">{calculateAccuracy()}%</span>
                          </p>
                          <p className="text-lg">
                            Words: {correctWords} correct, {incorrectWords} incorrect
                          </p>
                        </div>
                        <Button
                          onClick={initializeGame}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-6 py-3 rounded-2xl"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Try Again
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Stats & Controls */}
          <div className="space-y-6">
            {/* Live Stats */}
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-6 rounded-3xl">
              <h3 className="text-xl font-black mb-4 text-black dark:text-white">LIVE STATS</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Time
                  </span>
                  <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400">{formatTime(timeLeft)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">WPM</span>
                  <span className="text-xl font-black text-black dark:text-white">{calculateWPM()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Accuracy</span>
                  <span className="text-lg font-black text-green-600 dark:text-green-400">{calculateAccuracy()}%</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Words</span>
                  <span className="text-lg font-black text-blue-600 dark:text-blue-400">{correctWords}</span>
                </div>
              </div>
            </Card>

            {/* Best Scores */}
            {(bestWPM || bestAccuracy) && (
              <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-6 rounded-3xl">
                <h3 className="text-xl font-black mb-4 text-black dark:text-white">BEST SCORES</h3>
                <div className="space-y-3">
                  {bestWPM && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Best WPM</span>
                      <span className="text-xl font-black text-yellow-600 dark:text-yellow-400">{bestWPM}</span>
                    </div>
                  )}

                  {bestAccuracy && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Best Accuracy</span>
                      <span className="text-lg font-black text-green-600 dark:text-green-400">{bestAccuracy}%</span>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Controls */}
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-6 rounded-3xl">
              <h3 className="text-xl font-black mb-4 text-black dark:text-white">CONTROLS</h3>
              <div className="space-y-3">
                {!gameStarted && !gameEnded && (
                  <Button
                    onClick={startGame}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-2xl"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    START TEST
                  </Button>
                )}

                <Button
                  onClick={initializeGame}
                  variant="ghost"
                  className="w-full backdrop-blur-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white rounded-2xl py-3"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  NEW TEST
                </Button>
              </div>
            </Card>

            {/* WPM Guide */}
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-6 rounded-3xl">
              <h3 className="text-xl font-black mb-4 text-black dark:text-white">WPM GUIDE</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Beginner</span>
                  <span className="text-red-600 dark:text-red-400 font-bold">&lt; 30 WPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Average</span>
                  <span className="text-orange-600 dark:text-orange-400 font-bold">30-50 WPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Good</span>
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold">50-70 WPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Excellent</span>
                  <span className="text-green-600 dark:text-green-400 font-bold">70-90 WPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Expert</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">&gt; 90 WPM</span>
                </div>
              </div>
            </Card>

            {/* Instructions */}
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-6 rounded-3xl">
              <h3 className="text-xl font-black mb-4 text-black dark:text-white">HOW TO PLAY</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>• Type the highlighted word</p>
                <p>• Press space after each word</p>
                <p>• Focus on accuracy first</p>
                <p>• Speed comes with practice!</p>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
