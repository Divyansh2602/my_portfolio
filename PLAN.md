# DIVI://VOID — Portfolio Build Plan

> Dark-void / arctic-silicon immersive portfolio. Target: Awwwards SOTD-caliber, not "student portfolio."
> This file is the single source of truth for the build. Read fully before writing any code.

---

## 0. About Divi (context for any new session)

**Divi (Divyansh Gupta)** — principal software architect, senior cybersecurity engineer, staff-level full-stack developer; CS student at VIT. Interests: cybersecurity (pentesting, eJPT track), competitive programming, cryptography, visually immersive web experiences.

**Engineering standards (non-negotiable, every project):**
- Production-grade, enterprise-quality, designed for 10M users
- Security: OWASP Top 10, OWASP ASVS, OWASP API Security Top 10, NIST CSF
- Mandatory: RBAC where applicable, audit logging, rate limiting, secure JWT auth, input validation, security headers, CSRF/XSS/SQLi protection

**Working style:** brief, direct communication; hands-on and iterative; when multiple changes accumulate, provide complete file outputs over partial diffs.

**Projects to feature:**
1. **CipherMind** — full-stack encrypted AI chatbot (AES-256-GCM, HMAC-SHA-512), Groq API (Llama/Mixtral/Gemma2), streaming, vision uploads, TTS/voice, crypto inspector panel. Vercel + Render. (Shipped)
2. **AI HR Recruitment Simulator** — FastAPI/PostgreSQL backend: resume parsing, semantic job-matching (sentence-transformers), Anthropic-powered AI interviewer, Celery async workers
3. **Drone delivery routing engine** — competitive programming: parametric NFZ intersection math, multi-strategy navigation, greedy multi-drone scheduling, 17-case validation suite
4. **Pentest lab + security work** — VirtualBox/Kali/Metasploitable home lab, eJPT roadmap, cryptography depth (DES/AES/RSA/ECC/ElGamal/SHA-512/DH/DSS)

---

## 1. Concept & Art Direction

**Narrative:** descending through layers of a frozen machine — Surface (hero) → Profile (about) → Systems (skills) → Core (projects) → Vault (security) → Signal (contact). Every scroll is a descent; depth is the unifying metaphor.

**Palette (strict — nothing else):**
- Base: near-black `#050507`
- Arctic silver: `#C8D3DC`
- Ice-blue accent: `#7DD3FC`
- Signal (interactive states ONLY): electric cyan `#22D3EE`

**Typography:**
- Display: sharp grotesk (Space Grotesk or Neue Montreal-style) — huge, tight tracking
- Mono: JetBrains Mono / Geist Mono — terminal motifs, section labels like `// 02 — projects`

**Texture:** subtle film-grain shader overlay, 1px borders at 10% opacity, glassmorphic panels only where content sits over WebGL.

**Reference map (what to steal from where):**
| Reference | Steal |
|---|---|
| igloo.inc | Descent narrative, ice aesthetic, scroll pacing, sound design |
| Lusion (lusion.co) | WebGL section transitions, cursor-reactive 3D, particle morphs |
| PeachWeb (peachweb.io) | 3D object presentation, lighting on dark scenes |
| Godly (godly.website) + Awwwards | Per-section layout patterns — collect 5 refs before building each section |
| Codrops (tympanus.net/codrops) | Shader/effect implementation tutorials |

---

## 2. Stack

- **Next.js 15** (App Router, RSC, TypeScript strict) + **Tailwind** + **shadcn/ui** (forms, dialogs, toasts)
- **3D:** React Three Fiber + drei + @react-three/postprocessing (also run `npm install @threlte/extras` per standing setup rule)
- **Motion:** GSAP + ScrollTrigger (scroll choreography), **Lenis** (smooth-scroll backbone — everything syncs to it), Framer Motion (UI micro-interactions, page transitions)
- **Shaders:** raw GLSL shader materials + drei helpers
- **Email:** Resend (contact API) · **Hosting:** Vercel · **Analytics:** Vercel Analytics + Speed Insights
- **Component sourcing:** 21st.dev Magic MCP (generate structural UI, then restyle to design system), Aceternity UI, Magic UI, React Bits — cherry-pick and rewrite, never paste stock-looking components

---

## 3. Site Structure & Every Effect, Section by Section

Single-page descent (`/`) + project case-study subpages (`/projects/[slug]`).

### 0. Preloader (0–2s)
- Counter `00 → 100` in mono type
- Glitch/decrypt text effect on the name — characters cycle through cipher symbols before resolving (nod to CipherMind)
- WebGL scene loads behind; preloader lifts via horizontal "ice-crack" mask reveal (GSAP clip-path)

### 1. Hero — "Surface"
- Full-viewport WebGL: **~80k-point particle field forming a crystalline structure**, slow rotation, particles displace from cursor (curl noise + mouse uniform — Codrops tutorial)
- Name in massive display type, per-character stagger reveal (SplitText-style), chromatic-aberration pass on WebGL behind text
- Subline cycles identities with **decrypt/scramble animation**: `principal architect` → `security engineer` → `full-stack builder`
- Custom cursor: dot + trailing ring, magnetic pull toward interactive elements
- Scroll hint: animated line + `scroll to descend` in mono

### 2. About — "Profile"
- On scroll, hero particles **morph into low-poly abstract bust** (particle morph targets — Lusion signature)
- Bio reveals line-by-line, masked Y-translate (ScrollTrigger scrub)
- Stats strip (years coding, CTFs, projects shipped) — count-up on enter, mono labels
- Infinite marquee of stack icons, pauses on hover

### 3. Skills — "Systems"
- Bento grid (Aceternity-style, fully restyled): Architecture / Security / Full-Stack / ML
- Spotlight hover (radial gradient follows cursor), border-beam on featured card
- Security card runs a **fake live terminal** typing nmap/audit output on loop
- Cards tilt subtly in 3D toward cursor (Framer Motion `useTransform`)

### 4. Projects — "Core" (centerpiece)
- **Pinned horizontal scroll** inside vertical page (ScrollTrigger pin + scrub) — 4 full-height project panels
- Each panel: WebGL plane with project screenshot — **ripple/wave distortion on hover**, **RGB-shift on scroll velocity**
- Project number `01/04` huge in background, parallax at different speed
- Click → **shared-element transition** (Framer Motion layoutId: image expands into case-study hero, no hard cut)

### 4b. `/projects/[slug]` case studies
- Sticky media column + scrolling text column, scroll-progress bar
- Architecture diagrams drawn-in with SVG path animation (CipherMind security architecture = showpiece)
- Per-project metrics, stack chips, next-project footer with hover preview

### 5. Security — "Vault" (the differentiator)
- Transition: screen "locks" — vault-door/encryption visual, background drops to deepest black
- **Interactive terminal**: visitors type `help`, `whoami`, `projects`, `ctf` → real responses; easter eggs (`sudo hire me`)
- Wall of cipher text live-decrypting into security philosophy
- eJPT/cert roadmap timeline as an animated path drawing on scroll

### 6. Contact — "Signal"
- Particles return, **converge into pulsing beacon sphere**
- Magnetic CTA (`initiate contact`) — warps toward cursor
- Form (shadcn + react-hook-form + zod) → Resend API; success = particle burst
- Footer: live local time, `status: open to work` pulsing dot, socials with hover-glitch

### Global
- Lenis smooth scroll + subtle skew-on-velocity (page shears when scrolling fast)
- Grain + vignette post-processing over all WebGL
- Page transitions: ice-mask wipe (GSAP)
- Optional sound design (muted by default): soft UI ticks on hover

---

## 4. Build Workflow

1. **Research pass** — Godly + Awwwards: 5 references per section before building it
2. **Design tokens first** — colors, type scale, spacing, motion durations/easings in one `motion.ts` config; every animation uses the same easing family (`expo.out` entrances, `power3.inOut` transitions)
3. **Scaffold** — Next.js 15 + Tailwind + shadcn init, `@threlte/extras` install
4. **Component generation** — 21st.dev Magic MCP for structural UI (nav, bento, forms), restyle every output; Aceternity/Magic UI/React Bits for effect components, rewritten not pasted
5. **WebGL track in parallel** — hero particles → morph system → project shader panels → contact beacon (Codrops per effect)
6. **Motion pass** — wire sections to Lenis + ScrollTrigger only after layout is final
7. **Polish pass** — cursor, preloader, transitions, sound, easter eggs

---

## 5. Non-negotiables

- **Performance:** 60fps budget; particle count adaptive to GPU (`detect-gpu`/gpu-tier); `dynamic()` import all WebGL (zero 3D in initial bundle); draco-compressed assets; Lighthouse ≥ 90 with WebGL running
- **Accessibility:** full `prefers-reduced-motion` fallback (static gradients replace WebGL, fades replace morphs); keyboard-navigable; semantic landmarks; visible focus states
- **Security:** strict CSP, full security headers, rate-limited contact API (Upstash Ratelimit), zod validation server-side, honeypot + Turnstile on form, zero secrets client-side — a security engineer's portfolio must itself be auditable
- **SEO:** per-page metadata, generated on-brand dark OG images, sitemap, JSON-LD person schema

---

## 6. Phases

| Phase | Scope | Time |
|---|---|---|
| 1 | Tokens, scaffold, layout of all sections (no motion) | 2–3 days |
| 2 | Hero particles + preloader + custom cursor | 2–3 days |
| 3 | Scroll system (Lenis + ScrollTrigger) + section animations | 3–4 days |
| 4 | Projects horizontal scroll + shader panels + case studies | 4–5 days |
| 5 | Vault terminal + contact beacon + form/API | 2–3 days |
| 6 | Performance, a11y, security hardening, OG/SEO | 2 days |
| 7 | Polish: transitions, sound, easter eggs, mobile QA | 2 days |

~3 weeks of focused work to SOTD-submission quality.

---

## 7. Key Differentiators (what makes it world-class)

1. **Particle-system continuity** — ONE particle system travels the entire page: crystal (hero) → bust (about) → dissolve (projects) → beacon (contact). Not disconnected effects.
2. **The Vault** — a real interactive security terminal. No other portfolio has this.

---

## Pending input from Divi

- Real personal content: bio copy, project screenshots/links, socials, resume details
- The reference site Divi mentioned wanting to share (fold its ideas in before Phase 1)
