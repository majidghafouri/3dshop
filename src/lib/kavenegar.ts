import { getSetting } from "@/lib/settings";

const KAVENEGAR_TEMPLATE = "mobileverify";
// Lookup delivers the template via SMS by default; set explicitly per Kavenegar docs.
const KAVENEGAR_LOOKUP_TYPE = "sms";
// %token2 in the template (e.g. a fixed brand signature/link). Safe to pass even if the
// template only uses %token — Kavenegar ignores unused tokens.
const KAVENEGAR_TOKEN2 = process.env.KAVENEGAR_TOKEN2 ?? "@figureforge.ir";

const KAVENEGAR_SENDER_KEY = "kavenegar_sender";

export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  const match = digits.match(/^(?:98|0)?(9\d{9})$/);
  if (!match) return null;
  return `0${match[1]}`;
}

export function generateCode(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const n = buf[0] % 90000;
  return String(10000 + n);
}

type KavenegarEntry = {
  messageid?: number;
  cost?: number;
  receptor?: string;
};

type KavenegarEnvelope = {
  return?: { status: number; message: string };
  entries?: KavenegarEntry[];
};

export async function postKavenegar(
  path: string,
  params: Record<string, string>,
): Promise<void> {
  const apiKey = process.env.KAVENEGAR_API_KEY;
  if (!apiKey) throw new Error("KAVENEGAR_API_KEY is not configured");
  const res = await fetch(`https://api.kavenegar.com/v1/${apiKey}/${path}`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`kavenegar http ${res.status}: ${text}`);
  let data: KavenegarEnvelope;
  try {
    data = JSON.parse(text) as KavenegarEnvelope;
  } catch {
    throw new Error(`kavenegar invalid response: ${text}`);
  }
  const status = data.return?.status;
  if (status !== 200) {
    throw new Error(
      `kavenegar ${path} failed (${status ?? "?"}): ${data.return?.message ?? "unknown error"}`,
    );
  }
  const entry = data.entries?.[0];
  if (entry?.messageid) {
    console.log(
      `[SMS] kavenegar delivered (${path}) messageid=${entry.messageid} cost=${entry.cost ?? "?"} receptor=${entry.receptor ?? params.receptor}`,
    );
  }
}

// SERVICE channel: خط خدماتی — template-based verify/lookup.json
export async function sendOtpViaLookup(phone: string, code: string): Promise<void> {
  await postKavenegar("verify/lookup.json", {
    receptor: phone,
    token: code,
    token2: KAVENEGAR_TOKEN2,
    template: KAVENEGAR_TEMPLATE,
    type: KAVENEGAR_LOOKUP_TYPE,
  });
}

// ADVERTISE channel: خط تبلیغاتی — free-form sms/send.json
export async function sendOtpViaSend(phone: string, code: string): Promise<void> {
  const message = `کاربر گرامی فیگرفورج\nکد احراز هویت شما:\n${code}\n@figureforge.ir`;
  const params: Record<string, string> = { receptor: phone, message };
  const sender = await getSetting(KAVENEGAR_SENDER_KEY);
  if (sender) params.sender = sender;
  await postKavenegar("sms/send.json", params);
}
