"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import gsap from "gsap";
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
