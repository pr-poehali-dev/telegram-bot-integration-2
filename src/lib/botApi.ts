const BOT_API_URL = "https://functions.poehali.dev/745d0f9a-48b0-44d3-95cf-52765df1ba71";
const WEBHOOK_URL = "https://functions.poehali.dev/6a75bfd7-e4fa-4ae7-b206-57dabf696f6a";

export async function getBotInfo() {
  const res = await fetch(BOT_API_URL);
  return res.json();
}

export async function sendBotMessage(chatId: number, text: string) {
  const res = await fetch(BOT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "send", chat_id: chatId, text }),
  });
  return res.json();
}

export async function registerWebhook() {
  const res = await fetch(BOT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "set-webhook", url: WEBHOOK_URL }),
  });
  return res.json();
}

export async function getWebhookInfo() {
  const res = await fetch(BOT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "webhook-info" }),
  });
  return res.json();
}
