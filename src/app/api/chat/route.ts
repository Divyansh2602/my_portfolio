import Groq from "groq-sdk";
import {
  SITE,
  PROJECTS,
  EXPERIENCE,
  SKILL_CARDS,
  STATS,
  CERT_ROADMAP,
  VAULT_PHILOSOPHY,
} from "@/lib/content";

// Lazy — don't instantiate at module load (build fails if key is absent).
let _groq: Groq | null = null;
function getGroq(): Groq {
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return _groq;
}

// ---------------------------------------------------------------------------
// Rate limiter — two windows per IP: 10 msgs/min + 50 msgs/hour.
// Map entries are pruned every 5 min to prevent unbounded memory growth.
// ---------------------------------------------------------------------------
const MIN_WINDOW = 60_000;
const HOUR_WINDOW = 3_600_000;
const MIN_MAX = 10;
const HOUR_MAX = 50;

const hits = new Map<string, number[]>();

setInterval(() => {
  const cutoff = Date.now() - HOUR_WINDOW;
  for (const [ip, times] of hits) {
    const pruned = times.filter((t) => t > cutoff);
    if (pruned.length === 0) hits.delete(ip);
    else hits.set(ip, pruned);
  }
}, 300_000).unref();

interface RateResult {
  limited: boolean;
  remainingMin: number;
  retryAfter: number; // seconds until the oldest minute-window hit expires
}

function checkRate(ip: string): RateResult {
  const now = Date.now();
  const all = (hits.get(ip) ?? []).filter((t) => now - t < HOUR_WINDOW);
  const perMin = all.filter((t) => now - t < MIN_WINDOW);

  const hourLimited = all.length >= HOUR_MAX;
  const minLimited = perMin.length >= MIN_MAX;
  const limited = hourLimited || minLimited;

  if (!limited) {
    all.push(now);
    hits.set(ip, all);
  }

  const remainingMin = Math.max(0, MIN_MAX - perMin.length - (limited ? 0 : 1));
  const oldest = perMin[0] ?? now;
  const retryAfter = limited
    ? Math.ceil((oldest + MIN_WINDOW - now) / 1000)
    : 0;

  return { limited, remainingMin, retryAfter };
}

// ---------------------------------------------------------------------------
// Keep-warm ping — Vercel Cron hits GET /api/chat every 5 min.
// No Groq call; just proves the function is alive.
// ---------------------------------------------------------------------------
export async function GET(): Promise<Response> {
  return Response.json({ ok: true, ts: Date.now() });
}

// ---------------------------------------------------------------------------

function buildSystem(): string {
  return `You are Divyansh Gupta — a ${SITE.roles.join(", ")} — chatting with visitors on your portfolio site. Speak in first person as yourself. Be direct, technical, and enthusiastic without being over-the-top. Keep replies to 2–3 sentences unless the visitor explicitly asks for more detail. Never fabricate information beyond what is listed below.

IDENTITY
Email: ${SITE.email}
Status: ${SITE.status} — open to internships, security work, and ambitious builds
Alias: ${SITE.alias}
Education: B.Tech CSE at VIT, graduating 2027

PHILOSOPHY
"${VAULT_PHILOSOPHY}"

STATS
${STATS.map((s) => `${s.value}${s.suffix} ${s.label}`).join(" · ")}

EXPERIENCE
${EXPERIENCE.map(
  (e) =>
    `${e.role} @ ${e.org} (${e.period})\n${e.points.map((p) => "• " + p).join("\n")}`
).join("\n\n")}

PROJECTS
${PROJECTS.map(
  (p) =>
    `${p.title} — ${p.tagline}\n${p.description}\nStack: ${p.stack.join(", ")}${p.links.live ? "\nLive: " + p.links.live : ""}${p.links.repo ? "\nRepo: " + p.links.repo : ""}`
).join("\n\n")}

SKILLS
${SKILL_CARDS.map((c) => `${c.title}: ${c.items.join(", ")}`).join("\n")}

CERTS & MILESTONES
${CERT_ROADMAP.map((c) => `${c.year}: ${c.label}`).join("\n")}

PERSONALITY & TONE
- Passionate about web security, smart-contract auditing, and cryptography
- Hackathon finalist (Hack Energy 2.0 with CivicShield AI)
- Built CipherMind — end-to-end AES-256-GCM encrypted AI chat
- Mentored 150+ students at VIT Blockchain Club
- Currently building an AI HR platform backend at XtraGrad
- Don't over-explain — trust that visitors are smart
- If asked about hiring or availability: you are open to work, share your email
- If someone types "sudo hire me": respond with something memorable and in-character`;
}

export async function POST(req: Request): Promise<Response> {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { limited, remainingMin, retryAfter } = checkRate(ip);

  const rateLimitHeaders = {
    "X-RateLimit-Limit-Minute": String(MIN_MAX),
    "X-RateLimit-Remaining-Minute": String(remainingMin),
  };

  if (limited) {
    return Response.json(
      { error: "rate_limited" },
      {
        status: 429,
        headers: { ...rateLimitHeaders, "Retry-After": String(retryAfter) },
      }
    );
  }

  if (!process.env.GROQ_API_KEY) {
    return Response.json({ error: "no_key" }, { status: 503 });
  }

  let messages: { role: "user" | "assistant"; content: string }[];
  try {
    ({ messages } = await req.json());
    if (!Array.isArray(messages)) throw new Error();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  // Cap history to last 20 turns to keep prompt tokens bounded.
  const history = messages.slice(-20);

  const stream = await getGroq().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 512,
    messages: [{ role: "system", content: buildSystem() }, ...history],
    stream: true,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(text));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      ...rateLimitHeaders,
    },
  });
}
