"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/layout/section-heading";
import { ProfileDepth } from "@/components/webgl/profile-depth";
import { STATS, STACK_MARQUEE } from "@/lib/content";
import { GSAP_EASE, STAGGER } from "@/lib/motion";
import { useMediaQuery, REDUCED_MOTION_QUERY } from "@/lib/hooks";

const BIO_LINES = [
  "I build end-to-end platforms that assume hostile input.",
  "Full-stack developer with a security habit — CS at VIT (class",
  "of 2027), Hack Energy 2.0 finalist, and a blockchain dev who",
  "audited Ethereum contracts at IBM. I ship validated UIs, modular",
  "Python backends, data pipelines, and tooling that maps attack surface.",
];

// Status lines for the always-scrolling vertical rail beside the photo card.
const RAIL_LINES = [
  "STATUS: ONLINE",
  "LOC: VIT // 12.97°N",
  "ROLE: SEC ENGINEER",
  "STACK: PY / TS / SOL",
  "CLEARANCE: OWASP",
  "UPTIME: 24/7",
  "MODE: SHIP",
  "SIG: ENCRYPTED",
  "BUILD: 2027",
  "VOID: ACTIVE",
];

/**
 * 02 — Profile. A background-removed cutout of the user floats on the right
 * (no frame, no plate — just the person) and rotates in 3D as the section
 * scrolls past. Bio lines reveal on scroll, stats count up on enter, the
 * stack marquee loops, and a vertical status rail scrolls forever.
 */
export function About() {
  const root = useRef<HTMLElement>(null);
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);

  useEffect(() => {
    const rootEl = root.current;
    if (!rootEl || reduced) return; // bio is visible by default; reduced motion keeps it so
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // bio: masked line-by-line reveal as the column enters.
      // immediateRender:false → lines stay visible until the trigger
      // fires, so they can never get stuck hidden if it doesn't.
      const lines = rootEl.querySelectorAll("[data-bio]");
      gsap.from(lines, {
        yPercent: 110,
        duration: 1,
        ease: GSAP_EASE.out,
        stagger: STAGGER.lines,
        immediateRender: false,
        scrollTrigger: {
          trigger: rootEl.querySelector("[data-bio-group]"),
          start: "top 80%",
        },
      });

      // stats count-up, once on enter
      rootEl.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
        const target = Number(node.dataset.count);
        const suffix = node.dataset.suffix ?? "";
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

    }, rootEl);

    // the pinned Projects section changes page height — recompute positions
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={root}
      id="profile"
      aria-label="About"
      className="relative overflow-hidden px-6 py-32 lg:px-10"
    >
      <SectionHeading index="02" label="profile" title="Profile" />

      <div className="mt-16 grid items-center gap-16 lg:grid-cols-2">
        {/* Right side — vertical rail + the 3D cutout of the person */}
        <div className="order-first flex items-center justify-center gap-4 lg:order-last lg:justify-end">
          {/* Always-scrolling vertical rail — an infinite CSS loop, moving on
              its own regardless of page scroll. Hidden on small screens. */}
          <div
            aria-hidden
            className="marquee-y relative hidden h-[460px] w-12 shrink-0 rounded-md border border-ice/20 bg-ice/[0.04] sm:block"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <ul className="marquee-y-track flex flex-col items-center gap-8">
              {[...RAIL_LINES, ...RAIL_LINES].map((line, i) => (
                <li
                  key={`${line}-${i}`}
                  className="whitespace-nowrap font-mono text-sm font-semibold uppercase tracking-[0.25em] text-ice/80 [writing-mode:vertical-rl]"
                >
                  {line}
                  <span className="mx-3 text-ice/50">✦</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Depth portrait — the photo rendered as a displaced 3D mesh
              (real facial relief) that tilts with pointer + scroll. */}
          <div className="relative w-full max-w-[340px]">
            {/* soft glow behind the subject so it doesn't float flatly */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-6 bottom-6 top-10 -z-10 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(125,211,252,0.18),transparent_70%)] blur-2xl"
            />
            <ProfileDepth />
          </div>
        </div>

        {/* Left side — bio + stats */}
        <div className="flex flex-col gap-12">
          <div
            data-bio-group
            className="flex flex-col gap-1 text-xl leading-relaxed text-foreground/90 sm:text-2xl"
          >
            {BIO_LINES.map((line) => (
              // block + overflow-hidden so the mask actually clips (inline
              // spans don't); inner block is what slides up on reveal
              <span key={line} className="block overflow-hidden">
                <span data-bio className="block">
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
