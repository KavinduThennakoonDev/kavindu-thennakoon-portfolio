import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full font-medium transition-[color,background-color,border-color,transform,box-shadow] duration-300 ease-out-expo active:scale-[0.97] select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-fg text-bg hover:bg-white hover:shadow-[0_0_0_6px_rgb(99_102_241/0.18)]",
  secondary:
    "border border-line-strong bg-white/[0.02] text-fg hover:border-fg/40 hover:bg-white/[0.06]",
  ghost: "text-muted hover:text-fg",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px] sm:h-13 sm:px-7",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonLinkProps extends ComponentPropsWithoutRef<"a"> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  external?: boolean;
}

/** Anchor styled as a button. Text slides up on hover for a tactile feel. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  icon,
  external,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={buttonClass(variant, size, className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-out-expo group-hover/btn:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover/btn:translate-y-0"
        >
          {children}
        </span>
      </span>
      {icon ?? (external ? <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" aria-hidden /> : null)}
    </a>
  );
}

/**
 * Download CV button. Serves the original PDF from /public untouched.
 * Until the PDF is added (siteConfig.cv.available), it renders a disabled
 * state instead of a broken link.
 */
export function CvButton({
  variant = "secondary",
  size = "md",
  className,
  label = "Download CV",
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
  label?: string;
}) {
  if (!siteConfig.cv.available) {
    return (
      <span
        role="link"
        aria-disabled="true"
        title="CV will be available for download soon"
        className={cn(buttonClass(variant, size, className), "cursor-not-allowed opacity-50 active:scale-100")}
      >
        {label}
        <Download className="size-4" aria-hidden />
      </span>
    );
  }
  return (
    <ButtonLink
      variant={variant}
      size={size}
      className={className}
      href={siteConfig.cv.href}
      download={siteConfig.cv.fileName}
      icon={<Download className="size-4 transition-transform duration-300 group-hover/btn:translate-y-0.5" aria-hidden />}
    >
      {label}
    </ButtonLink>
  );
}
