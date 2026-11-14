/**
 * Featured project selection.
 *
 * This file ONLY controls which repositories are shown in the large-format
 * "Featured Projects" section and in what order. Every featured card still
 * renders live data from the GitHub API (name, description, languages, links…).
 *
 * To feature another repository, add an entry with its exact GitHub repo name.
 * Lower `priority` numbers appear first. Set `featured: false` to hide one
 * temporarily without deleting the entry.
 */

export interface FeaturedProjectConfig {
  owner: string;
  repo: string;
  featured: boolean;
  priority: number;
  /**
   * Optional real screenshot placed in /public/projects (e.g. "/projects/genix.webp").
   * When omitted, an abstract CSS visual generated from the repo's real
   * technologies is shown instead — never an unrelated stock image.
   */
  previewImage?: string;
}

export const featuredProjects: FeaturedProjectConfig[] = [
  {
    owner: "KavinduThennakoonDev",
    repo: "Genix",
    featured: true,
    priority: 1,
    previewImage: "/projects/genix.webp",
  },
  {
    owner: "KavinduThennakoonDev",
    repo: "nine-digits-admin",
    featured: true,
    priority: 2,
    previewImage: "/projects/nine-digits-admin.webp",
  },
];

/**
 * Repositories that should never appear on the portfolio, even though they
 * are public. Forks, archived and empty repos are already excluded automatically.
 */
export const excludedRepos: string[] = [
  // GitHub profile README repository — not a project.
  "KavinduThennakoonDev",
  // AI/ML project intentionally removed from the portfolio positioning.
  "gem-spectrum-classifier",
  // Older projects intentionally hidden from the portfolio.
  "SriLanka-eParticipation-Portal",
  "Green-Leaf-Info-Management-System",
];

/**
 * Optional screenshots for non-featured repositories, keyed by repo name.
 * Screenshots were captured from each project's live site.
 */
export const projectPreviewImages: Record<string, string> = {
  safari: "/projects/safari.webp",
  ZORIXCO: "/projects/zorixco.webp",
  ProjectHive: "/projects/projecthive.webp",
  luvora: "/projects/luvora.webp",
};

/**
 * Per-repository corrections applied on top of GitHub data, keyed by repo name.
 * Use when GitHub's metadata is missing or outdated (e.g. a site moved to a
 * custom domain). Keep descriptions factual.
 */
export interface ProjectOverride {
  title?: string;
  liveUrl?: string;
  description?: string;
}

export const projectOverrides: Record<string, ProjectOverride> = {
  safari: {
    title: "Tiger Vlog Safari",
    liveUrl: "https://www.tigervlogsafari.com/",
    description:
      "Website for Tiger Vlog Safari, a luxury safari company in Sri Lanka offering guided safari adventures and bookings.",
  },
  ZORIXCO: {
    title: "Zorixco",
    description:
      "Website for Zorixco, a digital agency specializing in web, mobile, and software solutions.",
  },
};
