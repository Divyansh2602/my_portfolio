"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import type Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SCROLL } from "@/lib/motion";
import { useMediaQuery, REDUCED_MOTION_QUERY } from "@/lib/hooks";

/**
 * Lenis smooth-scroll backbone. Every scroll effect (ScrollTrigger in
 * Phase 3) syncs to this. Driven by gsap.ticker with lagSmoothing off so
 * scroll and animations share a single rAF clock — no added latency.
 * Disabled entirely for prefers-reduced-motion users (native scroll).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);

  useEffect(() => {
    if (reducedMotion) return;
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, [reducedMotion]);

  // ScrollTrigger reads window scroll (Lenis drives it natively), but it
  // must recompute on every Lenis frame, not just native scroll events.
  useEffect(() => {
    if (reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);
    let bound: Lenis | null = null;
    const tryBind = () => {
      const lenis = lenisRef.current?.lenis;
      if (lenis && !bound) {
        bound = lenis;
        lenis.on("scroll", ScrollTrigger.update);
      }
      return !!bound;
    };
    // the Lenis instance is created in ReactLenis's own effect — poll
    // briefly until the ref is populated
    let interval: number | undefined;
    if (!tryBind()) {
      interval = window.setInterval(() => {
        if (tryBind()) window.clearInterval(interval);
      }, 50);
    }
    return () => {
      window.clearInterval(interval);
      bound?.off("scroll", ScrollTrigger.update);
    };
  }, [reducedMotion]);

  if (reducedMotion) return <>{children}</>;

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: SCROLL.lerp,
        wheelMultiplier: SCROLL.wheelMultiplier,
        // Native momentum scroll on touch devices — smoothing it adds lag.
        syncTouch: false,
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
