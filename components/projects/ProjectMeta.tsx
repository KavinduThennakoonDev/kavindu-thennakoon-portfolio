import { Star } from "lucide-react";
import type { Project } from "@/types/project";
import { formatMonthYear, languageColor } from "@/lib/github-utils";
import { cn } from "@/lib/utils";

export function LanguageDot({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-2 rounded-full" style={{ background: languageColor(name) }} aria-hidden />
      {name}
    </span>
  );
}

export function ProjectMeta({ project, className }: { project: Project; className?: string }) {
  const updated = formatMonthYear(project.updatedAt);
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-subtle", className)}>
      {project.primaryLanguage && <LanguageDot name={project.primaryLanguage} />}
      {project.stars > 0 && (
        <span className="inline-flex items-center gap-1" aria-label={`${project.stars} GitHub stars`}>
          <Star className="size-3" aria-hidden />
          {project.stars}
        </span>
      )}
      {updated && <span>Updated {updated}</span>}
    </div>
  );
}

export function TechBadges({
  techs,
  max,
  className,
}: {
  techs: string[];
  max?: number;
  className?: string;
}) {
  const shown = max ? techs.slice(0, max) : techs;
  const rest = techs.length - shown.length;
  if (!techs.length) return null;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Technologies">
      {shown.map((t) => (
        <li
          key={t}
          className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted transition-[color,border-color,background-color] duration-300 hover:border-accent-2/50 hover:bg-accent-2/5 hover:text-fg"
        >
          {t}
        </li>
      ))}
      {rest > 0 && (
        <li className="rounded-full px-2 py-1 font-mono text-[11px] text-subtle">+{rest}</li>
      )}
    </ul>
  );
}
