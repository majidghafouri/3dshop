import nodemailer from "nodemailer";
import { getSetting } from "@/lib/settings";

type TransportConfig = {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
};

async function loadConfig(): Promise<TransportConfig | null> {
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

export async function isSmtpConfigured(): Promise<boolean> {
  const cfg = await loadConfig();
  return cfg !== null;
}

function buildOtpHtml(code: string): string {
  return `<!doctype html><html dir="rtl" lang="fa"><head><meta charset="utf-8"></head>
<body style="margin:0;background:#f1f5fb;font-family:Tahoma,Arial,sans-serif">
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
<body style="margin:0;background:#f1f5fb;font-family:Tahoma,Arial,sans-serif">
  <div style="max-width:480px;margin:0 auto;padding:28px">
    <div style="background:#fff;border-radius:18px;padding:32px 28px;box-shadow:0 12px 36px rgba(20,45,90,.10)">
      <div style="font-size:22px;font-weight:900;color:#0D1633">فیگرفورج</div>
      <p style="margin:18px 0 0;font-size:14px;color:#53647C;line-height:1.8">ایمیل آزمایشی با موفقیت ارسال شد.</p>
    </div>
  </div>
</body></html>`;
}

async function getTransporter(cfg: TransportConfig) {
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: cfg.user && cfg.pass ? { user: cfg.user, pass: cfg.pass } : undefined,
  });
}

function assertConfig(cfg: TransportConfig | null): TransportConfig {
  if (!cfg) throw new Error("SMTP is not configured (set smtp_host/smtp_port in admin settings)");
  return cfg;
}

export async function sendOtpEmail(email: string, code: string): Promise<void> {
  const cfg = assertConfig(await loadConfig());
  const transporter = await getTransporter(cfg);
  await transporter.sendMail({
    from: cfg.from,
    to: email,
    subject: "کد تایید فیگرفورج",
    text: `کد تایید فیگرفورج: ${code}`,
    html: buildOtpHtml(code),
  });
}

export async function sendTestEmail(to: string): Promise<void> {
  const cfg = assertConfig(await loadConfig());
  const transporter = await getTransporter(cfg);
  await transporter.sendMail({
    from: cfg.from,
    to,
    subject: "فیگرفورج - ایمیل تست",
    text: "این یک ایمیل آزمایشی از فیگرفورج است.",
    html: buildTestHtml(),
  });
}
