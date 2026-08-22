import { NextRequest, NextResponse } from "next/server";
import { unsubscribeByToken } from "@/lib/newsletter";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  await unsubscribeByToken(token);

  // Always show a friendly confirmation; don't leak token validity.
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;font-family:Tahoma,Arial,sans-serif;background:#f4f7fc">
  <div style="max-width:420px;margin:60px auto;padding:32px;background:#fff;border-radius:18px;text-align:center;box-shadow:0 12px 36px rgba(20,45,90,.10)">
    <div style="font-size:40px">✅</div>
    <h1 style="font-size:18px;color:#0D1633;margin:12px 0 6px">اشتراک شما لغو شد</h1>
    <p style="font-size:13px;color:#53647C;margin:0 0 18px;line-height:1.9">Your newsletter subscription has been cancelled.</p>
    <a href="/" style="display:inline-block;background:#3454D1;color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:10px 20px;border-radius:12px">figureforge.ir</a>
  </div>
</body></html>`;
  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
