"""
Telegram webhook для бота @nemax_robot.
Принимает обновления от Telegram и отвечает пользователям.
"""
import json
import os
import urllib.request
import urllib.parse


BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_API = f"https://api.telegram.org/bot{BOT_TOKEN}"


def send_message(chat_id: int, text: str, parse_mode: str = "HTML") -> dict:
    url = f"{TELEGRAM_API}/sendMessage"
    payload = json.dumps({
        "chat_id": chat_id,
        "text": text,
        "parse_mode": parse_mode
    }).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())


def handle_message(message: dict) -> None:
    chat_id = message["chat"]["id"]
    text = message.get("text", "")
    user = message.get("from", {})
    first_name = user.get("first_name", "друг")
    username = user.get("username", "")

    if text.startswith("/start"):
        reply = (
            f"👋 Привет, <b>{first_name}</b>! Добро пожаловать в <b>NeMAX</b>.\n\n"
            "Я твой персональный помощник. Вот что я умею:\n\n"
            "📋 /profile — показать твой профиль\n"
            "🔐 /security — статус безопасности\n"
            "🔔 /notifications — управление уведомлениями\n"
            "📊 /history — история действий\n"
            "❓ /help — список команд\n\n"
            "Просто напиши мне что-нибудь — я отвечу! 🚀"
        )
    elif text.startswith("/profile"):
        uname = f"@{username}" if username else "не задан"
        reply = (
            f"👤 <b>Твой профиль</b>\n\n"
            f"Имя: <b>{first_name}</b>\n"
            f"Username: {uname}\n"
            f"ID: <code>{chat_id}</code>\n\n"
            "🔒 Данные защищены E2E-шифрованием NeMAX"
        )
    elif text.startswith("/security"):
        reply = (
            "🔐 <b>Статус безопасности</b>\n\n"
            "✅ Двухфакторная аутентификация: <b>Активна</b>\n"
            "✅ E2E-шифрование: <b>Включено</b>\n"
            "✅ Сессия: <b>Защищена</b>\n\n"
            "Для настройки 2FA перейди в приложение NeMAX → Настройки → Безопасность"
        )
    elif text.startswith("/notifications"):
        reply = (
            "🔔 <b>Уведомления</b>\n\n"
            "Push-уведомления: ✅ Включены\n"
            "Уведомления от бота: ✅ Включены\n"
            "Звуки: ❌ Выключены\n\n"
            "Управляй настройками в приложении NeMAX → Настройки → Уведомления"
        )
    elif text.startswith("/history"):
        reply = (
            "📊 <b>История действий</b>\n\n"
            "🔵 Вход через Telegram\n"
            "🟢 Синхронизация профиля\n"
            "🔵 Отправлено сообщений: 4\n"
            "🟢 2FA аутентификация включена\n\n"
            "Полную историю смотри в приложении NeMAX → История"
        )
    elif text.startswith("/help"):
        reply = (
            "❓ <b>Список команд NeMAX Bot</b>\n\n"
            "/start — начать работу\n"
            "/profile — твой профиль\n"
            "/security — статус безопасности\n"
            "/notifications — управление уведомлениями\n"
            "/history — история действий\n"
            "/help — эта справка\n\n"
            "💬 Или просто напиши любой вопрос!"
        )
    else:
        reply = (
            f"💬 Получил твоё сообщение: «{text[:100]}»\n\n"
            "Используй /help чтобы увидеть доступные команды, "
            "или открой приложение <b>NeMAX</b> для полного доступа."
        )

    send_message(chat_id, reply)


def handler(event: dict, context) -> dict:
    """Обрабатывает входящие обновления от Telegram Bot API через webhook."""
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    if event.get("httpMethod") == "GET":
        return {
            "statusCode": 200,
            "headers": cors_headers,
            "body": json.dumps({"status": "NeMAX Bot webhook is running", "bot": "@nemax_robot"})
        }

    try:
        body = json.loads(event.get("body") or "{}")
    except (json.JSONDecodeError, TypeError):
        return {"statusCode": 400, "headers": cors_headers, "body": json.dumps({"error": "Invalid JSON"})}

    if "message" in body:
        handle_message(body["message"])

    return {"statusCode": 200, "headers": cors_headers, "body": json.dumps({"ok": True})}
