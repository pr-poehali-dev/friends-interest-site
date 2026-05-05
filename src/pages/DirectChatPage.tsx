import { useState, useRef, useEffect } from "react";
import { Page } from "@/App";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

interface Message {
  id: number; text: string; created_at: string;
  from_id: number; to_id: number; from_name: string; from_emoji: string;
}
interface User {
  id: number; name: string; emoji: string; is_online: boolean;
}

interface Props {
  name: string;
  navigate: (p: Page, extra?: string) => void;
}

export default function DirectChatPage({ name, navigate }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [active, setActive] = useState(name);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loadingMsgs, setLoadingMsgs] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.users.list().then(data => {
      setUsers(Array.isArray(data) ? data.filter((u: User) => u.id !== api.ME_ID) : []);
    });
  }, []);

  useEffect(() => {
    const toUser = users.find(u => u.name === active);
    if (!toUser) return;
    setLoadingMsgs(true);
    api.directChat.list(toUser.id).then(data => {
      setMessages(Array.isArray(data) ? data : []);
      setLoadingMsgs(false);
    });
  }, [active, users]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const switchChat = (n: string) => {
    setActive(n);
    setMessages([]);
  };

  const send = async () => {
    if (!input.trim()) return;
    const toUser = users.find(u => u.name === active);
    if (!toUser) return;
    const msg = await api.directChat.send(toUser.id, input.trim());
    if (msg.id) setMessages(prev => [...prev, { ...msg, from_name: "Я", from_emoji: "😊" }]);
    setInput("");
  };

  const currentUser = users.find(u => u.name === active);

  return (
    <div className="flex h-screen animate-fade-in">
      <div className="w-64 glass border-r border-white/5 flex flex-col shrink-0">
        <div className="px-4 py-5 border-b border-white/5">
          <h2 className="font-display font-bold text-white text-sm">Личные чаты</h2>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {users.map(u => (
            <button
              key={u.id}
              onClick={() => switchChat(u.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${active === u.name ? "bg-white/8 border-r-2 border-purple-500" : ""}`}
            >
              <div className="relative shrink-0">
                <div className="avatar-ring w-10 h-10">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xl">{u.emoji}</div>
                </div>
                {u.is_online && <div className="online-dot absolute bottom-0 right-0" />}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-white">{u.name}</p>
                <p className="text-xs text-white/35">{u.is_online ? "онлайн" : "офлайн"}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="glass border-b border-white/5 px-6 py-4 flex items-center gap-3 shrink-0">
          {currentUser && (
            <>
              <div className="avatar-ring w-10 h-10">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xl">{currentUser.emoji}</div>
              </div>
              <div className="flex-1">
                <button onClick={() => navigate("friend", active)} className="font-semibold text-white hover:grad-text transition-all">{active}</button>
                <p className={`text-xs ${currentUser.is_online ? "text-green-400" : "text-white/30"}`}>{currentUser.is_online ? "онлайн" : "офлайн"}</p>
              </div>
              <button className="text-white/30 hover:text-white/60 transition-colors"><Icon name="Phone" size={18} /></button>
              <button onClick={() => navigate("friend", active)} className="text-white/30 hover:text-white/60 transition-colors"><Icon name="User" size={18} /></button>
            </>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {loadingMsgs ? (
            <div className="flex flex-col gap-3">
              {[1,2,3].map(i => <div key={i} className={`glass rounded-2xl h-10 animate-pulse border border-white/8 ${i%2===0?"self-end w-40":"w-52"}`} />)}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-white/25">
              <Icon name="MessageCircle" size={40} />
              <p className="mt-3 text-sm">Напишите первое сообщение!</p>
            </div>
          ) : messages.map(msg => {
            const isMe = msg.from_id === api.ME_ID;
            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                {!isMe && (
                  <div className="avatar-ring w-8 h-8 shrink-0 self-end">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-sm">{msg.from_emoji}</div>
                  </div>
                )}
                <div className={`max-w-xs flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? "grad-btn text-white rounded-br-md" : "glass border border-white/8 text-white/85 rounded-bl-md"}`}>
                    {msg.text}
                  </div>
                  <span className="text-xs text-white/20 px-1">
                    {new Date(msg.created_at).toLocaleTimeString("ru", { hour:"2-digit", minute:"2-digit" })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="glass border-t border-white/5 px-4 py-4 shrink-0">
          <div className="flex items-center gap-3 glass rounded-2xl px-4 py-2.5 border border-white/10">
            <button className="text-white/30 hover:text-white/60 transition-colors"><Icon name="Smile" size={20} /></button>
            <input
              className="flex-1 bg-transparent text-white placeholder-white/30 text-sm outline-none"
              placeholder={`Написать ${active}...`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
            />
            <button onClick={send} disabled={!input.trim()} className="grad-btn w-9 h-9 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40">
              <Icon name="Send" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
