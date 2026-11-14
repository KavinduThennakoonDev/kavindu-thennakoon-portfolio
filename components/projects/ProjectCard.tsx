import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/project";
import { GithubIcon } from "@/components/ui/icons";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { ProjectMeta, TechBadges } from "@/components/projects/ProjectMeta";

export function ProjectCard({
  project,
  order,
  onOpen,
}: {
  project: Project;
  order: number;
  onOpen: (project: Project) => void;
}) {
  return (
    <article
      className="card-enter group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-bg-2/60 transition-[border-color,transform,background-color] duration-500 ease-out-expo hover:-translate-y-1 hover:border-line-strong hover:bg-bg-2"
      style={{ "--i": order % 6 } as CSSProperties}
      data-cursor="View"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line">
        <ProjectVisual project={project} variant="compact" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="eyebrow truncate text-[10px]">{project.category}</span>
          {project.featured && (
            <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-[#c7c8fb]">
              Featured
            </span>
          )}
        </div>

        <h3 className="mt-3 font-display text-xl font-medium tracking-tight text-fg">
          {/* Full-card hit area opens the details dialog */}
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-2xl focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-accent-2"
          >
            {project.title}
          </button>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{project.description}</p>

        <TechBadges techs={project.technologies} max={4} className="mt-4" />

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <ProjectMeta project={project} />
          <div className="relative z-10 flex shrink-0 gap-1.5">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} source code on GitHub`}
                className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-fg/40 hover:text-fg"
              >
                <GithubIcon className="size-3.5" />
              </a>
            )}
            {project.homepageUrl && (
              <a
                href={project.homepageUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live demo`}
                className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-accent-2/60 hover:text-accent-2"
              >
                <ArrowUpRight className="size-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
