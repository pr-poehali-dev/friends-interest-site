import { Page } from "@/App";
import Icon from "@/components/ui/icon";

const friends = [
  { name: "Алина",   emoji: "🌸", status: true,  mood: "Слушает музыку 🎵" },
  { name: "Дима",    emoji: "⚡",  status: true,  mood: "За городом 🌲" },
  { name: "Катя",    emoji: "✨",  status: false, mood: "Спит 😴" },
  { name: "Максим",  emoji: "🎮",  status: true,  mood: "Играет в игры" },
];

const posts = [
  {
    author: "Алина",
    emoji: "🌸",
    time: "2 мин назад",
    text: "Сегодня такой закат — словно кто-то разлил малиновое варенье по небу 🌅",
    likes: 8,
    comments: 3,
    color: "from-purple-500/20 to-pink-500/10",
  },
  {
    author: "Дима",
    emoji: "⚡",
    time: "25 мин назад",
    text: "Нашёл идеальное место для пикника. Кто со мной в эти выходные? 🌿",
    likes: 5,
    comments: 7,
    color: "from-blue-500/20 to-purple-500/10",
  },
  {
    author: "Максим",
    emoji: "🎮",
    time: "1 час назад",
    text: "Прошёл финального босса после 6 часов мучений. Я ПОБЕДИЛ 🏆",
    likes: 12,
    comments: 5,
    color: "from-pink-500/20 to-orange-500/10",
  },
];

interface Props {
  navigate: (p: Page, extra?: string) => void;
}

export default function HomePage({ navigate }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white">
          Привет! 👋
        </h1>
        <p className="text-white/40 mt-1 text-sm">Что нового у твоих друзей</p>
      </div>

      {/* Friends online strip */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">Сейчас онлайн</p>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {friends.map((f, i) => (
            <button
              key={f.name}
              onClick={() => navigate("friend", f.name)}
              className={`flex flex-col items-center gap-2 shrink-0 animate-fade-in-up stagger-${i + 1}`}
            >
              <div className="relative">
                <div className={`avatar-ring w-14 h-14 ${!f.status ? "opacity-50" : ""}`}>
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl">
                    {f.emoji}
                  </div>
                </div>
                {f.status && <div className="online-dot absolute bottom-0 right-0" />}
              </div>
              <span className="text-xs text-white/60">{f.name}</span>
            </button>
          ))}
          <button
            onClick={() => navigate("profiles")}
            className="flex flex-col items-center gap-2 shrink-0"
          >
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/15 flex items-center justify-center text-white/30 hover:border-white/30 transition-colors">
              <Icon name="Plus" size={20} />
            </div>
            <span className="text-xs text-white/30">Все</span>
          </button>
        </div>
      </div>

      {/* Post composer */}
      <div className="glass rounded-2xl p-4 mb-6 border border-white/8">
        <div className="flex gap-3 items-center">
          <div className="avatar-ring w-9 h-9 shrink-0">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              Я
            </div>
          </div>
          <div className="flex-1 bg-white/5 rounded-xl px-4 py-2.5 text-white/30 text-sm cursor-pointer hover:bg-white/8 transition-colors">
            Что у тебя нового?
          </div>
        </div>
        <div className="flex gap-2 mt-3 pl-12">
          {["📷 Фото", "🎵 Музыка", "📍 Место"].map((tag) => (
            <span key={tag} className="text-xs text-white/30 px-3 py-1 rounded-full border border-white/10 hover:border-white/20 cursor-pointer transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="flex flex-col gap-4">
        {posts.map((post, i) => (
          <div
            key={i}
            className={`glass rounded-2xl p-5 bg-gradient-to-br ${post.color} border border-white/8 animate-fade-in-up stagger-${i + 1}`}
          >
            <div className="flex items-start gap-3 mb-3">
              <button onClick={() => navigate("friend", post.author)}>
                <div className="avatar-ring w-10 h-10">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xl">
                    {post.emoji}
                  </div>
                </div>
              </button>
              <div className="flex-1">
                <button onClick={() => navigate("friend", post.author)} className="font-semibold text-white hover:grad-text transition-all text-sm">
                  {post.author}
                </button>
                <p className="text-xs text-white/30">{post.time}</p>
              </div>
              <Icon name="MoreHorizontal" size={16} className="text-white/30 cursor-pointer" />
            </div>
            <p className="text-white/85 text-sm leading-relaxed mb-4">{post.text}</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-white/40 hover:text-pink-400 transition-colors text-sm">
                <Icon name="Heart" size={16} />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 text-white/40 hover:text-purple-400 transition-colors text-sm">
                <Icon name="MessageCircle" size={16} />
                <span>{post.comments}</span>
              </button>
              <button className="flex items-center gap-1.5 text-white/40 hover:text-blue-400 transition-colors text-sm ml-auto">
                <Icon name="Share2" size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
