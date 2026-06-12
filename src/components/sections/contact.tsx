import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE } from "@/lib/content";

/**
 * 06 — Signal. The beacon placeholder becomes the converged particle
 * sphere in Phase 2/3; the form gets react-hook-form + zod + Resend API,
 * honeypot, and Turnstile in Phase 5. Markup is final.
 */
export function Contact() {
  return (
    <section
      id="signal"
      aria-label="Contact"
      className="relative overflow-hidden px-6 py-32 lg:px-10"
    >
      {/* Beacon placeholder — pulsing particle sphere in Phase 2 */}
      <div
        aria-hidden
        className="absolute left-1/2 top-24 -z-10 size-[36rem] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.10), rgba(125,211,252,0.05) 40%, transparent 70%)",
        }}
      />

      <SectionHeading index="06" label="signal" title="Signal" />

      <div className="mt-16 grid gap-16 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <h3 className="text-display text-4xl sm:text-5xl">
            initiate
            <br />
            contact<span className="text-signal">_</span>
          </h3>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Open to internships, security work, and ambitious builds. Signal
            travels fastest by email — the form transmits straight to my
            inbox.
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="font-mono text-sm text-ice transition-colors hover:text-signal"
          >
            {SITE.email}
          </a>
        </div>

        {/* Static markup — submit handler + API in Phase 5 */}
        <form className="flex flex-col gap-6" aria-label="Contact form">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="label-mono">
                name
              </Label>
              <Input id="name" name="name" placeholder="your name" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="label-mono">
                email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@domain.tld"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="message" className="label-mono">
              message
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="what are we building?"
              rows={6}
              required
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-fit font-mono uppercase tracking-[0.25em]"
          >
            transmit →
          </Button>
        </form>
      </div>
    </section>
  );
}
