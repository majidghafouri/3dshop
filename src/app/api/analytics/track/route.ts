import { NextRequest } from "next/server";
import { ok, fail, parseJson } from "@/lib/api";
import { getSessionUserFromRequest } from "@/lib/auth";
import {
  trackEvent,
  getRequestMeta,
  isAnalyticsEventType,
} from "@/lib/analytics";

export async function POST(req: NextRequest) {
  const body = parseJson<{
    type?: string;
    path?: string;
    productId?: string;
    categorySlug?: string;
    query?: string;
    sessionId?: string;
  }>(await req.text());

  if (!body || !body.type || !isAnalyticsEventType(body.type)) {
    return fail("invalid_event");
  }

  const user = await getSessionUserFromRequest(req);
  const meta = getRequestMeta(req);

  await trackEvent({
    type: body.type,
    path: body.path,
    productId: body.productId,
    categorySlug: body.categorySlug,
    query: body.query,
    sessionId: body.sessionId,
    userId: user?.id ?? null,
    ip: meta.ip,
    userAgent: meta.userAgent,
    referrer: meta.referrer,
  });

  return ok({ tracked: true }, 201);
}
