"use client"

import { motion } from "framer-motion"
import ThemeToggle from "./theme-toggle"
import { Card } from "@/components/ui/card"

export default function ThemeToggleShowcase() {
  const variants = [
    {
      name: "Default",
      description: "Clean glassmorphism with smooth icon transitions",
      component: <ThemeToggle variant="default" size="md" />,
    },
    {
      name: "Expanded",
      description: "Multi-option toggle with system theme support",
      component: <ThemeToggle variant="expanded" showLabel />,
    },
    {
      name: "Floating",
      description: "Fixed position with animated background effects",
      component: <ThemeToggle variant="floating" />,
    },
    {
      name: "Minimal",
      description: "Subtle hover effects for clean interfaces",
      component: <ThemeToggle variant="minimal" />,
    },
    {
      name: "Brutalist",
      description: "Angular design with bold typography",
      component: <ThemeToggle variant="brutalist" />,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-8 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-6 text-black dark:text-white">THEME TOGGLES</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Modern theme-switching components with glassmorphism effects and brutalist aesthetics.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {variants.map((variant, index) => (
          <motion.div
            key={variant.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-8 rounded-3xl h-full">
              <div className="text-center">
                <h3 className="text-2xl font-black mb-3 text-black dark:text-white">{variant.name}</h3>

                <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm leading-relaxed">{variant.description}</p>

                <div className="flex justify-center items-center min-h-[80px]">{variant.component}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Size Variations */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16"
      >
        <h2 className="text-3xl font-black mb-8 text-black dark:text-white text-center">SIZE VARIATIONS</h2>

        <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-8 rounded-3xl">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <ThemeToggle variant="default" size="sm" />
              <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mt-2">Small</p>
            </div>

            <div className="text-center">
              <ThemeToggle variant="default" size="md" />
              <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mt-2">Medium</p>
            </div>

            <div className="text-center">
              <ThemeToggle variant="default" size="lg" />
              <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mt-2">Large</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Integration Examples */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-16"
      >
        <h2 className="text-3xl font-black mb-8 text-black dark:text-white text-center">INTEGRATION EXAMPLES</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Header Integration */}
          <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-6 rounded-3xl">
            <h3 className="text-lg font-black mb-4 text-black dark:text-white">Header Navigation</h3>
            <div className="flex justify-between items-center p-4 bg-black/5 dark:bg-white/5 rounded-2xl">
              <div className="text-xl font-black text-black dark:text-white">LOGO</div>
              <ThemeToggle variant="default" size="md" />
            </div>
          </Card>

          {/* Settings Panel Integration */}
          <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-6 rounded-3xl">
            <h3 className="text-lg font-black mb-4 text-black dark:text-white">Settings Panel</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-black dark:text-white">Theme</span>
                <ThemeToggle variant="expanded" />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-black dark:text-white">Notifications</span>
                <div className="w-10 h-6 bg-black/20 dark:bg-white/20 rounded-full"></div>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
