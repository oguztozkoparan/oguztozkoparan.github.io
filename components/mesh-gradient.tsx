"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface MeshGradientProps {
  variant?: "hero" | "section" | "card" | "subtle" | "accent";
  className?: string;
  animated?: boolean;
  opacity?: number;
}

export default function MeshGradient({
  variant = "hero",
  className = "",
  animated = true,
  opacity = 0.6,
}: MeshGradientProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  // Define gradient variants for different use cases
  const gradientVariants = {
    hero: {
      light: `
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
        conic-gradient(from 90deg at 50% 50%, 
          rgba(255, 119, 198, 0.1) 0deg,
          rgba(120, 119, 198, 0.1) 120deg,
          rgba(120, 219, 255, 0.1) 240deg,
          rgba(255, 119, 198, 0.1) 360deg)
      `,
      dark: `
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%),
        conic-gradient(from 90deg at 50% 50%, 
          rgba(255, 119, 198, 0.05) 0deg,
          rgba(120, 119, 198, 0.05) 120deg,
          rgba(120, 219, 255, 0.05) 240deg,
          rgba(255, 119, 198, 0.05) 360deg)
      `,
    },
    section: {
      light: `
        radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 60%),
        radial-gradient(circle at 30% 70%, rgba(147, 51, 234, 0.15) 0%, transparent 60%),
        linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)
      `,
      dark: `
        radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 60%),
        radial-gradient(circle at 30% 70%, rgba(147, 51, 234, 0.08) 0%, transparent 60%),
        linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(147, 51, 234, 0.03) 100%)
      `,
    },
    card: {
      light: `
        radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 0% 100%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)
      `,
      dark: `
        radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 0% 100%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)
      `,
    },
    subtle: {
      light: `
        linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(147, 51, 234, 0.03) 100%)
      `,
      dark: `
        linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(147, 51, 234, 0.02) 100%)
      `,
    },
    accent: {
      light: `
        radial-gradient(circle at 50% 50%, rgba(255, 119, 198, 0.2) 0%, transparent 70%),
        conic-gradient(from 0deg at 50% 50%, 
          rgba(59, 130, 246, 0.1) 0deg,
          rgba(147, 51, 234, 0.1) 180deg,
          rgba(59, 130, 246, 0.1) 360deg)
      `,
      dark: `
        radial-gradient(circle at 50% 50%, rgba(255, 119, 198, 0.1) 0%, transparent 70%),
        conic-gradient(from 0deg at 50% 50%, 
          rgba(59, 130, 246, 0.05) 0deg,
          rgba(147, 51, 234, 0.05) 180deg,
          rgba(59, 130, 246, 0.05) 360deg)
      `,
    },
  };

  const currentGradient = gradientVariants[variant][isDark ? "dark" : "light"];

  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        background: currentGradient,
        opacity: opacity,
      }}
      initial={animated ? { opacity: 0 } : undefined}
      animate={animated ? { opacity: opacity } : undefined}
      transition={animated ? { duration: 2, ease: "easeOut" } : undefined}
    >
      {animated && (
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              currentGradient,
              currentGradient.replace(/circle at \d+% \d+%/g, (match) => {
                const coords = match.match(/\d+/g);
                if (coords) {
                  const x = Number.parseInt(coords[0]);
                  const y = Number.parseInt(coords[1]);
                  return `circle at ${x + 5}% ${y + 5}%`;
                }
                return match;
              }),
              currentGradient,
            ],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      )}
    </motion.div>
  );
}
