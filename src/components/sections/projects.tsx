import Link from "next/link";
import { SectionHeading } from "@/components/layout/section-heading";
import { PROJECTS } from "@/lib/content";

/**
 * 04 — Core. Becomes a pinned horizontal scroll in Phase 4; for Phase 1
 * the panels live in a horizontal scroll-snap track so the final layout
 * proportions are already real. Screenshot planes become WebGL in Phase 4.
 */
export function Projects() {
  return (
    <section id="core" aria-label="Projects" className="py-32">
      <div className="px-6 lg:px-10">
        <SectionHeading index="04" label="core" title="Core" />
      </div>

      <div
        className="mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 lg:px-10"
        role="list"
      >
        {PROJECTS.map((project) => (
          <article
            key={project.slug}
            role="listitem"
            className="relative flex min-h-[70vh] w-[88vw] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-lg border p-8 sm:w-[70vw] lg:w-[60vw] lg:p-12"
          >
            {/* Giant parallax index number */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-8 right-4 select-none text-display text-[12rem] text-silver/5 lg:text-[18rem]"
            >
              {project.index}
            </span>

            {/* Screenshot plane placeholder — WebGL ripple shader in Phase 4 */}
            <div
              aria-hidden
              className="absolute inset-0 -z-10"
              style={{
                background: `radial-gradient(ellipse 70% 60% at 60% 30%, ${project.accent}12, transparent 70%)`,
              }}
            />

            <p className="label-mono mb-4">
              {project.index}/0{PROJECTS.length} · {project.tagline}
            </p>

            <h3 className="text-display text-4xl sm:text-5xl lg:text-6xl">
              {project.title}
            </h3>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
              <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {project.stack.slice(0, 4).map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>

              <Link
                href={`/projects/${project.slug}`}
                className="group font-mono text-xs uppercase tracking-[0.25em] text-ice transition-colors hover:text-signal"
              >
                open case study{" "}
                <span
                  aria-hidden
                  className="inline-block transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
