import { experiences } from "@/data/experience";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Experience() {
  const primary = experiences.filter((e) => !e.secondary);
  const secondary = experiences.filter((e) => e.secondary);

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="relative border-t border-line bg-bg-2/60 py-28 sm:py-36"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 top-40 h-[480px] w-[480px] rounded-full bg-accent/10 blur-[140px]" />
      </div>

      <div className="container-x relative">
        <SectionHeading
          index="02"
          label="Experience"
          id="experience-title"
          title={["Where I've", "Built Things."]}
          description="Enterprise microfinance platforms, finance ERP systems and civic technology — built alongside business analysts, QA engineers and developers."
        />

        <ol className="relative mt-16 lg:mt-24" data-timeline>
          {/* Timeline rail + scroll-linked progress */}
          <span aria-hidden className="absolute bottom-0 left-[7px] top-2 w-px bg-line-strong md:left-[calc(33.333%-1px)]" />
          <span
            aria-hidden
            data-timeline-line
            className="absolute bottom-0 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-accent-2 via-accent to-accent/0 md:left-[calc(33.333%-1px)]"
          />

          {primary.map((job) => (
            <li key={job.company} className="relative grid gap-6 pb-20 pl-10 last:pb-12 md:grid-cols-3 md:gap-0 md:pl-0">
              {/* Node */}
              <span
                aria-hidden
                className="absolute left-0 top-2 grid size-[15px] place-items-center rounded-full border border-line-strong bg-bg md:left-[calc(33.333%-8px)]"
              >
                <span className={job.current ? "size-[7px] rounded-full bg-accent-2" : "size-[7px] rounded-full bg-subtle"} />
              </span>

              <div className="md:pr-14" data-reveal>
                <div className="md:sticky md:top-28">
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">{job.period}</p>
                  <p className="mt-3 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                    {job.company}
                  </p>
                  {job.current && (
                    <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent-2/30 bg-accent-2/10 px-3 py-1 text-xs text-accent-2">
                      <span className="size-1.5 rounded-full bg-accent-2" />
                      Current role
                    </span>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 md:pl-14">
                <h3 className="font-display text-2xl font-medium tracking-tight text-fg sm:text-[1.75rem]" data-reveal>
                  {job.role}
                </h3>
                {job.stack && (
                  <ul className="mt-5 flex flex-wrap gap-2" data-reveal aria-label={`Technologies used at ${job.company}`}>
                    {job.stack.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted transition-colors duration-300 hover:border-accent-2/50 hover:text-fg"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                <ul className="mt-8 grid gap-x-10 gap-y-4 lg:grid-cols-2">
                  {job.responsibilities.map((item) => (
                    <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-muted" data-reveal>
                      <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-accent-2/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        {secondary.length > 0 && (
          <div className="mt-6 border-t border-line pt-10 md:ml-[33.333%] md:pl-14" data-reveal>
            <p className="eyebrow mb-6">Also</p>
            {secondary.map((job) => (
              <div key={job.company} className="grid gap-4 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-10">
                <div>
                  <h3 className="text-base font-medium text-fg">{job.role}</h3>
                  <p className="mt-1 text-sm text-muted">{job.company}</p>
                  {job.period && <p className="mt-1 font-mono text-xs text-subtle">{job.period}</p>}
                </div>
                <ul className="space-y-2">
                  {job.responsibilities.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-subtle">
                      <span aria-hidden className="mt-[0.7em] h-px w-2.5 shrink-0 bg-line-strong" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
