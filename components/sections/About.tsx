import type { ReactNode } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { ButtonLink, CvButton } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

const highlights = [
  { title: "2+ Years of Experience", detail: "Professional full-stack engineering" },
  { title: "Enterprise Application Development", detail: "Enterprise-level microfinance web applications" },
  { title: "Full-Stack Engineering", detail: "Next.js, React, Node.js, TypeScript, MySQL" },
  { title: "Financial & ERP Systems", detail: "Leasing, bank reconciliation, finance ERP" },
  { title: "Workflow Automation", detail: "Custom workflow and task automation modules" },
  { title: "Cross-functional Collaboration", detail: "With BAs, QA engineers and developers" },
];

/** A code-styled profile card built only from real facts in siteConfig. */
function ProfileCode() {
  const k = "text-[#c4b5fd]"; // keyword
  const p = "text-[#7dd3fc]"; // property
  const s = "text-[#a7f3d0]"; // string
  const c = "text-subtle"; // comment

  const rows: ReactNode[] = [
    <span key="c" className={c}>{"// engineer.ts"}</span>,
    <span key="d"><span className={k}>const</span> engineer = {"{"}</span>,
    <span key="n">  <span className={p}>name</span>: <span className={s}>&quot;{siteConfig.name}&quot;</span>,</span>,
    <span key="r">  <span className={p}>role</span>: <span className={s}>&quot;{siteConfig.roles[0]}&quot;</span>,</span>,
    <span key="co">  <span className={p}>company</span>: <span className={s}>&quot;Evoke Labs&quot;</span>,</span>,
    <span key="l">  <span className={p}>location</span>: <span className={s}>&quot;{siteConfig.location}&quot;</span>,</span>,
    <span key="e">  <span className={p}>experience</span>: <span className={s}>&quot;{siteConfig.experienceYears} years&quot;</span>,</span>,
    <span key="f">  <span className={p}>focus</span>: [</span>,
    <span key="f1">    <span className={s}>&quot;Enterprise web apps&quot;</span>,</span>,
    <span key="f2">    <span className={s}>&quot;ERP &amp; financial systems&quot;</span>,</span>,
    <span key="f3">    <span className={s}>&quot;Workflow automation&quot;</span>,</span>,
    <span key="f4">  ],</span>,
    <span key="st">  <span className={p}>stack</span>: [<span className={s}>&quot;Next.js&quot;</span>, <span className={s}>&quot;React&quot;</span>, <span className={s}>&quot;Node.js&quot;</span>,</span>,
    <span key="st2">          <span className={s}>&quot;TypeScript&quot;</span>, <span className={s}>&quot;MySQL&quot;</span>],</span>,
    <span key="end">{"};"}</span>,
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line-strong bg-bg-2 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.8)]">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="ml-3 font-mono text-[11px] text-subtle">engineer.ts</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-[1.85] text-fg/90 sm:text-[13px]">
        <code>
          {rows.map((row, i) => (
            <span key={i} className="block">
              <span className="mr-5 inline-block w-4 select-none text-right text-subtle/60">{i + 1}</span>
              {row}
            </span>
          ))}
        </code>
      </pre>
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-accent/20 blur-[80px]" />
    </div>
  );
}

export function About() {
  const aboutImage = siteConfig.images.about;

  return (
    <section id="about" aria-labelledby="about-title" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeading index="01" label="About" id="about-title" title={["Beyond", "Writing Code."]} />

        <div className="mt-16 grid grid-cols-1 gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-5">
            <div className="space-y-6 lg:sticky lg:top-28">
              {aboutImage && (
                <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-line-strong" data-reveal>
                  <Image
                    src={aboutImage}
                    alt={`${siteConfig.name} at work`}
                    fill
                    sizes="(min-width: 1024px) 36vw, 92vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
                  />
                </div>
              )}
              <div data-reveal>
                <ProfileCode />
              </div>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-6 lg:col-start-7">
            <div className="space-y-6" data-reveal>
              <p className="font-display text-[clamp(1.4rem,2.4vw,2rem)] font-medium leading-snug tracking-tight text-fg">
                I&apos;m a software engineer passionate about building practical digital solutions that
                solve real-world problems.
              </p>
              <p className="text-base leading-relaxed text-muted sm:text-[17px]">
                My experience includes developing enterprise applications, financial systems, workflow
                automation solutions, and modern web applications.
              </p>
              <p className="text-base leading-relaxed text-muted sm:text-[17px]">
                I enjoy transforming complex requirements into reliable, scalable, and user-friendly
                software.
              </p>
            </div>

            <ol className="mt-14 grid border-t border-line sm:grid-cols-2">
              {highlights.map((h, i) => (
                <li
                  key={h.title}
                  data-reveal
                  className="group relative border-b border-line py-6 sm:odd:pr-8 sm:even:border-l sm:even:pl-8"
                >
                  <span className="font-mono text-[11px] text-accent-2">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 font-display text-lg font-medium tracking-tight text-fg transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
                    {h.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{h.detail}</p>
                </li>
              ))}
            </ol>

            <div className="mt-12 flex flex-wrap gap-3" data-reveal>
              <CvButton variant="primary" />
              <ButtonLink href="#experience" variant="secondary">
                View Experience
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
