"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { SCROLL } from "@/lib/motion";

/**
 * Subtle skew-on-velocity: the page shears slightly when scrolling fast
 * and settles back at rest. Fixed elements (nav, particle field, cursor)
 * must live OUTSIDE this wrapper — a transformed ancestor becomes their
 * containing block and breaks position:fixed.
 *
 * Under reduced motion there's no Lenis context, the callback never
 * fires, and the wrapper stays at skew 0.
 */
export function SkewWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef(0);

  useLenis((lenis) => {
    target.current = gsap.utils.clamp(
      -SCROLL.maxSkew,
      SCROLL.maxSkew,
      lenis.velocity * 0.04
    );
  });

  useEffect(() => {
    if (!ref.current) return;
    const set = gsap.quickSetter(ref.current, "skewY", "deg");
    let current = 0;
    const tick = () => {
      current += (target.current - current) * 0.1;
      if (Math.abs(current) < 0.002) current = 0;
      set(current);
      // decay so the shear releases even if Lenis stops emitting
      target.current *= 0.9;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <div ref={ref} className="flex flex-1 flex-col will-change-transform">
      {children}
    </div>
  );
}
