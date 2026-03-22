"""
API для взаимодействия фронтенда с Telegram-ботом @nemax_robot.
Позволяет отправлять сообщения, регистрировать webhook и получать историю чата.
Все действия передаются через поле action в теле POST-запроса.
"""
import json
import os
import urllib.request


BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_API = f"https://api.telegram.org/bot{BOT_TOKEN}"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
    "Content-Type": "application/json"
}


def tg_request(method: str, payload: dict) -> dict:
    url = f"{TELEGRAM_API}/{method}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())


def handler(event: dict, context) -> dict:
    """Прокси-API для работы с Telegram Bot: отправка сообщений, регистрация webhook, получение информации о боте."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")

    try:
        body = json.loads(event.get("body") or "{}")
    except (json.JSONDecodeError, TypeError):
        body = {}

    action = body.get("action", "")

    # GET — информация о боте
    if method == "GET":
        result = tg_request("getMe", {})
        return {"statusCode": 200, "headers": CORS, "body": json.dumps(result)}

    # action=send — отправить сообщение через бота
    if action == "send":
        chat_id = body.get("chat_id")
        text = body.get("text", "")
        if not chat_id or not text:
            return {
                "statusCode": 400,
                "headers": CORS,
                "body": json.dumps({"error": "chat_id and text are required"})
            }
        result = tg_request("sendMessage", {
            "chat_id": chat_id,
            "text": text,
            "parse_mode": "HTML"
        })
        return {"statusCode": 200, "headers": CORS, "body": json.dumps(result)}

    # action=set-webhook — зарегистрировать webhook URL
    if action == "set-webhook":
        webhook_url = body.get("url")
        if not webhook_url:
            return {
                "statusCode": 400,
                "headers": CORS,
                "body": json.dumps({"error": "url is required"})
            }
        result = tg_request("setWebhook", {
            "url": webhook_url,
            "allowed_updates": ["message", "callback_query"]
        })
        return {"statusCode": 200, "headers": CORS, "body": json.dumps(result)}

    # action=webhook-info — статус webhook
    if action == "webhook-info":
        result = tg_request("getWebhookInfo", {})
        return {"statusCode": 200, "headers": CORS, "body": json.dumps(result)}

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({"status": "NeMAX Bot API", "actions": ["send", "set-webhook", "webhook-info"]})
    }
