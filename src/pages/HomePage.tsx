import { useEffect, useState } from "react";
import { Page } from "@/App";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

interface Post {
  id: number; text: string; likes: number; created_at: string;
  author_id: number; author_name: string; author_emoji: string;
}
interface User {
  id: number; name: string; emoji: string; status_text: string; is_online: boolean;
}

interface Props {
  navigate: (p: Page, extra?: string) => void;
}

export default function HomePage({ navigate }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    Promise.all([api.posts.list(), api.users.list()]).then(([p, u]) => {
      setPosts(Array.isArray(p) ? p : []);
      setUsers(Array.isArray(u) ? u : []);
      setLoading(false);
    });
  }, []);

  const sendPost = async () => {
    if (!newText.trim()) return;
    const created = await api.posts.create(newText);
    if (created.id) setPosts((prev) => [created, ...prev]);
    setNewText("");
  };

  const likePost = async (post: Post) => {
    if (likedPosts.has(post.id)) return;
    const res = await api.posts.like(post.id);
    setLikedPosts((prev) => new Set([...prev, post.id]));
    setPosts((prev) => prev.map(p => p.id === post.id ? { ...p, likes: res.likes ?? p.likes + 1 } : p));
  };

  const relativeTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "только что";
    if (mins < 60) return `${mins} мин назад`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ч назад`;
    return `${Math.floor(hours / 24)} дн назад`;
  };

  const onlineUsers = users.filter(u => u.is_online && u.id !== api.ME_ID);

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Главная 👋</h1>
        <p className="text-white/40 mt-1 text-sm">Что нового у твоих друзей</p>
      </div>

      {onlineUsers.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">Сейчас онлайн</p>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {onlineUsers.map((u, i) => (
              <button
                key={u.id}
                onClick={() => navigate("friend", u.name)}
                className={`flex flex-col items-center gap-2 shrink-0 animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}
              >
                <div className="relative">
                  <div className="avatar-ring w-14 h-14">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl">
                      {u.emoji}
                    </div>
                  </div>
                  <div className="online-dot absolute bottom-0 right-0" />
                </div>
                <span className="text-xs text-white/60">{u.name}</span>
              </button>
            ))}
            <button onClick={() => navigate("profiles")} className="flex flex-col items-center gap-2 shrink-0">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/15 flex items-center justify-center text-white/30 hover:border-white/30 transition-colors">
                <Icon name="Plus" size={20} />
              </div>
              <span className="text-xs text-white/30">Все</span>
            </button>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl p-4 mb-6 border border-white/8">
        <div className="flex gap-3 items-start">
          <div className="avatar-ring w-9 h-9 shrink-0 mt-1">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">Я</div>
          </div>
          <textarea
            className="flex-1 bg-transparent text-white/80 text-sm outline-none resize-none placeholder-white/30 min-h-[36px] pt-1"
            placeholder="Что у тебя нового?"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            rows={newText ? 3 : 1}
          />
        </div>
        {newText.trim() && (
          <div className="flex justify-end mt-2">
            <button onClick={sendPost} className="grad-btn px-4 py-2 rounded-xl text-sm font-semibold">Опубликовать</button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1,2,3].map(i => <div key={i} className="glass rounded-2xl p-5 border border-white/8 h-32 animate-pulse" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post, i) => (
            <div
              key={post.id}
              className={`glass rounded-2xl p-5 border border-white/8 animate-fade-in-up stagger-${Math.min(i+1,6)}`}
              style={{ background: `linear-gradient(135deg, hsl(${post.author_id*60+240},40%,12%), hsl(${post.author_id*60+270},30%,8%))` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <button onClick={() => navigate("friend", post.author_name)}>
                  <div className="avatar-ring w-10 h-10">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xl">{post.author_emoji}</div>
                  </div>
                </button>
                <div className="flex-1">
                  <button onClick={() => navigate("friend", post.author_name)} className="font-semibold text-white hover:grad-text transition-all text-sm">{post.author_name}</button>
                  <p className="text-xs text-white/30">{relativeTime(post.created_at)}</p>
                </div>
              </div>
              <p className="text-white/85 text-sm leading-relaxed mb-4">{post.text}</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => likePost(post)}
                  className={`flex items-center gap-1.5 transition-colors text-sm ${likedPosts.has(post.id) ? "text-pink-400" : "text-white/40 hover:text-pink-400"}`}
                >
                  <Icon name="Heart" size={16} />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-white/40 hover:text-purple-400 transition-colors text-sm">
                  <Icon name="MessageCircle" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
