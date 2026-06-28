"use client";

import { useEffect, useRef } from "react";

/**
 * Page-wide scroll crosshair. A horizontal and a vertical guide line track
 * overall scroll progress: as you move down the page the horizontal line
 * descends and the vertical line sweeps across, meeting at a glowing node
 * that reads out the percentage. Driven by requestAnimationFrame off the
 * window scroll (which Lenis updates), so it stays in sync with the smooth
 * scroll and never freezes. Fixed + pointer-events-none, so it overlays the
 * whole page without affecting interaction.
 */
export function ScrollGuides() {
  const h = useRef<HTMLDivElement>(null);
  const v = useRef<HTMLDivElement>(null);
  const node = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    let lastP = -1;

    const update = () => {
      const max =
        (document.documentElement.scrollHeight - window.innerHeight) || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / max));

      if (p !== lastP) {
        lastP = p;
        const x = p * window.innerWidth;
        const y = p * window.innerHeight;
        if (h.current) h.current.style.transform = `translate3d(0, ${y}px, 0)`;
        if (v.current) v.current.style.transform = `translate3d(${x}px, 0, 0)`;
        if (node.current)
          node.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        if (label.current)
          label.current.textContent =
            String(Math.round(p * 100)).padStart(2, "0") + "%";
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30">
      {/* horizontal guide — full width, rides down with scroll */}
      <div
        ref={h}
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ice/45 to-transparent"
      />
      {/* vertical guide — full height, sweeps across with scroll */}
      <div
        ref={v}
        className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-ice/45 to-transparent"
      />
      {/* crossing node + progress readout */}
      <div ref={node} className="absolute left-0 top-0">
        <span className="absolute -left-1 -top-1 block size-2 rounded-full bg-signal shadow-[0_0_12px_2px_rgba(34,211,238,0.6)]" />
        <span
          ref={label}
          className="absolute left-3 top-1.5 font-mono text-[10px] tracking-[0.2em] text-signal/80"
        >
          00%
        </span>
      </div>
    </div>
  );
}
