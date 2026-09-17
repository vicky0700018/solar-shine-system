import nodemailer from "nodemailer";

function cleanEnv(val: string | undefined): string {
  if (!val) return "";
  return val.trim().replace(/^['"]|['"]$/g, "");
}

const host = cleanEnv(process.env.EMAIL_HOST) || "smtp.gmail.com";
const port = parseInt(cleanEnv(process.env.EMAIL_PORT) || "587", 10);
const user = cleanEnv(process.env.EMAIL_HOST_USER);
const pass = cleanEnv(process.env.EMAIL_HOST_PASSWORD);
const fromEmail = cleanEnv(process.env.DEFAULT_FROM_EMAIL) || user;

let transporter: nodemailer.Transporter | null = null;

if (user && pass) {
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export type LeadPayload = {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  date?: string;
};

export async function sendLeadNotificationEmail(lead: LeadPayload): Promise<boolean> {
  if (!transporter) {
    console.warn("SMTP Transporter not configured, skipping email notification.");
    return false;
  }

  const mailOptions = {
    from: `"Sartaj Solar Water System" <${fromEmail}>`,
    to: fromEmail,
    subject: `🔔 New Lead Received: ${lead.name} (${lead.service})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">New Customer Enquiry</h2>
        <p style="color: #475569; font-size: 14px;">A new lead has been submitted through the Sartaj Solar Water System website:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: bold; color: #1e293b; width: 120px;">Name:</td>
            <td style="padding: 8px 0; color: #334155;">${lead.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">Phone:</td>
            <td style="padding: 8px 0; color: #334155;"><a href="tel:${lead.phone}" style="color: #0f4c81; font-weight: 600;">${lead.phone}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">Email:</td>
            <td style="padding: 8px 0; color: #334155;"><a href="mailto:${lead.email}" style="color: #0f4c81;">${lead.email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">Service:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 600;">${lead.service}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #1e293b; vertical-align: top;">Message:</td>
            <td style="padding: 8px 0; color: #334155; background-color: #f8fafc; padding: 10px; border-radius: 6px;">${lead.message || "No message provided."}</td>
          </tr>
        </table>
        <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">You can manage and update this lead in the Admin Panel.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("Failed to send admin notification email:", err);
    return false;
  }
}

export async function sendCustomerConfirmationEmail(lead: LeadPayload): Promise<boolean> {
  if (!transporter || !lead.email) {
    return false;
  }

  const mailOptions = {
    from: `"Sartaj Solar Water System" <${fromEmail}>`,
    to: lead.email,
    subject: `Thank you for contacting Sartaj Solar Water System!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">Thank You, ${lead.name}!</h2>
        <p style="color: #334155; font-size: 15px; line-height: 1.5;">
          We have received your enquiry for <strong>${lead.service}</strong>.
        </p>
        <p style="color: #475569; font-size: 14px; line-height: 1.5;">
          Our solar heating specialists will review your requirements and get back to you with the recommended system sizing and quotation shortly.
        </p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0; font-weight: bold; color: #0f172a;">Your Enquiry Details:</p>
          <p style="margin: 4px 0; font-size: 13px; color: #475569;"><strong>Service:</strong> ${lead.service}</p>
          <p style="margin: 4px 0; font-size: 13px; color: #475569;"><strong>Phone:</strong> ${lead.phone}</p>
          <p style="margin: 4px 0; font-size: 13px; color: #475569;"><strong>Message:</strong> ${lead.message}</p>
        </div>
        <p style="color: #64748b; font-size: 13px;">
          For urgent queries, you can reach us directly at <strong>08446614927</strong>.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
          Sartaj Solar Water System • Blue Cross Road, Mundhwa, Pune
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("Failed to send customer confirmation email:", err);
    return false;
  }
}
