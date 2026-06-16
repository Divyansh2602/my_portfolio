import Anthropic from "@anthropic-ai/sdk";
import {
  SITE,
  PROJECTS,
  EXPERIENCE,
  SKILL_CARDS,
  STATS,
  CERT_ROADMAP,
  VAULT_PHILOSOPHY,
} from "@/lib/content";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// In-memory rate limit for chat: 30 messages per 60 s per IP.
const chatHits = new Map<string, number[]>();
function isChatLimited(ip: string): boolean {
  const now = Date.now();
  const window = 60_000;
  const max = 30;
  const recent = (chatHits.get(ip) ?? []).filter((t) => now - t < window);
  recent.push(now);
  chatHits.set(ip, recent);
  return recent.length > max;
}

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
  if (isChatLimited(ip)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
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

  const stream = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: buildSystem(),
    messages: history,
    stream: true,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
