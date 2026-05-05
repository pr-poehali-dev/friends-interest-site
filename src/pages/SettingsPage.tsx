import { useState } from "react";
import { Page } from "@/App";
import Icon from "@/components/ui/icon";

interface Props {
  navigate: (p: Page) => void;
}

export default function SettingsPage({ navigate }: Props) {
  const [name, setName] = useState("Мой профиль");
  const [status, setStatus] = useState("На орбите 🚀");
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(false);
  const [showOnline, setShowOnline] = useState(true);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full transition-all relative ${value ? "grad-btn" : "bg-white/10"}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${value ? "left-6" : "left-0.5"}`} />
    </button>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Настройки</h1>
        <p className="text-white/40 mt-1 text-sm">Управляй своим аккаунтом</p>
      </div>

      {/* Avatar */}
      <div className="glass rounded-2xl p-6 mb-6 border border-white/8 flex items-center gap-5">
        <div className="relative cursor-pointer group">
          <div className="avatar-ring w-20 h-20 animate-pulse-glow">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl">
              😊
            </div>
          </div>
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Icon name="Camera" size={20} className="text-white" />
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-white text-lg">{name}</h3>
          <p className="text-sm text-white/40">{status}</p>
          <button className="text-xs text-purple-400 hover:text-purple-300 mt-1 transition-colors">Изменить фото</button>
        </div>
      </div>

      {/* Profile section */}
      <div className="glass rounded-2xl p-5 mb-4 border border-white/8">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Icon name="User" size={16} className="text-purple-400" />
          Профиль
        </h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Имя</label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-purple-500/50 transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Статус</label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-purple-500/50 transition-colors"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
        </div>
        <button className="grad-btn px-5 py-2.5 rounded-xl text-sm font-semibold mt-4">
          Сохранить
        </button>
      </div>

      {/* Notifications */}
      <div className="glass rounded-2xl p-5 mb-4 border border-white/8">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Icon name="Bell" size={16} className="text-pink-400" />
          Уведомления
        </h3>
        <div className="flex flex-col gap-4">
          {[
            { label: "Push-уведомления", sub: "Новые сообщения и лайки", value: notifications, onChange: () => setNotifications(v => !v) },
            { label: "Звуки",            sub: "Звуки при получении сообщений", value: sounds, onChange: () => setSounds(v => !v) },
            { label: "Показывать онлайн",sub: "Другие видят, что ты в сети", value: showOnline, onChange: () => setShowOnline(v => !v) },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white font-medium">{item.label}</p>
                <p className="text-xs text-white/35">{item.sub}</p>
              </div>
              <Toggle value={item.value} onChange={item.onChange} />
            </div>
          ))}
        </div>
      </div>

      {/* Invite section */}
      <div
        className="glass rounded-2xl p-5 mb-4 border border-purple-500/20 cursor-pointer hover:border-purple-500/40 transition-colors"
        style={{ background: "var(--grad-card)" }}
        onClick={() => navigate("invites")}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl grad-btn flex items-center justify-center">
              <Icon name="UserPlus" size={18} />
            </div>
            <div>
              <p className="font-semibold text-white">Пригласить друга</p>
              <p className="text-xs text-white/40">Управление инвайтами</p>
            </div>
          </div>
          <Icon name="ChevronRight" size={18} className="text-white/30" />
        </div>
      </div>

      {/* Danger */}
      <div className="glass rounded-2xl p-5 border border-red-500/15">
        <h3 className="font-semibold text-white/60 mb-3 text-sm uppercase tracking-wider">Опасная зона</h3>
        <button className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2 transition-colors">
          <Icon name="LogOut" size={15} />
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}
