/**
 * Tiny coordination layer between MotionProvider (root layout) and the parts
 * of the page that hydrate later.
 *
 * Animations must only touch elements React has already hydrated — otherwise
 * React reports a hydration mismatch (GSAP adds inline styles). Components call
 * `requestMotionBind()` from an effect, which only runs after hydration. If the
 * provider isn't ready yet, the request is queued.
 */

type Bind = (root?: ParentNode) => void;

declare global {
  interface Window {
    __motionBind?: Bind;
    __motionQueue?: Array<ParentNode | undefined>;
  }
}

export function requestMotionBind(root?: ParentNode) {
  if (typeof window === "undefined") return;
  if (window.__motionBind) window.__motionBind(root);
  else (window.__motionQueue ??= []).push(root);
}

/** Attribute marking a region that hydrates separately (e.g. inside Suspense). */
export const MOTION_DEFER_ATTR = "data-motion-defer";
