"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { getGPUTier } from "detect-gpu";
import { useMediaQuery, REDUCED_MOTION_QUERY } from "@/lib/hooks";

const HeroParticlesScene = dynamic(() => import("./hero-particles"), {
  ssr: false,
});

/** Particle budget per GPU tier — 60fps over max fidelity. */
const COUNT_BY_TIER: Record<number, number> = {
  0: 0, // no WebGL / blocklisted → keep gradient fallback
  1: 18_000,
  2: 45_000,
  3: 80_000,
};

let cachedCount: number | null = null;

/**
 * Mount gate for the hero WebGL scene: GPU-tier adaptive count,
 * prefers-reduced-motion fallback (static gradient stays underneath),
 * and frameloop pause when the hero scrolls out of view.
 */
export function HeroCanvas() {
  const wrapper = useRef<HTMLDivElement>(null);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const [count, setCount] = useState<number | null>(cachedCount);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (cachedCount !== null || reducedMotion) return;
    let cancelled = false;
    getGPUTier()
      .then((tier) => {
        const mobilePenalty = tier.isMobile ? 0.4 : 1;
        const base = COUNT_BY_TIER[tier.tier] ?? 18_000;
        cachedCount = Math.floor(base * mobilePenalty);
        if (!cancelled) setCount(cachedCount);
      })
      .catch(() => {
        cachedCount = 0;
        if (!cancelled) setCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!wrapper.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(wrapper.current);
    return () => observer.disconnect();
  }, []);

  const show = !reducedMotion && count !== null && count > 0;

  return (
    <div ref={wrapper} aria-hidden className="absolute inset-0 -z-10">
      {show && <HeroParticlesScene count={count} paused={paused} />}
    </div>
  );
}
