import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson, requireAdmin } from "@/lib/api";

const STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = parseJson<{ status?: string }>(await req.text());
  if (!body) return fail("invalid_body");
  const status = body.status as (typeof STATUSES)[number];
  if (!STATUSES.includes(status)) {
    return fail("invalid_status");
  }

  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status },
  });
  return ok({ order });
}
