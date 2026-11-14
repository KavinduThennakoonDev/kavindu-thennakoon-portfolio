/** Server-only: true when the contact form can deliver email via Resend. */
export function isContactDeliveryConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);
}
