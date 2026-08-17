// ---------------------------------------------------------------------------
// SITE CONTENT — everything user-visible lives in this file.
// Edit the objects below and rebuild; no component changes needed.
// ---------------------------------------------------------------------------

export const site = {
  name: "Oguz Tozkoparan",
  role: "Software Engineer",
  location: "Ankara, Turkey",
  email: "oguztozkoparan@gmail.com",
  url: "https://oguztozkoparan.com",
};

export const socials = [
  { label: "GitHub", handle: "@oguztozkoparan", href: "https://github.com/oguztozkoparan" },
  { label: "LinkedIn", handle: "in/oguztozkoparan", href: "https://www.linkedin.com/in/oguztozkoparan" },
  { label: "X / Twitter", handle: "@oguztozkoparan", href: "https://x.com/oguztozkoparan" },
];

export const about = {
  intro:
    "I'm Oguz — a software engineer based in Ankara. For 5+ years I've been shipping React and Next.js products with an obsession for motion, performance and detail.",
  outro:
    "From interactive experiments to design systems, I work where engineering meets design — and I sweat the last 4 pixels.",
  facts: [
    { k: "Location", v: "Ankara, TR" },
    { k: "Experience", v: "5+ years" },
    { k: "Focus", v: "Frontend & Motion" },
  ],
};

export type Project = {
  id: string; // picks the SVG artwork in components/ProjectVisual.tsx
  index: string;
  title: string;
  description: string;
  status: string; // small badge on the card ("Live", "Open source", ...)
  tags: string[];
  href: string | null; // null = card renders without a link
};

export const projects: Project[] = [
  {
    id: "portfolio",
    index: "01",
    title: "oguztozkoparan.com",
    description:
      "This site — a GSAP-driven single page with a scroll-scrubbed hero sequence, statically exported to GitHub Pages.",
    status: "v3.0.0",
    tags: ["Next.js", "GSAP", "Lenis"],
    href: "https://github.com/oguztozkoparan/oguztozkoparan.github.io",
  },
  {
    id: "dos-terminal",
    index: "02",
    title: "DOS Terminal",
    description:
      "A retro DOS-style terminal in the browser — virtual file system, tab completion and command history, built for v2 of this site.",
    status: "v2 experiment",
    tags: ["React", "TypeScript", "CLI UX"],
    href: "https://github.com/oguztozkoparan/oguztozkoparan.github.io",
  },
  {
    id: "mini-games",
    index: "03",
    title: "Mini Games Hub",
    description:
      "Five self-contained browser games — snake, memory, reaction, sliding puzzle and typing speed — with difficulty filters.",
    status: "v2 experiment",
    tags: ["React", "Canvas", "Games"],
    href: "https://github.com/oguztozkoparan/oguztozkoparan.github.io",
  },
  {
    id: "sprite-gen",
    index: "04",
    title: "Sprite Sheet Generator",
    description:
      "A Python tool that packs a folder of SVGs into a single sprite sheet alongside a metadata.json.",
    status: "Open source",
    tags: ["Python", "Tooling", "SVG"],
    href: "https://github.com/oguztozkoparan/sprite-sheet-generator",
  },
];

export const capabilities = [
  {
    index: "01",
    title: "Frontend Engineering",
    items: ["React", "Next.js", "Vue.js", "TypeScript", "Tailwind CSS", "SASS"],
  },
  {
    index: "02",
    title: "Motion & Interaction",
    items: ["GSAP", "ScrollTrigger", "Lenis", "Framer Motion", "Three.js"],
  },
  {
    index: "03",
    title: "Creative Development",
    items: ["Canvas", "WebGL", "Generative visuals", "Interactive experiments"],
  },
  {
    index: "04",
    title: "Design & Performance",
    items: ["UI/UX", "Design systems", "Figma", "Core Web Vitals", "SEO"],
  },
];

// Hero scroll narrative — "The Unfolding Grid": code pass, web/game split
// panels, then a canvas wipe into the featured project.
export const heroNarrative = {
  sub: "Full-stack engineering & game development",
  codeLines: [
    "float4 frag(v2f i) : SV_Target {",
    "  float rim = pow(1.0 - ndv, 3.0);",
    "  float glow = rim * pow(ndl, 2.0);",
    "  return lerp(base, neon, glow);",
    "}",
    'const forge = createEngine({ mode: "isometric" });',
    "forge.compose(scene, bloomPass, scanlines);",
    "export const world = forge.run();",
  ],
  webEngine: {
    title: "Web Engine",
    items: [
      "Next.js architecture",
      "TypeScript systems",
      "Realtime APIs",
      "Core Web Vitals",
    ],
  },
  gameForge: {
    title: "Game Forge",
    items: [
      "2D isometric mechanics",
      "Shader effects",
      "Pixel pipelines",
      "Game services",
    ],
  },
  card: {
    label: "Featured work",
    title: "oguztozkoparan.com",
    cta: "View selected work",
    href: "#work",
  },
};

export const marqueeItems = [
  "Software Engineer",
  "React & Next.js",
  "Motion & GSAP",
  "Creative Development",
  "UI Engineering",
  "Performance",
];
