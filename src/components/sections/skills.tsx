import { SectionHeading } from "@/components/layout/section-heading";
import { SKILL_CARDS } from "@/lib/content";
import { SkillCard } from "./skill-card";

/**
 * 03 — Systems. Bento grid. Per-card interactivity (spotlight, 3D tilt,
 * border-beam, live terminal) lives in <SkillCard/>; this stays a server
 * component that just lays out the grid.
 */
export function Skills() {
  return (
    <section id="systems" aria-label="Skills" className="px-6 py-32 lg:px-10">
      <SectionHeading index="03" label="systems" title="Systems" />

      <div className="mt-16 grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-3">
        {SKILL_CARDS.map((card) => {
          const terminal = "terminal" in card && card.terminal;
          return (
            <SkillCard
              key={card.id}
              card={card}
              className={`${card.featured ? "md:col-span-2" : ""} ${
                terminal ? "md:row-span-2" : ""
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
