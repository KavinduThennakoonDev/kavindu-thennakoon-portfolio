"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, SearchX } from "lucide-react";
import type { Project, ProjectsPayload } from "@/types/project";
import { siteConfig } from "@/config/site";
import { FeaturedProject } from "@/components/projects/FeaturedProject";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { ProjectFilters, type SortKey } from "@/components/projects/ProjectFilters";
import { MOTION_DEFER_ATTR, requestMotionBind } from "@/components/motion/motion-bus";

const PAGE_SIZE = 6;

const sorters: Record<SortKey, (a: Project, b: Project) => number> = {
  updated: (a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""),
  created: (a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
  name: (a, b) => a.title.localeCompare(b.title),
  stars: (a, b) => b.stars - a.stars || (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""),
};

function StatusNotice({ payload }: { payload: ProjectsPayload }) {
  if (payload.status === "ok" || !payload.error) return null;
  const reset =
    payload.error.resetAt &&
    new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }).format(
      new Date(payload.error.resetAt),
    );
  const message =
    payload.status === "stale"
      ? "GitHub is temporarily unavailable — showing the most recently synced projects."
      : "Live GitHub data couldn't be loaded right now, so only the core projects from my CV are shown.";
  return (
    <div
      role="status"
      className="mb-10 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/5 px-5 py-4 text-sm text-amber-100/90"
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-300" aria-hidden />
      <p>
        {message}
        {payload.error.code === "rate_limited" && reset && ` GitHub's rate limit resets at ${reset} UTC.`}{" "}
        <a
          href={siteConfig.social.github.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-white"
        >
          Browse all repositories on GitHub
        </a>
        .
      </p>
    </div>
  );
}

export function ProjectsExplorer({ payload }: { payload: ProjectsPayload }) {
  const { projects } = payload;
  const [selected, setSelected] = useState<Project | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [technology, setTechnology] = useState("all");
  const [sort, setSort] = useState<SortKey>("updated");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const deferredQuery = useDeferredValue(query);
  const rootRef = useRef<HTMLDivElement>(null);

  // This region streams and hydrates separately; animate it only once hydrated.
  useEffect(() => {
    if (rootRef.current) requestMotionBind(rootRef.current);
  }, []);

  const featured = useMemo(
    () =>
      projects
        .filter((p) => p.featured)
        .sort((a, b) => (a.featuredPriority ?? 99) - (b.featuredPriority ?? 99)),
    [projects],
  );

  const categories = useMemo(
    () => [...new Set(projects.map((p) => p.category))].sort(),
    [projects],
  );

  const technologies = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => p.technologies.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([t]) => t);
  }, [projects]);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return projects
      .filter((p) => category === "all" || p.category === category)
      .filter((p) => technology === "all" || p.technologies.includes(technology))
      .filter((p) => {
        if (!q) return true;
        return [p.title, p.repo, p.description, p.category, ...p.technologies, ...p.topics]
          .join(" ")
          .toLowerCase()
          .includes(q);
      })
      .sort(sorters[sort]);
  }, [projects, deferredQuery, category, technology, sort]);

  const shown = filtered.slice(0, visible);
  const remaining = filtered.length - shown.length;
  const dirty = query !== "" || category !== "all" || technology !== "all" || sort !== "updated";

  const resetPaging = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setVisible(PAGE_SIZE);
  };

  const reset = () => {
    setQuery("");
    setCategory("all");
    setTechnology("all");
    setSort("updated");
    setVisible(PAGE_SIZE);
  };

  const close = useCallback(() => setSelected(null), []);

  return (
    <div ref={rootRef} {...{ [MOTION_DEFER_ATTR]: "" }}>
      <StatusNotice payload={payload} />

      {featured.length > 0 && (
        <div className="space-y-24 sm:space-y-32">
          {featured.map((project, i) => (
            <FeaturedProject key={project.id} project={project} index={i} onOpen={setSelected} />
          ))}
        </div>
      )}

      <div className="mt-32 sm:mt-40" id="all-projects">
        <div className="mb-10 flex flex-col gap-4 border-t border-line pt-10 sm:flex-row sm:items-end sm:justify-between" data-reveal>
          <div>
            <p className="eyebrow mb-3">Archive</p>
            <h3 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-none tracking-tight">
              All Projects
            </h3>
          </div>
          <p className="max-w-sm text-sm text-muted">
            Every eligible public repository, pulled automatically from GitHub. Forks, archived and
            empty repositories are excluded.
          </p>
        </div>

        <ProjectFilters
          query={query}
          onQuery={resetPaging(setQuery)}
          categories={categories}
          category={category}
          onCategory={resetPaging(setCategory)}
          technologies={technologies}
          technology={technology}
          onTechnology={resetPaging(setTechnology)}
          sort={sort}
          onSort={resetPaging(setSort)}
          resultCount={filtered.length}
          onReset={reset}
          dirty={dirty}
        />

        {projects.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center">
            <p className="font-display text-xl">No public projects yet.</p>
            <p className="mt-2 text-sm text-muted">New repositories will appear here automatically.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center">
            <SearchX className="size-6 text-muted" aria-hidden />
            <p className="mt-4 font-display text-xl">No projects match these filters.</p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 h-10 rounded-full border border-line-strong px-5 text-sm text-fg hover:border-fg/40"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((project, i) => (
              <ProjectCard key={project.id} project={project} order={i} onOpen={setSelected} />
            ))}
          </div>
        )}

        {remaining > 0 && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="group inline-flex h-12 items-center gap-3 rounded-full border border-line-strong px-6 text-sm text-fg transition-colors duration-300 hover:border-fg/40 hover:bg-white/[0.04]"
            >
              Load more
              <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[11px] text-muted">
                {remaining}
              </span>
            </button>
          </div>
        )}
      </div>

      <ProjectDetails project={selected} onClose={close} />
    </div>
  );
}
