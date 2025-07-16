"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { FolderIcon, DocumentIcon } from "./icons/custom-icons";
import { ArrowLeft, Minimize2, Maximize2, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Blog posts data for the read command
const BLOG_POSTS = {
  "modern-web-development": {
    title: "The Future of Modern Web Development",
    content: `The Future of Modern Web Development
=========================================

Introduction
------------
The landscape of web development is constantly evolving, with new 
technologies and methodologies emerging at an unprecedented pace. As we 
look toward the future, several key trends are shaping how we build and 
interact with web applications.

AI Integration in Development
-----------------------------
Artificial Intelligence is no longer just a buzzword in web development. 
From AI-powered code completion tools like GitHub Copilot to automated 
testing and deployment processes, AI is becoming an integral part of the 
developer workflow.

"The future of web development lies in the seamless integration of AI 
tools that enhance developer productivity while maintaining code quality 
and security."

Performance-First Architecture
------------------------------
Modern web applications must be fast, responsive, and efficient. This 
means adopting performance-first architectural patterns such as:

• Server-side rendering (SSR) and static site generation (SSG)
• Edge computing and CDN optimization
• Progressive Web App (PWA) capabilities
• Advanced caching strategies

The Rise of Component-Driven Development
----------------------------------------
Component-driven development has revolutionized how we think about 
building user interfaces. Tools like Storybook, design systems, and 
atomic design principles are becoming standard practice.

Conclusion
----------
The future of web development is bright, with exciting technologies and 
methodologies on the horizon. By staying informed and adapting to these 
changes, developers can create more efficient, scalable, and user-friendly 
applications.

Author: Oguz Tozkoparan
Date: January 15, 2024
Reading Time: 8 minutes`,
    date: "2024-01-15",
    category: "Development",
    tags: ["React", "Performance", "AI", "Future"],
  },
  "design-systems-guide": {
    title: "Building Scalable Design Systems",
    content: `Building Scalable Design Systems
=================================

What is a Design System?
------------------------
A design system is a comprehensive set of standards, components, and 
guidelines that ensure consistency across digital products. It serves as 
a single source of truth for design and development teams.

Key Components of a Design System
---------------------------------
Every effective design system should include:

• Design Tokens: The atomic elements like colors, typography, and spacing
• Component Library: Reusable UI components with clear documentation
• Guidelines: Usage patterns and best practices
• Tools: Design and development resources

Implementation Strategy
-----------------------
Building a design system requires careful planning and execution. Start 
small with core components and gradually expand based on team needs and 
feedback.

"A design system is never finished. It's a living, breathing entity that 
evolves with your product and organization."

Measuring Success
-----------------
Track the adoption and effectiveness of your design system through 
metrics like component usage, design consistency scores, and development 
velocity improvements.

Best Practices
--------------
1. Start with a clear vision and goals
2. Involve stakeholders from the beginning
3. Document everything thoroughly
4. Maintain and iterate regularly
5. Provide excellent developer experience

Tools and Technologies
----------------------
Popular tools for building design systems include:
• Figma for design
• Storybook for component documentation
• Design tokens for consistency
• Automated testing for quality assurance

Author: Oguz Tozkoparan
Date: January 10, 2024
Reading Time: 12 minutes`,
    date: "2024-01-10",
    category: "Design",
    tags: ["Design Systems", "UI/UX", "Figma", "Components"],
  },
  "glassmorphism-trends": {
    title: "Glassmorphism in Modern UI Design",
    content: `Glassmorphism in Modern UI Design
=================================

Understanding Glassmorphism
---------------------------
Glassmorphism is a design trend that creates a frosted glass effect, 
combining transparency, blur, and subtle borders to create depth and 
hierarchy in user interfaces.

Key Characteristics
-------------------
The glassmorphism aesthetic is defined by several key visual elements:

• Semi-transparent backgrounds
• Backdrop blur effects
• Subtle borders and shadows
• Layered depth perception

Implementation Best Practices
-----------------------------
When implementing glassmorphism in your designs, consider accessibility 
and performance implications. Ensure sufficient contrast for readability 
and optimize blur effects for performance.

CSS Implementation
------------------
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}

Browser Support
---------------
Modern browsers support backdrop-filter, but always provide fallbacks:
• Chrome 76+
• Firefox 103+
• Safari 9+
• Edge 79+

Design Considerations
---------------------
1. Maintain sufficient contrast ratios
2. Use sparingly to avoid visual clutter
3. Consider performance on lower-end devices
4. Test across different backgrounds
5. Ensure accessibility compliance

Future of Glassmorphism
-----------------------
As browser support for backdrop-filter improves and design tools evolve, 
glassmorphism will continue to be a popular choice for creating modern, 
sophisticated interfaces.

Author: Oguz Tozkoparan
Date: January 5, 2024
Reading Time: 6 minutes`,
    date: "2024-01-05",
    category: "Design",
    tags: ["Glassmorphism", "CSS", "Trends", "UI Design"],
  },
  "performance-optimization": {
    title: "Web Performance Optimization Techniques",
    content: `Web Performance Optimization Techniques
======================================

Introduction
------------
Web performance is crucial for user experience, SEO, and business 
success. This guide covers advanced techniques for optimizing web 
performance in modern applications.

Core Web Vitals
---------------
Focus on Google's Core Web Vitals metrics:

• Largest Contentful Paint (LCP): < 2.5 seconds
• First Input Delay (FID): < 100 milliseconds
• Cumulative Layout Shift (CLS): < 0.1

Code Splitting Strategies
-------------------------
1. Route-based splitting
2. Component-based splitting
3. Dynamic imports
4. Vendor bundle optimization

Image Optimization
------------------
• Use modern formats (WebP, AVIF)
• Implement responsive images
• Lazy loading techniques
• Proper sizing and compression

Caching Strategies
------------------
1. Browser caching with proper headers
2. Service worker implementation
3. CDN optimization
4. Database query caching

Bundle Optimization
-------------------
• Tree shaking unused code
• Minification and compression
• Critical CSS extraction
• Resource hints and preloading

Monitoring and Measurement
--------------------------
Tools for performance monitoring:
• Lighthouse
• WebPageTest
• Chrome DevTools
• Real User Monitoring (RUM)

Author: Oguz Tozkoparan
Date: December 28, 2023
Reading Time: 10 minutes`,
    date: "2023-12-28",
    category: "Performance",
    tags: ["Performance", "Optimization", "JavaScript"],
  },
  "brutalist-design-principles": {
    title: "Brutalist Design in Digital Interfaces",
    content: `Brutalist Design in Digital Interfaces
======================================

What is Brutalist Design?
-------------------------
Brutalist design in digital interfaces draws inspiration from the 
architectural movement, emphasizing raw, bold, and uncompromising 
aesthetics that prioritize function over form.

Core Principles
---------------
1. Bold Typography
   • Heavy, sans-serif fonts
   • High contrast text
   • Unconventional layouts

2. Raw Materials
   • Exposed structural elements
   • Minimal decoration
   • Honest use of technology

3. Geometric Forms
   • Angular shapes
   • Asymmetrical layouts
   • Strong grid systems

4. Monochromatic Palettes
   • Limited color schemes
   • High contrast ratios
   • Strategic use of accent colors

Digital Implementation
----------------------
Translating brutalist principles to web design:

• Use system fonts or bold typefaces
• Embrace white space and negative space
• Create strong visual hierarchies
• Implement unconventional navigation
• Focus on content over decoration

Modern Brutalism
-----------------
Contemporary brutalist web design often incorporates:
• Accessibility considerations
• Responsive design principles
• Performance optimization
• User experience best practices

Examples in Practice
--------------------
Successful brutalist websites demonstrate:
• Clear information architecture
• Bold visual statements
• Memorable user experiences
• Strong brand identity

Challenges and Considerations
-----------------------------
1. Balancing aesthetics with usability
2. Ensuring accessibility compliance
3. Maintaining brand consistency
4. Adapting to different screen sizes

Author: Oguz Tozkoparan
Date: December 20, 2023
Reading Time: 7 minutes`,
    date: "2023-12-20",
    category: "Design",
    tags: ["Brutalism", "Typography", "Layout"],
  },
};

interface FileSystemItem {
  name: string;
  type: "file" | "directory";
  content?: string;
  children?: { [key: string]: FileSystemItem };
}

interface CommandHistory {
  command: string;
  output: string[];
  timestamp: Date;
}

interface TabCompletion {
  suggestions: string[];
  commonPrefix: string;
}

const initialFileSystem: { [key: string]: FileSystemItem } = {
  "C:": {
    name: "C:",
    type: "directory",
    children: {
      DOS: {
        name: "DOS",
        type: "directory",
        children: {
          "COMMAND.COM": {
            name: "COMMAND.COM",
            type: "file",
            content: "DOS Command Interpreter",
          },
          "CONFIG.SYS": {
            name: "CONFIG.SYS",
            type: "file",
            content: "DOS Configuration File",
          },
          "AUTOEXEC.BAT": {
            name: "AUTOEXEC.BAT",
            type: "file",
            content: "Automatic execution batch file",
          },
        },
      },
      WINDOWS: {
        name: "WINDOWS",
        type: "directory",
        children: {
          SYSTEM32: {
            name: "SYSTEM32",
            type: "directory",
            children: {
              "NOTEPAD.EXE": {
                name: "NOTEPAD.EXE",
                type: "file",
                content: "Text Editor Application",
              },
              "CALC.EXE": {
                name: "CALC.EXE",
                type: "file",
                content: "Calculator Application",
              },
              "CMD.EXE": {
                name: "CMD.EXE",
                type: "file",
                content: "Command Prompt",
              },
            },
          },
          TEMP: {
            name: "TEMP",
            type: "directory",
            children: {
              "TEMP001.TMP": {
                name: "TEMP001.TMP",
                type: "file",
                content: "Temporary file",
              },
            },
          },
        },
      },
      PROJECTS: {
        name: "PROJECTS",
        type: "directory",
        children: {
          "PORTFOLIO.TXT": {
            name: "PORTFOLIO.TXT",
            type: "file",
            content:
              "Welcome to Oguz Tozkoparan Portfolio!\n\nThis is a modern portfolio website built with:\n- Next.js 15\n- TypeScript\n- Tailwind CSS\n- Framer Motion\n- Glassmorphism Design\n\nFeatures:\n- Responsive Design\n- Dark/Light Mode\n- Interactive Games\n- Blog System\n- Contact Forms\n- DOS Terminal (you're here!)\n\nVisit /games for mini-games\nVisit /blog for articles\nVisit /contact to get in touch",
          },
          "README.MD": {
            name: "README.MD",
            type: "file",
            content:
              "# Oguz Tozkoparan Portfolio\n\nA modern, minimalist portfolio with brutalist design elements and glassmorphism effects.\n\n## Technologies Used\n- React/Next.js\n- TypeScript\n- Tailwind CSS\n- Framer Motion\n\n## Features\n- Interactive Games\n- Blog System\n- Contact Forms\n- DOS Terminal\n- Theme Switching",
          },
          "SKILLS.TXT": {
            name: "SKILLS.TXT",
            type: "file",
            content:
              "Technical Skills:\n\nFrontend Development:\n- React, Next.js, Vue.js\n- TypeScript, JavaScript\n- HTML5, CSS3, SASS\n- Tailwind CSS, Styled Components\n\nDesign:\n- UI/UX Design\n- Figma, Adobe Creative Suite\n- Design Systems\n- Responsive Design\n\nPerformance:\n- Web Performance Optimization\n- Core Web Vitals\n- Bundle Optimization\n- SEO Best Practices",
          },
        },
      },
      GAMES: {
        name: "GAMES",
        type: "directory",
        children: {
          "SNAKE.EXE": {
            name: "SNAKE.EXE",
            type: "file",
            content: "Classic Snake Game - Visit /games to play!",
          },
          "MEMORY.EXE": {
            name: "MEMORY.EXE",
            type: "file",
            content: "Memory Match Game - Visit /games to play!",
          },
          "PUZZLE.EXE": {
            name: "PUZZLE.EXE",
            type: "file",
            content: "Slide Puzzle Game - Visit /games to play!",
          },
          "REACTION.EXE": {
            name: "REACTION.EXE",
            type: "file",
            content: "Reaction Test Game - Visit /games to play!",
          },
          "TYPING.EXE": {
            name: "TYPING.EXE",
            type: "file",
            content: "Typing Speed Game - Visit /games to play!",
          },
        },
      },
      TEMP: {
        name: "TEMP",
        type: "directory",
        children: {},
      },
      DOCS: {
        name: "DOCS",
        type: "directory",
        children: {
          "RESUME.TXT": {
            name: "RESUME.TXT",
            type: "file",
            content:
              "Oguz Tozkoparan\nSoftware Engineer\n\nExperience:\n- 5+ years in web development\n- Specialized in React/Next.js\n- Expert in modern CSS and animations\n- Strong focus on performance and UX\n\nContact:\n- Email: oguz.tozkoparan@orionsgate.studio\n- Location: Ankara, Turkiye\n- Portfolio: oguztozkoparan.com",
          },
          "CONTACT.TXT": {
            name: "CONTACT.TXT",
            type: "file",
            content:
              "Contact Information:\n\nEmail: oguz.tozkoparan@orionsgate.studio\nPhone: +90 (531) 467-4610\nLocation: Ankara, Turkiye\n\nSocial Media:\n- GitHub: github.com/oguztozkoparan\n- LinkedIn: linkedin.com/in/oguztozkoparan\n- Twitter: @oguztozkoparan\n\nAvailable for:\n- Freelance projects\n- Full-time opportunities\n- Consulting work\n- Speaking engagements",
          },
        },
      },
      BLOG: {
        name: "BLOG",
        type: "directory",
        children: {
          "POSTS.TXT": {
            name: "POSTS.TXT",
            type: "file",
            content:
              "Available Blog Posts:\n\n" +
              Object.entries(BLOG_POSTS)
                .map(
                  ([key, post]) =>
                    `${key}\n  Title: ${post.title}\n  Date: ${post.date}\n  Category: ${post.category}\n`
                )
                .join("\n"),
          },
          "README.TXT": {
            name: "README.TXT",
            type: "file",
            content:
              "Blog Directory\n\nUse the 'READ' command to view blog posts:\n\nExamples:\n  READ modern-web-development\n  READ design-systems-guide\n  READ glassmorphism-trends\n\nType 'READ' without arguments to see all available posts.",
          },
        },
      },
    },
  },
};

const AVAILABLE_COMMANDS = [
  "dir",
  "cd",
  "echo",
  "type",
  "mkdir",
  "cls",
  "ver",
  "time",
  "date",
  "tree",
  "help",
  "exit",
  "copy",
  "del",
  "ren",
  "attrib",
  "read",
];

export default function DOSTerminal() {
  const [currentPath, setCurrentPath] = useState(["C:"]);
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentCommand, setCurrentCommand] = useState("");
  const [fileSystem, setFileSystem] = useState(initialFileSystem);
  const [isMaximized, setIsMaximized] = useState(true);
  const [showStartupAnimation, setShowStartupAnimation] = useState(true);
  const [tabSuggestions, setTabSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentDirectory = useCallback(() => {
    let current = fileSystem;
    for (const pathPart of currentPath) {
      if (current[pathPart] && current[pathPart].children) {
        current = current[pathPart].children!;
      }
    }
    return current;
  }, [fileSystem, currentPath]);

  const getPrompt = () => {
    return `${currentPath.join("\\")}>`;
  };

  const addToHistory = (command: string, output: string[]) => {
    const newEntry: CommandHistory = {
      command,
      output,
      timestamp: new Date(),
    };
    setCommandHistory((prev) => [...prev, newEntry]);
    setHistoryIndex(-1);
  };

  // Enhanced tab completion functionality
  const getTabCompletion = (input: string): TabCompletion => {
    const args = input.trim().split(/\s+/);
    const command = args[0].toLowerCase();

    if (args.length === 1) {
      // Complete command names
      const suggestions = AVAILABLE_COMMANDS.filter((cmd) =>
        cmd.startsWith(command)
      );
      const commonPrefix = getCommonPrefix(suggestions);
      return { suggestions, commonPrefix };
    } else if (
      args.length === 2 &&
      (command === "cd" ||
        command === "type" ||
        command === "del" ||
        command === "ren")
    ) {
      // Complete file/directory names
      const currentDir = getCurrentDirectory();
      const partial = args[1].toUpperCase();
      const items = Object.keys(currentDir);

      let suggestions: string[] = [];

      if (command === "cd") {
        // Only directories for cd command
        suggestions = items.filter(
          (item) =>
            currentDir[item].type === "directory" &&
            item.toUpperCase().startsWith(partial)
        );
        // Add special directories
        if ("..".startsWith(partial.toLowerCase()) && currentPath.length > 1) {
          suggestions.unshift("..");
        }
        if (".".startsWith(partial.toLowerCase())) {
          suggestions.unshift(".");
        }
      } else {
        // Files and directories for other commands
        suggestions = items.filter((item) =>
          item.toUpperCase().startsWith(partial)
        );
      }

      const commonPrefix = getCommonPrefix(suggestions);
      return { suggestions, commonPrefix };
    } else if (args.length === 2 && command === "read") {
      // Complete blog post titles
      const partial = args[1].toLowerCase().replace(/-/g, " ");
      const blogTitles = Object.keys(BLOG_POSTS);
      const suggestions = blogTitles.filter(
        (title) =>
          title.toLowerCase().startsWith(partial) ||
          BLOG_POSTS[title as keyof typeof BLOG_POSTS].title
            .toLowerCase()
            .includes(partial)
      );

      const commonPrefix = getCommonPrefix(suggestions);
      return { suggestions, commonPrefix };
    }

    return { suggestions: [], commonPrefix: "" };
  };

  const getCommonPrefix = (strings: string[]): string => {
    if (strings.length === 0) return "";
    if (strings.length === 1) return strings[0];

    let prefix = "";
    const firstString = strings[0];

    for (let i = 0; i < firstString.length; i++) {
      const char = firstString[i];
      if (
        strings.every(
          (str) => str[i] && str[i].toLowerCase() === char.toLowerCase()
        )
      ) {
        prefix += char;
      } else {
        break;
      }
    }

    return prefix;
  };

  const handleTabCompletion = () => {
    const args = currentCommand.trim().split(/\s+/);
    const completion = getTabCompletion(currentCommand);

    if (completion.suggestions.length === 1) {
      // Single match - complete it
      const suggestion = completion.suggestions[0];
      if (args.length === 1) {
        setCurrentCommand(suggestion + " ");
      } else {
        args[args.length - 1] = suggestion;
        setCurrentCommand(args.join(" ") + " ");
      }
      setShowSuggestions(false);
    } else if (completion.suggestions.length > 1) {
      // Multiple matches - show suggestions and complete common prefix
      if (
        completion.commonPrefix.length > (args[args.length - 1]?.length || 0)
      ) {
        if (args.length === 1) {
          setCurrentCommand(completion.commonPrefix);
        } else {
          args[args.length - 1] = completion.commonPrefix;
          setCurrentCommand(args.join(" "));
        }
      }
      setTabSuggestions(completion.suggestions);
      setShowSuggestions(true);
    }
  };

  const executeCommand = (command: string) => {
    const args = command.trim().split(/\s+/);
    const cmd = args[0].toLowerCase();
    const output: string[] = [];

    // Hide suggestions when executing command
    setShowSuggestions(false);

    switch (cmd) {
      case "help":
        output.push("Available commands:");
        output.push("");
        output.push("DIR          - List directory contents");
        output.push("CD <dir>     - Change directory");
        output.push("ECHO <text>  - Display text");
        output.push("TYPE <file>  - Display file contents");
        output.push("READ <post>  - Read blog post content");
        output.push("MKDIR <dir>  - Create directory");
        output.push("CLS          - Clear screen");
        output.push("VER          - Show version");
        output.push("TIME         - Show current time");
        output.push("DATE         - Show current date");
        output.push("TREE         - Show directory tree");
        output.push("COPY         - Copy files (simulated)");
        output.push("DEL          - Delete files (simulated)");
        output.push("REN          - Rename files (simulated)");
        output.push("ATTRIB       - Show file attributes");
        output.push("EXIT         - Return to portfolio");
        output.push("HELP         - Show this help");
        output.push("");
        output.push("Use TAB for auto-completion");
        output.push("Use UP/DOWN arrows for command history");
        output.push("");
        output.push("Blog Commands:");
        output.push("READ         - List available blog posts");
        output.push("READ <title> - Read specific blog post");
        break;

      case "dir":
        const currentDir = getCurrentDirectory();
        output.push(`Directory of ${currentPath.join("\\")}\n`);
        output.push("    <DIR>          .");
        if (currentPath.length > 1) {
          output.push("    <DIR>          ..");
        }

        Object.values(currentDir).forEach((item) => {
          const size = item.type === "directory" ? "    <DIR>" : "     1,024";
          const date = "01-01-24  12:00";
          output.push(`${date}  ${size}          ${item.name}`);
        });

        const fileCount = Object.values(currentDir).filter(
          (item) => item.type === "file"
        ).length;
        const dirCount = Object.values(currentDir).filter(
          (item) => item.type === "directory"
        ).length;
        output.push("");
        output.push(
          `               ${fileCount} File(s)     ${fileCount * 1024} bytes`
        );
        output.push(`               ${dirCount} Dir(s)`);
        break;

      case "cd":
        if (args.length < 2) {
          output.push(currentPath.join("\\"));
        } else {
          const targetDir = args[1];
          if (targetDir === "..") {
            if (currentPath.length > 1) {
              setCurrentPath(currentPath.slice(0, -1));
            }
          } else if (targetDir === ".") {
            // Stay in current directory
          } else {
            const currentDir = getCurrentDirectory();
            const targetKey = Object.keys(currentDir).find(
              (key) => key.toUpperCase() === targetDir.toUpperCase()
            );
            if (targetKey && currentDir[targetKey].type === "directory") {
              setCurrentPath([...currentPath, targetKey]);
            } else {
              output.push(`The system cannot find the path specified.`);
            }
          }
        }
        break;

      case "echo":
        if (args.length > 1) {
          output.push(args.slice(1).join(" "));
        } else {
          output.push("ECHO is on.");
        }
        break;

      case "type":
        if (args.length < 2) {
          output.push("The syntax of the command is incorrect.");
        } else {
          const fileName = args[1];
          const currentDir = getCurrentDirectory();
          const fileKey = Object.keys(currentDir).find(
            (key) => key.toUpperCase() === fileName.toUpperCase()
          );
          if (fileKey && currentDir[fileKey].type === "file") {
            const content = currentDir[fileKey].content || "";
            output.push(...content.split("\n"));
          } else {
            output.push("The system cannot find the file specified.");
          }
        }
        break;

      case "mkdir":
        if (args.length < 2) {
          output.push("The syntax of the command is incorrect.");
        } else {
          const dirName = args[1].toUpperCase();
          const currentDir = getCurrentDirectory();
          if (currentDir[dirName]) {
            output.push("A subdirectory or file already exists.");
          } else {
            output.push(`Directory created: ${dirName}`);
          }
        }
        break;

      case "copy":
        if (args.length < 3) {
          output.push("The syntax of the command is incorrect.");
          output.push("Usage: COPY <source> <destination>");
        } else {
          output.push(`1 file(s) copied. (simulated)`);
        }
        break;

      case "del":
        if (args.length < 2) {
          output.push("The syntax of the command is incorrect.");
        } else {
          output.push(`File deleted: ${args[1]} (simulated)`);
        }
        break;

      case "ren":
        if (args.length < 3) {
          output.push("The syntax of the command is incorrect.");
          output.push("Usage: REN <oldname> <newname>");
        } else {
          output.push(`File renamed: ${args[1]} -> ${args[2]} (simulated)`);
        }
        break;

      case "attrib":
        const currentDirForAttrib = getCurrentDirectory();
        Object.values(currentDirForAttrib).forEach((item) => {
          const attrs = item.type === "directory" ? "D" : "A";
          output.push(`${attrs}         ${item.name}`);
        });
        break;

      case "cls":
        setCommandHistory([]);
        return;

      case "ver":
        output.push("Oguz Tozkoparan DOS Terminal [Version 1.0.0]");
        output.push("(c) 2024 Oguz Tozkoparan. All rights reserved.");
        break;

      case "time":
        output.push(`The current time is: ${currentTime.toLocaleTimeString()}`);
        break;

      case "date":
        output.push(`The current date is: ${currentTime.toLocaleDateString()}`);
        break;

      case "tree":
        const renderTree = (
          dir: { [key: string]: FileSystemItem },
          prefix = "",
          isLast = true
        ) => {
          const items = Object.values(dir);
          items.forEach((item, index) => {
            const isLastItem = index === items.length - 1;
            const connector = isLastItem ? "└── " : "├── ";
            const iconComponent =
              item.type === "directory" ? (
                <FolderIcon className="inline h-4 w-4" />
              ) : (
                <DocumentIcon className="inline h-4 w-4" />
              );
            output.push(
              `${prefix}${connector}[${
                item.type === "directory" ? "DIR" : "FILE"
              }] ${item.name}`
            );

            if (item.type === "directory" && item.children) {
              const newPrefix = prefix + (isLastItem ? "    " : "│   ");
              renderTree(item.children, newPrefix, isLastItem);
            }
          });
        };

        output.push(`${currentPath.join("\\")}`);
        renderTree(getCurrentDirectory());
        break;

      case "exit":
        window.location.href = "/";
        return;

      case "":
        // Empty command, just show prompt
        break;

      case "read":
        if (args.length < 2) {
          output.push("The syntax of the command is incorrect.");
          output.push("Usage: READ <post-title>");
          output.push("");
          output.push("Available blog posts:");
          Object.entries(BLOG_POSTS).forEach(([key, post]) => {
            output.push(`  ${key.padEnd(25)} - ${post.title}`);
          });
        } else {
          const postKey = args.slice(1).join("-").toLowerCase();
          const exactMatch = BLOG_POSTS[postKey as keyof typeof BLOG_POSTS];

          if (exactMatch) {
            // Clear screen for better reading experience
            setCommandHistory([]);

            // Display the blog post content
            output.push(
              "============================================================"
            );
            output.push(`BLOG POST READER - DOS TERMINAL`);
            output.push(
              "============================================================"
            );
            output.push("");

            // Split content into lines and add proper spacing
            const lines = exactMatch.content.split("\n");
            lines.forEach((line) => {
              if (line.trim() === "") {
                output.push("");
              } else if (line.includes("=".repeat(10))) {
                output.push(line);
              } else if (line.includes("-".repeat(10))) {
                output.push(line);
              } else if (line.startsWith("•")) {
                output.push(`  ${line}`);
              } else if (line.startsWith('"') && line.endsWith('"')) {
                output.push("");
                output.push(`  ${line}`);
                output.push("");
              } else {
                output.push(line);
              }
            });

            output.push("");
            output.push(
              "============================================================"
            );
            output.push("End of post. Type 'read' to see available posts.");
            output.push(
              "============================================================"
            );
          } else {
            // Try to find partial matches
            const partialMatches = Object.entries(BLOG_POSTS).filter(
              ([key, post]) =>
                key.includes(postKey) ||
                post.title.toLowerCase().includes(postKey) ||
                post.tags.some((tag) => tag.toLowerCase().includes(postKey))
            );

            if (partialMatches.length > 0) {
              output.push(`Post '${postKey}' not found. Did you mean:`);
              output.push("");
              partialMatches.forEach(([key, post]) => {
                output.push(`  ${key.padEnd(25)} - ${post.title}`);
              });
            } else {
              output.push(`Blog post '${postKey}' not found.`);
              output.push("");
              output.push("Available blog posts:");
              Object.entries(BLOG_POSTS).forEach(([key, post]) => {
                output.push(`  ${key.padEnd(25)} - ${post.title}`);
              });
            }
          }
        }
        break;

      default:
        output.push(
          `'${cmd}' is not recognized as an internal or external command,`
        );
        output.push("operable program or batch file.");
        break;
    }

    addToHistory(command, output);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(currentCommand);
      setCurrentCommand("");
      setShowSuggestions(false);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex].command);
      }
      setShowSuggestions(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentCommand("");
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex].command);
        }
      }
      setShowSuggestions(false);
    } else if (e.key === "Tab") {
      e.preventDefault();
      handleTabCompletion();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    } else {
      // Hide suggestions when typing
      if (showSuggestions) {
        setShowSuggestions(false);
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current && contentRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStartupAnimation(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current && !showStartupAnimation) {
        inputRef.current.focus();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showStartupAnimation]);

  if (showStartupAnimation) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", bounce: 0.3 }}
            className="flex justify-center mb-8"
          >
            <Terminal className="h-24 w-24 text-green-400" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="text-2xl font-bold mb-4">
              Oguz Tozkoparan DOS TERMINAL
            </div>
            <div className="text-lg">Version 1.0.0</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="space-y-2"
          >
            <div>Loading system files...</div>
            <div className="flex justify-center">
              <motion.div
                animate={{ width: ["0%", "100%"] }}
                transition={{ delay: 2, duration: 1 }}
                className="h-1 bg-green-400 w-48"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="text-sm"
          >
            Press any key to continue...
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/5 to-blue-900/5" />
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(0, 255, 0, 0.03) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(0, 255, 0, 0.03) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 80%, rgba(0, 255, 0, 0.03) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
          className="absolute inset-0"
        />
      </div>

      {/* Terminal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative z-10 flex flex-col ${
          isMaximized
            ? "h-screen"
            : "max-w-4xl mx-auto mt-8 h-[600px] rounded-2xl overflow-hidden"
        }`}
      >
        {/* Window Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Terminal className="h-4 w-4 text-green-400" />
            <span className="text-white text-sm font-medium">
              DOS Terminal - Oguz Tozkoparan
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-700 p-1"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMaximized(!isMaximized)}
              className="text-gray-400 hover:text-white hover:bg-gray-700 p-1"
            >
              {isMaximized ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>

            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-400 hover:bg-gray-700 p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Terminal Content - Fixed height with proper overflow */}
        <div className="flex-1 flex flex-col min-h-0">
          <div
            ref={terminalRef}
            className="flex-1 bg-black text-green-400 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-800"
            style={{ fontFamily: "Consolas, 'Courier New', monospace" }}
          >
            <div ref={contentRef} className="p-4 pb-20">
              {/* Welcome Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <div>Oguz Tozkoparan DOS Terminal [Version 1.0.0]</div>
                <div>
                  (c) {new Date().getFullYear()} Oguz Tozkoparan. All rights
                  reserved.
                </div>
                <div className="mt-2">Type 'help' for available commands.</div>
                <div className="mb-4"></div>
              </motion.div>

              {/* Command History */}
              <AnimatePresence>
                {commandHistory.map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-2"
                  >
                    <div className="text-yellow-400">
                      {getPrompt()}
                      <span className="text-white ml-1">{entry.command}</span>
                    </div>
                    {entry.output.map((line, lineIndex) => (
                      <div
                        key={lineIndex}
                        className="text-green-400 whitespace-pre-wrap"
                      >
                        {line}
                      </div>
                    ))}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Tab Completion Suggestions */}
              {showSuggestions && tabSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-2 text-cyan-400"
                >
                  <div className="text-sm">Suggestions:</div>
                  <div className="flex flex-wrap gap-2 ml-4">
                    {tabSuggestions.map((suggestion, index) => (
                      <span
                        key={index}
                        className="bg-gray-800 px-2 py-1 rounded text-xs"
                      >
                        {suggestion}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Current Input */}
              <div className="flex items-center">
                <span className="text-yellow-400">{getPrompt()}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent text-white ml-1 flex-1 outline-none caret-green-400"
                  autoComplete="off"
                  spellCheck={false}
                />
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  className="text-green-400 ml-1"
                >
                  █
                </motion.span>
              </div>
            </div>
          </div>

          {/* Status Bar - Fixed at bottom */}
          <div className="bg-gray-800 border-t border-gray-700 px-4 py-1 text-xs text-gray-400 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-4">
              <span>Path: {currentPath.join("\\")}</span>
              <span className="hidden sm:inline">
                Files: {Object.keys(getCurrentDirectory()).length}
              </span>
            </div>
            <div className="hidden md:flex gap-4">
              <span>F1: Help</span>
              <span>TAB: Complete</span>
              <span>ESC: Exit</span>
            </div>
            <div className="text-right">
              <div className="hidden sm:inline">
                {currentTime.toLocaleDateString()}{" "}
              </div>
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
