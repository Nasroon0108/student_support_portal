import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    await transporter.sendMail({
      from: `"Campus Companion" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

export function ticketCreatedEmail(ticketTitle: string, ticketId: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4f46e5;">🎓 Campus Companion</h2>
      <p>Your ticket has been submitted successfully.</p>
      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <strong>${ticketTitle}</strong>
        <p style="color: #64748b; margin: 8px 0 0;">Ticket ID: ${ticketId}</p>
      </div>
      <p>We'll notify you when there's an update on your ticket.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/tickets/${ticketId}" 
         style="background: #4f46e5; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; display: inline-block;">
        View Ticket
      </a>
    </div>
  `;
}

export function ticketUpdatedEmail(ticketTitle: string, ticketId: string, newStatus: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4f46e5;">🎓 Campus Companion</h2>
      <p>Your ticket has been updated.</p>
      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <strong>${ticketTitle}</strong>
        <p style="color: #64748b; margin: 8px 0 0;">New Status: <strong>${newStatus}</strong></p>
      </div>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/tickets/${ticketId}" 
         style="background: #4f46e5; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; display: inline-block;">
        View Ticket
      </a>
    </div>
  `;
}
