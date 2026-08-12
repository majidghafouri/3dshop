import { NextRequest } from "next/server";
import prisma from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    select: { coverSvg: true, coverImage: true },
  });
  const svg = post?.coverSvg;
  if (!svg) {
    if (post?.coverImage?.startsWith("/api/blog/cover/")) {
      return new Response("Not Found", { status: 404 });
    }
    return new Response("Not Found", { status: 404 });
  }
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
