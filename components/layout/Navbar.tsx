"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { navItems, siteConfig, type SectionId } from "@/config/site";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function Navbar({ cvSlot }: { cvSlot: ReactNode }) {
  const [active, setActive] = useState<SectionId>("home");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const linkRefs = useRef<Partial<Record<SectionId, HTMLAnchorElement | null>>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  /* Active section tracking */
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* Hide on scroll down, reveal on scroll up */
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        setHidden(y > 240 && y > last + 4);
        if (y < last - 4) setHidden(false);
        last = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Sliding active indicator */
  const measure = useCallback(() => {
    const el = linkRefs.current[active];
    if (!el) return;
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
  }, [active]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  /* Mobile menu: lock scroll + Escape to close */
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[90] rounded-full bg-fg px-4 py-2 text-sm text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-out-expo",
          hidden && !open && "-translate-y-full",
        )}
      >
        <div
          className={cn(
            "border-b transition-[background-color,border-color,backdrop-filter] duration-500",
            scrolled || open
              ? "border-line bg-bg/75 backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          <nav
            aria-label="Primary"
            className="container-x flex h-[var(--nav-h)] items-center justify-between gap-6"
          >
            <a
              href="#home"
              className="group flex items-center gap-3"
              aria-label={`${siteConfig.name} — back to top`}
              onClick={() => setOpen(false)}
            >
              <span className="grid size-9 place-items-center rounded-full border border-line-strong font-display text-[13px] font-semibold tracking-tight transition-colors duration-300 group-hover:border-accent group-hover:bg-accent">
                {siteConfig.initials}
              </span>
              <span className="hidden font-display text-[15px] font-medium tracking-tight sm:block">
                Kavindu<span className="text-muted">.dev</span>
              </span>
            </a>

            <ul className="relative hidden items-center lg:flex">
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-1 rounded-full bg-white/[0.07] transition-all duration-500 ease-out-expo",
                  indicator.ready ? "opacity-100" : "opacity-0",
                )}
                style={{ left: indicator.left, width: indicator.width }}
              />
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    ref={(el) => {
                      linkRefs.current[item.id] = el;
                    }}
                    href={`#${item.id}`}
                    aria-current={active === item.id ? "true" : undefined}
                    className={cn(
                      "relative block rounded-full px-4 py-2 text-[13px] transition-colors duration-300",
                      active === item.id ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <div className="hidden sm:block">{cvSlot}</div>
              <button
                ref={menuButtonRef}
                type="button"
                className="relative grid size-11 place-items-center rounded-full border border-line-strong lg:hidden"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
              >
                <span
                  className={cn(
                    "absolute h-px w-4 bg-fg transition-transform duration-500 ease-out-expo",
                    open ? "rotate-45" : "-translate-y-[3px]",
                  )}
                />
                <span
                  className={cn(
                    "absolute h-px w-4 bg-fg transition-transform duration-500 ease-out-expo",
                    open ? "-rotate-45" : "translate-y-[3px]",
                  )}
                />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 flex flex-col bg-bg pt-[var(--nav-h)] transition-[clip-path,visibility] duration-700 ease-out-expo lg:hidden",
          open
            ? "visible [clip-path:inset(0_0_0_0)]"
            : "invisible [clip-path:inset(0_0_100%_0)]",
        )}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <nav aria-label="Mobile" className="container-x relative flex flex-1 flex-col justify-between py-8">
          <ul className="space-y-1">
            {navItems.map((item, i) => (
              <li key={item.id} className="overflow-hidden">
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-baseline gap-4 py-1.5 font-display text-[clamp(2.2rem,10vw,3.5rem)] font-medium leading-none tracking-tight transition-[transform,color] duration-700 ease-out-expo",
                    open ? "translate-y-0" : "translate-y-full",
                    active === item.id ? "text-fg" : "text-muted",
                  )}
                  style={{ transitionDelay: open ? `${120 + i * 45}ms` : "0ms" }}
                >
                  <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div
            className={cn(
              "flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 transition-opacity duration-500",
              open ? "opacity-100 delay-500" : "opacity-0",
            )}
          >
            {cvSlot}
            <div className="flex gap-2">
              <a
                href={siteConfig.social.github.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="grid size-11 place-items-center rounded-full border border-line-strong text-muted hover:text-fg"
              >
                <GithubIcon className="size-4" />
              </a>
              <a
                href={siteConfig.social.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="grid size-11 place-items-center rounded-full border border-line-strong text-muted hover:text-fg"
              >
                <LinkedinIcon className="size-4" />
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
