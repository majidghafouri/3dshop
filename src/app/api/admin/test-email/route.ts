import { NextRequest } from "next/server";
import { ok, fail, parseJson, requireAdmin } from "@/lib/api";
import { sendTestEmail } from "@/lib/email";
import { getSetting } from "@/lib/settings";

function normalizeEmail(raw: string): string | null {
  const e = (raw ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null;
  return e;
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = parseJson<{ to?: string }>(await req.text());
  const requested = normalizeEmail(body?.to ?? "");
  const fallbackFrom = normalizeEmail((await getSetting("mail_from")) ?? "") ?? null;
  const target = requested ?? fallbackFrom;
  if (!target) return fail("invalid_email");

  try {
    await sendTestEmail(target);
    return ok({ sent: true, to: target });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "unknown error";
    return fail("send_failed", 400, { detail });
  }
}