# DIVYANSH://VOID

**Live → [portfolio-divi.vercel.app](https://portfolio-divi.vercel.app)**

Personal portfolio of Divyansh Gupta — full-stack developer, security engineer, and blockchain auditor. Built as a single long-scroll experience with GPU-adaptive WebGL particle systems, GSAP scroll choreography, and a terminal-style AI chat widget.

---

## Features

| Area | Detail |
|---|---|
| **WebGL particle field** | 18k–80k particles (GPU-tier adaptive) forming a crystal silhouette that morphs into a bust as you scroll into the About section — driven by a GLSL `uMorph` uniform, not CPU geometry swaps |
| **Fibonacci beacon** | Contact section's sphere built from a fibonacci-distributed particle cloud with a breathing pulse and slow rotation |
| **Smooth theme toggle** | Dark ↔ Light with zero geometry rebuild — both colour palettes are precomputed; `uColorMix` cross-fades them in the shader; CSS transitions via a scoped `.theme-transitioning` class window |
| **SSR theming** | `divi-theme` cookie read server-side in the App Router layout so the correct `html.light` class is rendered before hydration — no flash, no mismatch |
| **Horizontal scroll** | GSAP `ScrollTrigger` pin + scrub drives the Projects section sideways; each panel has a WebGL ripple shader with RGB-shift at scroll velocity |
| **View transitions** | Shared-element morph between a project panel and its case-study page via the View Transitions API |
| **AI chat widget** | Terminal-style floating widget powered by Claude (Anthropic SDK) with Upstash rate limiting and a keep-warm cron |
| **Vault terminal** | Interactive shell in the Security section with real command responses |
| **Custom cursor** | Fine-pointer only; degrades gracefully on touch |
| **Easter eggs** | Konami code triggers a full-page glitch animation |

---

## Stack

**Framework**
- [Next.js 16](https://nextjs.org/) — App Router, server components, View Transitions
- [React 19](https://react.dev/) — `useSyncExternalStore` for the theme/sound stores

**3D / WebGL**
- [Three.js r184](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) — custom GLSL shaders, `AdditiveBlending` / `NormalBlending` per theme
- [detect-gpu](https://github.com/pmndrs/detect-gpu) — GPU tier → particle budget

**Animation**
- [GSAP 3](https://gsap.com/) + ScrollTrigger — scroll choreography, morph progress, parallax index numbers
- [Lenis](https://lenis.darkroom.engineering/) — smooth scroll; velocity fed to panel shaders

**Styling**
- [Tailwind CSS v4](https://tailwindcss.com/) — `@theme inline` tokens, `oklch` / `color-mix`
- [shadcn/ui](https://ui.shadcn.com/) components

**AI / Backend**
- [@anthropic-ai/sdk](https://github.com/anthropics/anthropic-sdk-typescript) — Claude for the chat widget
- [Groq SDK](https://groq.com/) — Llama 3.3 70B fallback
- [Upstash Redis + Ratelimit](https://upstash.com/) — per-IP rate limiting
- [Resend](https://resend.com/) — contact form emails

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set environment variables (see below)
cp .env.example .env.local

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

```env
# AI chat widget
ANTHROPIC_API_KEY=

# Groq fallback (optional)
GROQ_API_KEY=

# Rate limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Contact form emails (Resend)
RESEND_API_KEY=

# Canonical URL for metadata / OG tags
NEXT_PUBLIC_SITE_URL=https://portfolio-divi.vercel.app
```

The site runs without any keys — the chat widget falls back gracefully and the contact form shows an error toast. WebGL, scroll animations, and theming are entirely client-side.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — SSR theme cookie, fonts, JSON-LD
│   ├── globals.css          # Design tokens, dark/light palettes, utilities
│   └── projects/[slug]/    # Case study pages with shared-element transitions
├── components/
│   ├── sections/            # 01 Surface → 07 Signal (one component per section)
│   ├── webgl/               # Particle field, project panel shader, beacon
│   ├── fx/                  # Chat widget, cursor, easter eggs, view transition
│   ├── layout/              # Nav, section heading, footer
│   └── providers/           # Lenis smooth scroll provider
└── lib/
    ├── content.ts           # All site copy — projects, experience, skills
    ├── theme.ts             # Dark/light store (useSyncExternalStore pattern)
    └── hooks.ts             # useMediaQuery, reduced-motion query
```

---

## Sections

| # | ID | What it does |
|---|---|---|
| 01 | `surface` | Hero — WebGL crystal particle field, name, roles |
| 02 | `profile` | About — particles morph into a bust silhouette on scroll |
| 03 | `record` | Experience timeline |
| 04 | `systems` | Skills bento grid with marquee |
| 05 | `core` | Projects — pinned horizontal scroll, WebGL panel ripple |
| 06 | `vault` | Security — live terminal, decrypt-on-scroll philosophy, cert roadmap |
| 07 | `signal` | Contact — fibonacci sphere beacon, contact form |

---

## Deployment

Deployed on **Vercel**. The only build-time requirement is `NEXT_PUBLIC_SITE_URL`. All other env vars are runtime (API routes).

```bash
npm run build   # production build
npm run start   # production server
```

---

## License

MIT — feel free to use the architecture or visual ideas as inspiration. Please don't deploy it as-is with my name and content.

---

*Divyansh Gupta · [github.com/Divyansh2602](https://github.com/Divyansh2602) · [linkedin](https://www.linkedin.com/in/divyansh-gupta-485b04377/) · divyanshg2602@gmail.com*
