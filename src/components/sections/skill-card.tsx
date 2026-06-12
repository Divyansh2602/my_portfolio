"use client";

import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { TerminalTyper } from "@/components/fx/terminal-typer";

interface SkillCardData {
  id: string;
  title: string;
  blurb: string;
  items: readonly string[];
  featured?: boolean;
  terminal?: boolean;
}

const MAX_TILT = 6; // degrees

/**
 * Bento card with cursor spotlight (CSS, via --mx/--my), a subtle 3D tilt
 * toward the pointer, the rotating border-beam on the featured card, and
 * the live terminal on the security card. Tilt writes transforms directly
 * (no React state) so cursor tracking stays on the compositor.
 */
export function SkillCard({
  card,
  className = "",
}: {
  card: SkillCardData;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.transform = `perspective(900px) rotateY(${
      (px - 0.5) * 2 * MAX_TILT
    }deg) rotateX(${(0.5 - py) * 2 * MAX_TILT}deg)`;
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`spotlight group relative flex flex-col gap-6 bg-background p-8 transition-transform duration-300 ease-out [transform-style:preserve-3d] ${
        card.featured ? "border-beam" : ""
      } ${className}`}
    >
      <div className="flex items-baseline justify-between">
        <h3 className="text-display text-2xl sm:text-3xl">{card.title}</h3>
        {card.featured && <span className="label-mono text-ice">core</span>}
      </div>

      <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
        {card.blurb}
      </p>

      {card.terminal && <TerminalTyper />}

      <ul className="mt-auto flex flex-wrap gap-2">
        {card.items.map((item) => (
          <li key={item}>
            <Badge
              variant="outline"
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
            >
              {item}
            </Badge>
          </li>
        ))}
      </ul>
    </article>
  );
}
