import { getResendClient } from "./resend";

export async function sendStaffInviteEmail(to: string, role: "staff" | "owner", acceptUrl: string) {
  const from = process.env.RESEND_FROM_EMAIL ?? "Folium <no-reply@example.com>";
  await getResendClient().emails.send({
    to,
    from,
    subject: "You've been invited to Folium's back office",
    html: `
      <p>You've been invited to join Folium's back office as ${role}.</p>
      <p><a href="${acceptUrl}">Accept the invitation</a></p>
      <p>If you weren't expecting this, you can safely ignore this email — the invitation expires in 7 days.</p>
    `,
  });
}
