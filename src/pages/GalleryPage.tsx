import { useState } from "react";
import { Page } from "@/App";
import Icon from "@/components/ui/icon";

const photos = [
  { emoji: "🌅", author: "Алина",  title: "Закат в Питере",   likes: 12, date: "Сегодня",    color: "from-orange-500 to-pink-600" },
  { emoji: "🏔️", author: "Дима",   title: "Алтай, пик 3200м", likes: 22, date: "3 дня назад", color: "from-blue-600 to-purple-600" },
  { emoji: "🎨", author: "Катя",   title: "Новый холст",      likes: 19, date: "Вчера",       color: "from-pink-500 to-red-500" },
  { emoji: "🌿", author: "Дима",   title: "Место для пикника",likes: 8,  date: "Сегодня",    color: "from-green-600 to-teal-600" },
  { emoji: "🎸", author: "Рома",   title: "Репетиция",        likes: 6,  date: "4 дня назад", color: "from-purple-600 to-indigo-600" },
  { emoji: "🌸", author: "Алина",  title: "Весна пришла",     likes: 17, date: "Неделю назад",color: "from-rose-500 to-pink-400" },
  { emoji: "🎮", author: "Максим", title: "Финальный босс",   likes: 11, date: "Вчера",       color: "from-violet-600 to-purple-800" },
  { emoji: "☕", author: "Соня",   title: "Утренний кофе",    likes: 9,  date: "2 дня назад", color: "from-amber-600 to-orange-500" },
  { emoji: "🌊", author: "Дима",   title: "Байкал ночью",     likes: 31, date: "2 нед назад", color: "from-cyan-600 to-blue-700" },
];

const filters = ["Все", "Алина", "Дима", "Катя", "Максим", "Соня", "Рома"];

interface Props {
  navigate: (p: Page, extra?: string) => void;
}

export default function GalleryPage({ navigate }: Props) {
  const [filter, setFilter] = useState("Все");
  const [selected, setSelected] = useState<typeof photos[0] | null>(null);

  const visible = filter === "Все" ? photos : photos.filter(p => p.author === filter);

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 max-w-5xl mx-auto">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Галерея</h1>
          <p className="text-white/40 mt-1 text-sm">{photos.length} воспоминаний</p>
        </div>
        <button className="grad-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold">
          <Icon name="Upload" size={16} />
          Добавить
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 max-w-5xl mx-auto">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === f
                ? "grad-btn text-white"
                : "glass border border-white/10 text-white/50 hover:text-white hover:border-white/20"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
        {visible.map((photo, i) => (
          <div
            key={i}
            className={`aspect-square rounded-2xl cursor-pointer hover:scale-105 transition-all duration-300 relative overflow-hidden group animate-fade-in-up stagger-${Math.min(i % 6 + 1, 6)}`}
            style={{ background: `linear-gradient(135deg, hsl(${i * 35 + 240}, 55%, 25%), hsl(${i * 35 + 270}, 55%, 15%))` }}
            onClick={() => setSelected(photo)}
          >
            <div className="absolute inset-0 flex items-center justify-center text-5xl">
              {photo.emoji}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
              <p className="text-white text-xs font-semibold truncate">{photo.title}</p>
              <div className="flex items-center justify-between mt-1">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate("friend", photo.author); }}
                  className="text-white/60 text-xs hover:text-white"
                >
                  {photo.author}
                </button>
                <span className="flex items-center gap-1 text-xs text-pink-400">
                  <Icon name="Heart" size={12} />
                  {photo.likes}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="glass rounded-3xl p-8 max-w-md w-full border border-white/12 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-full aspect-square rounded-2xl flex items-center justify-center text-8xl mb-6"
              style={{ background: `linear-gradient(135deg, hsl(240, 55%, 25%), hsl(270, 55%, 15%))` }}
            >
              {selected.emoji}
            </div>
            <h2 className="font-display font-bold text-white text-xl mb-1">{selected.title}</h2>
            <div className="flex items-center justify-between">
              <button
                onClick={() => { setSelected(null); navigate("friend", selected.author); }}
                className="text-sm text-white/50 hover:text-purple-400 transition-colors"
              >
                {selected.author} · {selected.date}
              </button>
              <button className="flex items-center gap-1.5 text-white/40 hover:text-pink-400 transition-colors">
                <Icon name="Heart" size={18} />
                <span className="text-sm">{selected.likes}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
