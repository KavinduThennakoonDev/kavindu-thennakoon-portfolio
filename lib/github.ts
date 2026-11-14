import { cacheLife, cacheTag } from "next/cache";
import { siteConfig } from "@/config/site";
import {
  excludedRepos,
  featuredProjects,
  projectOverrides,
  projectPreviewImages,
} from "@/config/featured-projects";
import { cvProjects, manualProjects, type CvProject } from "@/data/cv-projects";
import type { GitHubLanguages, GitHubRepo } from "@/types/github";
import type { Project, ProjectsPayload } from "@/types/project";
import {
  FALLBACK_DESCRIPTION,
  detectCategory,
  extractReadmeSummary,
  normalizeUrl,
  prettifyRepoName,
  sortTechnologies,
  techFromDependencies,
  techFromLanguages,
  techFromText,
  toLanguageShares,
} from "@/lib/github-utils";

const OWNER = siteConfig.social.github.username;
const API = "https://api.github.com";
const RAW = "https://raw.githubusercontent.com";
/** Revalidate GitHub data every 60 minutes. */
const REVALIDATE_SECONDS = 60 * 60;
const MAX_PAGES = 10;
const REQUEST_TIMEOUT_MS = 10_000;

export const GITHUB_CACHE_TAG = "github-repos";

class GitHubError extends Error {
  constructor(
    message: string,
    public code: "rate_limited" | "network" | "http" | "unknown",
    public resetAt?: string,
  ) {
    super(message);
  }
}

function apiHeaders(accept = "application/vnd.github+json"): HeadersInit {
  const headers: Record<string, string> = {
    Accept: accept,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-github-sync",
  };
  // Optional, server-only. Raises the limit from 60 to 5,000 requests/hour.
  // Never prefixed with NEXT_PUBLIC_, so it is never bundled for the browser.
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function request(url: string, init: RequestInit = {}): Promise<Response> {
  try {
    return await fetch(url, {
      ...init,
      // Persistent fetch cache: only 200 responses are stored, so a failed
      // refresh keeps serving the previously cached response.
      cache: "force-cache",
      next: { revalidate: REVALIDATE_SECONDS, tags: [GITHUB_CACHE_TAG] },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new GitHubError(
      error instanceof Error ? error.message : "Network request failed",
      "network",
    );
  }
}

function assertOk(res: Response) {
  if (res.ok) return;
  const remaining = res.headers.get("x-ratelimit-remaining");
  if ((res.status === 403 || res.status === 429) && (remaining === "0" || res.status === 429)) {
    const reset = Number(res.headers.get("x-ratelimit-reset"));
    throw new GitHubError(
      "GitHub API rate limit reached.",
      "rate_limited",
      Number.isFinite(reset) && reset > 0 ? new Date(reset * 1000).toISOString() : undefined,
    );
  }
  throw new GitHubError(`GitHub responded with HTTP ${res.status}.`, "http");
}

function nextPageUrl(link: string | null): string | null {
  if (!link) return null;
  const match = link.split(",").find((part) => /rel="next"/.test(part));
  return match?.match(/<([^>]+)>/)?.[1] ?? null;
}

/** Fetch every public repository, following GitHub's Link-header pagination. */
async function fetchAllRepos(): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let url: string | null =
    `${API}/users/${OWNER}/repos?sort=updated&per_page=100&type=owner`;

  for (let page = 0; url && page < MAX_PAGES; page++) {
    const res = await request(url, { headers: apiHeaders() });
    assertOk(res);
    const batch = (await res.json()) as GitHubRepo[];
    repos.push(...batch);
    url = nextPageUrl(res.headers.get("link"));
  }
  return repos;
}

/* ------------------------- per-repository metadata ------------------------ */
// Each helper swallows its own errors: missing metadata must never break the
// whole project list.

async function fetchLanguages(repo: GitHubRepo): Promise<GitHubLanguages | null> {
  try {
    const res = await request(`${API}/repos/${repo.full_name}/languages`, {
      headers: apiHeaders(),
    });
    if (!res.ok) return null;
    return (await res.json()) as GitHubLanguages;
  } catch {
    return null;
  }
}

/** package.json via raw.githubusercontent.com (does not use API quota). */
async function fetchDependencies(repo: GitHubRepo): Promise<string[] | null> {
  try {
    const res = await request(
      `${RAW}/${repo.full_name}/${encodeURIComponent(repo.default_branch)}/package.json`,
    );
    if (!res.ok) return null;
    const pkg = (await res.json()) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    return [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
    ];
  } catch {
    return null;
  }
}

/** README: raw README.md first (no quota), then the API endpoint for other filenames. */
async function fetchReadme(repo: GitHubRepo): Promise<string | null> {
  try {
    const raw = await request(
      `${RAW}/${repo.full_name}/${encodeURIComponent(repo.default_branch)}/README.md`,
    );
    if (raw.ok) return await raw.text();
    if (raw.status !== 404) return null;

    const res = await request(`${API}/repos/${repo.full_name}/readme`, {
      headers: apiHeaders("application/vnd.github.raw+json"),
    });
    if (!res.ok) return null; // 404 = repository has no README
    return await res.text();
  } catch {
    return null;
  }
}

/** Bullet points listed under a "Features" heading in the README, verbatim. */
function extractReadmeFeatures(markdown: string | null): string[] {
  if (!markdown) return [];
  const section = markdown
    .replace(/\r\n/g, "\n")
    .match(/^#{1,4}\s*[^\n]*features?[^\n]*\n([\s\S]*?)(?=^#{1,4}\s|$(?![\s\S]))/im);
  if (!section) return [];
  return section[1]
    .split("\n")
    .filter((line) => /^[-*+]\s+/.test(line))
    .map((line) =>
      line
        .replace(/^[-*+]\s+/, "")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/[*_`]/g, "")
        .split(/\s[–—-]\s/)[0]
        .trim(),
    )
    .filter((line) => line.length > 2 && line.length < 90)
    .slice(0, 8);
}

/* ------------------------------ normalization ----------------------------- */

const featuredByRepo = new Map(
  featuredProjects
    .filter((f) => f.featured && f.owner.toLowerCase() === OWNER.toLowerCase())
    .map((f) => [f.repo.toLowerCase(), f]),
);
/** CV projects + manually configured (private-repo) projects. */
const curatedProjects = [...cvProjects, ...manualProjects];
const cvByRepo = new Map(curatedProjects.map((p) => [p.repo.toLowerCase(), p]));

function isEligible(repo: GitHubRepo): boolean {
  if (repo.fork || repo.archived || repo.disabled || repo.private) return false;
  if (repo.size === 0) return false; // empty repository
  if (repo.name.toLowerCase() === OWNER.toLowerCase()) return false; // profile README
  return !excludedRepos.some((r) => r.toLowerCase() === repo.name.toLowerCase());
}

async function normalizeRepo(repo: GitHubRepo): Promise<Project | null> {
  const key = repo.name.toLowerCase();
  const cv = cvByRepo.get(key);
  const featured = featuredByRepo.get(key);
  const override = projectOverrides[repo.name];

  const [languagesRaw, deps] = await Promise.all([
    fetchLanguages(repo),
    fetchDependencies(repo),
  ]);

  // README is only needed when the description or dependency data is missing,
  // or for featured projects (to surface listed features).
  const needsReadme = !repo.description || !deps || Boolean(featured && !cv?.features);
  const readme = needsReadme ? await fetchReadme(repo) : null;
  const readmeSummary = extractReadmeSummary(readme);

  const languages = toLanguageShares(languagesRaw);
  const topics = repo.topics ?? [];

  const technologies = sortTechnologies([
    ...(cv?.technologies ?? []),
    ...techFromDependencies(deps ?? []),
    ...techFromText(repo.name, repo.description, topics.join(" ")),
    // README text is used for tech only when there is no package.json to read.
    ...(deps ? [] : techFromText(readme)),
    ...techFromLanguages(languages),
  ]);

  const homepageUrl = normalizeUrl(override?.liveUrl ?? repo.homepage);
  const hasInfo =
    Boolean(repo.description || readmeSummary || homepageUrl || cv) ||
    languages.length > 0;
  if (!hasInfo) return null; // no meaningful project information

  let description = FALLBACK_DESCRIPTION;
  let descriptionSource: Project["descriptionSource"] = "fallback";
  if (override?.description) {
    description = override.description;
    descriptionSource = "override";
  } else if (cv) {
    // CV text is the owner's own curated description of this exact repository.
    description = cv.description;
    descriptionSource = "cv";
  } else if (repo.description?.trim()) {
    description = repo.description.trim();
    descriptionSource = "github";
  } else if (readmeSummary) {
    description = readmeSummary;
    descriptionSource = "readme";
  }

  return {
    id: String(repo.id),
    repo: repo.name,
    owner: repo.owner.login,
    title: override?.title ?? cv?.title ?? prettifyRepoName(repo.name),
    description,
    descriptionSource,
    category: cv?.category ?? detectCategory(technologies),
    technologies,
    primaryLanguage: repo.language,
    languages,
    topics,
    features: cv?.features ?? extractReadmeFeatures(readme),
    stars: repo.stargazers_count,
    githubUrl: repo.html_url,
    homepageUrl,
    createdAt: repo.created_at,
    updatedAt: repo.pushed_at || repo.updated_at,
    defaultBranch: repo.default_branch,
    previewImage: featured?.previewImage ?? projectPreviewImages[repo.name] ?? null,
    featured: Boolean(featured),
    featuredPriority: featured?.priority ?? null,
    source: "github",
  };
}

/**
 * A CV project shown without live GitHub data — either because its repository
 * is not public (`repoKnownPublic = false`) or because GitHub is unreachable.
 */
function cvOnlyProject(cv: CvProject, repoKnownPublic = false): Project {
  const featured = featuredByRepo.get(cv.repo.toLowerCase());
  return {
    id: `cv-${cv.repo}`,
    repo: cv.repo,
    owner: OWNER,
    title: cv.title,
    description: cv.description,
    descriptionSource: "cv",
    category: cv.category,
    technologies: sortTechnologies(cv.technologies),
    primaryLanguage: null,
    languages: [],
    topics: [],
    features: cv.features ?? [],
    stars: 0,
    githubUrl:
      repoKnownPublic && !cv.privateRepo ? `https://github.com/${OWNER}/${cv.repo}` : null,
    homepageUrl: normalizeUrl(cv.fallbackUrl),
    createdAt: null,
    updatedAt: null,
    defaultBranch: null,
    previewImage: featured?.previewImage ?? projectPreviewImages[cv.repo] ?? null,
    featured: Boolean(featured),
    featuredPriority: featured?.priority ?? null,
    source: "cv",
  };
}

function byRecentlyUpdated(a: Project, b: Project) {
  return (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "");
}

async function buildPayload(): Promise<ProjectsPayload> {
  const all = await fetchAllRepos();
  const eligible = all.filter(isEligible);

  const normalized = (await Promise.all(eligible.map(normalizeRepo))).filter(
    (p): p is Project => p !== null,
  );

  const present = new Set(normalized.map((p) => p.repo.toLowerCase()));
  const cvOnly = curatedProjects
    .filter((cv) => !present.has(cv.repo.toLowerCase()))
    .map((cv) => cvOnlyProject(cv));

  return {
    status: "ok",
    projects: [...normalized, ...cvOnly].sort(byRecentlyUpdated),
    fetchedAt: new Date().toISOString(),
    totalPublicRepos: all.filter((r) => !r.private).length,
  };
}

/** Last successful payload kept in memory (used when a refresh fails). */
let lastGood: ProjectsPayload | null = null;

/**
 * Portfolio projects sourced from the public GitHub REST API.
 * Cached server-side and revalidated hourly; never throws.
 */
export async function getProjects(): Promise<ProjectsPayload> {
  "use cache";
  cacheTag(GITHUB_CACHE_TAG);

  try {
    const payload = await buildPayload();
    cacheLife({ stale: 300, revalidate: REVALIDATE_SECONDS, expire: 60 * 60 * 24 * 7 });
    lastGood = payload;
    return payload;
  } catch (e) {
    const err =
      e instanceof GitHubError
        ? { code: e.code, message: e.message, resetAt: e.resetAt }
        : { code: "unknown" as const, message: "Unexpected error while loading GitHub data." };

    // Retry sooner when something went wrong.
    cacheLife({ stale: 300, revalidate: 300, expire: 60 * 60 });

    if (lastGood) return { ...lastGood, status: "stale", error: err };
    return {
      status: "error",
      projects: curatedProjects.map((cv) => cvOnlyProject(cv, true)),
      fetchedAt: null,
      totalPublicRepos: 0,
      error: err,
    };
  }
}
