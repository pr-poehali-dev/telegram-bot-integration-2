import Icon from "@/components/ui/icon";

type Screen = "login" | "chats" | "chat" | "profile" | "notifications" | "settings" | "history" | "help";

interface BottomNavProps {
  activeTab: Screen;
  setActiveTab: (tab: Screen) => void;
  unreadChats: number;
  unreadNotifs: number;
}

export default function BottomNav({ activeTab, setActiveTab, unreadChats, unreadNotifs }: BottomNavProps) {
  const tabs: { tab: Screen; icon: string; label: string; badge: number }[] = [
    { tab: "chats", icon: "MessageCircle", label: "Чаты", badge: unreadChats },
    { tab: "notifications", icon: "Bell", label: "Уведомления", badge: unreadNotifs },
    { tab: "history", icon: "Clock", label: "История", badge: 0 },
    { tab: "settings", icon: "Settings", label: "Настройки", badge: 0 },
    { tab: "profile", icon: "User", label: "Профиль", badge: 0 },
    { tab: "help", icon: "HelpCircle", label: "Справка", badge: 0 },
  ];

  return (
    <div className="shrink-0 px-1 pb-3 pt-2 glass" style={{ borderTop: "1px solid var(--tg-border)" }}>
      <div className="flex items-center justify-around">
        {tabs.map(({ tab, icon, label, badge }) => (
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
  );
}
