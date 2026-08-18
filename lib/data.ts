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
  image: "/images/about.webp",
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
  image?: string; // optional /public path; falls back to the SVG artwork
};

export const projects: Project[] = [
  {
    id: "portfolio",
    image: "/images/portfolio.webp",
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
    image: "/images/dos-terminal.webp",
    index: "02",
    title: "DOS Terminal",
    description:
      "A retro DOS-style terminal in the browser — virtual file system, tab completion and command history. Try it live.",
    status: "Live",
    tags: ["React", "TypeScript", "CLI UX"],
    href: "/dos",
  },
  {
    id: "mini-games",
    image: "/images/mini-games.webp",
    index: "03",
    title: "Mini Games Hub",
    description:
      "Five self-contained browser games — snake, memory, reaction, sliding puzzle and typing speed. Play them live.",
    status: "Live",
    tags: ["React", "Canvas", "Games"],
    href: "/games",
  },
  {
    id: "sprite-gen",
    image: "/images/sprite-gen.webp",
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
  finale: {
    label: "The grid is live",
    lineSolid: "From thought",
    lineOutline: "to reality",
    meta: "Featured — oguztozkoparan.com · v3",
    cta: "Explore selected work",
    href: "#work",
    image: "/images/portfolio.webp",
  },
};

// Hobbies — "After Dark", the off-duty reliquary. Three relic cards
// (one per obsession) + a closing quote. Images live in /public/images/hobbies/.
export type HobbyRelic = {
  id: string; // picks the card icon in components/Hobbies.tsx
  numeral: string; // roman numeral in the card corner
  tag: string; // explicit hobby tag shown top-left ("Gaming", "Manga", ...)
  kicker: string; // one-line plain-language hobby name above the title
  title: string;
  description: string;
  image: string; // /public path, ~3:4 portrait
  alt: string;
  stats: { k: string; v: string }[]; // two short flavor stats
  whisper: string; // soulslike "player message" at the card foot
};

export const hobbies = {
  label: "Hobbies",
  headingSolid: "After",
  headingOutline: "Dark",
  intro:
    "This is what I do when I'm not shipping code: I sink long nights into punishing soulslike RPGs, devour grim dark-fantasy manga, and get lost in mythologies deep enough to ship their own appendices.",
  outro:
    "Scroll the shelf — every card is one obsession, and the shelf grows as new ones join.",
  relics: [
    {
      id: "souls",
      numeral: "I",
      tag: "Gaming",
      kicker: "What I play",
      title: "Soulslike Worlds",
      description:
        "Boss doors, bonfire checkpoints and the beautiful cruelty of learning by dying. Patience as a core mechanic — I speak it fluently.",
      image: "/images/hobbies/souls.webp",
      alt: "A lone knight resting at a bonfire before a colossal fog-shrouded gate",
      stats: [
        { k: "Deaths", v: "Countless" },
        { k: "Regrets", v: "None" },
      ],
      whisper: "bonfire ahead, therefore hope",
    },
    {
      id: "manga",
      numeral: "II",
      tag: "Manga",
      kicker: "What I read",
      title: "Grim Manga Sagas",
      description:
        "Ink-black epics where the struggle is the story — colossal swords, doomed causes and panels heavy enough to bend the shelf.",
      image: "/images/hobbies/manga.webp",
      alt: "A swordsman carrying a colossal greatsword beneath a crimson eclipse",
      stats: [
        { k: "Volumes", v: "Shelves full" },
        { k: "Heart", v: "Broken, often" },
      ],
      whisper: "don't get attached",
    },
    {
      id: "myth",
      numeral: "III",
      tag: "Mythology",
      kicker: "Where I get lost",
      title: "Layered Mythologies",
      description:
        "Invented languages, bloodlines, maps with burnt corners. If a story ships its own encyclopedia, I'm already living in it.",
      image: "/images/hobbies/myth.webp",
      alt: "A ruined citadel on a mountainside above mist-filled valleys",
      stats: [
        { k: "Lore depth", v: "Appendix N" },
        { k: "Maps owned", v: "Too many" },
      ],
      whisper: "the road goes ever on",
    },
  ] as HobbyRelic[],
  quote: {
    solid: "Die. Learn.",
    outline: "Ship again.",
    meta: "The loop — in games and in code",
    image: "/images/hobbies/eclipse-field.webp", // faint backdrop behind the quote
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
