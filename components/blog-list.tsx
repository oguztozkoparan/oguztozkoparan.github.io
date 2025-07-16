"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, ArrowUpRight, Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import MeshGradient from "./mesh-gradient"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  readTime: string
  category: string
  tags: string[]
  featured: boolean
}

const blogPosts: BlogPost[] = [
  {
    id: "modern-web-development",
    title: "The Future of Modern Web Development",
    excerpt:
      "Exploring the latest trends and technologies shaping the future of web development, from AI integration to performance optimization.",
    content: "",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Development",
    tags: ["React", "Performance", "AI"],
    featured: true,
  },
  {
    id: "design-systems-guide",
    title: "Building Scalable Design Systems",
    excerpt:
      "A comprehensive guide to creating design systems that scale with your organization and maintain consistency across products.",
    content: "",
    date: "2024-01-10",
    readTime: "12 min read",
    category: "Design",
    tags: ["Design Systems", "UI/UX", "Figma"],
    featured: true,
  },
  {
    id: "glassmorphism-trends",
    title: "Glassmorphism in Modern UI Design",
    excerpt: "Understanding the glassmorphism trend and how to implement it effectively in modern user interfaces.",
    content: "",
    date: "2024-01-05",
    readTime: "6 min read",
    category: "Design",
    tags: ["Glassmorphism", "CSS", "Trends"],
    featured: false,
  },
  {
    id: "performance-optimization",
    title: "Web Performance Optimization Techniques",
    excerpt:
      "Advanced techniques for optimizing web performance, including code splitting, lazy loading, and modern bundling strategies.",
    content: "",
    date: "2023-12-28",
    readTime: "10 min read",
    category: "Performance",
    tags: ["Performance", "Optimization", "JavaScript"],
    featured: false,
  },
  {
    id: "brutalist-design-principles",
    title: "Brutalist Design in Digital Interfaces",
    excerpt:
      "Exploring how brutalist design principles can be applied to create bold and impactful digital experiences.",
    content: "",
    date: "2023-12-20",
    readTime: "7 min read",
    category: "Design",
    tags: ["Brutalism", "Typography", "Layout"],
    featured: false,
  },
]

const categories = ["All", "Development", "Design", "Performance"]

export default function BlogList() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featuredPosts = filteredPosts.filter((post) => post.featured)
  const regularPosts = filteredPosts.filter((post) => !post.featured)

  return (
    <div className="relative max-w-6xl mx-auto px-8 py-16">
      <MeshGradient variant="subtle" opacity={0.3} />
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 mb-16">
        <h1 className="text-5xl md:text-7xl font-black mb-6 text-black dark:text-white">INSIGHTS</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
          Thoughts on design, development, and the future of digital experiences.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 mb-12"
      >
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 rounded-2xl text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-2">
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
      </motion.div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 mb-16"
        >
          <h2 className="text-2xl font-black mb-8 text-black dark:text-white">FEATURED</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/blog/${post.id}`}>
                  <Card className="relative backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-8 rounded-3xl h-full group cursor-pointer">
                    <MeshGradient variant="card" opacity={0.15} />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                          {post.category}
                        </span>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 45 }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ArrowUpRight className="h-5 w-5 text-gray-400" />
                        </motion.div>
                      </div>

                      <h3 className="text-2xl font-black mb-4 text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{post.excerpt}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readTime}
                          </div>
                        </div>

                        <div className="flex gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-xs bg-black/10 dark:bg-white/10 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Regular Posts */}
      {regularPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10"
        >
          <h2 className="text-2xl font-black mb-8 text-black dark:text-white">ALL ARTICLES</h2>
          <div className="space-y-6">
            {regularPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ x: 10 }}
              >
                <Link href={`/blog/${post.id}`}>
                  <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-6 md:p-8 rounded-3xl group cursor-pointer">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-sm font-bold text-gray-600 dark:text-gray-400 bg-black/10 dark:bg-white/10 px-3 py-1 rounded-full">
                            {post.category}
                          </span>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(post.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {post.readTime}
                            </div>
                          </div>
                        </div>

                        <h3 className="text-xl md:text-2xl font-black mb-3 text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{post.excerpt}</p>

                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-gray-500 dark:text-gray-400 bg-black/10 dark:bg-white/10 px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 45 }}
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <div className="w-12 h-12 bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center">
                          <ArrowUpRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                      </motion.div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* No Results */}
      {filteredPosts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center py-16"
        >
          <div className="flex justify-center mb-4">
            <Search className="h-16 w-16 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-2xl font-black mb-2 text-black dark:text-white">No articles found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
        </motion.div>
      )}
    </div>
  )
}
