"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery, REDUCED_MOTION_QUERY } from "@/lib/hooks";

/**
 * Architecture flow for a case study. The connecting spine "draws" in as
 * you scroll (scaleY scrub) and each node slides up in sequence. Default
 * markup is fully visible, so reduced-motion / no-JS readers still see the
 * whole diagram.
 */
export function ArchitectureDiagram({ nodes }: { nodes: string[] }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);

  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const line = el.querySelector<HTMLElement>("[data-spine]");
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 75%",
              end: "bottom 75%",
              scrub: true,
            },
          }
        );
      }
      gsap.from(el.querySelectorAll("[data-node]"), {
        opacity: 0,
        y: 18,
        stagger: 0.12,
        duration: 0.6,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 72%" },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={root} className="relative">
      <span
        data-spine
        aria-hidden
        className="absolute left-[9px] top-3 h-[calc(100%-1.5rem)] w-px origin-top bg-gradient-to-b from-ice to-signal"
      />
      <ol className="flex flex-col gap-5">
        {nodes.map((node, i) => (
          <li
            key={node}
            data-node
            className="relative flex items-center gap-5 pl-8"
          >
            <span
              aria-hidden
              className="absolute left-0 top-1/2 size-[18px] -translate-y-1/2 rounded-full border border-signal bg-background"
            />
            <span
              aria-hidden
              className="absolute left-[5px] top-1/2 size-2 -translate-y-1/2 rounded-full bg-signal"
            />
            <div className="flex-1 rounded-lg border bg-card/40 px-5 py-4">
              <span className="mr-3 font-mono text-xs text-ice/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm text-foreground/90">{node}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
