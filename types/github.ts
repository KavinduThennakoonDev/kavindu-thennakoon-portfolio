/** Subset of the GitHub REST "repository" object we rely on. */
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  disabled?: boolean;
  private: boolean;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
}

/** GET /repos/{owner}/{repo}/languages → { "TypeScript": 12345, ... } */
export type GitHubLanguages = Record<string, number>;
