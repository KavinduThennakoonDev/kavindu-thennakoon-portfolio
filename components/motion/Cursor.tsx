"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Decorative follower ring for desktop (fine pointer, motion allowed).
 * The native cursor is kept for accessibility; the ring only adds feedback:
 * it grows over interactive elements and shows a label for [data-cursor].
 */
export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(
      "(pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)",
    );
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!mq.matches || !ring || !label) return;

    const xTo = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });
    let visible = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      xTo(e.clientX);
      yTo(e.clientY);
      if (!visible) {
        visible = true;
        gsap.set(ring, { x: e.clientX, y: e.clientY });
        ring.dataset.visible = "true";
      }
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      const interactive = target?.closest("a, button, input, textarea, select, [role='button']");
      if (labelled) {
        ring.dataset.state = "label";
        label.textContent = labelled.dataset.cursor ?? "";
      } else if (interactive) {
        ring.dataset.state = target?.closest("input, textarea") ? "text" : "hover";
      } else {
        ring.dataset.state = "idle";
      }
    };

    const onLeave = () => {
      visible = false;
      ring.dataset.visible = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden
      data-state="idle"
      data-visible="false"
      className="group/cursor pointer-events-none fixed left-0 top-0 z-[100] hidden opacity-0 transition-opacity duration-300 data-[visible=true]:opacity-100 [@media(pointer:fine)]:block"
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <div className="flex size-9 items-center justify-center rounded-full border border-white/35 transition-all duration-500 ease-out-expo group-data-[state=hover]/cursor:size-14 group-data-[state=hover]/cursor:border-accent-2/60 group-data-[state=hover]/cursor:bg-accent-2/10 group-data-[state=label]/cursor:size-20 group-data-[state=label]/cursor:border-transparent group-data-[state=label]/cursor:bg-fg group-data-[state=text]/cursor:size-2 group-data-[state=text]/cursor:opacity-0">
          <span
            ref={labelRef}
            className="text-[11px] font-medium uppercase tracking-[0.14em] text-bg opacity-0 transition-opacity duration-300 group-data-[state=label]/cursor:opacity-100"
          />
        </div>
      </div>
    </div>
  );
}
