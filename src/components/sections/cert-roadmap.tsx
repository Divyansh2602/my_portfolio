"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CERT_ROADMAP } from "@/lib/content";
import { useMediaQuery, REDUCED_MOTION_QUERY } from "@/lib/hooks";

/**
 * Certification roadmap timeline — the spine draws downward on scroll and
 * each milestone slides in. Visible by default for reduced-motion / no-JS.
 */
export function CertRoadmap() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);

  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const spine = el.querySelector<HTMLElement>("[data-spine]");
      if (spine) {
        gsap.fromTo(
          spine,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "bottom 80%",
              scrub: true,
            },
          }
        );
      }
      gsap.from(el.querySelectorAll("[data-step]"), {
        opacity: 0,
        x: -14,
        stagger: 0.14,
        duration: 0.6,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 78%" },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={root} className="relative">
      <span
        data-spine
        aria-hidden
        className="absolute left-[6px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-ice/50 to-signal"
      />
      <ol className="flex flex-col gap-6">
        {CERT_ROADMAP.map((step) => (
          <li key={step.label} data-step className="relative flex flex-col gap-1 pl-7">
            <span
              aria-hidden
              className={`absolute left-0 top-1 size-3.5 rounded-full border ${
                step.done
                  ? "border-signal bg-signal"
                  : "border-muted-foreground bg-background"
              }`}
            />
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {step.year}
            </p>
            <p
              className={`text-sm ${
                step.done ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {step.label}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
