"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/layout/section-heading";
import { STATS, STACK_MARQUEE } from "@/lib/content";
import { GSAP_EASE, STAGGER } from "@/lib/motion";
import { useMediaQuery, REDUCED_MOTION_QUERY } from "@/lib/hooks";

const BIO_LINES = [
  "I design systems that assume hostile input.",
  "Principal-level architecture, security engineering, and full-stack",
  "delivery — currently studying CS at VIT, permanently studying",
  "everything else. Encrypted AI chat, semantic hiring pipelines,",
  "drone routing math, and a home pentest lab that gets no mercy.",
];

/**
 * 02 — Profile. The hero particle crystal morphs into a bust behind this
 * column (see ParticleField). Bio lines reveal on scroll, stats count up
 * on enter, and the stack marquee loops (pausing on hover).
 */
export function About() {
  const root = useRef<HTMLElement>(null);
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);

  useEffect(() => {
    if (!root.current) return;
    if (reduced) return; // CSS already shows reveal-line at rest under reduced motion
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context((self) => {
      const el = self.selector!;

      // bio: masked line-by-line reveal as the column enters
      gsap.fromTo(
        el("[data-bio]"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          ease: GSAP_EASE.out,
          stagger: STAGGER.lines,
          scrollTrigger: {
            trigger: el("[data-bio-group]")[0],
            start: "top 80%",
          },
        }
      );

      // stats count-up, once on enter
      el("[data-count]").forEach((node: Element) => {
        const target = Number((node as HTMLElement).dataset.count);
        const suffix = (node as HTMLElement).dataset.suffix ?? "";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: GSAP_EASE.out,
          scrollTrigger: { trigger: node, start: "top 90%", once: true },
          onUpdate: () => {
            node.textContent = `${Math.floor(obj.v)}${suffix}`;
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={root}
      id="profile"
      aria-label="About"
      className="relative px-6 py-32 lg:px-10"
    >
      <SectionHeading index="02" label="profile" title="Profile" />

      <div className="mt-16 grid gap-16 lg:grid-cols-2">
        {/* Right column kept empty on desktop — the morphed particle bust
            occupies this space (rendered by the global ParticleField). */}
        <div aria-hidden className="order-last hidden min-h-[420px] lg:block" />

        <div className="flex flex-col gap-12">
          <div
            data-bio-group
            className="flex flex-col gap-1 text-xl leading-relaxed text-foreground/90 sm:text-2xl"
          >
            {BIO_LINES.map((line) => (
              <span key={line} className="reveal-mask">
                <span data-bio className="reveal-line">
                  {line}
                </span>
              </span>
            ))}
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-2 bg-background p-6"
              >
                <dd
                  data-count={stat.value}
                  data-suffix={stat.suffix}
                  className="text-display text-4xl text-ice"
                >
                  {stat.value}
                  {stat.suffix}
                </dd>
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Stack marquee — duplicated track loops seamlessly, pauses on hover */}
      <div className="marquee mt-24 border-y py-5" aria-label="Stack">
        <ul className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
          {[...STACK_MARQUEE, ...STACK_MARQUEE].map((tech, i) => (
            <li
              key={`${tech}-${i}`}
              className="font-mono text-sm uppercase tracking-[0.15em] text-muted-foreground"
              aria-hidden={i >= STACK_MARQUEE.length}
            >
              {tech}
              <span aria-hidden className="ml-10 text-ice/40">
                ✦
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
