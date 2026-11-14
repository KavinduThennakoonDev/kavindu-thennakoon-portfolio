import type { LanguageShare, ProjectCategory } from "@/types/project";
import type { GitHubLanguages } from "@/types/github";

export const FALLBACK_DESCRIPTION =
  "Explore this repository to learn more about the project.";

/* -------------------------------------------------------------------------- */
/*                               Technology map                               */
/* -------------------------------------------------------------------------- */

/** npm dependency name → display technology. Only well-known, unambiguous ones. */
const DEPENDENCY_TECH: Record<string, string> = {
  next: "Next.js",
  react: "React",
  "react-native": "React Native",
  expo: "Expo",
  vue: "Vue",
  nuxt: "Nuxt",
  svelte: "Svelte",
  "@angular/core": "Angular",
  express: "Express",
  mongoose: "Mongoose",
  mongodb: "MongoDB",
  mysql: "MySQL",
  mysql2: "MySQL",
  pg: "PostgreSQL",
  prisma: "Prisma",
  "@prisma/client": "Prisma",
  "socket.io": "Socket.io",
  "socket.io-client": "Socket.io",
  tailwindcss: "Tailwind CSS",
  "@tailwindcss/postcss": "Tailwind CSS",
  bootstrap: "Bootstrap",
  "react-bootstrap": "Bootstrap",
  gsap: "GSAP",
  three: "Three.js",
  cloudinary: "Cloudinary",
  firebase: "Firebase",
  "firebase-admin": "Firebase",
  nodemailer: "Nodemailer",
  multer: "Multer",
  redux: "Redux",
  "@reduxjs/toolkit": "Redux",
  zod: "Zod",
  "framer-motion": "Framer Motion",
  motion: "Framer Motion",
  "@supabase/supabase-js": "Supabase",
  jsonwebtoken: "JWT",
  jose: "JWT",
  typescript: "TypeScript",
  vite: "Vite",
  sass: "Sass",
  "@mui/material": "Material UI",
  "@chakra-ui/react": "Chakra UI",
  recharts: "Recharts",
  leaflet: "Leaflet",
  "react-leaflet": "Leaflet",
  "@react-google-maps/api": "Google Maps",
  stripe: "Stripe",
  lenis: "Lenis",
};

/**
 * Keyword patterns used on repo name / description / topics / README text.
 * Patterns are deliberately strict (word boundaries) to avoid inventing tech.
 */
const TEXT_TECH: Array<[RegExp, string]> = [
  [/\bnext\.?js\b/i, "Next.js"],
  [/\breact\s?native\b/i, "React Native"],
  // Case-sensitive so the English verbs "react"/"express" never match.
  [/\bReact(\.js|JS)?\b(?!\s?Native)/, "React"],
  [/\bnode(\.js|js)\b/i, "Node.js"],
  [/\bexpress(\.js|js)\b|\bExpress\s(server|backend|API)/i, "Express"],
  [/\bmongo\s?db\b/i, "MongoDB"],
  [/\bmongoose\b/i, "Mongoose"],
  [/\bmysql\b/i, "MySQL"],
  [/\bpostgres(ql)?\b/i, "PostgreSQL"],
  [/\bprisma\b/i, "Prisma"],
  [/\bsocket\.?io\b/i, "Socket.io"],
  [/\btailwind(\s?css)?\b/i, "Tailwind CSS"],
  [/\bbootstrap\b/i, "Bootstrap"],
  [/\bspring\s?boot\b/i, "Spring Boot"],
  [/\bflask\b/i, "Flask"],
  [/\bdjango\b/i, "Django"],
  [/\blaravel\b/i, "Laravel"],
  [/\bfirebase\b/i, "Firebase"],
  [/\bcloudinary\b/i, "Cloudinary"],
  [/\bdocker\b/i, "Docker"],
  [/\bgsap\b/i, "GSAP"],
  [/\bthree\.?js\b/i, "Three.js"],
  [/\bnodemailer\b/i, "Nodemailer"],
  [/\bmulter\b/i, "Multer"],
  [/\bredux\b/i, "Redux"],
  [/\bshadcn(\/ui)?\b/i, "shadcn/ui"],
  [/\bvitess\b/i, "Vitess"],
  [/\bmern\b/i, "MERN"],
];

/** MERN is an abbreviation — expand it into its real parts. */
const EXPANSIONS: Record<string, string[]> = {
  MERN: ["MongoDB", "Express", "React", "Node.js"],
};

/** GitHub language names that are worth showing as technology badges. */
const LANGUAGE_TECH = new Set([
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "PHP",
  "HTML",
  "CSS",
  "SCSS",
  "Kotlin",
  "Swift",
  "Dart",
  "Go",
  "Rust",
  "C#",
  "C++",
  "Ruby",
]);

export function techFromDependencies(deps: string[]): string[] {
  const out = new Set<string>();
  for (const dep of deps) {
    const tech = DEPENDENCY_TECH[dep];
    if (tech) out.add(tech);
  }
  // Mongoose implies MongoDB is the database.
  if (out.has("Mongoose")) out.add("MongoDB");
  // Any Express server or Next.js app runs on Node.js.
  if (out.has("Express")) out.add("Node.js");
  return [...out];
}

export function techFromText(...texts: Array<string | null | undefined>): string[] {
  const haystack = texts.filter(Boolean).join("\n");
  if (!haystack) return [];
  const out = new Set<string>();
  for (const [pattern, tech] of TEXT_TECH) {
    if (pattern.test(haystack)) {
      for (const t of EXPANSIONS[tech] ?? [tech]) out.add(t);
    }
  }
  return [...out];
}

export function techFromLanguages(languages: LanguageShare[]): string[] {
  return languages
    .filter((l) => LANGUAGE_TECH.has(l.name) && l.percent >= 3)
    .map((l) => l.name);
}

/** Display order: frameworks first, then data, tooling, finally raw languages. */
const TECH_ORDER = [
  "Next.js",
  "React",
  "React Native",
  "Expo",
  "Vue",
  "Angular",
  "Svelte",
  "Node.js",
  "Express",
  "Spring Boot",
  "Flask",
  "Django",
  "Laravel",
  "Socket.io",
  "MongoDB",
  "Mongoose",
  "MySQL",
  "Vitess",
  "PostgreSQL",
  "Prisma",
  "Firebase",
  "Supabase",
  "Cloudinary",
  "Tailwind CSS",
  "Bootstrap",
  "shadcn/ui",
  "GSAP",
  "Three.js",
  "TypeScript",
  "JavaScript",
];

export function sortTechnologies(techs: Iterable<string>): string[] {
  const unique = [...new Set(techs)];
  return unique.sort((a, b) => {
    const ia = TECH_ORDER.indexOf(a);
    const ib = TECH_ORDER.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });
}

/* -------------------------------------------------------------------------- */
/*                                 Categories                                 */
/* -------------------------------------------------------------------------- */

const MOBILE = ["React Native", "Expo", "Kotlin", "Swift", "Dart"];
const FRONTEND = [
  "React",
  "Next.js",
  "Vue",
  "Angular",
  "Svelte",
  "HTML",
  "Tailwind CSS",
  "Bootstrap",
];
const BACKEND = [
  "Express",
  "Mongoose",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "Prisma",
  "Spring Boot",
  "Flask",
  "Django",
  "Laravel",
  "PHP",
  "Socket.io",
  "Firebase",
  "Supabase",
  "Nodemailer",
  "Multer",
];

/**
 * Assign a category only from evidence present in the repository data.
 * Next.js alone is treated as frontend; it only becomes full-stack when a
 * data/back-end technology is detected as well.
 */
export function detectCategory(techs: string[]): ProjectCategory {
  const has = (list: string[]) => techs.some((t) => list.includes(t));
  if (has(MOBILE)) return "Mobile Development";
  const fe = has(FRONTEND);
  const be = has(BACKEND);
  if (fe && be) return "Full-Stack Development";
  if (fe) return "Frontend Development";
  if (be) return "Backend Development";
  return "Other";
}

/* -------------------------------------------------------------------------- */
/*                                  Languages                                 */
/* -------------------------------------------------------------------------- */

/** Colors follow GitHub linguist conventions so they read as familiar. */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  PHP: "#4F5D95",
  HTML: "#e34c26",
  CSS: "#663399",
  SCSS: "#c6538c",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Dart: "#00B4AB",
  EJS: "#a91e50",
  Handlebars: "#f7931e",
  Go: "#00ADD8",
};

export function languageColor(name: string | null | undefined): string {
  return (name && LANGUAGE_COLORS[name]) || "#71717a";
}

export function toLanguageShares(languages: GitHubLanguages | null): LanguageShare[] {
  if (!languages) return [];
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
  if (!total) return [];
  return Object.entries(languages)
    .map(([name, bytes]) => ({
      name,
      percent: Math.round((bytes / total) * 1000) / 10,
      color: languageColor(name),
    }))
    .filter((l) => l.percent >= 0.5)
    .sort((a, b) => b.percent - a.percent);
}

/* -------------------------------------------------------------------------- */
/*                                   README                                   */
/* -------------------------------------------------------------------------- */

const BOILERPLATE = [
  /bootstrapped with \[?`?create-next-app/i,
  /bootstrapped with \[?create react app/i,
  /this template provides a minimal setup/i,
  /getting started with create react app/i,
  /^#*\s*getting started/i,
  /^run the development server/i,
];

/**
 * Extract the first meaningful prose paragraph from a README.
 * Returns null for template/boilerplate READMEs so we never present
 * framework boilerplate as a project description.
 */
export function extractReadmeSummary(markdown: string | null): string | null {
  if (!markdown) return null;

  const cleaned = markdown
    .replace(/\r\n/g, "\n")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, " ");

  const paragraphs = cleaned
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  for (const raw of paragraphs) {
    if (/^#/.test(raw)) continue; // headings
    if (/^(\s*[-*+]|\s*\d+\.)\s/.test(raw)) continue; // lists
    if (/^\s*[|>]/.test(raw)) continue; // tables, quotes
    if (/^!\[|^\[!\[/.test(raw)) continue; // badges / images
    if (BOILERPLATE.some((re) => re.test(raw))) return null;

    const text = raw
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_`~]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (text.length < 30) continue;
    return text.length > 280 ? `${text.slice(0, 277).trimEnd()}…` : text;
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

const ACRONYMS: Record<string, string> = {
  api: "API",
  ui: "UI",
  cms: "CMS",
  erp: "ERP",
  crud: "CRUD",
  mern: "MERN",
};

/** "Green-Leaf-Info-Management-System" → "Green Leaf Info Management System" */
export function prettifyRepoName(name: string): string {
  if (/^[A-Z0-9]+$/.test(name)) return name; // e.g. ZORIXCO
  // Single-word names keep their own casing (e.g. "ProjectHive", "safari" → "Safari").
  if (!/[-_\s]/.test(name)) return name.charAt(0).toUpperCase() + name.slice(1);
  return name
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(" ")
    .filter(Boolean)
    .map((w) => {
      const lower = w.toLowerCase();
      if (ACRONYMS[lower]) return ACRONYMS[lower];
      if (/^[A-Z0-9]{2,}$/.test(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ")
    .replace(/\bSpringboot\b/i, "Spring Boot")
    .replace(/\bE Participation\b/i, "eParticipation")
    .replace(/\bSri Lanka\b/i, "Sri Lanka");
}

/** Normalize a homepage URL; returns null for empty / invalid values. */
export function normalizeUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** Deterministic (server == client) date formatting. */
export function formatMonthYear(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : DATE_FMT.format(d);
}
