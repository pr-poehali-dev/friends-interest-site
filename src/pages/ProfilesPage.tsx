import { useEffect, useState } from "react";
import { Page } from "@/App";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

interface User {
  id: number; name: string; emoji: string; role: string;
  is_online: boolean; posts_count: number; photos_count: number;
}

interface Props {
  navigate: (p: Page, extra?: string) => void;
}

export default function ProfilesPage({ navigate }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.users.list().then(data => {
      setUsers(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const online = users.filter(u => u.is_online).length;

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Друзья</h1>
          <p className="text-white/40 mt-1 text-sm">{users.length} человек в твоей орбите</p>
        </div>
        <button onClick={() => navigate("invites")} className="grad-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold">
          <Icon name="UserPlus" size={16} />
          Пригласить
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        {[
          { label: "Онлайн", count: online, color: "text-green-400" },
          { label: "Всего", count: users.length, color: "text-white" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl px-5 py-3 border border-white/8">
            <span className={`font-display font-bold text-xl ${stat.color}`}>{stat.count}</span>
            <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="glass rounded-2xl h-52 animate-pulse border border-white/8" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u, i) => (
            <div
              key={u.id}
              className={`glass rounded-2xl p-5 border border-white/8 hover:border-purple-500/30 transition-all cursor-pointer group animate-fade-in-up stagger-${Math.min(i+1,6)}`}
              onClick={() => navigate("friend", u.name)}
              style={{ background: "var(--grad-card)" }}
            >
              <div className="relative mb-3">
                <div className="avatar-ring w-16 h-16 mx-auto">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-3xl">{u.emoji}</div>
                </div>
                {u.is_online && <div className="online-dot absolute bottom-0 right-1/2 translate-x-5" />}
              </div>
              <h3 className="font-semibold text-white text-center group-hover:grad-text transition-all">{u.name}</h3>
              <p className="text-xs text-white/40 text-center mb-4">{u.role}</p>
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-sm font-bold text-white">{u.posts_count}</p>
                  <p className="text-xs text-white/30">постов</p>
                </div>
                <div className="w-px bg-white/8" />
                <div>
                  <p className="text-sm font-bold text-white">{u.photos_count}</p>
                  <p className="text-xs text-white/30">фото</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  className="flex-1 py-2 rounded-xl text-xs font-semibold grad-btn"
                  onClick={e => { e.stopPropagation(); navigate("direct-chat", u.name); }}
                >Написать</button>
                <button
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-white/8 text-white/70 hover:bg-white/12 transition-colors"
                  onClick={e => { e.stopPropagation(); navigate("friend", u.name); }}
                >Профиль</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
