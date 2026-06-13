/**
 * Site content. Placeholder copy lives here until Divi supplies the real
 * bio, screenshots, links, and socials (see PLAN.md "Pending input").
 */

export const SITE = {
  name: "Divyansh Gupta",
  alias: "DIVI://VOID",
  email: "divyansh.gupta2023@vitstudent.ac.in",
  roles: ["principal architect", "security engineer", "full-stack builder"],
  status: "open to work",
} as const;

/** Canonical site origin (no trailing slash). Override per-deploy. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://divi-void.vercel.app"
).replace(/\/$/, "");

export const SECTIONS = [
  { id: "surface", index: "01", label: "surface", title: "Hero" },
  { id: "profile", index: "02", label: "profile", title: "About" },
  { id: "systems", index: "03", label: "systems", title: "Skills" },
  { id: "core", index: "04", label: "core", title: "Projects" },
  { id: "vault", index: "05", label: "vault", title: "Security" },
  { id: "signal", index: "06", label: "signal", title: "Contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const STATS = [
  { value: 5, suffix: "+", label: "years coding" },
  { value: 12, suffix: "", label: "ctfs played" },
  { value: 8, suffix: "+", label: "projects shipped" },
  { value: 4, suffix: "", label: "stacks mastered" },
] as const;

export const STACK_MARQUEE = [
  "TypeScript",
  "Next.js",
  "React",
  "Node.js",
  "Python",
  "FastAPI",
  "PostgreSQL",
  "Redis",
  "Docker",
  "Three.js",
  "GSAP",
  "Tailwind",
  "Kali Linux",
  "Metasploit",
  "Burp Suite",
  "C++",
] as const;

export interface Project {
  slug: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  metrics: { value: string; label: string }[];
  links: { live?: string; repo?: string };
  /** Placeholder tint until real screenshots arrive. */
  accent: string;
  /** Ordered architecture flow — drawn in on the case-study page. */
  architecture: string[];
}

export const PROJECTS: Project[] = [
  {
    slug: "ciphermind",
    index: "01",
    title: "CipherMind",
    tagline: "End-to-end encrypted AI chatbot",
    description:
      "Full-stack encrypted AI chat: AES-256-GCM payloads with HMAC-SHA-512 integrity, Groq-served Llama / Mixtral / Gemma2 with token streaming, vision uploads, voice + TTS, and a live crypto-inspector panel exposing every encryption step. Deployed on Vercel + Render.",
    stack: [
      "Next.js",
      "Node.js",
      "AES-256-GCM",
      "HMAC-SHA-512",
      "Groq API",
      "Web Speech",
      "Vercel",
      "Render",
    ],
    metrics: [
      { value: "AES-256", label: "encryption at rest + transit" },
      { value: "3", label: "model families served" },
      { value: "<100ms", label: "first-token streaming" },
    ],
    links: {},
    accent: "#7DD3FC",
    architecture: [
      "Browser client — AES-256-GCM encrypt",
      "Next.js API — HMAC-SHA-512 verify",
      "Groq inference — Llama / Mixtral / Gemma2",
      "Token stream — SSE back to client",
      "Crypto inspector — every step exposed",
    ],
  },
  {
    slug: "hr-simulator",
    index: "02",
    title: "AI HR Recruitment Simulator",
    tagline: "Semantic hiring pipeline with an AI interviewer",
    description:
      "FastAPI + PostgreSQL backend that parses resumes, runs semantic job-matching with sentence-transformers, and conducts adaptive interviews powered by Anthropic models. Celery workers handle parsing and scoring asynchronously at scale.",
    stack: [
      "FastAPI",
      "PostgreSQL",
      "sentence-transformers",
      "Anthropic API",
      "Celery",
      "Redis",
      "Docker",
    ],
    metrics: [
      { value: "384-dim", label: "embedding match space" },
      { value: "async", label: "Celery worker pipeline" },
      { value: "RBAC", label: "role-scoped API surface" },
    ],
    links: {},
    accent: "#C8D3DC",
    architecture: [
      "Resume upload — parse + normalize",
      "sentence-transformers — 384-dim embed",
      "PostgreSQL — vector job-match",
      "Celery workers — async scoring",
      "Anthropic interviewer — adaptive Q&A",
    ],
  },
  {
    slug: "drone-routing",
    index: "03",
    title: "Drone Delivery Routing Engine",
    tagline: "Geometric pathfinding around no-fly zones",
    description:
      "Competitive-programming-grade routing core: parametric intersection math for no-fly-zone avoidance, multi-strategy navigation with fallback chains, and greedy multi-drone scheduling — proven against a 17-case validation suite.",
    stack: [
      "C++",
      "Computational Geometry",
      "Greedy Scheduling",
      "Parametric Intersection",
    ],
    metrics: [
      { value: "17/17", label: "validation cases passing" },
      { value: "O(n log n)", label: "scheduling core" },
      { value: "3", label: "navigation strategies" },
    ],
    links: {},
    accent: "#22D3EE",
    architecture: [
      "Scenario input — drones, NFZs, orders",
      "Parametric solver — NFZ intersection math",
      "Multi-strategy nav — fallback chains",
      "Greedy scheduler — multi-drone assignment",
      "Validator — 17-case proof suite",
    ],
  },
  {
    slug: "pentest-lab",
    index: "04",
    title: "Offensive Security Lab",
    tagline: "Home pentest lab + cryptography depth",
    description:
      "VirtualBox lab running Kali against Metasploitable on an isolated network — recon to exploitation, documented like an engagement. Paired with the eJPT roadmap and implementation-level cryptography: DES, AES, RSA, ECC, ElGamal, SHA-512, DH, DSS.",
    stack: [
      "Kali Linux",
      "Metasploitable",
      "nmap",
      "Metasploit",
      "Wireshark",
      "Cryptography",
    ],
    metrics: [
      { value: "eJPT", label: "certification track" },
      { value: "8", label: "ciphers implemented" },
      { value: "isolated", label: "lab network topology" },
    ],
    links: {},
    accent: "#7DD3FC",
    architecture: [
      "Kali attacker — isolated host-only net",
      "Recon — nmap service + version sweep",
      "Exploit — Metasploit against Metasploitable",
      "Post-exploitation — loot + pivot",
      "Engagement report — findings + remediation",
    ],
  },
];

export const SKILL_CARDS = [
  {
    id: "architecture",
    title: "Architecture",
    blurb:
      "Systems designed for 10M users — service boundaries, queues, caching layers, and failure modes mapped before the first line ships.",
    items: ["System design", "API design", "Event-driven", "Scalability"],
    featured: true,
  },
  {
    id: "security",
    title: "Security",
    blurb:
      "OWASP Top 10 / ASVS by default: RBAC, audit logging, rate limiting, hardened JWT auth, strict input validation.",
    items: ["Pentesting", "Cryptography", "OWASP", "Threat modeling"],
    featured: false,
    terminal: true,
  },
  {
    id: "fullstack",
    title: "Full-Stack",
    blurb:
      "Next.js and FastAPI in production — typed end to end, streaming where it matters, observable everywhere.",
    items: ["Next.js", "FastAPI", "PostgreSQL", "TypeScript"],
    featured: false,
  },
  {
    id: "ml",
    title: "ML / AI",
    blurb:
      "LLM pipelines with real engineering behind them: embeddings, semantic search, async inference workers.",
    items: ["LLM integration", "Embeddings", "Semantic search", "Celery"],
    featured: false,
  },
] as const;

export const VAULT_PHILOSOPHY =
  "Security is not a feature you add — it is the substrate everything else runs on. Every system I ship assumes hostile input, least privilege, and an audit trail.";

export const CERT_ROADMAP = [
  { year: "2024", label: "Home lab — Kali vs Metasploitable", done: true },
  { year: "2025", label: "Cryptography core — DES → ECC → DSS", done: true },
  { year: "2026", label: "eJPT certification", done: false },
  { year: "2027", label: "OSCP track", done: false },
] as const;

export const SOCIALS = [
  { label: "github", href: "https://github.com/" },
  { label: "linkedin", href: "https://linkedin.com/" },
  { label: "email", href: `mailto:${SITE.email}` },
] as const;
