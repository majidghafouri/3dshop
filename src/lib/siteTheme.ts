import prisma from "@/lib/db";
import { sanitizePalette, Palette } from "@/lib/palette";

export * from "@/lib/palette";

export async function getSiteTheme(): Promise<Palette | null> {
  try {
    const row = await prisma.siteTheme.findUnique({ where: { id: 1 } });
    if (!row) return null;
    return sanitizePalette(row.palette);
  } catch {
    return null;
  }
}
