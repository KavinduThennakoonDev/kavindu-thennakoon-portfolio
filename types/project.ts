export type ProjectCategory =
  | "Full-Stack Development"
  | "Frontend Development"
  | "Backend Development"
  | "Mobile Development"
  | "Real-Time Web Application"
  | "Other"
  | (string & {});

export interface LanguageShare {
  name: string;
  percent: number;
  color: string;
}

/** Normalized project used by every portfolio component. */
export interface Project {
  id: string;
  repo: string;
  owner: string;
  title: string;
  description: string;
  /** Where the description came from — useful for honesty/debugging. */
  descriptionSource: "override" | "github" | "cv" | "readme" | "fallback";
  category: ProjectCategory;
  technologies: string[];
  primaryLanguage: string | null;
  languages: LanguageShare[];
  topics: string[];
  features: string[];
  stars: number;
  githubUrl: string | null;
  homepageUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  defaultBranch: string | null;
  previewImage: string | null;
  featured: boolean;
  featuredPriority: number | null;
  source: "github" | "cv";
}

export type ProjectsStatus = "ok" | "stale" | "error";

export interface ProjectsPayload {
  status: ProjectsStatus;
  projects: Project[];
  /** ISO timestamp of the GitHub fetch that produced this data. */
  fetchedAt: string | null;
  totalPublicRepos: number;
  error?: {
    code: "rate_limited" | "network" | "http" | "unknown";
    message: string;
    resetAt?: string;
  };
}
