import { Page } from "@/App";
import Icon from "@/components/ui/icon";

const friends = [
  { name: "Алина",  emoji: "🌸", role: "Фотограф", status: true,  posts: 47, photos: 124, joined: "с 2022" },
  { name: "Дима",   emoji: "⚡",  role: "Путешественник", status: true,  posts: 31, photos: 89,  joined: "с 2022" },
  { name: "Катя",   emoji: "✨",  role: "Художник", status: false, posts: 62, photos: 203, joined: "с 2023" },
  { name: "Максим", emoji: "🎮",  role: "Геймер",   status: true,  posts: 18, photos: 34,  joined: "с 2023" },
  { name: "Соня",   emoji: "🎨",  role: "Дизайнер", status: false, posts: 29, photos: 67,  joined: "с 2024" },
  { name: "Рома",   emoji: "🎸",  role: "Музыкант", status: false, posts: 14, photos: 22,  joined: "с 2024" },
];

interface Props {
  navigate: (p: Page, extra?: string) => void;
}

export default function ProfilesPage({ navigate }: Props) {
  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Друзья</h1>
          <p className="text-white/40 mt-1 text-sm">{friends.length} человек в твоей орбите</p>
        </div>
        <button
          onClick={() => navigate("invites")}
          className="grad-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
        >
          <Icon name="UserPlus" size={16} />
          Пригласить
        </button>
      </div>

      {/* Online count */}
      <div className="flex gap-4 mb-8">
        {[
          { label: "Онлайн", count: friends.filter(f => f.status).length, color: "text-green-400" },
          { label: "Всего", count: friends.length, color: "text-white" },
          { label: "Новых за месяц", count: 2, color: "text-purple-400" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl px-5 py-3 border border-white/8">
            <span className={`font-display font-bold text-xl ${stat.color}`}>{stat.count}</span>
            <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {friends.map((f, i) => (
          <div
            key={f.name}
            className={`glass rounded-2xl p-5 border border-white/8 hover:border-purple-500/30 transition-all cursor-pointer group animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}
            onClick={() => navigate("friend", f.name)}
            style={{ background: "var(--grad-card)" }}
          >
            <div className="relative mb-3">
              <div className="avatar-ring w-16 h-16 mx-auto">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-3xl">
                  {f.emoji}
                </div>
              </div>
              {f.status && <div className="online-dot absolute bottom-0 right-1/2 translate-x-5" />}
            </div>

            <h3 className="font-semibold text-white text-center group-hover:grad-text transition-all">{f.name}</h3>
            <p className="text-xs text-white/40 text-center mb-4">{f.role}</p>

            <div className="flex justify-around text-center">
              <div>
                <p className="text-sm font-bold text-white">{f.posts}</p>
                <p className="text-xs text-white/30">постов</p>
              </div>
              <div className="w-px bg-white/8" />
              <div>
                <p className="text-sm font-bold text-white">{f.photos}</p>
                <p className="text-xs text-white/30">фото</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                className="flex-1 py-2 rounded-xl text-xs font-semibold grad-btn"
                onClick={(e) => { e.stopPropagation(); navigate("direct-chat", f.name); }}
              >
                Написать
              </button>
              <button
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-white/8 text-white/70 hover:bg-white/12 transition-colors"
                onClick={(e) => { e.stopPropagation(); navigate("friend", f.name); }}
              >
                Профиль
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
