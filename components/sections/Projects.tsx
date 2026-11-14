import { Suspense } from "react";
import { getProjects } from "@/lib/github";
import { siteConfig } from "@/config/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { ProjectsSkeleton } from "@/components/projects/ProjectsSkeleton";
import { GithubIcon } from "@/components/ui/icons";

async function ProjectsContent() {
  const payload = await getProjects();
  return <ProjectsExplorer payload={payload} />;
}

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeading
          index="03"
          label="Work"
          id="projects-title"
          title={["Selected", "Projects."]}
          description="Featured work and every public repository — synced automatically from GitHub every hour."
          aside={
            <a
              href={siteConfig.social.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm text-fg underline-offset-4 hover:underline"
            >
              <GithubIcon className="size-4" aria-hidden />
              github.com/{siteConfig.social.github.username}
            </a>
          }
        />
        <div className="mt-16 lg:mt-24">
          <Suspense fallback={<ProjectsSkeleton />}>
            <ProjectsContent />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
