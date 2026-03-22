import { useState } from "react";
import Icon from "@/components/ui/icon";

type Screen = "login" | "chats" | "chat" | "profile" | "notifications" | "settings" | "history" | "help";

interface Message {
  id: number;
  text: string;
  out: boolean;
  time: string;
  status?: "sent" | "read";
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  bot?: boolean;
}

interface HistoryItem {
  id: number;
  action: string;
  time: string;
  icon: string;
  color: string;
}

interface Notification {
  id: number;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: string;
}

const CHATS: Chat[] = [
  { id: 1, name: "NeMAX Bot", avatar: "🤖", lastMessage: "Добро пожаловать в NeMAX!", time: "12:41", unread: 1, online: true, bot: true },
  { id: 2, name: "Алексей Петров", avatar: "А", lastMessage: "Окей, увидимся завтра", time: "11:20", unread: 0, online: true },
  { id: 3, name: "Маркетинг", avatar: "📣", lastMessage: "Новая кампания запущена", time: "10:05", unread: 3, online: false },
  { id: 4, name: "Мария Соколова", avatar: "М", lastMessage: "Спасибо за помощь!", time: "Вчера", unread: 0, online: false },
  { id: 5, name: "Команда NeMAX", avatar: "⚡", lastMessage: "Релиз версии 2.0 скоро", time: "Вчера", unread: 0, online: false },
];

const INITIAL_MESSAGES: Message[] = [
  { id: 1, text: "Привет! Я NeMAX Bot — твой персональный помощник 🚀", out: false, time: "12:40" },
  { id: 2, text: "Привет! Как мне настроить уведомления?", out: true, time: "12:41", status: "read" },
  { id: 3, text: "Зайди в Настройки → Уведомления. Там можно включить пуши от бота и системные алерты.", out: false, time: "12:41" },
  { id: 4, text: "Понял, спасибо! А двухфакторка где?", out: true, time: "12:42", status: "read" },
  { id: 5, text: "Настройки → Безопасность → 2FA. Поддерживаем Google Authenticator и SMS ✅", out: false, time: "12:42" },
];

const NOTIFICATIONS_DATA: Notification[] = [
  { id: 1, title: "NeMAX Bot", body: "Новое сообщение от команды NeMAX", time: "12:41", read: false, icon: "🤖" },
  { id: 2, title: "Безопасность", body: "Выполнен вход с нового устройства", time: "11:30", read: false, icon: "🔐" },
  { id: 3, title: "Синхронизация", body: "Данные успешно синхронизированы", time: "10:15", read: true, icon: "🔄" },
  { id: 4, title: "Маркетинг", body: "Алексей Петров упомянул вас", time: "09:00", read: true, icon: "📣" },
  { id: 5, title: "Обновление", body: "NeMAX обновлён до версии 1.2.0", time: "Вчера", read: true, icon: "⬆️" },
];

const HISTORY: HistoryItem[] = [
  { id: 1, action: "Вход через Telegram", time: "Сегодня, 12:38", icon: "LogIn", color: "#2AABEE" },
  { id: 2, action: "Синхронизация профиля", time: "Сегодня, 12:39", icon: "RefreshCw", color: "#4caf76" },
  { id: 3, action: "Отправлено 4 сообщения", time: "Сегодня, 12:42", icon: "MessageCircle", color: "#2AABEE" },
  { id: 4, action: "Включена 2FA аутентификация", time: "Вчера, 18:10", icon: "Shield", color: "#4caf76" },
  { id: 5, action: "Изменены настройки уведомлений", time: "Вчера, 17:45", icon: "Bell", color: "#f59e0b" },
  { id: 6, action: "Экспорт данных выполнен", time: "22 марта, 14:00", icon: "Download", color: "#a855f7" },
];

const SETTINGS_GROUPS = [
  {
    title: "Аккаунт",
    items: [
      { icon: "User", label: "Профиль Telegram", value: "@nemax_user", toggle: undefined },
      { icon: "Phone", label: "Номер телефона", value: "+7 ••• ••• 42", toggle: undefined },
      { icon: "Lock", label: "Пароль", value: "Изменить", toggle: undefined },
    ]
  },
  {
    title: "Безопасность",
    items: [
      { icon: "Shield", label: "2FA аутентификация", value: "", toggle: "2fa" },
      { icon: "Key", label: "Шифрование данных", value: "", toggle: "encrypt" },
      { icon: "Eye", label: "Скрыть номер телефона", value: "", toggle: "hidePhone" },
    ]
  },
  {
    title: "Синхронизация",
    items: [
      { icon: "RefreshCw", label: "Автосинхронизация", value: "", toggle: "autoSync" },
      { icon: "Cloud", label: "Резервное копирование", value: "Ежедневно", toggle: undefined },
      { icon: "Download", label: "Экспорт данных", value: ">", toggle: undefined },
    ]
  },
  {
    title: "Уведомления",
    items: [
      { icon: "Bell", label: "Push-уведомления", value: "", toggle: "pushNotif" },
      { icon: "MessageSquare", label: "Уведомления от бота", value: "", toggle: "botNotif" },
      { icon: "Volume2", label: "Звуки", value: "", toggle: "sound" },
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Screen>("chats");
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    "2fa": true, "encrypt": true, "hidePhone": false,
    "autoSync": true, "pushNotif": true, "botNotif": true, "sound": false
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginStep, setLoginStep] = useState<"phone" | "code" | "done">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [notifs, setNotifs] = useState<Notification[]>(NOTIFICATIONS_DATA);

  const unreadNotifs = notifs.filter(n => !n.read).length;
  const unreadChats = CHATS.reduce((a, c) => a + c.unread, 0);

  function sendMessage() {
    if (!messageText.trim()) return;
    const now = new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
    const newMsg: Message = { id: Date.now(), text: messageText, out: true, time: now, status: "sent" };
    setMessages(prev => [...prev, newMsg]);
    setMessageText("");
    setTimeout(() => {
      const botMsg: Message = { id: Date.now() + 1, text: "Понял! Обрабатываю твой запрос... ⚙️", out: false, time: now };
      setMessages(prev => [...prev, botMsg]);
    }, 900);
  }

  function handleLogin() {
    if (loginStep === "phone") {
      setLoginStep("code");
    } else if (loginStep === "code") {
      setLoginStep("done");
      setTimeout(() => { setLoggedIn(true); setActiveTab("chats"); }, 900);
    }
  }

  if (!loggedIn) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0d1821 0%, #17212b 60%, #1a2d3d 100%)" }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute rounded-full" style={{
              width: `${180 + i * 90}px`, height: `${180 + i * 90}px`,
              border: "1px solid rgba(42,171,238,0.08)",
              top: "50%", left: "50%", transform: "translate(-50%, -50%)"
            }} />
          ))}
        </div>

        <div className="mobile-frame flex flex-col" style={{ background: "var(--tg-bg)" }}>
          <div className="flex items-center justify-between px-6 pt-4 pb-1 text-xs shrink-0" style={{ color: "var(--tg-text)" }}>
            <span className="font-semibold">9:41</span>
            <div className="flex items-center gap-1.5"><Icon name="Signal" size={12} /><Icon name="Wifi" size={12} /><Icon name="Battery" size={12} /></div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-8 animate-fade-in">
            <div className="mb-8 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-[28px] flex items-center justify-center text-5xl font-bold"
                  style={{ background: "linear-gradient(145deg, #1a96d4 0%, #2AABEE 100%)", boxShadow: "0 12px 40px rgba(42,171,238,0.45), 0 2px 8px rgba(0,0,0,0.3)" }}>
                  N
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "#4caf76", border: "2.5px solid var(--tg-bg)", boxShadow: "0 2px 8px rgba(76,175,118,0.4)" }}>
                  <Icon name="Shield" size={12} color="white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight" style={{ color: "var(--tg-text)" }}>NeMAX</h1>
              <p className="text-sm mt-1.5 font-medium" style={{ color: "var(--tg-text-muted)" }}>Безопасный мессенджер</p>
            </div>

            {loginStep === "done" ? (
              <div className="flex flex-col items-center gap-3 animate-scale-in">
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(76,175,118,0.15)", border: "2px solid #4caf76" }}>
                  <Icon name="Check" size={32} color="#4caf76" />
                </div>
                <p className="text-base font-semibold" style={{ color: "var(--tg-text)" }}>Вход выполнен!</p>
              </div>
            ) : loginStep === "code" ? (
              <div className="w-full space-y-5 animate-slide-up">
                <div className="text-center">
                  <p className="text-base font-semibold" style={{ color: "var(--tg-text)" }}>Код подтверждения</p>
                  <p className="text-sm mt-1" style={{ color: "var(--tg-text-muted)" }}>Мы отправили код на {phone || "+7 (999) 000-00-00"}</p>
                </div>
                <div className="flex gap-3 justify-center">
                  {[0,1,2,3,4].map(i => (
                    <input key={i} type="text" maxLength={1}
                      className="w-11 h-13 text-center text-xl font-bold rounded-xl outline-none transition-all"
                      style={{ background: "var(--tg-surface)", border: "1.5px solid var(--tg-border)", color: "var(--tg-text)", height: "52px", width: "44px" }}
                      value={code[i] || ""}
                      onChange={e => {
                        const val = e.target.value;
                        const arr = (code + "     ").split("");
                        arr[i] = val;
                        setCode(arr.join("").trim());
                        if (val && e.target.nextSibling) (e.target.nextSibling as HTMLInputElement).focus?.();
                      }}
                    />
                  ))}
                </div>
                <button onClick={handleLogin} className="w-full py-3.5 rounded-2xl font-semibold text-base transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg, #1a96d4, #2AABEE)", color: "white" }}>
                  Подтвердить
                </button>
                <p className="text-center text-sm" style={{ color: "var(--tg-text-muted)" }}>
                  Не получили код? <span style={{ color: "var(--tg-blue)" }} className="cursor-pointer">Отправить снова</span>
                </p>
              </div>
            ) : (
              <div className="w-full space-y-4 animate-slide-up">
                <div className="text-center">
                  <p className="text-base font-semibold" style={{ color: "var(--tg-text)" }}>Войти через Telegram</p>
                  <p className="text-sm mt-1" style={{ color: "var(--tg-text-muted)" }}>Введите номер, привязанный к Telegram</p>
                </div>
                <input type="tel" placeholder="+7 (999) 000-00-00" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl text-base outline-none"
                  style={{ background: "var(--tg-surface)", border: "1.5px solid var(--tg-border)", color: "var(--tg-text)" }}
                />
                <button onClick={handleLogin} className="w-full py-3.5 rounded-2xl font-semibold text-base transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg, #1a96d4, #2AABEE)", color: "white" }}>
                  Далее →
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px" style={{ background: "var(--tg-border)" }} />
                  <span className="text-xs" style={{ color: "var(--tg-text-muted)" }}>или</span>
                  <div className="flex-1 h-px" style={{ background: "var(--tg-border)" }} />
                </div>
                <button onClick={handleLogin} className="w-full py-3.5 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all active:scale-95"
                  style={{ background: "var(--tg-surface)", border: "1.5px solid var(--tg-border)", color: "var(--tg-text)" }}>
                  <span className="text-lg">✈️</span> Открыть в Telegram
                </button>
                <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "rgba(42,171,238,0.07)", border: "1px solid rgba(42,171,238,0.18)" }}>
                  <Icon name="Lock" size={13} color="#2AABEE" />
                  <p className="text-xs" style={{ color: "var(--tg-text-muted)" }}>Данные шифруются E2E. Мы не храним пароли.</p>
                </div>
              </div>
            )}
          </div>

          <div className="px-8 pb-5 text-center shrink-0">
            <p className="text-xs" style={{ color: "var(--tg-text-muted)" }}>
              Продолжая, вы соглашаетесь с <span style={{ color: "var(--tg-blue)" }}>условиями использования</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0d1821 0%, #17212b 60%, #1a2d3d 100%)" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="absolute rounded-full" style={{
            width: `${200 + i * 100}px`, height: `${200 + i * 100}px`,
            border: "1px solid rgba(42,171,238,0.06)",
            top: "50%", left: "50%", transform: "translate(-50%, -50%)"
          }} />
        ))}
      </div>

      <div className="mobile-frame flex flex-col" style={{ background: "var(--tg-bg)" }}>
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-1 text-xs shrink-0" style={{ color: "var(--tg-text)" }}>
          <span className="font-semibold">9:41</span>
          <div className="flex items-center gap-1.5"><Icon name="Signal" size={12} /><Icon name="Wifi" size={12} /><Icon name="Battery" size={12} /></div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">

          {/* ── CHATS LIST ── */}
          {activeTab === "chats" && !activeChat && (
            <div className="flex flex-col h-full animate-fade-in">
              <div className="px-4 py-3 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-semibold" style={{ color: "var(--tg-text)" }}>Сообщения</h2>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--tg-surface)" }}>
                    <Icon name="Search" size={16} color="var(--tg-text-muted)" />
                  </button>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--tg-surface)" }}>
                    <Icon name="Edit" size={16} color="var(--tg-blue)" />
                  </button>
                </div>
              </div>
              <div className="px-4 mb-3 shrink-0">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "var(--tg-surface)" }}>
                  <Icon name="Search" size={14} color="var(--tg-text-muted)" />
                  <span className="text-sm" style={{ color: "var(--tg-text-muted)" }}>Поиск по чатам...</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {CHATS.map((chat, i) => (
                  <button key={chat.id} onClick={() => setActiveChat(chat)}
                    className="w-full flex items-center gap-3 px-4 py-3 tap-highlight text-left"
                    style={{ animationDelay: `${i * 55}ms`, borderBottom: "1px solid rgba(43,56,69,0.5)" }}>
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-semibold"
                        style={{ background: chat.bot ? "linear-gradient(135deg, #1a96d4, #2AABEE)" : "var(--tg-surface2)" }}>
                        {chat.avatar}
                      </div>
                      {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full" style={{ background: "var(--tg-green)", border: "2px solid var(--tg-bg)" }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm" style={{ color: "var(--tg-text)" }}>{chat.name}</span>
                        <span className="text-xs shrink-0 ml-2" style={{ color: "var(--tg-text-muted)" }}>{chat.time}</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-sm truncate" style={{ color: "var(--tg-text-muted)" }}>{chat.lastMessage}</span>
                        {chat.unread > 0 && (
                          <span className="ml-2 min-w-5 h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center shrink-0"
                            style={{ background: "var(--tg-blue)", color: "white" }}>
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── CHAT DETAIL ── */}
          {activeTab === "chats" && activeChat && (
            <div className="flex flex-col h-full animate-fade-in">
              <div className="px-4 py-3 flex items-center gap-3 shrink-0" style={{ borderBottom: "1px solid var(--tg-border)" }}>
                <button onClick={() => setActiveChat(null)} className="shrink-0 tap-highlight">
                  <Icon name="ChevronLeft" size={26} color="var(--tg-blue)" />
                </button>
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-base"
                    style={{ background: activeChat.bot ? "linear-gradient(135deg, #1a96d4, #2AABEE)" : "var(--tg-surface2)" }}>
                    {activeChat.avatar}
                  </div>
                  {activeChat.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full" style={{ background: "var(--tg-green)", border: "2px solid var(--tg-bg)" }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight" style={{ color: "var(--tg-text)" }}>{activeChat.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex gap-0.5">{[1,2,3].map(i => <div key={i} className="typing-dot" />)}</div>
                    <span className="text-xs" style={{ color: "var(--tg-blue)" }}>печатает...</span>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--tg-surface)" }}>
                  <Icon name="Phone" size={16} color="var(--tg-blue)" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                {messages.map((msg, i) => (
                  <div key={msg.id} className={`flex ${msg.out ? "justify-end" : "justify-start"} animate-slide-up`}
                    style={{ animationDelay: `${i * 40}ms` }}>
                    <div className={`max-w-[76%] px-3.5 py-2.5 ${msg.out ? "bubble-out" : "bubble-in"}`}>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--tg-text)" }}>{msg.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[11px]" style={{ color: msg.out ? "rgba(255,255,255,0.6)" : "var(--tg-text-muted)" }}>{msg.time}</span>
                        {msg.out && <Icon name={msg.status === "read" ? "CheckCheck" : "Check"} size={12} color={msg.status === "read" ? "#2AABEE" : "rgba(255,255,255,0.5)"} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-3 flex items-center gap-2 shrink-0" style={{ borderTop: "1px solid var(--tg-border)" }}>
                <button className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--tg-surface)" }}>
                  <Icon name="Paperclip" size={17} color="var(--tg-text-muted)" />
                </button>
                <input value={messageText} onChange={e => setMessageText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Сообщение..."
                  className="flex-1 px-3.5 py-2.5 rounded-2xl text-sm outline-none"
                  style={{ background: "var(--tg-surface)", color: "var(--tg-text)", border: "1px solid var(--tg-border)" }}
                />
                <button onClick={sendMessage}
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90"
                  style={{ background: "linear-gradient(135deg, #1a96d4, #2AABEE)" }}>
                  <Icon name="Send" size={16} color="white" />
                </button>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeTab === "notifications" && (
            <div className="flex flex-col h-full animate-fade-in">
              <div className="px-4 py-3 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-semibold" style={{ color: "var(--tg-text)" }}>Уведомления</h2>
                {unreadNotifs > 0 && (
                  <button className="text-sm font-medium" style={{ color: "var(--tg-blue)" }}
                    onClick={() => setNotifs(notifs.map(n => ({ ...n, read: true })))}>
                    Прочитать все
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto">
                {notifs.map((n) => (
                  <button key={n.id} onClick={() => setNotifs(notifs.map(x => x.id === n.id ? { ...x, read: true } : x))}
                    className="w-full flex items-start gap-3 px-4 py-4 tap-highlight text-left"
                    style={{ background: n.read ? "transparent" : "rgba(42,171,238,0.05)", borderBottom: "1px solid var(--tg-border)" }}>
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl shrink-0"
                      style={{ background: "var(--tg-surface2)" }}>
                      {n.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm" style={{ color: "var(--tg-text)" }}>{n.title}</span>
                        <span className="text-xs ml-2 shrink-0" style={{ color: "var(--tg-text-muted)" }}>{n.time}</span>
                      </div>
                      <p className="text-sm mt-0.5 leading-relaxed" style={{ color: "var(--tg-text-muted)" }}>{n.body}</p>
                    </div>
                    {!n.read && <div className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--tg-blue)" }} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeTab === "settings" && (
            <div className="flex flex-col h-full overflow-y-auto animate-fade-in">
              <div className="px-4 py-3 shrink-0">
                <h2 className="text-xl font-semibold" style={{ color: "var(--tg-text)" }}>Настройки</h2>
              </div>
              <div className="mx-4 mb-5 p-4 rounded-2xl flex items-center gap-3" style={{ background: "var(--tg-surface)" }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{ background: "linear-gradient(135deg, #1a96d4, #2AABEE)" }}>А</div>
                <div>
                  <p className="font-semibold" style={{ color: "var(--tg-text)" }}>Алексей Новиков</p>
                  <p className="text-sm" style={{ color: "var(--tg-blue)" }}>@nemax_user</p>
                </div>
                <Icon name="ChevronRight" size={20} color="var(--tg-text-muted)" className="ml-auto" />
              </div>

              {SETTINGS_GROUPS.map(group => (
                <div key={group.title} className="mb-5">
                  <p className="px-4 mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--tg-text-muted)" }}>{group.title}</p>
                  <div className="mx-4 rounded-2xl overflow-hidden" style={{ background: "var(--tg-surface)" }}>
                    {group.items.map((item, i) => (
                      <div key={item.label} className={`flex items-center gap-3 px-4 py-3.5 tap-highlight ${i > 0 ? "border-t" : ""}`}
                        style={{ borderColor: "var(--tg-border)" }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: "rgba(42,171,238,0.12)" }}>
                          <Icon name={item.icon} size={16} color="var(--tg-blue)" />
                        </div>
                        <span className="flex-1 text-sm font-medium" style={{ color: "var(--tg-text)" }}>{item.label}</span>
                        {item.toggle ? (
                          <div className={`tg-toggle ${toggles[item.toggle] ? "active" : ""}`}
                            onClick={() => setToggles(prev => ({ ...prev, [item.toggle!]: !prev[item.toggle!] }))} />
                        ) : (
                          <span className="text-sm" style={{ color: "var(--tg-text-muted)" }}>{item.value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mx-4 mb-6">
                <button className="w-full py-3.5 rounded-2xl text-center font-semibold transition-all active:scale-95"
                  style={{ background: "rgba(229,57,53,0.1)", color: "var(--tg-red)", border: "1px solid rgba(229,57,53,0.2)" }}
                  onClick={() => { setLoggedIn(false); setLoginStep("phone"); }}>
                  Выйти из аккаунта
                </button>
              </div>
            </div>
          )}

          {/* ── HISTORY ── */}
          {activeTab === "history" && (
            <div className="flex flex-col h-full animate-fade-in">
              <div className="px-4 py-3 shrink-0">
                <h2 className="text-xl font-semibold" style={{ color: "var(--tg-text)" }}>История</h2>
                <p className="text-sm mt-0.5" style={{ color: "var(--tg-text-muted)" }}>Журнал действий аккаунта</p>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4">
                <div className="relative pl-5">
                  <div className="absolute left-[19px] top-0 bottom-0 w-0.5" style={{ background: "var(--tg-border)" }} />
                  <div className="space-y-5">
                    {HISTORY.map((item, i) => (
                      <div key={item.id} className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: `${i * 70}ms` }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 -ml-5"
                          style={{ background: "var(--tg-surface2)", border: `2px solid ${item.color}`, boxShadow: `0 0 10px ${item.color}30` }}>
                          <Icon name={item.icon} size={16} color={item.color} />
                        </div>
                        <div className="flex-1 pt-1.5 pb-1">
                          <p className="text-sm font-medium" style={{ color: "var(--tg-text)" }}>{item.action}</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--tg-text-muted)" }}>{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PROFILE ── */}
          {activeTab === "profile" && (
            <div className="flex flex-col h-full overflow-y-auto animate-fade-in">
              <div className="px-4 py-3 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-semibold" style={{ color: "var(--tg-text)" }}>Профиль</h2>
                <button className="text-sm font-medium" style={{ color: "var(--tg-blue)" }}>Изменить</button>
              </div>

              <div className="flex flex-col items-center py-6 px-4">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold"
                    style={{ background: "linear-gradient(135deg, #1a96d4, #2AABEE)", boxShadow: "0 6px 24px rgba(42,171,238,0.45)" }}>А</div>
                  <div className="absolute bottom-0.5 right-0.5 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "var(--tg-blue)", border: "2.5px solid var(--tg-bg)" }}>
                    <Icon name="Camera" size={12} color="white" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 rounded-full" style={{ background: "var(--tg-green)", border: "2px solid var(--tg-bg)" }} />
                </div>
                <h3 className="text-xl font-bold" style={{ color: "var(--tg-text)" }}>Алексей Новиков</h3>
                <p className="text-sm mt-1 font-medium" style={{ color: "var(--tg-blue)" }}>@nemax_user</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Icon name="Phone" size={12} color="var(--tg-text-muted)" />
                  <span className="text-xs" style={{ color: "var(--tg-text-muted)" }}>+7 (999) 123-45-67</span>
                </div>
              </div>

              <div className="flex gap-3 px-4 mb-5">
                {[{ label: "Сообщений", value: "248" }, { label: "Чатов", value: "12" }, { label: "Дней", value: "34" }].map(s => (
                  <div key={s.label} className="flex-1 rounded-2xl p-3 text-center" style={{ background: "var(--tg-surface)" }}>
                    <p className="text-xl font-bold" style={{ color: "var(--tg-blue)" }}>{s.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--tg-text-muted)" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="px-4 mb-4">
                <div className="rounded-2xl overflow-hidden" style={{ background: "var(--tg-surface)" }}>
                  {([
                    { icon: "Mail", label: "Email", value: "alexey@mail.ru", color: "" },
                    { icon: "MapPin", label: "Город", value: "Москва", color: "" },
                    { icon: "Calendar", label: "Зарегистрирован", value: "15 фев 2026", color: "" },
                    { icon: "Shield", label: "Статус 2FA", value: "Активна", color: "#4caf76" },
                  ] as { icon: string; label: string; value: string; color: string }[]).map((item, i) => (
                    <div key={item.label} className={`flex items-center gap-3 px-4 py-3.5 tap-highlight ${i > 0 ? "border-t" : ""}`}
                      style={{ borderColor: "var(--tg-border)" }}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(42,171,238,0.12)" }}>
                        <Icon name={item.icon} size={16} color="var(--tg-blue)" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs" style={{ color: "var(--tg-text-muted)" }}>{item.label}</p>
                        <p className="text-sm font-semibold mt-0.5" style={{ color: item.color || "var(--tg-text)" }}>{item.value}</p>
                      </div>
                      <Icon name="ChevronRight" size={16} color="var(--tg-text-muted)" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-4 mb-4">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl" style={{ background: "rgba(42,171,238,0.08)", border: "1px solid rgba(42,171,238,0.2)" }}>
                  <span className="text-xl">✈️</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: "var(--tg-text)" }}>Подключён к Telegram</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--tg-text-muted)" }}>Синхронизация активна</p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--tg-green)" }} />
                </div>
              </div>
            </div>
          )}

          {/* ── HELP ── */}
          {activeTab === "help" && (
            <div className="flex flex-col h-full overflow-y-auto animate-fade-in">
              <div className="px-4 py-3 shrink-0">
                <h2 className="text-xl font-semibold" style={{ color: "var(--tg-text)" }}>Справка</h2>
              </div>

              <div className="mx-4 mb-4 p-4 rounded-2xl flex items-center gap-3"
                style={{ background: "linear-gradient(135deg, rgba(26,150,212,0.18), rgba(42,171,238,0.08))", border: "1px solid rgba(42,171,238,0.25)" }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl">🤖</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: "var(--tg-text)" }}>Спросить NeMAX Bot</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--tg-text-muted)" }}>Мгновенный ответ на любой вопрос</p>
                </div>
                <button className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: "var(--tg-blue)", color: "white" }}
                  onClick={() => { setActiveTab("chats"); setActiveChat(CHATS[0]); }}>
                  Открыть
                </button>
              </div>

              {[
                { emoji: "🔐", title: "Безопасность и 2FA", desc: "Настройка двухфакторной аутентификации" },
                { emoji: "🔄", title: "Синхронизация с Telegram", desc: "Подключение и настройка синхронизации" },
                { emoji: "🤖", title: "Управление ботом", desc: "Команды и возможности NeMAX Bot" },
                { emoji: "🔔", title: "Уведомления", desc: "Настройка push-уведомлений и алертов" },
                { emoji: "📤", title: "Экспорт данных", desc: "Выгрузка истории и персональных данных" },
                { emoji: "❓", title: "Частые вопросы", desc: "Ответы на популярные вопросы" },
              ].map((item, i) => (
                <div key={item.title} className="mx-4 mb-2 p-4 rounded-2xl flex items-center gap-3 tap-highlight cursor-pointer"
                  style={{ background: "var(--tg-surface)" }}>
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm" style={{ color: "var(--tg-text)" }}>{item.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--tg-text-muted)" }}>{item.desc}</p>
                  </div>
                  <Icon name="ChevronRight" size={16} color="var(--tg-text-muted)" />
                </div>
              ))}

              <div className="mx-4 my-4 p-4 rounded-2xl text-center" style={{ background: "var(--tg-surface)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--tg-text)" }}>Не нашли ответ?</p>
                <p className="text-xs mt-1 mb-3" style={{ color: "var(--tg-text-muted)" }}>Ответим в течение 2 часов</p>
                <button className="px-6 py-2 rounded-xl text-sm font-bold" style={{ background: "var(--tg-blue)", color: "white" }}>
                  Написать в поддержку
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── BOTTOM NAV ── */}
        {!activeChat && (
          <div className="shrink-0 px-1 pb-3 pt-2 glass" style={{ borderTop: "1px solid var(--tg-border)" }}>
            <div className="flex items-center justify-around">
              {([
                { tab: "chats", icon: "MessageCircle", label: "Чаты", badge: unreadChats },
                { tab: "notifications", icon: "Bell", label: "Уведомления", badge: unreadNotifs },
                { tab: "history", icon: "Clock", label: "История", badge: 0 },
                { tab: "settings", icon: "Settings", label: "Настройки", badge: 0 },
                { tab: "profile", icon: "User", label: "Профиль", badge: 0 },
                { tab: "help", icon: "HelpCircle", label: "Справка", badge: 0 },
              ] as { tab: Screen; icon: string; label: string; badge: number }[]).map(({ tab, icon, label, badge }) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className="flex flex-col items-center gap-0.5 px-1.5 py-1 relative transition-all"
                  style={{ color: activeTab === tab ? "var(--tg-blue)" : "var(--tg-text-muted)" }}>
                  <div className="relative">
                    <Icon name={icon} size={21} />
                    {badge > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
                        style={{ background: "var(--tg-red)", color: "white" }}>
                        {badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[8px] font-semibold leading-none">{label}</span>
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full" style={{ background: "var(--tg-blue)" }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}