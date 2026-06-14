import { SectionHeading } from "@/components/layout/section-heading";
import { DecryptText } from "@/components/fx/decrypt-text";
import { VaultTerminal } from "./vault-terminal";
import { VaultLock } from "./vault-lock";
import { CertRoadmap } from "./cert-roadmap";
import { VAULT_PHILOSOPHY } from "@/lib/content";

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
      <SectionHeading index="06" label="vault" title="Vault" />

      <div className="mt-12">
        <VaultLock />
      </div>

      <div className="grid gap-16 lg:grid-cols-2">
        <div className="flex flex-col gap-12">
          {/* Cipher wall — decrypts into the security philosophy on scroll */}
          <blockquote className="max-w-prose font-mono text-lg leading-relaxed text-foreground/90 sm:text-xl">
            <DecryptText text={VAULT_PHILOSOPHY} />
          </blockquote>

          <div>
            <h3 className="label-mono mb-6">certification roadmap</h3>
            <CertRoadmap />
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
