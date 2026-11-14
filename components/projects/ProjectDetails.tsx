"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Calendar, GitBranch, Star, X } from "lucide-react";
import type { Project } from "@/types/project";
import { GithubIcon } from "@/components/ui/icons";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { TechBadges } from "@/components/projects/ProjectMeta";
import { formatMonthYear } from "@/lib/github-utils";

/** Accessible project details dialog built on the native <dialog> element. */
export function ProjectDetails({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) {
      dialog.showModal();
      window.__lenis?.stop();
    } else if (!project && dialog.open) {
      dialog.close();
    }
  }, [project]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      window.__lenis?.start();
      onClose();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const created = formatMonthYear(project?.createdAt ?? null);
  const updated = formatMonthYear(project?.updatedAt ?? null);

  return (
    <dialog
      ref={ref}
      aria-labelledby="project-dialog-title"
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself) closes it.
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-3xl overflow-visible rounded-3xl border border-line-strong bg-bg-2 p-0 text-fg shadow-[0_60px_120px_-40px_rgb(0_0_0/0.9)] backdrop:bg-bg/80 backdrop:backdrop-blur-sm open:animate-[card-in_0.5s_var(--ease-out)]"
    >
      {project && (
        <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto" data-lenis-prevent>
          <div className="relative aspect-[16/8] overflow-hidden rounded-t-3xl border-b border-line">
            <ProjectVisual project={project} />
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close project details"
              autoFocus
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-line-strong bg-bg/70 text-fg backdrop-blur transition-colors hover:bg-bg"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="p-6 sm:p-9">
            <p className="eyebrow text-[10px]">{project.category}</p>
            <h3 id="project-dialog-title" className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {project.title}
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base">{project.description}</p>

            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-subtle">
              {created && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" aria-hidden />
                  <dt className="sr-only">Created</dt>
                  <dd>Created {created}</dd>
                </div>
              )}
              {updated && (
                <div className="flex items-center gap-1.5">
                  <dt className="sr-only">Last updated</dt>
                  <dd>Updated {updated}</dd>
                </div>
              )}
              {project.defaultBranch && (
                <div className="flex items-center gap-1.5">
                  <GitBranch className="size-3.5" aria-hidden />
                  <dt className="sr-only">Default branch</dt>
                  <dd>{project.defaultBranch}</dd>
                </div>
              )}
              {project.stars > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star className="size-3.5" aria-hidden />
                  <dt className="sr-only">Stars</dt>
                  <dd>{project.stars}</dd>
                </div>
              )}
            </dl>

            {project.features.length > 0 && (
              <section className="mt-8">
                <h4 className="eyebrow mb-4">Key features</h4>
                <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {project.features.map((f) => (
                    <li key={f} className="flex gap-3 text-sm text-fg/85">
                      <span aria-hidden className="mt-[0.6em] size-1 shrink-0 rounded-full bg-accent-2" />
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project.technologies.length > 0 && (
              <section className="mt-8">
                <h4 className="eyebrow mb-4">Technologies</h4>
                <TechBadges techs={project.technologies} />
              </section>
            )}

            {project.languages.length > 0 && (
              <section className="mt-8">
                <h4 className="eyebrow mb-4">Languages · from GitHub</h4>
                <div className="flex h-2 overflow-hidden rounded-full bg-bg-3">
                  {project.languages.map((l) => (
                    <span key={l.name} style={{ width: `${l.percent}%`, background: l.color }} title={`${l.name} ${l.percent}%`} />
                  ))}
                </div>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted">
                  {project.languages.map((l) => (
                    <li key={l.name} className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full" style={{ background: l.color }} aria-hidden />
                      {l.name} <span className="text-subtle">{l.percent}%</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-10 flex flex-wrap gap-3 border-t border-line pt-6">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-bg transition-shadow hover:shadow-[0_0_0_5px_rgb(99_102_241/0.2)]"
                >
                  <GithubIcon className="size-4" aria-hidden />
                  View on GitHub
                </a>
              )}
              {project.homepageUrl && (
                <a
                  href={project.homepageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-5 text-sm text-fg transition-colors hover:border-accent-2/60 hover:text-accent-2"
                >
                  Live demo
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              )}
              {!project.githubUrl && !project.homepageUrl && (
                <p className="text-sm text-subtle">Source code for this project is not publicly available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
