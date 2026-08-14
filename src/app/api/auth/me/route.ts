import { NextRequest } from "next/server";
import { ok } from "@/lib/api";
import { getSessionUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getSessionUserFromRequest(req);
  return ok(
    user
      ? {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
          role: user.role,
        }
      : null
  );
}
