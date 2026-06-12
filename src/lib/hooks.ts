"use client";

import { useSyncExternalStore } from "react";

/** SSR-safe media query subscription (server snapshot = false). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
