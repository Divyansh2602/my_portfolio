"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery, REDUCED_MOTION_QUERY } from "@/lib/hooks";

const CIPHER = "!<>-_\\/[]{}=+*^?#01ﾊﾐﾋｰｳ";

/**
 * One-shot decrypt: text starts as cipher glyphs and resolves to the real
 * string the first time it scrolls into view (left → right). A wall of
 * this becomes the Vault's security philosophy. Reduced motion → plain
 * text immediately.
 */
export function DecryptText({
  text,
  className = "",
  duration = 1400,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);
  const ref = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduced || done) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let started = false;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / duration);
          const resolved = Math.floor(p * text.length);
          let out = "";
          for (let i = 0; i < text.length; i++) {
            if (i < resolved || text[i] === " ") out += text[i];
            else out += CIPHER[Math.floor(Math.random() * CIPHER.length)];
          }
          el.textContent = out;
          if (p < 1) raf = requestAnimationFrame(tick);
          else {
            el.textContent = text;
            setDone(true);
          }
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced, done, text, duration]);

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {text}
    </span>
  );
}
