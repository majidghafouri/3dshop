import nodemailer from "nodemailer";
import { getSetting } from "@/lib/settings";

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
};

async function loadSmtpConfig(): Promise<SmtpConfig | null> {
  const host = (await getSetting("smtp_host")) || process.env.SMTP_HOST;
  const port = (await getSetting("smtp_port")) || process.env.SMTP_PORT;
  if (!host || !port) return null;
  const user = (await getSetting("smtp_user")) || process.env.SMTP_USER;
  const pass = (await getSetting("smtp_pass")) || process.env.SMTP_PASS;
  const secureRaw =
    (await getSetting("smtp_secure")) || process.env.SMTP_SECURE || "";
  const from = (await getSetting("mail_from")) || process.env.MAIL_FROM || user || "noreply@figureforge.ir";
  const portNum = Number(port);
  return {
    host,
    port: portNum,
    secure: secureRaw === "true" || portNum === 465,
    user: user || undefined,
    pass: pass || undefined,
    from,
  };
}

async function loadBrevoConfig(): Promise<{ apiKey: string; from: string } | null> {
  const apiKey = (await getSetting("brevo_api_key")) || process.env.BREVO_API_KEY;
  if (!apiKey) return null;
  const from = (await getSetting("mail_from")) || process.env.MAIL_FROM || "noreply@figureforge.ir";
  return { apiKey, from };
}

async function loadResendConfig(): Promise<{ apiKey: string; from: string } | null> {
  const apiKey = (await getSetting("resend_api_key")) || process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  const from = (await getSetting("mail_from")) || process.env.MAIL_FROM || "noreply@figureforge.ir";
  return { apiKey, from };
}

export async function isEmailConfigured(): Promise<boolean> {
  return (await loadResendConfig()) !== null || (await loadBrevoConfig()) !== null || (await loadSmtpConfig()) !== null;
}

function buildOtpHtml(code: string): string {
  return `<!doctype html><html dir="rtl" lang="fa"><head><meta charset="utf-8"></head>
<body style="margin:0;background:#f1f5lb;font-family:Tahoma,Arial,sans-serif">
  <div style="max-width:480px;margin:0 auto;padding:28px">
    <div style="background:#fff;border-radius:18px;padding:32px 28px;box-shadow:0 12px 36px rgba(20,45,90,.10)">
      <div style="font-size:22px;font-weight:900;color:#0D1633">فیگرفورج</div>
      <p style="margin:18px 0 6px;font-size:15px;color:#0D1633;font-weight:700">کد تایید شما</p>
      <div style="font-size:34px;font-weight:900;letter-spacing:6px;color:#3454D1;margin:10px 0 18px;direction:ltr">${code}</div>
      <p style="margin:0;font-size:13px;color:#53647C;line-height:1.8">این کد به مدت ۵ دقیقه معتبر است. کد را با کسی به اشتراک نگذارید.</p>
    </div>
  </div>
</body></html>`;
}

function buildTestHtml(): string {
  return `<!doctype html><html dir="rtl" lang="fa"><head><meta charset="utf-8"></head>
<body style="margin:0;background:#f1f5lb;font-family:Tahoma,Arial,sans-serif">
  <div style="max-width:480px;margin:0 auto;padding:28px">
    <div style="background:#fff;border-radius:18px;padding:32px 28px;box-shadow:0 12px 36px rgba(20,45,90,.10)">
      <div style="font-size:22px;font-weight:900;color:#0D1633">فیگرفورج</div>
      <p style="margin:18px 0 0;font-size:14px;color:#53647C;line-height:1.8">ایمیل آزمایشی با موفقیت ارسال شد.</p>
    </div>
  </div>
</body></html>`;
}

async function sendViaBrevo(apiKey: string, from: string, to: string, subject: string, text: string, html: string): Promise<void> {
  const res = await fetch("https://api.brevo.com/v3/smtpEmail", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { email: from },
      to: [{ email: to }],
      subject,
      textContent: text,
      htmlContent: html,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo API error ${res.status}: ${body}`);
  }
}

function getSmtpTransporter(cfg: SmtpConfig) {
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: cfg.user && cfg.pass ? { user: cfg.user, pass: cfg.pass } : undefined,
  });
}

async function sendViaSmtp(cfg: SmtpConfig, to: string, subject: string, text: string, html: string): Promise<void> {
  const transporter = getSmtpTransporter(cfg);
  await transporter.sendMail({
    from: cfg.from,
    to,
    subject,
    text,
    html,
  });
}

async function sendViaResend(apiKey: string, from: string, to: string, subject: string, text: string, html: string): Promise<void> {
  const res = await fetch("https://api.resend.com/email", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      html,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API error ${res.status}: ${body}`);
  }
}

async function sendEmail(to: string, subject: string, text: string, html: string): Promise<void> {
  const resendCfg = await loadResendConfig();
  if (resendCfg) {
    await sendViaResend(resendCfg.apiKey, resendCfg.from, to, subject, text, html);
    return;
  }

  const brevoCfg = await loadBrevoConfig();
  if (brevoCfg) {
    await sendViaBrevo(brevoCfg.apiKey, brevoCfg.from, to, subject, text, html);
    return;
  }

  const smtpCfg = await loadSmtpConfig();
  if (smtpCfg) {
    await sendViaSmtp(smtpCfg, to, subject, text, html);
    return;
  }

  throw new Error("Email transport is not configured (set RESEND_API_KEY, BREVO_API_KEY, or smtp_host/smtp_port in admin settings or env)");
}

export async function sendOtpEmail(email: string, code: string): Promise<void> {
  await sendEmail(
    email,
    "کد تایید فیگرفورج",
    `کد تایید فیگرفورج: ${code}`,
    buildOtpHtml(code),
  );
}

export async function sendTestEmail(to: string): Promise<void> {
  await sendEmail(
    to,
    "فیگرفورج - ایمیل تست",
    "این یک ایمیل آزمایشی از فیگرفورج است.",
    buildTestHtml(),
  );
}
