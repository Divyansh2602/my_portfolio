"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DecryptText } from "@/components/fx/decrypt-text";
import { useMediaQuery, REDUCED_MOTION_QUERY } from "@/lib/hooks";

/**
 * Entry "lock" for the Vault — a clearance readout that decrypts as the
 * section arrives, with a single cyan scan sweep across the bar. Signals
 * the descent into the deepest, most secure layer.
 */
export function VaultLock() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);

  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const sweep = el.querySelector<HTMLElement>("[data-sweep]");
      const shackle = el.querySelector<SVGElement>("[data-shackle]");
      if (shackle) {
        gsap.from(shackle, {
          y: -4,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: { trigger: el, start: "top 82%" },
        });
      }
      if (sweep) {
        gsap.fromTo(
          sweep,
          { xPercent: -120 },
          {
            xPercent: 420,
            duration: 1.1,
            ease: "power2.inOut",
            immediateRender: false,
            scrollTrigger: { trigger: el, start: "top 82%" },
          }
        );
      }
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={root}
      className="relative mb-12 flex items-center gap-3 overflow-hidden rounded-lg border bg-void/60 px-5 py-4 font-mono text-xs uppercase tracking-[0.25em]"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4 shrink-0 text-signal"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden
      >
        <path data-shackle d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" />
        <rect x="5" y="11" width="14" height="9" rx="2" />
      </svg>
      <DecryptText
        text="channel secured · clearance granted"
        className="text-ice/80"
      />
      <span aria-hidden className="ml-auto size-1.5 rounded-full bg-signal" />
      <span
        data-sweep
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-signal/15 to-transparent"
      />
    </div>
  );
}
