import type { ElementType } from "react";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  lines: string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  /** Applies the brand gradient to the last line. */
  highlightLast?: boolean;
  id?: string;
}

/**
 * Heading split into explicit lines. Each line is clipped by a mask and slides
 * up when scrolled into view (driven by MotionProvider). Explicit lines avoid
 * runtime text splitting and the layout shift it causes.
 */
export function AnimatedText({
  lines,
  as: Tag = "h2",
  className,
  lineClassName,
  highlightLast,
  id,
}: AnimatedTextProps) {
  return (
    <Tag id={id} className={className} data-reveal-lines>
      {lines.map((line, i) => (
        <span key={i} className={cn("line-mask", lineClassName)}>
          <span className={cn("line-inner", highlightLast && i === lines.length - 1 && "text-gradient w-fit")}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
