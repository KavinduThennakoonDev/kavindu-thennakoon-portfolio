"use client";

import { useEffect } from "react";
import { requestMotionBind } from "@/components/motion/motion-bus";

/**
 * Rendered at the end of the page. Its effect runs once the page segment has
 * hydrated, which is the earliest safe moment to start scroll animations.
 */
export function MotionReady() {
  useEffect(() => {
    requestMotionBind();
  }, []);
  return null;
}
