"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useMediaQuery, REDUCED_MOTION_QUERY } from "@/lib/hooks";

const INTERACTIVE = "a, button, [role='button'], input, textarea, label, select";

/**
 * Custom cursor: dot tracks the pointer 1:1 (zero latency), ring trails
 * with a tight rAF lerp. Ring expands + goes signal-cyan over interactive
 * elements; [data-magnetic] elements get pulled toward the cursor.
 * Mounted only for fine pointers with motion allowed — touch devices and
 * reduced-motion users keep the native cursor.
 */
export function Cursor() {
  const finePointer = useMediaQuery("(pointer: fine)");
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const active = finePointer && !reducedMotion;
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !dot.current || !ring.current) return;

    document.documentElement.classList.add("custom-cursor");

    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let hovering = false;
    let magnetEl: HTMLElement | null = null;
    let visible = false;

    const dotEl = dot.current;
    const ringEl = ring.current;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        ringPos.x = pos.x;
        ringPos.y = pos.y;
        dotEl.style.opacity = "1";
        ringEl.style.opacity = "1";
      }
      // dot is 1:1 — set immediately, not in the rAF loop
      dotEl.style.transform = `translate3d(${pos.x - 3}px, ${pos.y - 3}px, 0)`;

      if (magnetEl) {
        const r = magnetEl.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        gsap.to(magnetEl, {
          x: (pos.x - cx) * 0.3,
          y: (pos.y - cy) * 0.3,
          duration: 0.3,
          ease: "power3.out",
        });
      }
    };

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement;
      hovering = !!target.closest(INTERACTIVE);
      const magnet = target.closest<HTMLElement>("[data-magnetic]");
      if (magnet && magnet !== magnetEl) magnetEl = magnet;
      ringEl.style.borderColor = hovering
        ? "var(--signal)"
        : "color-mix(in oklab, var(--silver) 40%, transparent)";
    };

    const onOut = (e: Event) => {
      const target = e.target as HTMLElement;
      const magnet = target.closest<HTMLElement>("[data-magnetic]");
      if (magnet && magnet === magnetEl) {
        gsap.to(magnet, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.4)",
        });
        magnetEl = null;
      }
      hovering = !!(e as MouseEvent & { relatedTarget: HTMLElement | null })
        .relatedTarget?.closest?.(INTERACTIVE);
      if (!hovering)
        ringEl.style.borderColor =
          "color-mix(in oklab, var(--silver) 40%, transparent)";
    };

    const onLeave = () => {
      visible = false;
      dotEl.style.opacity = "0";
      ringEl.style.opacity = "0";
    };

    let raf = 0;
    const RING_LERP = 0.22;
    let scale = 1;
    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * RING_LERP;
      ringPos.y += (pos.y - ringPos.y) * RING_LERP;
      const targetScale = hovering ? 1.6 : 1;
      scale += (targetScale - scale) * 0.18;
      ringEl.style.transform = `translate3d(${ringPos.x - 18}px, ${
        ringPos.y - 18
      }px, 0) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, true);
    document.addEventListener("mouseout", onOut, true);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver, true);
      document.removeEventListener("mouseout", onOut, true);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [active]);

  if (!active) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[150]">
      <div
        ref={dot}
        className="absolute left-0 top-0 size-1.5 rounded-full bg-silver opacity-0"
      />
      <div
        ref={ring}
        className="absolute left-0 top-0 size-9 rounded-full border opacity-0 transition-[border-color] duration-200"
        style={{
          borderColor: "color-mix(in oklab, var(--silver) 40%, transparent)",
        }}
      />
    </div>
  );
}
