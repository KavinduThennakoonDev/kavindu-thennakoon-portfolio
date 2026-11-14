import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/project";
import { GithubIcon } from "@/components/ui/icons";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { ProjectMeta, TechBadges } from "@/components/projects/ProjectMeta";
import { cn } from "@/lib/utils";

export function FeaturedProject({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}) {
  const reversed = index % 2 === 1;

  return (
    <article
      className="group grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
      aria-labelledby={`featured-${project.id}`}
      data-reveal
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        data-cursor="View"
        aria-label={`View details for ${project.title}`}
        className={cn(
          "relative block aspect-[16/11] overflow-hidden rounded-2xl border border-line-strong text-left transition-[border-color,box-shadow] duration-500 hover:border-fg/25 hover:shadow-[0_40px_100px_-40px_rgb(99_102_241/0.45)] sm:aspect-[16/10] lg:col-span-7",
          reversed && "lg:order-2",
        )}
      >
        <ProjectVisual project={project} priority={index === 0} />
      </button>

      <div className={cn("lg:col-span-5", reversed && "lg:order-1")}>
        <div className="flex items-center gap-4">
          <span className="font-display text-5xl font-semibold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgb(244_244_245/0.35)] sm:text-6xl">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-line" aria-hidden />
          <span className="eyebrow text-[10px]">{project.category}</span>
        </div>

        <h3
          id={`featured-${project.id}`}
          className="mt-6 font-display text-[clamp(1.8rem,3.2vw,2.75rem)] font-semibold leading-[1.02] tracking-tight text-fg"
        >
          {project.title}
        </h3>
        <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base">{project.description}</p>

        <TechBadges techs={project.technologies} max={7} className="mt-6" />
        <ProjectMeta project={project} className="mt-6" />

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-fg px-4 text-[13px] font-medium text-bg transition-[background-color,box-shadow] duration-300 hover:shadow-[0_0_0_5px_rgb(99_102_241/0.2)]"
          >
            Project details
          </button>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-[13px] text-fg transition-colors duration-300 hover:border-fg/40 hover:bg-white/[0.05]"
            >
              <GithubIcon className="size-3.5" aria-hidden />
              Source
            </a>
          )}
          {project.homepageUrl && (
            <a
              href={project.homepageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/live inline-flex h-10 items-center gap-1.5 rounded-full border border-line-strong px-4 text-[13px] text-fg transition-colors duration-300 hover:border-accent-2/60 hover:text-accent-2"
            >
              Live demo
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/live:-translate-y-0.5 group-hover/live:translate-x-0.5" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
