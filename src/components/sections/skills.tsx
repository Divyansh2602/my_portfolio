import { SectionHeading } from "@/components/layout/section-heading";
import { SKILL_CARDS } from "@/lib/content";
import { Badge } from "@/components/ui/badge";

const TERMINAL_LINES = [
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
 * 03 — Systems. Bento grid. Spotlight hover, 3D tilt, and the looping
 * terminal animation land in Phase 3 — the markup is final here.
 */
export function Skills() {
  return (
    <section
      id="systems"
      aria-label="Skills"
      className="px-6 py-32 lg:px-10"
    >
      <SectionHeading index="03" label="systems" title="Systems" />

      <div className="mt-16 grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-3">
        {SKILL_CARDS.map((card) => (
          <article
            key={card.id}
            className={`flex flex-col gap-6 bg-background p-8 ${
              card.featured ? "md:col-span-2" : ""
            } ${"terminal" in card && card.terminal ? "md:row-span-2" : ""}`}
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-display text-2xl sm:text-3xl">
                {card.title}
              </h3>
              {card.featured && (
                <span className="label-mono text-ice">core</span>
              )}
            </div>

            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
              {card.blurb}
            </p>

            {"terminal" in card && card.terminal && (
              <div
                className="rounded-md border bg-void p-4 font-mono text-xs leading-relaxed text-ice/80"
                aria-label="Terminal output sample"
              >
                {TERMINAL_LINES.map((line) => (
                  <p key={line} className={line.startsWith("$") ? "text-silver" : ""}>
                    {line}
                  </p>
                ))}
                <p aria-hidden>
                  $ <span className="animate-pulse text-signal">▌</span>
                </p>
              </div>
            )}

            <ul className="mt-auto flex flex-wrap gap-2">
              {card.items.map((item) => (
                <li key={item}>
                  <Badge
                    variant="outline"
                    className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
                  >
                    {item}
                  </Badge>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
