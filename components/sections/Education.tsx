import { education } from "@/data/education";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeading index="05" label="Education" id="education-title" title={["Education."]} />

        <ol className="mt-16 border-t border-line lg:mt-20">
          {education.map((item, i) => (
            <li
              key={item.qualification}
              data-reveal
              className="group grid gap-3 border-b border-line py-8 transition-colors duration-500 hover:bg-white/[0.015] md:grid-cols-12 md:items-baseline md:gap-8 md:py-10"
            >
              <span className="font-mono text-xs text-subtle md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="md:col-span-7">
                <h3
                  className={
                    i === 0
                      ? "font-display text-2xl font-medium tracking-tight text-fg transition-transform duration-500 ease-out-expo group-hover:translate-x-1 sm:text-3xl"
                      : "font-display text-xl font-medium tracking-tight text-fg transition-transform duration-500 ease-out-expo group-hover:translate-x-1 sm:text-2xl"
                  }
                >
                  {item.qualification}
                </h3>
                <p className="mt-2 text-sm text-muted sm:text-base">{item.institution}</p>
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted md:col-span-4 md:text-right">
                {item.period}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
