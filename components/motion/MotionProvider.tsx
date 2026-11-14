"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { MOTION_DEFER_ATTR } from "@/components/motion/motion-bus";

declare global {
  interface Window {
    __motionReady?: boolean;
    __lenis?: Lenis | null;
  }
}

/**
 * Global, attribute-driven motion. Sections stay Server Components and only
 * opt in with data attributes:
 *
 *   data-reveal           fade + rise when scrolled into view (batched stagger)
 *   data-reveal="fade"    fade only
 *   data-reveal-lines     AnimatedText line-mask reveal
 *   data-parallax="0.12"  subtle scroll parallax (desktop only)
 *   data-timeline / data-timeline-line   scroll-linked timeline progress
 *
 * Animations bind only after hydration (see motion-bus.ts), so GSAP never
 * modifies markup React hasn't hydrated yet.
 *
 * Smooth scrolling (Lenis) is enabled only for fine pointers; touch devices
 * keep native scrolling. Everything is skipped for prefers-reduced-motion.
 */
export function MotionProvider() {
  useEffect(() => {
    window.__motionReady = true;
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      root.classList.remove("motion");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* ------------------------------ Lenis ------------------------------ */
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    if (window.matchMedia("(pointer: fine)").matches) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        anchors: true,
        autoRaf: false,
      });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      window.__lenis = lenis;
    }

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const ctx = gsap.context(() => {});
    // Track bound elements in memory — never write attributes React manages.
    const bound = new WeakSet<Element>();

    /**
     * Bind animations to elements under `scope` that aren't bound yet.
     * Called (via requestMotionBind) only after that part of the page has
     * hydrated. A document-wide bind skips regions marked data-motion-defer;
     * those hydrate separately and request their own bind.
     */
    const bind = (scope: ParentNode = document) => {
      const pick = (selector: string) =>
        Array.from(scope.querySelectorAll<HTMLElement>(selector)).filter((el) => {
          if (bound.has(el)) return false;
          if (scope === document && el.closest(`[${MOTION_DEFER_ATTR}]`)) return false;
          bound.add(el);
          return true;
        });

      ctx.add(() => {
        const reveals = pick("[data-reveal]");
        if (reveals.length) {
          ScrollTrigger.batch(reveals, {
            start: "top 90%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "expo.out",
                stagger: 0.08,
                overwrite: true,
              }),
          });
        }

        pick("[data-reveal-lines]").forEach((el) => {
          gsap.to(el.querySelectorAll(".line-inner"), {
            y: 0,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        if (isDesktop) {
          pick("[data-parallax]").forEach((el) => {
            const speed = Number(el.dataset.parallax) || 0.1;
            gsap.fromTo(
              el,
              { yPercent: speed * 50 },
              {
                yPercent: -speed * 50,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          });
        }

        pick("[data-timeline]").forEach((el) => {
          const line = el.querySelector<HTMLElement>("[data-timeline-line]");
          if (!line) return;
          gsap.fromTo(
            line,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top 70%",
                end: "bottom 60%",
                scrub: 0.6,
              },
            },
          );
        });
      });
      ScrollTrigger.refresh();
    };

    // Accept bind requests, including any queued before this provider mounted.
    window.__motionBind = bind;
    const queued = window.__motionQueue ?? [];
    window.__motionQueue = [];
    queued.forEach((scope) => bind(scope));

    // Fonts/images can change layout after first paint.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    document.fonts?.ready.then(onLoad).catch(() => {});

    return () => {
      window.__motionBind = undefined;
      window.removeEventListener("load", onLoad);
      ctx.revert();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      window.__lenis = null;
    };
  }, []);

  return null;
}
