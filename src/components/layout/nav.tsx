import Link from "next/link";
import { SECTIONS, SITE } from "@/lib/content";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Primary"
        className="glass flex items-center justify-between border-x-0 border-t-0 px-6 py-4 lg:px-10"
      >
        <Link
          href="/"
          className="font-mono text-sm tracking-tight text-foreground transition-colors hover:text-signal"
        >
          {SITE.alias}
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {SECTIONS.filter((s) => s.id !== "surface").map((section) => (
            <li key={section.id}>
              <Link
                href={`/#${section.id}`}
                className="group whitespace-nowrap font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-signal"
              >
                <span className="text-ice/60 group-hover:text-signal">
                  {section.index}
                </span>{" "}
                {section.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 whitespace-nowrap font-mono text-xs text-muted-foreground md:flex">
          <span
            aria-hidden
            className="size-1.5 rounded-full bg-signal"
          />
          {SITE.status}
        </div>
      </nav>
    </header>
  );
}
