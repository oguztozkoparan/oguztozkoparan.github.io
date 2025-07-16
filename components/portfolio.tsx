"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Github,
  Linkedin,
  Mail,
  ArrowUpRight,
  Code2,
  Palette,
  Zap,
  BookOpen,
  Gamepad2,
  Terminal,
  Star,
  Keyboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import MeshGradient from "./mesh-gradient";
import {
  PaletteIcon,
  SnakeIcon,
  BrainIcon,
  PuzzleIcon,
  InfinityIcon,
} from "./icons/custom-icons";
import FluidMeshBackground from "./fluid-mesh-background";

export default function ModernPortfolio() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const projects = [
    {
      title: "Neural Dashboard",
      description: "AI-powered analytics platform with real-time insights",
      year: "2024",
      tech: ["React", "TypeScript", "AI"],
    },
    {
      title: "Crypto Exchange",
      description: "Decentralized trading platform with advanced features",
      year: "2024",
      tech: ["Next.js", "Web3", "DeFi"],
    },
    {
      title: "Design System",
      description: "Comprehensive component library for modern apps",
      year: "2023",
      tech: ["Storybook", "Figma", "CSS"],
    },
  ];

  const skills = [
    { name: "Software", icon: Code2, level: "Expert" },
    { name: "Design", icon: Palette, level: "Advanced" },
    { name: "Performance", icon: Zap, level: "Advanced" },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-black backdrop-blur-sm transition-colors duration-500">
      {/* Mesh Gradient */}
      {/* <FluidMeshBackground className="max-h-[100vh]" /> */}

      {/* Enhanced Background with Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <MeshGradient variant="hero" animated={true} opacity={0.4} />
        <motion.div style={{ y }} className="opacity-30">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-400/5 dark:to-purple-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 dark:from-purple-400/5 dark:to-pink-400/5 rounded-full blur-3xl" />
        </motion.div>
      </div>

      {/* Enhanced Header with Navigation */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-8"
      >
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-2xl font-black tracking-tight text-black dark:text-white"
          >
            OGUZ TOZKOPARAN
          </motion.div>

          <div className="flex items-center gap-4">
            <Link href="/blog">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  className="backdrop-blur-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 rounded-full px-4 py-2"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Blog
                </Button>
              </motion.div>
            </Link>

            <Link href="/contact">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  className="backdrop-blur-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 rounded-full px-4 py-2"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </motion.div>
            </Link>

            <Link href="/dos">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  className="backdrop-blur-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 rounded-full px-4 py-2"
                >
                  <Terminal className="h-4 w-4 mr-2" />
                  DOS
                </Button>
              </motion.div>
            </Link>

            <ThemeToggle variant="default" size="md" />
          </div>
        </nav>
      </motion.header>

      {/* Floating Theme Toggle for Mobile */}
      <ThemeToggle variant="floating" className="md:hidden" />

      {/* Hero Section - Ultra Minimal */}
      <section className="relative z-10 px-8 py-32">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <motion.h1
              className="text-7xl md:text-9xl font-black leading-none mb-8 text-black dark:text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              SOFTWARE
              <br />
              <span className="text-blue-600 dark:text-blue-400">ENGINEER</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Building digital experiences with precision, creativity, and
              modern technology.
            </motion.p>

            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {[
                { icon: Github, label: "GitHub" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Mail, label: "Contact", href: "/contact" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={item.href || "#"}>
                    <Button
                      variant="ghost"
                      className="backdrop-blur-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white rounded-full px-6 py-6"
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section - Glassmorphism Cards */}
      <section className="relative z-10 px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-16 text-black dark:text-white"
          >
            EXPERTISE
          </motion.h2>

          <div className="relative">
            <MeshGradient
              variant="section"
              className="rounded-3xl"
              opacity={0.3}
            />
            <div className="relative z-10 grid md:grid-cols-3 gap-8">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-8 rounded-3xl">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="inline-flex items-center justify-center w-16 h-16 bg-black/10 dark:bg-white/10 rounded-2xl mb-6"
                    >
                      <skill.icon className="h-8 w-8 text-black dark:text-white" />
                    </motion.div>

                    <h3 className="text-2xl font-black mb-2 text-black dark:text-white">
                      {skill.name}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      {skill.level}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section - Clean Grid */}
      <section className="relative z-10 px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-16 text-black dark:text-white"
          >
            SELECTED WORK
          </motion.h2>

          <div className="space-y-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ x: 10 }}
                className="group cursor-pointer"
              >
                <Card className="relative backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-8 md:p-12 rounded-3xl overflow-hidden">
                  <MeshGradient variant="card" opacity={0.2} />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-3xl md:text-4xl font-black text-black dark:text-white">
                          {project.title}
                        </h3>
                        <span className="text-sm font-bold text-gray-500 dark:text-gray-400 bg-black/10 dark:bg-white/10 px-3 py-1 rounded-full">
                          {project.year}
                        </span>
                      </div>

                      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, i) => (
                          <span
                            key={i}
                            className="text-sm font-bold text-black dark:text-white bg-black/10 dark:bg-white/10 px-3 py-1 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 45 }}
                      className="flex-shrink-0"
                    >
                      <div className="w-16 h-16 bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center group-hover:bg-blue-600 dark:group-hover:bg-blue-400 transition-colors">
                        <ArrowUpRight className="h-6 w-6 text-black dark:text-white group-hover:text-white dark:group-hover:text-black" />
                      </div>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Games Section */}
      <section className="relative z-10 px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-black dark:text-white">
              INTERACTIVE
              <br />
              <span className="text-purple-600 dark:text-purple-400">
                GAMES
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
              Challenge yourself with our collection of browser-based
              mini-games. Test your skills, reflexes, and strategy.
            </p>
          </motion.div>

          <div className="relative">
            <MeshGradient
              variant="section"
              className="rounded-3xl"
              opacity={0.25}
            />
            <div className="relative z-10">
              {/* Games Preview Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                {[
                  {
                    icon: SnakeIcon,
                    name: "Snake",
                    description: "Classic arcade action",
                    color: "from-green-500 to-emerald-600",
                  },
                  {
                    icon: BrainIcon,
                    name: "Memory",
                    description: "Test your recall",
                    color: "from-blue-500 to-cyan-600",
                  },
                  {
                    icon: Zap,
                    name: "Reaction",
                    description: "Lightning reflexes",
                    color: "from-yellow-500 to-orange-600",
                  },
                  {
                    icon: PuzzleIcon,
                    name: "Puzzle",
                    description: "Strategic thinking",
                    color: "from-orange-500 to-red-600",
                  },
                  {
                    icon: Keyboard,
                    name: "Typing",
                    description: "Speed & accuracy",
                    color: "from-cyan-500 to-blue-600",
                  },
                ].map((game, index) => (
                  <motion.div
                    key={game.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group cursor-pointer"
                  >
                    <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-6 rounded-3xl text-center h-full">
                      <div className="relative">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`
                            w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white
                            bg-gradient-to-br ${game.color} shadow-lg group-hover:shadow-xl transition-shadow
                          `}
                        >
                          <game.icon className="h-8 w-8" />
                        </motion.div>

                        <h3 className="text-lg font-black mb-2 text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {game.name}
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {game.description}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Games Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-3 gap-8 mb-12"
              >
                {[
                  { number: "5", label: "Interactive Games", icon: Gamepad2 },
                  { number: "3", label: "Difficulty Levels", icon: Star },
                  { number: "∞", label: "Hours of Fun", icon: InfinityIcon },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="flex justify-center mb-2">
                      <stat.icon className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-3xl md:text-4xl font-black text-purple-600 dark:text-purple-400 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 dark:border-purple-400/20 p-8 md:p-12 rounded-3xl max-w-2xl mx-auto">
                  <h3 className="text-2xl md:text-3xl font-black mb-4 text-black dark:text-white">
                    READY TO PLAY?
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                    Challenge yourself with our collection of interactive
                    mini-games. Test your skills across different categories and
                    difficulty levels.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/games">
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="lg"
                          className="bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-600 font-black px-8 py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all"
                        >
                          <Gamepad2 className="h-5 w-5 mr-2" />
                          PLAY GAMES
                          <ArrowUpRight className="h-5 w-5 ml-2" />
                        </Button>
                      </motion.div>
                    </Link>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="lg"
                        className="backdrop-blur-xl bg-white/40 dark:bg-black/40 border border-black/20 dark:border-white/20 hover:bg-white/60 dark:hover:bg-black/60 text-black dark:text-white font-bold px-8 py-4 rounded-2xl text-lg"
                        onClick={() => {
                          document
                            .querySelector("#about-section")
                            ?.scrollIntoView({
                              behavior: "smooth",
                            });
                        }}
                      >
                        Learn More
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Minimal */}
      <section id="about-section" className="relative z-10 px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-black mb-8 text-black dark:text-white">
                ABOUT
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                I'm a creative developer passionate about crafting exceptional
                digital experiences. With expertise in modern web technologies
                and design principles, I bridge the gap between beautiful design
                and functional code.
              </p>

              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Currently focused on building innovative solutions that push the
                boundaries of what's possible on the web.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-8 rounded-3xl">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-black text-black dark:text-white mb-2">
                      Location
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      San Francisco, CA
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-black dark:text-white mb-2">
                      Experience
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">5+ Years</p>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-black dark:text-white mb-2">
                      Focus
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Frontend & Design Systems
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section - Clean CTA */}
      <section className="relative z-10 px-8 py-32">
        <MeshGradient variant="accent" className="rounded-3xl" opacity={0.2} />
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-8 text-black dark:text-white">
              LET'S WORK
              <br />
              <span className="text-blue-600 dark:text-blue-400">TOGETHER</span>
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Ready to create something extraordinary? Let's discuss your
              project and bring your vision to life.
            </p>

            <Link href="/contact">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-black px-12 py-6 rounded-full text-lg"
                >
                  Get In Touch
                  <ArrowUpRight className="h-5 w-5 ml-2" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Dynamic Footer */}
      <footer className="relative z-10 mt-32">
        {/* Footer Background with Mesh Gradient */}
        <div className="relative">
          <MeshGradient
            variant="section"
            className="rounded-t-3xl"
            opacity={0.3}
          />

          {/* Animated Wave Separator */}
          <div className="absolute top-0 left-0 w-full overflow-hidden">
            <motion.svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="relative block w-full h-16"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <motion.path
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                fill="rgba(59, 130, 246, 0.1)"
                className="dark:fill-blue-400/5"
              />
              <motion.path
                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                fill="rgba(147, 51, 234, 0.1)"
                className="dark:fill-purple-400/5"
              />
            </motion.svg>
          </div>

          <div className="relative z-10 px-8 pt-24 pb-12">
            <div className="max-w-6xl mx-auto">
              {/* Main Footer Content */}
              <div className="grid lg:grid-cols-4 gap-12 mb-16">
                {/* Brand Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="lg:col-span-2"
                >
                  <motion.div whileHover={{ scale: 1.02 }} className="mb-6">
                    <h3 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-4">
                      OGUZ TOZKOPARAN
                      <span className="text-blue-600 dark:text-blue-400">
                        .COM
                      </span>
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
                      Crafting exceptional digital experiences with modern
                      technology, creative design, and performance-first
                      development.
                    </p>
                  </motion.div>

                  {/* Newsletter Signup */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl p-6"
                  >
                    <h4 className="text-xl font-black text-black dark:text-white mb-3">
                      Stay Updated
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Get the latest insights on web development and design
                      trends.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="flex-1 px-4 py-2 bg-white/60 dark:bg-black/60 border border-black/20 dark:border-white/20 rounded-xl text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors"
                      >
                        Subscribe
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="text-xl font-black text-black dark:text-white mb-6">
                    Explore
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: "Portfolio", href: "#", icon: PaletteIcon },
                      { label: "Blog", href: "/blog", icon: BookOpen },
                      { label: "Games", href: "/games", icon: Gamepad2 },
                      { label: "DOS Terminal", href: "/dos", icon: Terminal },
                      { label: "Contact", href: "/contact", icon: Mail },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors group"
                        >
                          <span className="mr-3 group-hover:scale-110 transition-transform">
                            <item.icon className="h-5 w-5" />
                          </span>
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Connect Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="text-xl font-black text-black dark:text-white mb-6">
                    Connect
                  </h4>

                  {/* Social Links */}
                  <div className="space-y-4 mb-8">
                    {[
                      {
                        icon: Github,
                        label: "GitHub",
                        href: "#",
                        color: "hover:text-gray-800 dark:hover:text-gray-200",
                      },
                      {
                        icon: Linkedin,
                        label: "LinkedIn",
                        href: "#",
                        color: "hover:text-blue-600 dark:hover:text-blue-400",
                      },
                      {
                        icon: Mail,
                        label: "Email",
                        href: "/contact",
                        color: "hover:text-green-600 dark:hover:text-green-400",
                      },
                    ].map((social, index) => (
                      <motion.div
                        key={social.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.05, x: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          href={social.href}
                          className={`flex items-center text-gray-600 dark:text-gray-400 ${social.color} transition-all group`}
                        >
                          <div className="w-10 h-10 bg-black/10 dark:bg-white/10 rounded-xl flex items-center justify-center mr-3 group-hover:bg-black/20 dark:group-hover:bg-white/20 transition-colors">
                            <social.icon className="h-5 w-5" />
                          </div>
                          <span className="font-medium">{social.label}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Status Indicator */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
                  >
                    <div className="flex items-center">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                        className="w-3 h-3 bg-blue-500 rounded-full mr-3"
                      />
                      <div>
                        <div className="text-sm font-bold text-blue-700 dark:text-blue-300">
                          Working at Orion's Gate Studio
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          Creative development & design
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Divider with Animation */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="h-px bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent mb-8"
              />

              {/* Bottom Footer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-col md:flex-row justify-between items-center gap-6"
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="text-black dark:text-white font-black">
                    © {new Date().getFullYear()} OGUZ TOZKOPARAN
                  </div>

                  <div className="flex gap-6">
                    {[
                      { label: "Privacy", href: "#" },
                      { label: "Terms", href: "#" },
                      { label: "Cookies", href: "#" },
                    ].map((item) => (
                      <motion.div key={item.label} whileHover={{ y: -2 }}>
                        <Link
                          href={item.href}
                          className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white font-medium transition-colors text-sm"
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Back to Top Button */}
                <motion.button
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 rounded-full text-black dark:text-white font-medium transition-all group"
                >
                  <span className="text-sm">Back to Top</span>
                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="text-lg"
                  >
                    ↑
                  </motion.div>
                </motion.button>
              </motion.div>

              {/* Floating Elements */}
              <div className="absolute top-10 right-10 opacity-20 pointer-events-none">
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: {
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    },
                    scale: { duration: 3, repeat: Number.POSITIVE_INFINITY },
                  }}
                  className="w-16 h-16 border-2 border-blue-500/30 rounded-full"
                />
              </div>

              <div className="absolute bottom-20 left-10 opacity-20 pointer-events-none">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                  className="w-8 h-8 bg-purple-500/30 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
