import { useState, useEffect } from "react";
import { Page } from "@/App";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

interface Photo {
  id: number; emoji: string; title: string; likes: number;
  created_at: string; author_id: number; author_name: string;
}
interface User { id: number; name: string; }

interface Props {
  navigate: (p: Page, extra?: string) => void;
}

export default function GalleryPage({ navigate }: Props) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState("Все");
  const [selected, setSelected] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [likedPhotos, setLikedPhotos] = useState<Set<number>>(new Set());

  useEffect(() => {
    Promise.all([api.gallery.list(), api.users.list()]).then(([p, u]) => {
      setPhotos(Array.isArray(p) ? p : []);
      setUsers(Array.isArray(u) ? u : []);
      setLoading(false);
    });
  }, []);

  const likePhoto = async (photo: Photo) => {
    if (likedPhotos.has(photo.id)) return;
    const res = await api.gallery.like(photo.id);
    setLikedPhotos(prev => new Set([...prev, photo.id]));
    setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, likes: res.likes ?? p.likes + 1 } : p));
    if (selected?.id === photo.id) setSelected(prev => prev ? { ...prev, likes: res.likes ?? prev.likes + 1 } : null);
  };

  const filters = ["Все", ...users.map(u => u.name)];
  const filterUserId = filter !== "Все" ? users.find(u => u.name === filter)?.id : undefined;
  const visible = filterUserId ? photos.filter(p => p.author_id === filterUserId) : photos;

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8 max-w-5xl mx-auto">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Галерея</h1>
          <p className="text-white/40 mt-1 text-sm">{photos.length} воспоминаний</p>
        </div>
        <button className="grad-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold">
          <Icon name="Upload" size={16} />Добавить
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 max-w-5xl mx-auto">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${filter===f ? "grad-btn text-white" : "glass border border-white/10 text-white/50 hover:text-white hover:border-white/20"}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-square rounded-2xl animate-pulse bg-white/5" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
          {visible.map((photo, i) => (
            <div
              key={photo.id}
              className={`aspect-square rounded-2xl cursor-pointer hover:scale-105 transition-all duration-300 relative overflow-hidden group animate-fade-in-up stagger-${Math.min(i%6+1,6)}`}
              style={{ background: `linear-gradient(135deg, hsl(${photo.author_id*45+230},55%,22%), hsl(${photo.author_id*45+260},55%,14%))` }}
              onClick={() => setSelected(photo)}
            >
              <div className="absolute inset-0 flex items-center justify-center text-5xl">{photo.emoji}</div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-white text-xs font-semibold truncate">{photo.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <button onClick={e => { e.stopPropagation(); navigate("friend", photo.author_name); }} className="text-white/60 text-xs hover:text-white">{photo.author_name}</button>
                  <button onClick={e => { e.stopPropagation(); likePhoto(photo); }} className={`flex items-center gap-1 text-xs ${likedPhotos.has(photo.id) ? "text-pink-400" : "text-white/60"}`}>
                    <Icon name="Heart" size={12} />{photo.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setSelected(null)}>
          <div className="glass rounded-3xl p-8 max-w-md w-full border border-white/12 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="w-full aspect-square rounded-2xl flex items-center justify-center text-8xl mb-6"
              style={{ background: `linear-gradient(135deg, hsl(${selected.author_id*45+230},55%,22%), hsl(${selected.author_id*45+260},55%,14%))` }}>
              {selected.emoji}
            </div>
            <h2 className="font-display font-bold text-white text-xl mb-1">{selected.title}</h2>
            <div className="flex items-center justify-between">
              <button onClick={() => { setSelected(null); navigate("friend", selected.author_name); }} className="text-sm text-white/50 hover:text-purple-400 transition-colors">
                {selected.author_name} · {new Date(selected.created_at).toLocaleDateString("ru")}
              </button>
              <button onClick={() => likePhoto(selected)} className={`flex items-center gap-1.5 transition-colors ${likedPhotos.has(selected.id) ? "text-pink-400" : "text-white/40 hover:text-pink-400"}`}>
                <Icon name="Heart" size={18} /><span className="text-sm">{selected.likes}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
