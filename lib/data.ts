export const site = {
  name: "Oguz Tozkoparan",
  role: "Software Engineer",
  studio: "Orion's Gate Studio",
  location: "Ankara, Türkiye",
  email: "oguz@orionsgatestudios.com",
  url: "https://oguztozkoparan.com",
};

export const socials = [
  { label: "GitHub", handle: "@oguztozkoparan", href: "https://github.com/oguztozkoparan" },
  { label: "LinkedIn", handle: "in/oguztozkoparan", href: "https://www.linkedin.com/in/oguztozkoparan" },
  { label: "X / Twitter", handle: "@oguztozkoparan", href: "https://x.com/oguztozkoparan" },
];

export const about = {
  intro:
    "I'm Oguz — a software engineer based in Ankara, building games and web experiences at Orion's Gate Studio. For 5+ years I've been shipping React and Next.js products with an obsession for motion, performance and detail.",
  outro:
    "From Web3 game economies to design systems, I work where engineering meets design — and I sweat the last 4 pixels.",
  facts: [
    { k: "Location", v: "Ankara, TR" },
    { k: "Experience", v: "5+ years" },
    { k: "Currently", v: "Orion's Gate Studio" },
  ],
};

export type Project = {
  id: string;
  index: string;
  title: string;
  description: string;
  status: string;
  tags: string[];
  href: string | null;
};

export const projects: Project[] = [
  {
    id: "galactic-life",
    index: "01",
    title: "Orion's Galactic Life",
    description:
      "A Web3 game where players own the economy — earn, trade and stake through gameplay in a persistent galactic world.",
    status: "Beta",
    tags: ["Web3", "Game", "Token Economy"],
    href: "https://www.orionsgate.studio",
  },
  {
    id: "studio",
    index: "02",
    title: "Orion's Gate Studio",
    description:
      "The studio's home on the web — a Next.js site for a blockchain game studio, from design system to deployment.",
    status: "Live",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    href: "https://www.orionsgate.studio",
  },
  {
    id: "marketplace",
    index: "03",
    title: "Galactic Marketplace",
    description:
      "A trading platform for in-game assets across the Orion universe — listings, bids and on-chain ownership.",
    status: "In development",
    tags: ["Platform", "Web3", "Marketplace"],
    href: null,
  },
  {
    id: "portfolio",
    index: "04",
    title: "oguztozkoparan.com",
    description:
      "This site — a GSAP-driven rebuild with scroll choreography and smooth scrolling, statically exported to GitHub Pages.",
    status: "v3.0.0",
    tags: ["Next.js", "GSAP", "Lenis"],
    href: "https://github.com/oguztozkoparan/oguztozkoparan.github.io",
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
    title: "Games & Web3",
    items: ["Gameplay systems", "Game services", "Token economies", "NFT integration"],
  },
  {
    index: "04",
    title: "Design & Performance",
    items: ["UI/UX", "Design systems", "Figma", "Core Web Vitals", "SEO"],
  },
];

export const marqueeItems = [
  "Software Engineer",
  "Game Developer",
  "React & Next.js",
  "Motion & GSAP",
  "Web3",
  "UI Engineering",
];
