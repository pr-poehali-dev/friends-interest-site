import Icon from "@/components/ui/icon";
import { Page } from "@/App";

interface Props {
  page: Page;
  navigate: (p: Page) => void;
}

const navItems = [
  { id: "home",       label: "Главная",      icon: "Home" },
  { id: "profiles",   label: "Профили",      icon: "Users" },
  { id: "group-chat", label: "Группа",       icon: "MessageSquare" },
  { id: "direct-chat",label: "Личные чаты",  icon: "MessageCircle" },
  { id: "gallery",    label: "Галерея",      icon: "Images" },
  { id: "invites",    label: "Инвайты",      icon: "UserPlus" },
  { id: "settings",   label: "Настройки",    icon: "Settings" },
] as const;

export default function Sidebar({ page, navigate }: Props) {
  return (
    <aside className="w-64 min-h-screen glass border-r border-white/5 flex flex-col py-6 px-3 relative z-20 shrink-0">
      {/* Logo */}
      <div className="px-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl grad-btn flex items-center justify-center glow-purple animate-pulse-glow">
            <span className="text-white font-display font-bold text-sm">О</span>
          </div>
          <span className="font-display font-bold text-lg grad-text">Орбита</span>
        </div>
        <p className="text-xs text-white/30 mt-1 pl-12">только свои</p>
      </div>

      {/* My avatar block */}
      <div className="mx-4 mb-6 p-3 rounded-2xl" style={{ background: "var(--grad-card)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="avatar-ring w-10 h-10 shrink-0">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              Я
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">Мой профиль</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="online-dot" />
              <span className="text-xs text-green-400">онлайн</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id as Page)}
            className={`nav-item w-full text-left ${page === item.id ? "active" : ""}`}
          >
            <Icon name={item.icon} size={18} className="shrink-0" />
            <span>{item.label}</span>
            {item.id === "direct-chat" && (
              <span className="ml-auto text-xs bg-pink-500 text-white rounded-full px-1.5 py-0.5 font-bold">3</span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="pt-4 border-t border-white/5 px-4">
        <p className="text-xs text-white/20 text-center">Орбита v1.0</p>
      </div>
    </aside>
  );
}
