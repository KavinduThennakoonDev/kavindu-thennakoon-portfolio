import type { CSSProperties } from "react";
import { skillGroups } from "@/data/skills";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skillIcons } from "@/components/ui/icons";

function Marquee() {
  const names = skillGroups.flatMap((g) => g.skills.map((s) => s.name));
  const row = [...new Set(names)];
  return (
    <div
      aria-hidden
      className="relative mt-16 overflow-hidden border-y border-line py-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] lg:mt-24"
    >
      <div className="marquee-track flex w-max gap-10">
        {[...row, ...row].map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="flex items-center gap-10 font-display text-[clamp(1.75rem,4vw,3.25rem)] font-medium tracking-tight text-transparent [-webkit-text-stroke:1px_rgb(244_244_245/0.28)]"
          >
            {name}
            <span className="size-2 rounded-full bg-accent/60" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="relative border-t border-line bg-bg-2/60 py-28 sm:py-36"
    >
      <div className="container-x">
        <SectionHeading
          index="04"
          label="Skills"
          id="skills-title"
          title={["Tools I", "Build With."]}
          description="The languages, frameworks and platforms I use to design, build and ship production software."
        />
      </div>

      <Marquee />

      <div className="container-x mt-16 lg:mt-20">
        <div className="divide-y divide-line border-y border-line">
          {skillGroups.map((group, gi) => (
            <div key={group.id} className="grid gap-6 py-10 md:grid-cols-12 md:gap-8" data-reveal>
              <div className="md:col-span-3">
                <p className="font-mono text-[11px] text-accent-2">{String(gi + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-display text-2xl font-medium tracking-tight">{group.title}</h3>
                <p className="mt-1 text-xs text-subtle">
                  {group.skills.length} {group.skills.length === 1 ? "technology" : "technologies"}
                </p>
              </div>
              <ul className="grid grid-cols-2 gap-3 xs:grid-cols-3 sm:grid-cols-4 md:col-span-9 lg:grid-cols-5">
                {group.skills.map((skill) => {
                  const Icon = skillIcons[skill.icon];
                  return (
                    <li
                      key={skill.name}
                      style={{ "--brand": skill.color } as CSSProperties}
                      className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-line bg-bg/50 px-4 py-3.5 transition-[border-color,transform,background-color] duration-500 ease-out-expo hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--brand)_45%,transparent)] hover:bg-bg"
                    >
                      <span
                        aria-hidden
                        className="absolute -left-6 top-1/2 size-16 -translate-y-1/2 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
                        style={{ background: "var(--brand)" }}
                      />
                      {Icon && (
                        <Icon
                          aria-hidden
                          className="relative size-5 shrink-0 text-muted transition-colors duration-500 group-hover:text-[var(--brand)]"
                        />
                      )}
                      <span className="relative text-sm text-fg/90">{skill.name}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
