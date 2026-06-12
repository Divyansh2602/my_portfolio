import { SectionHeading } from "@/components/layout/section-heading";
import { CERT_ROADMAP, VAULT_PHILOSOPHY } from "@/lib/content";

const VAULT_TERMINAL = [
  { prompt: true, text: "help" },
  { prompt: false, text: "available commands:" },
  { prompt: false, text: "  whoami     — operator identity" },
  { prompt: false, text: "  projects   — list declassified work" },
  { prompt: false, text: "  ctf        — competition history" },
  { prompt: false, text: "  sudo hire me — [REDACTED]" },
  { prompt: true, text: "whoami" },
  { prompt: false, text: "divi · security engineer · eJPT track" },
];

/**
 * 05 — Vault. Deepest-black section. The terminal becomes fully
 * interactive in Phase 5; markup and layout are final here.
 */
export function Vault() {
  return (
    <section
      id="vault"
      aria-label="Security"
      className="bg-black px-6 py-32 lg:px-10"
    >
      <SectionHeading index="05" label="vault" title="Vault" />

      <div className="mt-16 grid gap-16 lg:grid-cols-2">
        <div className="flex flex-col gap-12">
          {/* Cipher wall — live-decrypt animation in Phase 5 */}
          <blockquote className="max-w-prose text-xl leading-relaxed text-foreground/90 sm:text-2xl">
            {VAULT_PHILOSOPHY}
          </blockquote>

          <div>
            <h3 className="label-mono mb-6">certification roadmap</h3>
            <ol className="relative flex flex-col gap-6 border-l pl-6">
              {CERT_ROADMAP.map((step) => (
                <li key={step.label} className="relative">
                  <span
                    aria-hidden
                    className={`absolute -left-[1.85rem] top-1.5 size-2.5 rounded-full border ${
                      step.done
                        ? "border-signal bg-signal"
                        : "border-muted-foreground bg-background"
                    }`}
                  />
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {step.year}
                  </p>
                  <p
                    className={`mt-1 text-sm ${
                      step.done ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Interactive terminal — wired up in Phase 5 */}
        <div className="flex flex-col overflow-hidden rounded-lg border">
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <span aria-hidden className="size-2.5 rounded-full bg-silver/20" />
            <span aria-hidden className="size-2.5 rounded-full bg-silver/20" />
            <span aria-hidden className="size-2.5 rounded-full bg-silver/20" />
            <p className="ml-2 font-mono text-xs text-muted-foreground">
              divi@void:~/vault
            </p>
          </div>
          <div className="flex-1 p-5 font-mono text-sm leading-loose">
            {VAULT_TERMINAL.map((line, i) => (
              <p
                key={i}
                className={line.prompt ? "text-silver" : "text-ice/70"}
              >
                {line.prompt && (
                  <span aria-hidden className="mr-2 text-signal">
                    ❯
                  </span>
                )}
                {line.text}
              </p>
            ))}
            <p aria-hidden className="text-silver">
              <span className="mr-2 text-signal">❯</span>
              <span className="animate-pulse text-signal">▌</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
