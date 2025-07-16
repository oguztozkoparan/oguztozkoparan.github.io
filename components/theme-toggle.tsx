"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ThemeToggleProps {
  variant?: "default" | "expanded" | "floating" | "minimal" | "brutalist"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

export default function ThemeToggle({
  variant = "default",
  size = "md",
  showLabel = false,
  className = "",
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`animate-pulse bg-black/10 dark:bg-white/10 rounded-full ${getSizeClasses(size)} ${className}`} />
    )
  }

  const currentTheme = resolvedTheme || theme
  const isDark = currentTheme === "dark"

  // Default Theme Toggle
  if (variant === "default") {
    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`relative ${className}`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={`
            relative overflow-hidden backdrop-blur-xl 
            bg-white/60 dark:bg-black/60 
            border border-black/10 dark:border-white/10 
            hover:bg-white/80 dark:hover:bg-black/80
            rounded-full transition-all duration-300
            ${getSizeClasses(size)}
            group
          `}
          aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        >
          {/* Background Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            layoutId="glow"
          />

          {/* Icon Container */}
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={isDark ? "moon" : "sun"}
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {isDark ? (
                  <Moon className={`${getIconSize(size)} text-white`} />
                ) : (
                  <Sun className={`${getIconSize(size)} text-black`} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Ripple Effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20 dark:bg-black/20 scale-0"
            whileTap={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </Button>

        {showLabel && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap"
          >
            {isDark ? "Dark Mode" : "Light Mode"}
          </motion.span>
        )}
      </motion.div>
    )
  }

  // Expanded Theme Toggle with Options
  if (variant === "expanded") {
    return (
      <div className={`relative ${className}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 rounded-2xl p-2"
        >
          <div className="flex items-center gap-2">
            {[
              { key: "light", icon: Sun, label: "Light" },
              { key: "dark", icon: Moon, label: "Dark" },
              { key: "system", icon: Monitor, label: "System" },
            ].map((option) => (
              <motion.button
                key={option.key}
                onClick={() => setTheme(option.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative p-3 rounded-xl transition-all duration-300
                  ${
                    theme === option.key
                      ? "bg-black dark:bg-white text-white dark:text-black shadow-lg"
                      : "hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white"
                  }
                `}
                aria-label={`Switch to ${option.label.toLowerCase()} theme`}
              >
                <option.icon className="h-5 w-5" />

                {theme === option.key && (
                  <motion.div
                    layoutId="activeTheme"
                    className="absolute inset-0 bg-black dark:bg-white rounded-xl"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {showLabel && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap"
          >
            Theme: {theme?.charAt(0).toUpperCase() + theme?.slice(1)}
          </motion.div>
        )}
      </div>
    )
  }

  // Floating Theme Toggle
  if (variant === "floating") {
    return (
      <motion.div
        className={`fixed bottom-8 right-8 z-50 ${className}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", bounce: 0.3 }}
      >
        <motion.button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          className="
            relative w-16 h-16 backdrop-blur-xl 
            bg-white/80 dark:bg-black/80 
            border border-black/20 dark:border-white/20 
            rounded-full shadow-2xl
            flex items-center justify-center
            group overflow-hidden
          "
          aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        >
          {/* Animated Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />

          {/* Icon */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isDark ? "moon" : "sun"}
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 90, scale: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isDark ? <Moon className="h-6 w-6 text-white" /> : <Sun className="h-6 w-6 text-black" />}
            </motion.div>
          </AnimatePresence>

          {/* Pulse Effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-blue-500/50"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </motion.button>
      </motion.div>
    )
  }

  // Minimal Theme Toggle
  if (variant === "minimal") {
    return (
      <motion.button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative p-2 rounded-lg transition-all duration-300
          hover:bg-black/5 dark:hover:bg-white/5
          ${className}
        `}
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isDark ? "moon" : "sun"}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? <Moon className="h-5 w-5 text-white" /> : <Sun className="h-5 w-5 text-black" />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    )
  }

  // Brutalist Theme Toggle
  if (variant === "brutalist") {
    return (
      <motion.div
        whileHover={{ scale: 1.02, rotate: 1 }}
        whileTap={{ scale: 0.98 }}
        className={`relative ${className}`}
      >
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="
            relative overflow-hidden backdrop-blur-xl
            bg-white/60 dark:bg-black/60 
            border-2 border-black dark:border-white
            hover:bg-white/80 dark:hover:bg-black/80
            px-6 py-3 font-black text-sm
            transition-all duration-300
            group
          "
          style={{
            clipPath: "polygon(0% 0%, 90% 0%, 100% 100%, 10% 100%)",
            transform: "skew(-5deg)",
          }}
          aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        >
          <div className="flex items-center gap-2" style={{ transform: "skew(5deg)" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={isDark ? "moon" : "sun"}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isDark ? <Moon className="h-4 w-4 text-white" /> : <Sun className="h-4 w-4 text-black" />}
              </motion.div>
            </AnimatePresence>

            <span className="text-black dark:text-white">{isDark ? "DARK" : "LIGHT"}</span>
          </div>

          {/* Brutalist Shadow Effect */}
          <div
            className="absolute inset-0 bg-black dark:bg-white opacity-20 -z-10"
            style={{
              clipPath: "polygon(0% 0%, 90% 0%, 100% 100%, 10% 100%)",
              transform: "translate(4px, 4px)",
            }}
          />
        </button>
      </motion.div>
    )
  }

  return null
}

// Helper functions
function getSizeClasses(size: string) {
  switch (size) {
    case "sm":
      return "w-8 h-8"
    case "lg":
      return "w-14 h-14"
    default:
      return "w-10 h-10"
  }
}

function getIconSize(size: string) {
  switch (size) {
    case "sm":
      return "h-4 w-4"
    case "lg":
      return "h-6 w-6"
    default:
      return "h-5 w-5"
  }
}
