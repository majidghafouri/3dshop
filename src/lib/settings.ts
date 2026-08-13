import prisma from "@/lib/db";

/**
 * Read a single Setting value by key. Returns null when not configured.
 */
export async function getSetting(key: string): Promise<string | null> {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row?.value ?? null;
}
