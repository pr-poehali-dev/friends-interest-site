import { Page } from "@/App";
import Icon from "@/components/ui/icon";

const friendData: Record<string, { emoji: string; role: string; status: boolean; mood: string; bio: string; posts: { text: string; time: string; likes: number }[] }> = {
  "Алина": {
    emoji: "🌸", role: "Фотограф", status: true,
    mood: "Слушает музыку 🎵",
    bio: "Снимаю красоту каждого момента. Люблю закаты, кофе и интересных людей.",
    posts: [
      { text: "Сегодня такой закат — словно кто-то разлил малиновое варенье по небу 🌅", time: "2 мин назад", likes: 8 },
      { text: "Новая серия фото из Питера готова! Отправила вам в галерею ✨", time: "Вчера", likes: 15 },
    ]
  },
  "Дима": {
    emoji: "⚡", role: "Путешественник", status: true,
    mood: "За городом 🌲",
    bio: "Всегда в движении. Уже был в 23 странах, цель — 50.",
    posts: [
      { text: "Нашёл идеальное место для пикника. Кто со мной в эти выходные? 🌿", time: "25 мин назад", likes: 5 },
      { text: "Алтай — это просто космос. Фото не передают 🏔️", time: "3 дня назад", likes: 22 },
    ]
  },
  "Катя": {
    emoji: "✨", role: "Художник", status: false,
    mood: "Спит 😴",
    bio: "Рисую маслом и акварелью. Каждая картина — маленькая история.",
    posts: [
      { text: "Закончила новый холст. Три недели работы — и всё равно хочу переделать угол 😅", time: "1 день назад", likes: 19 },
    ]
  },
  "Максим": {
    emoji: "🎮", role: "Геймер", status: true,
    mood: "Играет в игры",
    bio: "Speedrunner. Побил три мировых рекорда в инди-играх.",
    posts: [
      { text: "Прошёл финального босса после 6 часов мучений. Я ПОБЕДИЛ 🏆", time: "1 час назад", likes: 12 },
    ]
  },
};

const defaultFriend = { emoji: "😊", role: "Участник орбиты", status: false, mood: "Здесь", bio: "Участник группы.", posts: [] };

interface Props {
  name: string;
  navigate: (p: Page, extra?: string) => void;
}

const photos = ["🌅", "🌿", "🎵", "✨", "🌸", "⚡"];

export default function FriendPage({ name, navigate }: Props) {
  const f = friendData[name] || defaultFriend;

  return (
    <div className="animate-fade-in">
      {/* Cover */}
      <div className="relative h-48 overflow-hidden" style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899, #3b82f6)" }}>
        <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20 animate-float">
          {f.emoji}
        </div>
        <button
          onClick={() => navigate("profiles")}
          className="absolute top-4 left-4 glass px-3 py-1.5 rounded-xl text-sm text-white/70 hover:text-white flex items-center gap-2 transition-colors"
        >
          <Icon name="ArrowLeft" size={14} />
          Назад
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-6">
        {/* Avatar */}
        <div className="flex items-end justify-between -mt-10 mb-6">
          <div className="relative">
            <div className="avatar-ring w-20 h-20 glow-purple">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-4xl">
                {f.emoji}
              </div>
            </div>
            {f.status && <div className="online-dot absolute bottom-1 right-1" style={{ width: 12, height: 12 }} />}
          </div>
          <div className="flex gap-2 mb-1">
            <button
              onClick={() => navigate("direct-chat", name)}
              className="grad-btn flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
            >
              <Icon name="MessageCircle" size={15} />
              Написать
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-white">{name}</h1>
          <p className="text-white/40 text-sm mt-0.5">{f.role}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-white/50">{f.mood}</span>
            {f.status && (
              <span className="flex items-center gap-1 text-xs text-green-400">
                <div className="online-dot" style={{ width: 6, height: 6, border: "none" }} />
                онлайн
              </span>
            )}
          </div>
          <p className="text-white/65 text-sm mt-3 leading-relaxed">{f.bio}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Постов", value: f.posts.length + 12 },
            { label: "Фото", value: 47 },
            { label: "Дней вместе", value: 412 },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4 text-center border border-white/8">
              <p className="font-display font-bold text-xl grad-text">{s.value}</p>
              <p className="text-xs text-white/40 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Photo grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm font-bold text-white uppercase tracking-wider">Фото</h2>
            <button onClick={() => navigate("gallery")} className="text-xs text-purple-400 hover:text-purple-300">Все →</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((p, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl flex items-center justify-center text-3xl cursor-pointer hover:scale-105 transition-transform"
                style={{ background: `linear-gradient(135deg, hsl(${i * 40 + 250}, 60%, 25%), hsl(${i * 40 + 280}, 60%, 15%))` }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div className="mb-8">
          <h2 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-4">Посты</h2>
          <div className="flex flex-col gap-3">
            {f.posts.map((post, i) => (
              <div key={i} className="glass rounded-2xl p-4 border border-white/8">
                <p className="text-white/80 text-sm leading-relaxed mb-3">{post.text}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/30">{post.time}</span>
                  <button className="flex items-center gap-1.5 text-white/40 hover:text-pink-400 transition-colors text-sm">
                    <Icon name="Heart" size={14} />
                    <span>{post.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
