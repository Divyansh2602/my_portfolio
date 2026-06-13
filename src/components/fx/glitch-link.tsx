"use client";

import { useRef } from "react";
import { useMediaQuery, REDUCED_MOTION_QUERY } from "@/lib/hooks";

const GLITCH = "!<>-_\\/[]{}=+*#";

/**
 * Link whose label briefly scrambles through glitch glyphs on hover, then
 * resolves back. Reduced motion → a plain link.
 */
export function GlitchLink({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);
  const raf = useRef(0);

  const scramble = () => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const dur = 360;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const resolved = Math.floor(p * label.length);
      el.textContent = label
        .split("")
        .map((ch, i) =>
          i < resolved || ch === " "
            ? ch
            : GLITCH[Math.floor(Math.random() * GLITCH.length)]
        )
        .join("");
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else el.textContent = label;
    };
    raf.current = requestAnimationFrame(tick);
  };

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={scramble}
      onFocus={scramble}
      className={className}
    >
      {label}
    </a>
  );
}
