import { SITE } from "@/lib/content";
import { HeroCanvas } from "@/components/webgl/hero-canvas";

/**
 * 01 — Surface. Full-viewport hero. The particle crystal renders on top
 * of a static gradient (which doubles as the reduced-motion / no-WebGL
 * fallback); the role line gets the decrypt/scramble cycle in Phase 3.
 */
export function Hero() {
  return (
    <section
      id="surface"
      aria-label="Hero"
      className="relative flex min-h-screen flex-col justify-end overflow-hidden px-6 pb-16 pt-32 lg:px-10"
    >
      {/* Static gradient: backdrop while WebGL loads + reduced-motion fallback */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 35%, rgba(125,211,252,0.08), transparent 70%), radial-gradient(ellipse 50% 40% at 50% 40%, rgba(200,211,220,0.05), transparent 60%)",
        }}
      />
      <HeroCanvas />

      <p className="label-mono mb-6">
        {"//"} 01 — surface · {SITE.alias}
      </p>

      <h1 className="text-display text-[16vw] leading-[0.9] sm:text-[13vw] lg:text-[11vw]">
        DIVYANSH
        <br />
        GUPTA
      </h1>

      <div className="mt-8 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <p className="max-w-md font-mono text-sm leading-relaxed text-muted-foreground">
          <span className="text-ice">{SITE.roles[0]}</span>
          {" / "}
          {SITE.roles[1]}
          {" / "}
          {SITE.roles[2]}
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
