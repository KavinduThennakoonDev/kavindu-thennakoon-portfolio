import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowDown, ArrowRight, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ButtonLink, CvButton } from "@/components/ui/Button";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

const floatingLabels = [
  { label: "Next.js", className: "-left-6 top-[12%] xl:-left-12", d: 0 },
  { label: "TypeScript", className: "-right-4 top-[30%] xl:-right-10", d: 150 },
  { label: "Node.js", className: "-left-10 top-[56%] xl:-left-16", d: 300 },
  { label: "MySQL", className: "-right-6 bottom-[16%] xl:-right-12", d: 450 },
];

function PortraitFallback() {
  // Typographic monogram until a real portrait is provided — never a fake photo.
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-bg-2">
      <div className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
      <div className="absolute -left-1/4 top-1/4 size-[70%] rounded-full bg-accent/25 blur-[90px]" />
      <div className="absolute -right-1/4 bottom-0 size-[60%] rounded-full bg-accent-2/15 blur-[90px]" />
      <span
        aria-hidden
        className="relative font-display text-[clamp(8rem,22vw,15rem)] font-semibold leading-none tracking-[-0.02em] text-transparent [-webkit-text-stroke:1.5px_rgb(244_244_245/0.55)]"
      >
        {siteConfig.initials}
      </span>
    </div>
  );
}

function Corners() {
  return (
    <>
      {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "left-3 bottom-3 border-l border-b", "right-3 bottom-3 border-r border-b"].map((c) => (
        <span key={c} aria-hidden className={`absolute size-4 border-fg/50 ${c}`} />
      ))}
    </>
  );
}

export function Hero() {
  const portrait = siteConfig.images.hero;

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="noise relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[var(--nav-h)]"
    >
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-40 left-[-10%] h-[520px] w-[620px] rounded-full bg-accent/20 blur-[140px]" />
        <div className="absolute right-[-10%] top-[30%] h-[460px] w-[520px] rounded-full bg-accent-2/10 blur-[140px]" />
      </div>

      <div className="container-x flex flex-1 flex-col justify-center gap-12 py-10 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-16">
        {/* Copy */}
        <div className="lg:col-span-8">
          <p className="hero-fade eyebrow flex items-center gap-3" style={{ "--d": 0 } as CSSProperties}>
            <span className="h-px w-10 bg-accent-2" aria-hidden />
            Hello, I&apos;m
          </p>

          <h1
            id="hero-title"
            className="display mt-6 text-[clamp(2.75rem,12.6vw,8.25rem)] uppercase lg:text-[clamp(4rem,8.6vw,8.25rem)]"
          >
            <span className="line-mask">
              <span className="hero-line block" style={{ "--d": 80 } as CSSProperties}>
                Kavindu
              </span>
            </span>
            <span className="line-mask">
              <span className="hero-line block w-fit text-gradient" style={{ "--d": 200 } as CSSProperties}>
                Thennakoon.
              </span>
            </span>
          </h1>

          <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-10">
            <ul
              className="hero-fade space-y-2 border-l border-line-strong pl-4"
              style={{ "--d": 450 } as CSSProperties}
              aria-label="Professional titles"
            >
              {siteConfig.roles.map((role, i) => (
                <li key={role} className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] text-accent-2">0{i + 1}</span>
                  <span className="text-[15px] font-medium text-fg">{role}</span>
                </li>
              ))}
              <li className="flex items-center gap-2 pt-2 text-sm text-muted">
                <MapPin className="size-3.5 text-accent-2" aria-hidden />
                Based in {siteConfig.location}
              </li>
            </ul>

            <div className="hero-fade" style={{ "--d": 550 } as CSSProperties}>
              <p className="font-display text-[clamp(1.35rem,2.2vw,1.85rem)] font-medium leading-[1.15] tracking-tight">
                Building Digital Experiences.
                <br />
                <span className="text-muted">Engineering Real-World Solutions.</span>
              </p>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
                I develop scalable web applications, enterprise software solutions, and meaningful
                digital products using modern technologies.
              </p>
            </div>
          </div>

          <div
            className="hero-fade mt-10 flex flex-wrap items-center gap-3"
            style={{ "--d": 700 } as CSSProperties}
          >
            <ButtonLink
              href="#projects"
              size="lg"
              icon={<ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden />}
            >
              Explore My Work
            </ButtonLink>
            <CvButton size="lg" />
            <ButtonLink href="#contact" variant="ghost" size="lg">
              Get In Touch
            </ButtonLink>
          </div>
        </div>

        {/* Portrait */}
        <div className="relative mx-auto w-full max-w-md lg:col-span-4 lg:max-w-none">
          <div className="hero-portrait relative aspect-[4/5] overflow-hidden rounded-[28px] border border-line-strong bg-bg-2">
            {portrait ? (
              <Image
                src={portrait}
                alt={`Portrait of ${siteConfig.name}, ${siteConfig.roles[0]}`}
                fill
                priority
                sizes="(min-width: 1024px) 32vw, (min-width: 640px) 28rem, 92vw"
                className="hero-portrait-img object-cover object-[50%_22%]"
              />
            ) : (
              <PortraitFallback />
            )}
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
            <Corners />
            <div className="absolute inset-x-5 bottom-5 flex items-center justify-between">
              <span className="flex items-center gap-2 rounded-full border border-line-strong bg-bg/60 px-3 py-1.5 text-xs text-fg backdrop-blur-md">
                <span className="relative flex size-2">
                  <span className="pulse-ring absolute inset-0 rounded-full bg-accent-2" />
                  <span className="relative size-2 rounded-full bg-accent-2" />
                </span>
                {siteConfig.location}
              </span>
              <span className="font-mono text-[11px] text-fg/80">{siteConfig.experienceYears} yrs exp.</span>
            </div>
          </div>

          {floatingLabels.map((item) => (
            <span
              key={item.label}
              aria-hidden
              className={`float-label absolute hidden rounded-full border border-line-strong bg-bg-2/80 px-3.5 py-1.5 font-mono text-[11px] text-fg shadow-[0_10px_30px_-10px_rgb(0_0_0/0.6)] backdrop-blur-md sm:block ${item.className}`}
              style={{ "--d": item.d } as CSSProperties}
            >
              <span className="mr-1.5 text-accent-2">●</span>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container-x hero-fade pb-8" style={{ "--d": 900 } as CSSProperties}>
        <div className="flex items-center justify-between border-t border-line pt-6">
          <div className="flex items-center gap-2">
            <a
              href={siteConfig.social.github.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="grid size-11 place-items-center rounded-full border border-line-strong text-muted transition-colors duration-300 hover:border-fg/40 hover:text-fg"
            >
              <GithubIcon className="size-4" />
            </a>
            <a
              href={siteConfig.social.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="grid size-11 place-items-center rounded-full border border-line-strong text-muted transition-colors duration-300 hover:border-fg/40 hover:text-fg"
            >
              <LinkedinIcon className="size-4" />
            </a>
            <span className="ml-3 hidden text-xs text-subtle md:block">
              @{siteConfig.social.github.username}
            </span>
          </div>
          <a href="#about" className="group flex items-center gap-3 text-xs text-muted hover:text-fg">
            <span className="eyebrow hidden sm:inline">Scroll to explore</span>
            <span className="relative flex h-10 w-6 justify-center rounded-full border border-line-strong pt-2">
              <span className="scroll-dot block size-1 rounded-full bg-fg" />
            </span>
            <ArrowDown className="size-3.5 sm:hidden" aria-hidden />
            <span className="sr-only">Scroll to the About section</span>
          </a>
        </div>
      </div>
    </section>
  );
}
