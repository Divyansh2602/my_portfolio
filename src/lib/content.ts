/**
 * Site content — sourced from Divi's resume (overall.pdf), LinkedIn, and
 * GitHub. Project repo/live URLs and a couple of stats are still pending
 * confirmation (see the questions Divi was asked).
 */

export const SITE = {
  name: "Divyansh Gupta",
  alias: "DIVI://VOID",
  email: "divyanshg2602@gmail.com",
  roles: ["full-stack developer", "security engineer", "blockchain auditor"],
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
  { value: 3, suffix: "+", label: "years building" },
  { value: 2, suffix: "", label: "dev internships" },
  { value: 5, suffix: "", label: "certifications" },
  { value: 150, suffix: "+", label: "students mentored" },
] as const;

export const STACK_MARQUEE = [
  "Python",
  "JavaScript",
  "HTML",
  "CSS",
  "REST APIs",
  "SQL",
  "MySQL",
  "ElasticSearch",
  "Git",
  "GitHub Actions",
  "Linux",
  "Web Crawling",
  "OWASP Top 10",
  "Threat Modeling",
  "Solidity",
  "Ethereum",
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
    slug: "civicshield",
    index: "01",
    title: "CivicShield",
    tagline: "Attack-surface mapping & vulnerability scanner",
    description:
      "A full-stack security platform that automates web crawling and JavaScript endpoint extraction to map an application's attack surface. A custom parameter-fuzzing engine detects SQLi and XSS, with integrated phishing detection and access control for end-to-end threat coverage. Shipped deployment-ready with SEO fundamentals — XML sitemap, Open Graph tags, Google Search Console. Hack Energy 2.0 Finalist.",
    stack: [
      "Python",
      "JavaScript",
      "HTML",
      "CSS",
      "Web Crawling",
      "Fuzzing",
    ],
    metrics: [
      { value: "Finalist", label: "Hack Energy 2.0" },
      { value: "SQLi · XSS", label: "vulnerabilities detected" },
      { value: "end-to-end", label: "threat coverage" },
    ],
    links: { repo: "https://github.com/Divyansh2602" },
    accent: "#7DD3FC",
    architecture: [
      "Web crawler — JS endpoint extraction",
      "Parameter fuzzer — SQLi / XSS probes",
      "Phishing detection + access control",
      "Attack-surface map — ranked findings",
      "Deploy-ready — sitemap, OG, Search Console",
    ],
  },
  {
    slug: "risk-pipeline",
    index: "02",
    title: "Regulatory Risk Signal Pipeline",
    tagline: "Financial risk classification & compliance reporting",
    description:
      "An end-to-end pipeline that ingests unstructured financial data, classifies risk signals, and indexes findings in ElasticSearch for real-time querying. Automated compliance reports run at over 85% precision, backed by strict per-stage validation that keeps output accurate and auditable for internal and external financial reporting.",
    stack: [
      "Python",
      "ElasticSearch",
      "REST APIs",
      "Data Pipelines",
      "Automated Reporting",
    ],
    metrics: [
      { value: ">85%", label: "compliance report precision" },
      { value: "real-time", label: "ElasticSearch querying" },
      { value: "per-stage", label: "data validation" },
    ],
    links: {},
    accent: "#C8D3DC",
    architecture: [
      "Ingest — unstructured financial data",
      "Classify — risk-signal tagging",
      "Index — ElasticSearch real-time query",
      "Validate — strict per-stage checks",
      "Report — automated compliance, >85%",
    ],
  },
  {
    slug: "data-integrity-analyzer",
    index: "03",
    title: "Automated Data Integrity Analyzer",
    tagline: "Distributed crawling & data-validation backend",
    description:
      "A scalable backend that crawls, extracts, and validates data across distributed API surfaces. Modular parallel processing cut the validation cycle time by 60%, and the system emits structured per-endpoint findings reports with accuracy scores for downstream consumption.",
    stack: [
      "Python",
      "REST APIs",
      "Distributed Crawling",
      "Parallel Processing",
    ],
    metrics: [
      { value: "60%", label: "faster validation cycle" },
      { value: "distributed", label: "parallel API crawl" },
      { value: "scored", label: "per-endpoint reports" },
    ],
    links: { repo: "https://github.com/Divyansh2602" },
    accent: "#22D3EE",
    architecture: [
      "Distributed crawler — multi-API surfaces",
      "Parallel workers — modular processing",
      "Validation engine — integrity checks",
      "Scoring — per-endpoint accuracy",
      "Findings report — downstream-ready",
    ],
  },
];

export const SKILL_CARDS = [
  {
    id: "fullstack",
    title: "Full-Stack",
    blurb:
      "End-to-end platforms with responsive, validated UIs and clean REST APIs. HTML/CSS/JavaScript on the front, modular Python services behind — architected for load times and cross-device consistency.",
    items: ["JavaScript", "Python", "REST APIs", "Responsive UI"],
    featured: true,
  },
  {
    id: "security",
    title: "Security",
    blurb:
      "OWASP Top 10 and threat modeling by default. Smart-contract auditing (reentrancy, access control, gas misuse), parameter fuzzing for SQLi/XSS, and strict input validation to shrink the attack surface.",
    items: ["OWASP Top 10", "Threat modeling", "Smart-contract audit", "Fuzzing"],
    featured: false,
    terminal: true,
  },
  {
    id: "data",
    title: "Backend & Data",
    blurb:
      "Modular Python backends, distributed web crawlers, and data pipelines with per-stage validation and automated reporting — indexed in ElasticSearch for real-time querying.",
    items: ["Data pipelines", "Web crawling", "ElasticSearch", "SQL / MySQL"],
    featured: false,
  },
  {
    id: "blockchain",
    title: "Blockchain",
    blurb:
      "Ethereum smart-contract development and security auditing at IBM — secure coding, iterative testing, and logic-flaw elimination before deployment.",
    items: ["Ethereum", "Solidity", "Contract auditing", "Secure coding"],
    featured: false,
  },
] as const;

export const VAULT_PHILOSOPHY =
  "Security is not a feature you bolt on — it is the substrate everything else runs on. Every system I ship assumes hostile input, least privilege, and an audit trail.";

export const CERT_ROADMAP = [
  { year: "2024", label: "Frontend Developer — 1Stop.ai", done: true },
  { year: "2024", label: "Google Cybersecurity Professional — Coursera", done: true },
  { year: "2025", label: "Blockchain Developer — IBM", done: true },
  { year: "2026", label: "Hack Energy 2.0 Finalist — CivicShield", done: true },
  { year: "2027", label: "B.Tech CSE — VIT (expected)", done: false },
] as const;

export const SOCIALS = [
  { label: "github", href: "https://github.com/Divyansh2602" },
  {
    label: "linkedin",
    href: "https://www.linkedin.com/in/divyansh-gupta-485b04377/",
  },
  { label: "email", href: `mailto:${SITE.email}` },
] as const;
