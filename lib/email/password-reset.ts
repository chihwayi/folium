import { getResendClient } from "./resend";

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const from = process.env.RESEND_FROM_EMAIL ?? "Folium <no-reply@example.com>";
  await getResendClient().emails.send({
    to,
    from,
    subject: "Reset your Folium password",
    html: `
      <p>Someone requested a password reset for this Folium account.</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>If you didn't request this, you can safely ignore this email — the link expires in 1 hour.</p>
    `,
  });
}
