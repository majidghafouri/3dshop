import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/api";
import { sendPhoto, sendMessage } from "@/lib/telegram";
import { generateDailyPost, generateWeeklyCollection } from "@/lib/telegram-post-generator";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return fail("Unauthorized", 401);
  }

  const today = new Date();
  const dayOfWeek = today.getDay();

  if (dayOfWeek === 0) {
    const collection = await generateWeeklyCollection();
    if (collection) {
      if (collection.image) {
        await sendPhoto(collection.image, collection.text);
      } else {
        await sendMessage(collection.text);
      }
      return ok({ posted: true, type: "collection" });
    }
  }

  const post = await generateDailyPost();

  if (post.image) {
    await sendPhoto(post.image, post.text);
  } else {
    await sendMessage(post.text);
  }

  return ok({ posted: true, type: post.type });
}
