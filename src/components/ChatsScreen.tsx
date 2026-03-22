import Icon from "@/components/ui/icon";

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

interface ChatsScreenProps {
  activeChat: Chat | null;
  setActiveChat: (c: Chat | null) => void;
  messages: Message[];
  messageText: string;
  setMessageText: (v: string) => void;
  sendMessage: () => void;
  chats: Chat[];
}

export default function ChatsScreen({
  activeChat, setActiveChat,
  messages, messageText, setMessageText, sendMessage,
  chats,
}: ChatsScreenProps) {
  if (!activeChat) {
    return (
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
          {chats.map((chat, i) => (
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
    );
  }

  return (
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
        <div className="flex-1">
          <p className="font-semibold text-sm leading-tight" style={{ color: "var(--tg-text)" }}>{activeChat.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="flex gap-0.5">{[1, 2, 3].map(i => <div key={i} className="typing-dot" />)}</div>
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
  );
}
