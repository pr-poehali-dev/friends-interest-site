import { useEffect, useState } from "react";
import { Page } from "@/App";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

interface User {
  id: number; name: string; emoji: string; role: string; bio: string;
  status_text: string; is_online: boolean; posts_count: number; photos_count: number;
}
interface Post {
  id: number; text: string; likes: number; created_at: string;
}

interface Props {
  name: string;
  navigate: (p: Page, extra?: string) => void;
}

const photoEmojis = ["🌅","🌿","🎵","✨","🌸","⚡","🎨","☕","🏔️"];

export default function FriendPage({ name, navigate }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    api.users.list().then(users => {
      const found = Array.isArray(users) ? users.find((u: User) => u.name === name) : null;
      if (found) {
        setUser(found);
        api.posts.list(found.id).then(p => {
          setPosts(Array.isArray(p) ? p : []);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, [name]);

  const likePost = async (post: Post) => {
    if (likedPosts.has(post.id)) return;
    const res = await api.posts.like(post.id);
    setLikedPosts(prev => new Set([...prev, post.id]));
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: res.likes ?? p.likes + 1 } : p));
  };

  if (loading) {
    return <div className="p-6 animate-pulse">
      <div className="h-48 bg-white/5 rounded-2xl mb-6" />
      <div className="max-w-2xl mx-auto px-6 space-y-4">
        <div className="h-20 bg-white/5 rounded-2xl" />
        <div className="h-32 bg-white/5 rounded-2xl" />
      </div>
    </div>;
  }

  if (!user) return (
    <div className="p-6 text-center text-white/40">
      <button onClick={() => navigate("profiles")} className="grad-btn px-4 py-2 rounded-xl text-sm font-semibold mb-4">← Назад</button>
      <p>Пользователь не найден</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="relative h-48 overflow-hidden" style={{ background: `linear-gradient(135deg, hsl(${user.id*60+220},70%,30%), hsl(${user.id*60+260},70%,20%))` }}>
        <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20 animate-float">{user.emoji}</div>
        <button onClick={() => navigate("profiles")} className="absolute top-4 left-4 glass px-3 py-1.5 rounded-xl text-sm text-white/70 hover:text-white flex items-center gap-2 transition-colors">
          <Icon name="ArrowLeft" size={14} />Назад
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-6">
        <div className="flex items-end justify-between -mt-10 mb-6">
          <div className="relative">
            <div className="avatar-ring w-20 h-20 glow-purple">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-4xl">{user.emoji}</div>
            </div>
            {user.is_online && <div className="online-dot absolute bottom-1 right-1" style={{ width:12, height:12 }} />}
          </div>
          <div className="flex gap-2 mb-1">
            <button onClick={() => navigate("direct-chat", name)} className="grad-btn flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold">
              <Icon name="MessageCircle" size={15} />Написать
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-white">{user.name}</h1>
          <p className="text-white/40 text-sm mt-0.5">{user.role}</p>
          <div className="flex items-center gap-2 mt-2">
            {user.status_text && <span className="text-sm text-white/50">{user.status_text}</span>}
            {user.is_online && (
              <span className="flex items-center gap-1 text-xs text-green-400">
                <div className="online-dot" style={{ width:6, height:6, border:"none" }} />онлайн
              </span>
            )}
          </div>
          {user.bio && <p className="text-white/65 text-sm mt-3 leading-relaxed">{user.bio}</p>}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Постов", value: user.posts_count },
            { label: "Фото", value: user.photos_count },
            { label: "Дней вместе", value: 412 },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl p-4 text-center border border-white/8">
              <p className="font-display font-bold text-xl grad-text">{s.value}</p>
              <p className="text-xs text-white/40 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm font-bold text-white uppercase tracking-wider">Фото</h2>
            <button onClick={() => navigate("gallery")} className="text-xs text-purple-400 hover:text-purple-300">Все →</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {photoEmojis.slice(0, 6).map((p, i) => (
              <div key={i} className="aspect-square rounded-xl flex items-center justify-center text-3xl cursor-pointer hover:scale-105 transition-transform"
                style={{ background: `linear-gradient(135deg, hsl(${user.id*40+i*30+240},50%,22%), hsl(${user.id*40+i*30+270},50%,14%))` }}>
                {p}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-4">Посты</h2>
          {posts.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-8">Постов пока нет</p>
          ) : (
            <div className="flex flex-col gap-3">
              {posts.map((post, i) => (
                <div key={post.id} className="glass rounded-2xl p-4 border border-white/8">
                  <p className="text-white/80 text-sm leading-relaxed mb-3">{post.text}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/30">{new Date(post.created_at).toLocaleDateString("ru")}</span>
                    <button
                      onClick={() => likePost(post)}
                      className={`flex items-center gap-1.5 transition-colors text-sm ${likedPosts.has(post.id) ? "text-pink-400" : "text-white/40 hover:text-pink-400"}`}
                    >
                      <Icon name="Heart" size={14} /><span>{post.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
