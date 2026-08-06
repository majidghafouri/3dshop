import { NextRequest } from "next/server";
import { ok } from "@/lib/api";
import { getSessionUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getSessionUserFromRequest(req);
  return ok(
    user
      ? { id: user.id, phone: user.phone, role: user.role, name: user.name }
      : null
  );
}
