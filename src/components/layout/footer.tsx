import { SITE, SOCIALS } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t px-6 py-8 lg:px-10">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <p className="font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE.name} — built in the void
        </p>

        <ul className="flex items-center gap-6">
          {SOCIALS.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-signal"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span aria-hidden className="size-1.5 rounded-full bg-signal" />
          status: {SITE.status} · IST (UTC+5:30)
        </div>
      </div>
    </footer>
  );
}
