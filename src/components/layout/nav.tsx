import Link from "next/link";
import { SECTIONS, SITE } from "@/lib/content";
import { SoundToggle } from "@/components/fx/sound-toggle";
import { ThemeToggle } from "@/components/fx/theme-toggle";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Primary"
        className="glass flex items-center justify-between border-x-0 border-t-0 px-6 py-4 lg:px-10"
      >
        <Link
          href="/"
          data-magnetic
          className="inline-block font-mono text-sm tracking-tight text-foreground transition-colors hover:text-signal"
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

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 whitespace-nowrap font-mono text-xs text-muted-foreground md:flex">
            <span aria-hidden className="size-1.5 rounded-full bg-signal" />
            {SITE.status}
          </div>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded border border-ice/30 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-ice transition-colors hover:border-signal hover:text-signal sm:flex"
          >
            Resume
            <svg
              aria-hidden
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-3"
            >
              <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
              <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
            </svg>
          </a>
          <ThemeToggle />
          <SoundToggle />
        </div>
      </nav>
    </header>
  );
}
