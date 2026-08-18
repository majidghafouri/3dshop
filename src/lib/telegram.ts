const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

function getBaseUrl() {
  if (!BOT_TOKEN) throw new Error("TELEGRAM_BOT_TOKEN is not set");
  return `https://api.telegram.org/bot${BOT_TOKEN}`;
}

export async function sendMessage(text: string, replyMarkup?: Record<string, unknown>) {
  const body: Record<string, unknown> = {
    chat_id: CHANNEL_ID,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: false,
  };
  if (replyMarkup) body.reply_markup = replyMarkup;

  const res = await fetch(`${getBaseUrl()}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function sendPhoto(
  photo: string,
  caption: string,
  replyMarkup?: Record<string, unknown>,
) {
  const body: Record<string, unknown> = {
    chat_id: CHANNEL_ID,
    photo,
    caption,
    parse_mode: "HTML",
  };
  if (replyMarkup) body.reply_markup = replyMarkup;

  const res = await fetch(`${getBaseUrl()}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function sendMediaGroup(
  media: Array<{ type: string; media: string; caption?: string; parse_mode?: string }>,
) {
  const body = {
    chat_id: CHANNEL_ID,
    media,
  };

  const res = await fetch(`${getBaseUrl()}/sendMediaGroup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function getBotInfo() {
  const res = await fetch(`${getBaseUrl()}/getMe`);
  return res.json();
}
