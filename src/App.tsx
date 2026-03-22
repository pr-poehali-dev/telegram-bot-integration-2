import { useState } from "react";
import Icon from "@/components/ui/icon";
import LoginScreen from "@/components/LoginScreen";
import ChatsScreen from "@/components/ChatsScreen";
import MainScreens from "@/components/MainScreens";
import BottomNav from "@/components/BottomNav";

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

  const [authMethod, setAuthMethod] = useState<"telegram" | "email">("telegram");
  const [emailMode, setEmailMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

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

  if (!loggedIn) {
    return (
      <LoginScreen
        loginStep={loginStep} setLoginStep={setLoginStep}
        phone={phone} setPhone={setPhone}
        code={code} setCode={setCode}
        authMethod={authMethod} setAuthMethod={setAuthMethod}
        emailMode={emailMode} setEmailMode={setEmailMode}
        email={email} setEmail={setEmail}
        password={password} setPassword={setPassword}
        displayName={displayName} setDisplayName={setDisplayName}
        authError={authError} setAuthError={setAuthError}
        authLoading={authLoading} setAuthLoading={setAuthLoading}
        setCurrentUser={setCurrentUser}
        setLoggedIn={setLoggedIn}
        setActiveTab={setActiveTab}
      />
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
        <div className="flex items-center justify-between px-6 pt-4 pb-1 text-xs shrink-0" style={{ color: "var(--tg-text)" }}>
          <span className="font-semibold">9:41</span>
          <div className="flex items-center gap-1.5"><Icon name="Signal" size={12} /><Icon name="Wifi" size={12} /><Icon name="Battery" size={12} /></div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === "chats" && (
            <ChatsScreen
              activeChat={activeChat}
              setActiveChat={setActiveChat}
              messages={messages}
              messageText={messageText}
              setMessageText={setMessageText}
              sendMessage={sendMessage}
              chats={CHATS}
            />
          )}

          {activeTab !== "chats" && (
            <MainScreens
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              notifs={notifs}
              setNotifs={setNotifs}
              unreadNotifs={unreadNotifs}
              toggles={toggles}
              setToggles={setToggles}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              authMethod={authMethod}
              phone={phone}
              history={HISTORY}
              setLoggedIn={setLoggedIn}
              setLoginStep={setLoginStep}
              setEmail={setEmail}
              setPassword={setPassword}
              setDisplayName={setDisplayName}
              firstChat={CHATS[0]}
            />
          )}
        </div>

        {!activeChat && (
          <BottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            unreadChats={unreadChats}
            unreadNotifs={unreadNotifs}
          />
        )}
      </div>
    </div>
  );
}
