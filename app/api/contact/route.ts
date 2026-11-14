import { MIN_FILL_TIME_MS, normalizeContact, validateContact } from "@/lib/contact";
import { isContactDeliveryConfigured } from "@/lib/contact-config";

/**
 * POST /api/contact
 *
 * Delivers contact form messages through Resend's free tier
 * (https://resend.com — 3,000 emails/month, no card required).
 *
 * Required server-only environment variables:
 *   RESEND_API_KEY     – API key from the Resend dashboard
 *   CONTACT_TO_EMAIL   – inbox that receives messages
 * Optional:
 *   CONTACT_FROM_EMAIL – verified sender, defaults to Resend's onboarding sender
 *
 * Without configuration it responds 503 and the client falls back to mailto.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // bound memory
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  if (!isContactDeliveryConfigured()) {
    return Response.json(
      { ok: false, code: "not_configured", message: "Email delivery is not configured." },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, code: "bad_request", message: "Invalid request." }, { status: 400 });
  }

  // Spam protection 1: honeypot field must stay empty. Pretend success to bots.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  // Spam protection 2: reject submissions faster than a human can type.
  const startedAt = Number(body.startedAt);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_TIME_MS) {
    return Response.json(
      { ok: false, code: "too_fast", message: "Please take a moment before sending." },
      { status: 400 },
    );
  }

  // Spam protection 3: per-IP rate limit.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json(
      { ok: false, code: "rate_limited", message: "Too many messages. Please try again later." },
      { status: 429 },
    );
  }

  const input = normalizeContact(body);
  const errors = validateContact(input);
  if (Object.keys(errors).length) {
    return Response.json({ ok: false, code: "invalid", errors }, { status: 422 });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: input.email,
        subject: `[Portfolio] ${input.subject}`,
        text: `Name: ${input.name}\nEmail: ${input.email}\n\n${input.message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
  } catch (error) {
    console.error("[contact] delivery failed:", error);
    return Response.json(
      { ok: false, code: "delivery_failed", message: "Your message couldn't be sent right now." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
