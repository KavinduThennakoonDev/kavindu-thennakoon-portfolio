"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import {
  CONTACT_LIMITS,
  MIN_FILL_TIME_MS,
  buildMailto,
  normalizeContact,
  validateContact,
  type ContactErrors,
  type ContactInput,
} from "@/lib/contact";
import { cn } from "@/lib/utils";

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent" }
  | { state: "error"; message: string; mailto?: string };

const fields: Array<{
  name: keyof ContactInput;
  label: string;
  type?: string;
  autoComplete?: string;
  textarea?: boolean;
  span?: boolean;
}> = [
  { name: "name", label: "Name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "subject", label: "Subject", span: true },
  { name: "message", label: "Message", textarea: true, span: true },
];

/**
 * Contact form.
 * - `deliveryEnabled` (server-detected): POSTs to /api/contact (Resend).
 * - Otherwise it validates and opens the visitor's email app with a prefilled
 *   message (mailto) — it never pretends a message was sent.
 */
export function ContactForm({ email, deliveryEnabled }: { email: string; deliveryEnabled: boolean }) {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const startedAt = useRef<number>(0);

  const markStarted = () => {
    if (!startedAt.current) startedAt.current = Date.now();
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const input = normalizeContact(Object.fromEntries(data) as Record<string, string>);
    const found = validateContact(input);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    // Honeypot filled → silently ignore (bots).
    if (String(data.get("website") ?? "").trim()) {
      setStatus({ state: "sent" });
      return;
    }

    if (!deliveryEnabled) {
      window.location.href = buildMailto(email, input);
      return;
    }

    if (Date.now() - startedAt.current < MIN_FILL_TIME_MS) {
      setStatus({ state: "error", message: "That was quick! Please take a moment and try again." });
      return;
    }

    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, website: "", startedAt: startedAt.current }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        errors?: ContactErrors;
      };
      if (res.ok && json.ok) {
        setStatus({ state: "sent" });
        form.reset();
        startedAt.current = 0;
        return;
      }
      if (json.errors) setErrors(json.errors);
      setStatus({
        state: "error",
        message: json.message ?? "Something went wrong. You can email me directly instead.",
        mailto: buildMailto(email, input),
      });
    } catch {
      setStatus({
        state: "error",
        message: "Network error. You can email me directly instead.",
        mailto: buildMailto(email, input),
      });
    }
  }

  if (status.state === "sent") {
    return (
      <div className="flex min-h-[420px] flex-col items-start justify-center rounded-3xl border border-line-strong bg-bg-2/70 p-8 sm:p-10" role="status">
        <CheckCircle2 className="size-8 text-accent-2" aria-hidden />
        <p className="mt-6 font-display text-3xl font-medium tracking-tight">Message sent.</p>
        <p className="mt-3 max-w-sm text-muted">Thanks for reaching out — I&apos;ll get back to you as soon as I can.</p>
        <button
          type="button"
          onClick={() => setStatus({ state: "idle" })}
          className="mt-8 h-10 rounded-full border border-line-strong px-5 text-sm hover:border-fg/40"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      onFocus={markStarted}
      className="relative rounded-3xl border border-line-strong bg-bg-2/70 p-6 sm:p-8"
      aria-describedby="contact-form-note"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((f) => {
          const err = errors[f.name];
          const id = `contact-${f.name}`;
          const common = {
            id,
            name: f.name,
            "aria-invalid": err ? true : undefined,
            "aria-describedby": err ? `${id}-error` : undefined,
            maxLength: CONTACT_LIMITS[f.name].max,
            className: cn(
              "peer w-full rounded-xl border bg-bg/60 px-4 text-[15px] text-fg placeholder:text-subtle transition-colors focus:outline-none",
              err ? "border-red-400/60 focus:border-red-400" : "border-line-strong hover:border-fg/25 focus:border-accent-2",
            ),
            onInput: () => err && setErrors((prev) => ({ ...prev, [f.name]: undefined })),
          };
          return (
            <div key={f.name} className={cn(f.span && "sm:col-span-2")}>
              <label htmlFor={id} className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted">
                {f.label}
              </label>
              {f.textarea ? (
                <textarea {...common} rows={6} className={cn(common.className, "resize-y py-3")} placeholder="Tell me about your project or opportunity…" />
              ) : (
                <input {...common} type={f.type ?? "text"} autoComplete={f.autoComplete} className={cn(common.className, "h-12")} />
              )}
              {err && (
                <p id={`${id}-error`} className="mt-2 text-xs text-red-300">
                  {err}
                </p>
              )}
            </div>
          );
        })}

        {/* Honeypot — hidden from people and assistive tech, attractive to bots. */}
        <div aria-hidden className="absolute -left-[10000px] h-px w-px overflow-hidden">
          <label htmlFor="contact-website">Website</label>
          <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {status.state === "error" && (
        <div role="alert" className="mt-5 rounded-xl border border-red-400/25 bg-red-400/5 px-4 py-3 text-sm text-red-200">
          {status.message}{" "}
          {status.mailto && (
            <a href={status.mailto} className="underline underline-offset-4 hover:text-white">
              Open in your email app
            </a>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="contact-form-note" className="text-xs leading-relaxed text-subtle">
          {deliveryEnabled
            ? "Your message is sent directly to my inbox."
            : "Opens your email app with your message ready to send."}
        </p>
        <button
          type="submit"
          disabled={status.state === "sending"}
          className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-fg px-6 text-sm font-medium text-bg transition-[box-shadow,opacity] duration-300 hover:shadow-[0_0_0_6px_rgb(99_102_241/0.2)] disabled:opacity-60"
        >
          {status.state === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Sending…
            </>
          ) : deliveryEnabled ? (
            <>
              Send message
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </>
          ) : (
            <>
              <Mail className="size-4" aria-hidden />
              Compose email
            </>
          )}
        </button>
      </div>
    </form>
  );
}
