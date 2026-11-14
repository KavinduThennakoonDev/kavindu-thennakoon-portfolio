/** Contact form validation shared by the client form and the API route. */

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export const CONTACT_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  subject: { min: 3, max: 120 },
  message: { min: 10, max: 5000 },
} as const;

/** Minimum time (ms) a human needs to fill the form — faster submissions are bots. */
export const MIN_FILL_TIME_MS = 3000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeContact(raw: Partial<Record<keyof ContactInput, unknown>>): ContactInput {
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  return {
    name: str(raw.name).trim().replace(/\s+/g, " "),
    email: str(raw.email).trim().toLowerCase(),
    // Single line only — prevents header injection in the email subject.
    subject: str(raw.subject).trim().replace(/[\r\n]+/g, " "),
    message: str(raw.message).trim(),
  };
}

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  const { name, email, subject, message } = input;
  const L = CONTACT_LIMITS;

  if (name.length < L.name.min) errors.name = "Please enter your name.";
  else if (name.length > L.name.max) errors.name = `Name must be under ${L.name.max} characters.`;

  if (!email) errors.email = "Please enter your email address.";
  else if (email.length > L.email.max || !EMAIL_RE.test(email))
    errors.email = "Please enter a valid email address.";

  if (subject.length < L.subject.min) errors.subject = "Please add a short subject.";
  else if (subject.length > L.subject.max)
    errors.subject = `Subject must be under ${L.subject.max} characters.`;

  if (message.length < L.message.min)
    errors.message = `Message should be at least ${L.message.min} characters.`;
  else if (message.length > L.message.max)
    errors.message = `Message must be under ${L.message.max} characters.`;
  else if ((message.match(/https?:\/\//gi) ?? []).length > 3)
    errors.message = "Please include no more than 3 links.";

  return errors;
}

export function buildMailto(to: string, input: ContactInput) {
  const body = `${input.message}\n\n— ${input.name}${input.email ? ` (${input.email})` : ""}`;
  return `mailto:${to}?subject=${encodeURIComponent(input.subject)}&body=${encodeURIComponent(body)}`;
}
