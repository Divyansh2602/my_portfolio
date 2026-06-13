"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery, REDUCED_MOTION_QUERY } from "@/lib/hooks";

const LINES = [
  "$ nmap -sV --top-ports 1000 10.0.2.4",
  "PORT     STATE  SERVICE   VERSION",
  "22/tcp   open   ssh       OpenSSH 4.7p1",
  "80/tcp   open   http      Apache 2.2.8",
  "3306/tcp open   mysql     MySQL 5.0.51a",
  "$ audit --owasp-asvs ./api",
  "✓ rbac          ✓ rate-limit",
  "✓ jwt-rotation  ✓ input-validation",
];

/**
 * Fake live terminal — types nmap / audit output line by line on a loop.
 * Pauses when off-screen to save cycles. Reduced-motion users see the
 * full transcript, statically.
 */
export function TerminalTyper() {
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<string[]>([]);
  const [typing, setTyping] = useState("");

  useEffect(() => {
    if (reduced) return; // reduced motion shows the full transcript via render
    const el = ref.current;
    if (!el) return;

    let line = 0;
    let char = 0;
    let timer = 0;
    let running = false; // starts when first scrolled into view

    const step = () => {
      if (!running) return;
      if (line >= LINES.length) {
        timer = window.setTimeout(() => {
          if (!running) return;
          line = 0;
          char = 0;
          setShown([]);
          setTyping("");
          step();
        }, 2600);
        return;
      }
      const full = LINES[line];
      if (char < full.length) {
        char++;
        setTyping(full.slice(0, char));
        timer = window.setTimeout(step, 18 + Math.random() * 28);
      } else {
        setShown((s) => [...s, full]);
        setTyping("");
        line++;
        char = 0;
        timer = window.setTimeout(step, 280);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // kick off (or resume) — only if not already running, so we
          // never spawn a second timer chain
          if (!running) {
            running = true;
            step();
          }
        } else {
          // pause off-screen and drop any pending tick
          running = false;
          window.clearTimeout(timer);
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);

    return () => {
      running = false;
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, [reduced]);

  const displayed = reduced ? LINES : shown;

  return (
    <div
      ref={ref}
      className="rounded-md border bg-void p-4 font-mono text-xs leading-relaxed text-ice/80"
      aria-label="Terminal output sample"
    >
      {displayed.map((line, i) => (
        <p key={i} className={line.startsWith("$") ? "text-silver" : ""}>
          {line}
        </p>
      ))}
      {!reduced && (
        <p className={typing.startsWith("$") ? "text-silver" : ""}>
          {typing}
          <span className="animate-pulse text-signal">▌</span>
        </p>
      )}
    </div>
  );
}
