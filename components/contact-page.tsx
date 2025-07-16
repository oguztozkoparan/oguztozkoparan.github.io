"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Code2,
  Palette,
  Zap,
  Users,
  Clock,
  Star,
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import MeshGradient from "./mesh-gradient";

interface FormData {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    service: "",
    budget: "",
    timeline: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const services = [
    {
      icon: Code2,
      title: "Web Development",
      description:
        "Custom websites and web applications built with modern technologies",
      features: [
        "React & Next.js",
        "TypeScript",
        "Performance Optimization",
        "SEO Ready",
      ],
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description:
        "Beautiful, user-centered designs that convert visitors into customers",
      features: [
        "Design Systems",
        "Prototyping",
        "User Research",
        "Accessibility",
      ],
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "Speed up your existing website and improve user experience",
      features: [
        "Core Web Vitals",
        "Bundle Optimization",
        "Caching Strategies",
        "Monitoring",
      ],
    },
  ];

  const budgetRanges = [
    "Under $5,000",
    "$5,000 - $15,000",
    "$15,000 - $50,000",
    "$50,000 - $100,000",
    "$100,000+",
  ];

  const timelineOptions = [
    "ASAP",
    "1-2 months",
    "3-6 months",
    "6+ months",
    "Flexible",
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.service) newErrors.service = "Please select a service";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        company: "",
        service: "",
        budget: "",
        timeline: "",
        message: "",
      });
    }, 3000);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      {/* Enhanced Background with Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <MeshGradient variant="hero" animated={true} opacity={0.3} />
        <div className="opacity-20">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-400/10 dark:to-purple-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 dark:from-purple-400/10 dark:to-pink-400/10 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-8xl font-black mb-6 text-black dark:text-white leading-none">
            LET'S WORK
            <br />
            <span className="text-blue-600 dark:text-blue-400">TOGETHER</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Ready to bring your vision to life? Let's discuss your project and
            create something extraordinary together.
          </p>
        </motion.div>

        {/* Services Overview */}
        <motion.section className="relative mb-20">
          <MeshGradient
            variant="section"
            className="rounded-3xl"
            opacity={0.2}
          />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-12 text-black dark:text-white text-center">
              SERVICES
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="relative backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-8 rounded-3xl h-full">
                    <MeshGradient variant="card" opacity={0.1} />
                    <div className="relative z-10">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-black/10 dark:bg-white/10 rounded-2xl mb-6"
                      >
                        <service.icon className="h-8 w-8 text-black dark:text-white" />
                      </motion.div>

                      <h3 className="text-2xl font-black mb-4 text-black dark:text-white">
                        {service.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        {service.description}
                      </p>

                      <ul className="space-y-2">
                        {service.features.map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                          >
                            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-8 md:p-12 rounded-3xl">
              <h2 className="text-3xl md:text-4xl font-black mb-8 text-black dark:text-white">
                START A PROJECT
              </h2>

              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                    >
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                    </motion.div>
                    <h3 className="text-2xl font-black mb-4 text-black dark:text-white">
                      Message Sent!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Thanks for reaching out. I'll get back to you within 24
                      hours.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {/* Name and Email Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-black dark:text-white mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className={`
                            w-full px-4 py-3 backdrop-blur-xl bg-white/40 dark:bg-black/40 
                            border ${
                              errors.name
                                ? "border-red-500"
                                : "border-black/20 dark:border-white/20"
                            }
                            rounded-2xl text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all
                          `}
                          placeholder="Your name"
                        />
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1 flex items-center"
                          >
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.name}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-black dark:text-white mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className={`
                            w-full px-4 py-3 backdrop-blur-xl bg-white/40 dark:bg-black/40 
                            border ${
                              errors.email
                                ? "border-red-500"
                                : "border-black/20 dark:border-white/20"
                            }
                            rounded-2xl text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all
                          `}
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1 flex items-center"
                          >
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.email}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-sm font-bold text-black dark:text-white mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) =>
                          handleInputChange("company", e.target.value)
                        }
                        className="w-full px-4 py-3 backdrop-blur-xl bg-white/40 dark:bg-black/40 border border-black/20 dark:border-white/20 rounded-2xl text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                        placeholder="Your company (optional)"
                      />
                    </div>

                    {/* Service Selection */}
                    <div>
                      <label className="block text-sm font-bold text-black dark:text-white mb-2">
                        Service Needed *
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) =>
                          handleInputChange("service", e.target.value)
                        }
                        className={`
                          w-full px-4 py-3 backdrop-blur-xl bg-white/40 dark:bg-black/40 
                          border ${
                            errors.service
                              ? "border-red-500"
                              : "border-black/20 dark:border-white/20"
                          }
                          rounded-2xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all
                        `}
                      >
                        <option value="">Select a service</option>
                        <option value="web-development">Web Development</option>
                        <option value="ui-ux-design">UI/UX Design</option>
                        <option value="performance-optimization">
                          Performance Optimization
                        </option>
                        <option value="consultation">Consultation</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.service && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center"
                        >
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.service}
                        </motion.p>
                      )}
                    </div>

                    {/* Budget and Timeline */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-black dark:text-white mb-2">
                          Budget Range
                        </label>
                        <select
                          value={formData.budget}
                          onChange={(e) =>
                            handleInputChange("budget", e.target.value)
                          }
                          className="w-full px-4 py-3 backdrop-blur-xl bg-white/40 dark:bg-black/40 border border-black/20 dark:border-white/20 rounded-2xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                        >
                          <option value="">Select budget range</option>
                          {budgetRanges.map((range) => (
                            <option key={range} value={range}>
                              {range}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-black dark:text-white mb-2">
                          Timeline
                        </label>
                        <select
                          value={formData.timeline}
                          onChange={(e) =>
                            handleInputChange("timeline", e.target.value)
                          }
                          className="w-full px-4 py-3 backdrop-blur-xl bg-white/40 dark:bg-black/40 border border-black/20 dark:border-white/20 rounded-2xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                        >
                          <option value="">Select timeline</option>
                          {timelineOptions.map((timeline) => (
                            <option key={timeline} value={timeline}>
                              {timeline}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-bold text-black dark:text-white mb-2">
                        Project Details *
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        rows={6}
                        className={`
                          w-full px-4 py-3 backdrop-blur-xl bg-white/40 dark:bg-black/40 
                          border ${
                            errors.message
                              ? "border-red-500"
                              : "border-black/20 dark:border-white/20"
                          }
                          rounded-2xl text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all resize-none
                        `}
                        placeholder="Tell me about your project, goals, and any specific requirements..."
                      />
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center"
                        >
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.message}
                        </motion.p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-black py-4 rounded-2xl text-lg transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2" />
                            Sending...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            Send Message
                            <Send className="h-5 w-5 ml-2" />
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Contact Info & CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-8"
          >
            {/* Contact Information */}
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-8 rounded-3xl">
              <h3 className="text-2xl font-black mb-6 text-black dark:text-white">
                GET IN TOUCH
              </h3>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-black/10 dark:bg-white/10 rounded-2xl flex items-center justify-center mr-4">
                    <Mail className="h-5 w-5 text-black dark:text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-black dark:text-white">
                      Email
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      oguz.tozkoparan@orionsgate.studio
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-black/10 dark:bg-white/10 rounded-2xl flex items-center justify-center mr-4">
                    <Phone className="h-5 w-5 text-black dark:text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-black dark:text-white">
                      Phone
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      +90 (531) 467-4610
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-black/10 dark:bg-white/10 rounded-2xl flex items-center justify-center mr-4">
                    <MapPin className="h-5 w-5 text-black dark:text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-black dark:text-white">
                      Location
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Ankara, Turkiye
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
                <p className="font-bold text-black dark:text-white mb-4">
                  Follow Me
                </p>
                <div className="flex gap-3">
                  {[
                    { icon: Github, label: "GitHub" },
                    { icon: Linkedin, label: "LinkedIn" },
                    { icon: Twitter, label: "Twitter" },
                  ].map((social) => (
                    <motion.a
                      key={social.label}
                      href="#"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="h-4 w-4 text-black dark:text-white" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </Card>

            {/* Why Work With Me */}
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-black/10 dark:border-white/10 p-8 rounded-3xl">
              <h3 className="text-2xl font-black mb-6 text-black dark:text-white">
                WHY WORK WITH ME
              </h3>

              <div className="space-y-4">
                {[
                  { icon: Users, text: "50+ Happy Clients" },
                  { icon: Clock, text: "Fast Turnaround" },
                  { icon: Star, text: "5-Star Reviews" },
                  { icon: Code2, text: "Modern Tech Stack" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center"
                  >
                    <item.icon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Quick CTA */}
            <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-blue-400/20 p-8 rounded-3xl">
              <h3 className="text-xl font-black mb-4 text-black dark:text-white">
                READY TO START?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                Let's schedule a free consultation to discuss your project.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl">
                  Schedule Call
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        </div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-16"
        >
          <Link href="/">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                className="backdrop-blur-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white rounded-full px-8 py-3 font-bold"
              >
                ← Back to Portfolio
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
