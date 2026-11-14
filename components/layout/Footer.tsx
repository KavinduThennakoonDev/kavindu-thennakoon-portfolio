import { cacheLife } from "next/cache";
import { ArrowUp } from "lucide-react";
import { navItems, siteConfig } from "@/config/site";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="display text-3xl">{siteConfig.name}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              {siteConfig.roles.join(" · ")} based in {siteConfig.location}.
            </p>
          </div>
          <nav aria-label="Footer" className="md:col-span-4">
            <p className="eyebrow mb-4">Navigate</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-muted transition-colors hover:text-fg">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="eyebrow mb-4">Elsewhere</p>
            <div className="flex gap-2">
              <a
                href={siteConfig.social.github.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="grid size-11 place-items-center rounded-full border border-line-strong text-muted transition-colors hover:border-fg/40 hover:text-fg"
              >
                <GithubIcon className="size-4" />
              </a>
              <a
                href={siteConfig.social.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="grid size-11 place-items-center rounded-full border border-line-strong text-muted transition-colors hover:border-fg/40 hover:text-fg"
              >
                <LinkedinIcon className="size-4" />
              </a>
              <a
                href="#home"
                aria-label="Back to top"
                className="grid size-11 place-items-center rounded-full border border-line-strong text-muted transition-colors hover:border-fg/40 hover:text-fg"
              >
                <ArrowUp className="size-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {siteConfig.name}. All rights reserved.
          </p>
          <p>Designed &amp; built with Next.js, TypeScript and GSAP.</p>
        </div>
      </div>
    </footer>
  );
}
