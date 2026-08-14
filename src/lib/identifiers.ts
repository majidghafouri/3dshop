export function normalizeEmail(raw: string): string | null {
  const e = raw.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null;
  return e;
}

export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  const match = digits.match(/^(?:98|0)?(9\d{9})$/);
  if (!match) return null;
  return `0${match[1]}`;
}

export type Identifier = { field: "email" | "phone"; value: string };

export function resolveIdentifier(raw: string): Identifier | null {
  const email = normalizeEmail(raw);
  if (email) return { field: "email", value: email };
  const phone = normalizePhone(raw);
  if (phone) return { field: "phone", value: phone };
  return null;
}

export function resolveIdentifierFromBody(body: {
  email?: string;
  phone?: string;
}): Identifier | null {
  const raw = (body?.email ?? "").trim() || (body?.phone ?? "").trim();
  return resolveIdentifier(raw);
}

export function generateCode(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const n = buf[0] % 90000;
  return String(10000 + n);
}
