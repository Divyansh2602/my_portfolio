"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/layout/section-heading";
import { EXPERIENCE } from "@/lib/content";
import { useMediaQuery, REDUCED_MOTION_QUERY } from "@/lib/hooks";

/**
 * 03 — Record. Professional experience as a timeline. The spine draws on
 * scroll and entries slide in; visible by default for reduced-motion /
 * no-JS readers.
 */
export function Experience() {
  const root = useRef<HTMLElement>(null);
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
              trigger: el.querySelector("[data-timeline]"),
              start: "top 78%",
              end: "bottom 78%",
              scrub: true,
            },
          }
        );
      }
      gsap.from(el.querySelectorAll("[data-entry]"), {
        opacity: 0,
        x: -16,
        stagger: 0.16,
        duration: 0.6,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: { trigger: el.querySelector("[data-timeline]"), start: "top 76%" },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={root}
      id="record"
      aria-label="Experience"
      className="px-6 py-32 lg:px-10"
    >
      <SectionHeading index="03" label="record" title="Experience" />

      <div data-timeline className="relative mt-16 max-w-3xl">
        <span
          data-spine
          aria-hidden
          className="absolute left-[6px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-ice/50 to-signal"
        />
        <ol className="flex flex-col gap-12">
          {EXPERIENCE.map((job) => (
            <li key={`${job.org}-${job.role}`} data-entry className="relative pl-8">
              <span
                aria-hidden
                className="absolute left-0 top-1.5 size-3.5 rounded-full border border-signal bg-signal"
              />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-display text-2xl sm:text-3xl">
                  {job.role}{" "}
                  <span className="text-ice">· {job.org}</span>
                </h3>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {job.period}
                </p>
              </div>
              <ul className="mt-4 flex flex-col gap-3">
                {job.points.map((point) => (
                  <li
                    key={point}
                    className="relative pl-5 text-sm leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-2.5 before:size-1 before:rounded-full before:bg-ice/60"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
