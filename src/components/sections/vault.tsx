import { SectionHeading } from "@/components/layout/section-heading";
import { DecryptText } from "@/components/fx/decrypt-text";
import { VaultTerminal } from "./vault-terminal";
import { CERT_ROADMAP, VAULT_PHILOSOPHY } from "@/lib/content";

/**
 * 05 — Vault. Deepest-black section — the differentiator. The philosophy
 * live-decrypts from cipher on scroll; the terminal is a real interactive
 * shell (see vault-terminal.tsx). Cert roadmap as a timeline.
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
          {/* Cipher wall — decrypts into the security philosophy on scroll */}
          <blockquote className="max-w-prose font-mono text-lg leading-relaxed text-foreground/90 sm:text-xl">
            <DecryptText text={VAULT_PHILOSOPHY} />
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

        {/* Interactive terminal */}
        <div>
          <p className="label-mono mb-4">{"//"} live shell — type a command</p>
          <VaultTerminal />
        </div>
      </div>
    </section>
  );
}
