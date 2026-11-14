import Image from "next/image";
import type { Project } from "@/types/project";
import { languageColor } from "@/lib/github-utils";
import { cn } from "@/lib/utils";

function hash(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function hostOf(project: Project) {
  const url = project.homepageUrl ?? project.githubUrl;
  if (!url) return `${project.owner}/${project.repo}`;
  try {
    const u = new URL(url);
    return u.host === "github.com" ? `github.com${u.pathname}` : u.host;
  } catch {
    return url;
  }
}

/**
 * Real screenshot when configured; otherwise an abstract, deterministic
 * composition built only from the project's real metadata (title, host,
 * technologies, language share). No stock imagery.
 */
export function ProjectVisual({
  project,
  variant = "large",
  className,
  priority,
}: {
  project: Project;
  variant?: "large" | "compact";
  className?: string;
  priority?: boolean;
}) {
  const tint = languageColor(project.primaryLanguage ?? project.languages[0]?.name);
  const seed = hash(project.repo);
  const layout = seed % 3;
  const large = variant === "large";
  const techs = project.technologies.slice(0, large ? 6 : 3);

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-bg-2", className)}>
      {project.previewImage ? (
        <Image
          src={project.previewImage}
          alt={`Screenshot of ${project.title}`}
          fill
          priority={priority}
          sizes={large ? "(min-width: 1024px) 58vw, 92vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"}
          className="object-cover object-top transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]"
        >
          {/* Ambient tint from the primary language */}
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background: `radial-gradient(120% 90% at ${layout === 1 ? "85% 0%" : "10% 0%"}, ${tint}33, transparent 55%), radial-gradient(90% 80% at ${layout === 2 ? "0% 100%" : "100% 100%"}, rgb(99 102 241 / 0.22), transparent 60%)`,
            }}
          />
          <div className="bg-grid absolute inset-0 opacity-50 [background-size:40px_40px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

          {/* Window mock */}
          <div
            className={cn(
              "absolute overflow-hidden rounded-xl border border-white/10 bg-bg/70 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)] backdrop-blur-sm",
              large ? "inset-x-[8%] top-[14%] bottom-[-6%]" : "inset-x-[7%] top-[16%] bottom-[-10%]",
            )}
          >
            <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
              <span className="size-2 rounded-full bg-white/20" />
              <span className="size-2 rounded-full bg-white/20" />
              <span className="size-2 rounded-full bg-white/20" />
              <span className="ml-2 truncate rounded-md bg-white/5 px-2 py-0.5 font-mono text-[10px] text-subtle">
                {hostOf(project)}
              </span>
            </div>
            <div className={cn("relative", large ? "p-5 sm:p-7" : "p-4")}>
              <p
                className={cn(
                  "font-display font-semibold leading-[0.95] tracking-tight text-fg/90",
                  large ? "text-[clamp(1.4rem,3vw,2.6rem)]" : "text-lg",
                )}
              >
                {project.title}
              </p>
              <div className={cn("mt-4 space-y-2", !large && "mt-3")}>
                <span className="block h-1.5 w-3/4 rounded-full bg-white/10" />
                <span className="block h-1.5 w-1/2 rounded-full bg-white/[0.07]" />
              </div>
              {large && (
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-14 rounded-lg border border-white/5 bg-white/[0.03]"
                      style={i === layout ? { background: `${tint}22`, borderColor: `${tint}44` } : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Real technology labels */}
          <div className={cn("absolute flex flex-wrap gap-1.5", large ? "left-[6%] top-[5%] right-[6%]" : "left-[6%] top-[5%] right-[6%]")}>
            {techs.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-bg/60 px-2 py-0.5 font-mono text-[10px] text-fg/80 backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Real language share */}
          {project.languages.length > 0 && (
            <div className="absolute inset-x-0 bottom-0 flex h-1">
              {project.languages.map((l) => (
                <span key={l.name} style={{ width: `${l.percent}%`, background: l.color }} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
