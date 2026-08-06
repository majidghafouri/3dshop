import { NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { NextRequest } from "next/server";

export function ok(data: unknown, init?: number) {
  return NextResponse.json({ ok: true, data }, { status: init ?? 200 });
}

export function fail(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

export function parseJson<T>(body: string): T | null {
  try {
    return JSON.parse(body) as T;
  } catch {
    return null;
  }
}

export async function requireAdmin(req: NextRequest) {
  const user = await getSessionUserFromRequest(req);
  if (!user || user.role !== "ADMIN") {
    return { error: fail("Unauthorized", 401), user: null };
  }
  return { error: null, user };
}

export function getCartToken(req: NextRequest): string {
  const token = req.cookies.get("cart_token")?.value;
  if (token) return token;
  return crypto.randomUUID();
}
