import Icon from "@/components/ui/icon";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

type Screen = "login" | "chats" | "chat" | "profile" | "notifications" | "settings" | "history" | "help";

interface Notification {
  id: number;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: string;
}

interface HistoryItem {
  id: number;
  action: string;
  time: string;
  icon: string;
  color: string;
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

interface MainScreensProps {
  activeTab: Screen;
  setActiveTab: (tab: Screen) => void;
  notifs: Notification[];
  setNotifs: (n: Notification[]) => void;
  unreadNotifs: number;
  toggles: Record<string, boolean>;
  setToggles: (fn: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
  currentUser: { name: string; email: string } | null;
  setCurrentUser: (u: { name: string; email: string } | null) => void;
  authMethod: "telegram" | "email";
  phone: string;
  history: HistoryItem[];
  setLoggedIn: (v: boolean) => void;
  setLoginStep: (v: "phone" | "code" | "done") => void;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setDisplayName: (v: string) => void;
  firstChat: Chat;
}

export default function MainScreens({
  activeTab, setActiveTab,
  notifs, setNotifs, unreadNotifs,
  toggles, setToggles,
  currentUser, setCurrentUser,
  authMethod, phone,
  history,
  setLoggedIn, setLoginStep,
  setEmail, setPassword, setDisplayName,
  firstChat,
}: MainScreensProps) {

  if (activeTab === "notifications") {
    return (
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
    );
  }

  if (activeTab === "settings") {
    return (
      <div className="flex flex-col h-full overflow-y-auto animate-fade-in">
        <div className="px-4 py-3 shrink-0">
          <h2 className="text-xl font-semibold" style={{ color: "var(--tg-text)" }}>Настройки</h2>
        </div>
        <div className="mx-4 mb-5 p-4 rounded-2xl flex items-center gap-3" style={{ background: "var(--tg-surface)" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ background: "linear-gradient(135deg, #1a96d4, #2AABEE)" }}>
            {(currentUser?.name || auth.currentUser?.displayName || "U")[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold" style={{ color: "var(--tg-text)" }}>
              {currentUser?.name || auth.currentUser?.displayName || "Пользователь"}
            </p>
            <p className="text-sm" style={{ color: "var(--tg-blue)" }}>
              {authMethod === "email" ? (currentUser?.email || "") : "@nemax_user"}
            </p>
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
            onClick={async () => {
              if (authMethod === "email") await signOut(auth).catch(() => {});
              setLoggedIn(false);
              setLoginStep("phone");
              setCurrentUser(null);
              setEmail(""); setPassword(""); setDisplayName("");
            }}>
            Выйти из аккаунта
          </button>
        </div>
      </div>
    );
  }

  if (activeTab === "history") {
    return (
      <div className="flex flex-col h-full animate-fade-in">
        <div className="px-4 py-3 shrink-0">
          <h2 className="text-xl font-semibold" style={{ color: "var(--tg-text)" }}>История</h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--tg-text-muted)" }}>Активность за последние 7 дней</p>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="relative pl-8">
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5" style={{ background: "var(--tg-border)" }} />
            <div className="space-y-5">
              {history.map((item, i) => (
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
    );
  }

  if (activeTab === "profile") {
    return (
      <div className="flex flex-col h-full overflow-y-auto animate-fade-in">
        <div className="px-4 py-3 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-semibold" style={{ color: "var(--tg-text)" }}>Профиль</h2>
          <button className="text-sm font-medium" style={{ color: "var(--tg-blue)" }}>Изменить</button>
        </div>

        <div className="flex flex-col items-center py-6 px-4">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold"
              style={{ background: "linear-gradient(135deg, #1a96d4, #2AABEE)", boxShadow: "0 6px 24px rgba(42,171,238,0.45)" }}>
              {(currentUser?.name || auth.currentUser?.displayName || "U")[0].toUpperCase()}
            </div>
            <div className="absolute bottom-0.5 right-0.5 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "var(--tg-blue)", border: "2.5px solid var(--tg-bg)" }}>
              <Icon name="Camera" size={12} color="white" />
            </div>
            <div className="absolute bottom-0 left-0 w-4 h-4 rounded-full" style={{ background: "var(--tg-green)", border: "2px solid var(--tg-bg)" }} />
          </div>
          <h3 className="text-xl font-bold" style={{ color: "var(--tg-text)" }}>
            {currentUser?.name || auth.currentUser?.displayName || "Пользователь"}
          </h3>
          <p className="text-sm mt-1 font-medium" style={{ color: "var(--tg-blue)" }}>
            {authMethod === "email"
              ? (currentUser?.email || auth.currentUser?.email || "")
              : (phone ? `+${phone.replace(/\D/g, "")}` : "@nemax_user")}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <Icon name={authMethod === "email" ? "Mail" : "Phone"} size={12} color="var(--tg-text-muted)" />
            <span className="text-xs" style={{ color: "var(--tg-text-muted)" }}>
              {authMethod === "email" ? "Вход через Email" : "Вход через Telegram"}
            </span>
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
              { icon: "Mail", label: "Email", value: currentUser?.email || auth.currentUser?.email || "—", color: "" },
              { icon: "User", label: "Метод входа", value: authMethod === "email" ? "Email / пароль" : "Telegram", color: "" },
              { icon: "Calendar", label: "Зарегистрирован", value: "22 мар 2026", color: "" },
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
    );
  }

  if (activeTab === "help") {
    return (
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
            onClick={() => { setActiveTab("chats"); }}>
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
        ].map((item) => (
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
    );
  }

  return null;
}
