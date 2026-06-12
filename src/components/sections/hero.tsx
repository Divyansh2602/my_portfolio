"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SITE } from "@/lib/content";
import { GSAP_EASE, STAGGER } from "@/lib/motion";
import { usePreloaded } from "@/lib/use-preloaded";
import { ScrambleText } from "@/components/fx/scramble-text";
import { useMediaQuery, REDUCED_MOTION_QUERY } from "@/lib/hooks";

const LINES = ["DIVYANSH", "GUPTA"];

/**
 * 01 — Surface. The particle crystal now lives in the global
 * <ParticleField/> behind all content. Here: the name reveals per
 * character (masked Y-translate) once the preloader lifts, and the role
 * line cycles identities with a decrypt/scramble animation.
 *
 * The title is visible by default in the markup — JS only hides it (while
 * the preloader overlay covers the screen) and then reveals it. So if the
 * preloader signal is ever missed, or JS doesn't run, the name still shows
 * rather than getting stuck off-screen in its mask.
 */
export function Hero() {
  const ready = usePreloaded();
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const chars = el.querySelectorAll("[data-char]");

    if (reduced) {
      gsap.set(chars, { yPercent: 0 });
      gsap.set(metaRef.current, { opacity: 1 });
      return;
    }

    if (!ready) {
      // hide until the preloader lifts — its overlay (z-200) covers this
      gsap.set(chars, { yPercent: 100 });
      gsap.set(metaRef.current, { opacity: 0 });
      return;
    }

    const tl = gsap.timeline();
    tl.to(chars, {
      yPercent: 0,
      duration: 1,
      ease: GSAP_EASE.out,
      stagger: STAGGER.chars,
    }).to(metaRef.current, { opacity: 1, duration: 0.8 }, "-=0.4");
    return () => {
      tl.kill();
    };
  }, [ready, reduced]);

  return (
    <section
      id="surface"
      aria-label="Hero"
      className="relative flex min-h-screen flex-col justify-end px-6 pb-16 pt-32 lg:px-10"
    >
      <p className="label-mono mb-6">
        {"//"} 01 — surface · {SITE.alias}
      </p>

      <h1
        ref={titleRef}
        className="text-display text-[16vw] leading-[0.9] sm:text-[13vw] lg:text-[11vw]"
        aria-label={`${SITE.name}`}
      >
        {LINES.map((line, l) => (
          <span key={line} className="block" aria-hidden>
            {line.split("").map((ch, i) => (
              <span
                key={`${l}-${i}`}
                className="reveal-mask inline-block align-bottom"
              >
                <span data-char className="inline-block">
                  {ch}
                </span>
              </span>
            ))}
          </span>
        ))}
      </h1>

      <div
        ref={metaRef}
        className="mt-8 flex flex-col gap-10 md:flex-row md:items-end md:justify-between"
      >
        <p className="max-w-md font-mono text-sm leading-relaxed text-muted-foreground">
          <ScrambleText
            words={SITE.roles}
            start={ready}
            className="text-ice"
          />
        </p>

        <div
          className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground"
          aria-hidden
        >
          <span className="block h-12 w-px bg-border" />
          scroll to descend
        </div>
      </div>
    </section>
  );
}
