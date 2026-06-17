"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getGPUTier } from "detect-gpu";
import { useMediaQuery, REDUCED_MOTION_QUERY } from "@/lib/hooks";
import { getThemeSnapshot, subscribeTheme } from "@/lib/theme";

const ContactBeaconScene = dynamic(() => import("./contact-beacon-scene"), {
  ssr: false,
});

const COUNT_BY_TIER: Record<number, number> = {
  0: 0,
  1: 4_000,
  2: 9_000,
  3: 14_000,
};

/**
 * Gate for the Signal beacon: GPU-tier adaptive count, reduced-motion /
 * no-WebGL fallback (the gradient behind it stays), and a frameloop pause
 * when the section is off-screen.
 */
export function ContactBeacon() {
  const wrapper = useRef<HTMLDivElement>(null);
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => "dark" as const);
  const [count, setCount] = useState<number | null>(null);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    getGPUTier()
      .then((tier) => {
        const base = COUNT_BY_TIER[tier.tier] ?? 4_000;
        const n = Math.floor(base * (tier.isMobile ? 0.5 : 1));
        if (!cancelled) setCount(n);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [reduced]);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapper}
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-8 -z-10 size-[42rem] max-w-[90vw] -translate-x-1/2"
    >
      {!reduced && theme === "dark" && count !== null && count > 0 && (
        <ContactBeaconScene count={count} paused={paused} />
      )}
    </div>
  );
}
