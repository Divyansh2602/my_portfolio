"use client";

import { useEffect, useState } from "react";

/**
 * Resolves true once the preloader has finished (it dispatches
 * `divi:preloaded` and sets a global flag). Components keyed off this
 * hold their intro animation until the ice-crack reveal completes. Under
 * reduced motion the preloader still fires the event after its quick fade.
 */
export function usePreloaded(): boolean {
  const [ready, setReady] = useState(
    () =>
      typeof window !== "undefined" &&
      !!(window as Window & { __diviPreloaded?: boolean }).__diviPreloaded
  );

  useEffect(() => {
    if (ready) return;
    const onReady = () => setReady(true);
    window.addEventListener("divi:preloaded", onReady, { once: true });
    // safety net in case the event is missed (e.g. fast remount)
    const t = window.setTimeout(() => setReady(true), 6500);
    return () => {
      window.removeEventListener("divi:preloaded", onReady);
      window.clearTimeout(t);
    };
  }, [ready]);

  return ready;
}
