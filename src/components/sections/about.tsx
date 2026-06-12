import { SectionHeading } from "@/components/layout/section-heading";
import { STATS, STACK_MARQUEE } from "@/lib/content";

const BIO_LINES = [
  "I design systems that assume hostile input.",
  "Principal-level architecture, security engineering, and full-stack",
  "delivery — currently studying CS at VIT, permanently studying",
  "everything else. Encrypted AI chat, semantic hiring pipelines,",
  "drone routing math, and a home pentest lab that gets no mercy.",
];

/**
 * 02 — Profile. Hero particles morph into a bust here in Phase 3;
 * the marquee and count-ups animate in Phase 3 too.
 */
export function About() {
  return (
    <section
      id="profile"
      aria-label="About"
      className="relative px-6 py-32 lg:px-10"
    >
      <SectionHeading index="02" label="profile" title="Profile" />

      <div className="mt-16 grid gap-16 lg:grid-cols-2">
        {/* Particle-bust placeholder (Phase 2/3) */}
        <div
          aria-hidden
          className="order-last hidden min-h-[420px] rounded-lg border lg:block"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(125,211,252,0.07), transparent 70%)",
          }}
        />

        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-1 text-xl leading-relaxed text-foreground/90 sm:text-2xl">
            {BIO_LINES.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-2 bg-background p-6"
              >
                <dd className="text-display text-4xl text-ice">
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

      {/* Stack marquee — static row for now, infinite loop in Phase 3 */}
      <div className="mt-24 overflow-hidden border-y py-5" aria-label="Stack">
        <ul className="flex w-max items-center gap-10 whitespace-nowrap">
          {STACK_MARQUEE.map((tech) => (
            <li
              key={tech}
              className="font-mono text-sm uppercase tracking-[0.15em] text-muted-foreground"
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
