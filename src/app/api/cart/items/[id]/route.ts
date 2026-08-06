import { NextRequest } from "next/server";
import { Locale, isLocale } from "@/lib/i18n";
import { ok, fail, parseJson } from "@/lib/api";
import { updateCartItem, removeCartItem } from "@/lib/cart";
import { getSessionUserFromRequest } from "@/lib/auth";

function localeFromPath(pathname: string): Locale {
  const m = pathname.match(/^\/(en|ar|fa)(\/|$)/);
  if (m && isLocale(m[1])) return m[1] as Locale;
  return "fa";
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const locale = localeFromPath(req.nextUrl.pathname);
  const user = await getSessionUserFromRequest(req);
  const token = req.cookies.get("cart_token")?.value ?? null;
  const body = parseJson<{ quantity?: number }>(await req.text());
  const quantity = Math.max(1, Number(body?.quantity) || 1);

  const result = await updateCartItem(
    { token, userId: user?.id ?? null },
    params.id,
    quantity,
    locale
  );
  if (result.error) return fail(result.error, 404);
  return ok({ items: result.items });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const locale = localeFromPath(req.nextUrl.pathname);
  const user = await getSessionUserFromRequest(req);
  const token = req.cookies.get("cart_token")?.value ?? null;

  const result = await removeCartItem(
    { token, userId: user?.id ?? null },
    params.id,
    locale
  );
  if (result.error) return fail(result.error, 404);
  return ok({ items: result.items });
}
