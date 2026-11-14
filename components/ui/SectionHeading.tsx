import type { ReactNode } from "react";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  index: string;
  label: string;
  title: string[];
  id: string;
  description?: ReactNode;
  aside?: ReactNode;
  className?: string;
}

export function SectionHeading({
  index,
  label,
  title,
  id,
  description,
  aside,
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn("grid gap-8 lg:grid-cols-12 lg:items-end", className)}>
      <div className="lg:col-span-8">
        <p className="eyebrow mb-6 flex items-center gap-3" data-reveal="fade">
          <span className="text-accent-2">({index})</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden />
          {label}
        </p>
        <AnimatedText
          id={id}
          lines={title}
          className="display text-[clamp(2.6rem,7vw,6.5rem)] text-fg"
        />
      </div>
      {(description || aside) && (
        <div className="lg:col-span-4 lg:pb-3" data-reveal>
          {description && (
            <p className="max-w-md text-base leading-relaxed text-muted">{description}</p>
          )}
          {aside}
        </div>
      )}
    </header>
  );
}
