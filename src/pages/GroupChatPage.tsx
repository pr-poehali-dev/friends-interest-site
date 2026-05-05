import { useState, useRef, useEffect } from "react";
import { Page } from "@/App";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

interface Message {
  id: number; text: string; created_at: string;
  author_id: number; author_name: string; author_emoji: string;
}

interface Props {
  navigate: (p: Page) => void;
}

export default function GroupChatPage({ navigate }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.groupChat.list().then(data => {
      setMessages(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const msg = await api.groupChat.send(input.trim());
    if (msg.id) setMessages(prev => [...prev, msg]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen animate-fade-in">
      <div className="glass border-b border-white/5 px-6 py-4 flex items-center gap-4 shrink-0">
        <div className="relative w-10 h-10">
          {["🌸","⚡","✨"].map((e, i) => (
            <div key={i} className="absolute w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-sm border-2 border-[#0a0a12]"
              style={{ left: i*12, zIndex: 3-i }}>{e}</div>
          ))}
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-white">Наша орбита 🚀</h1>
          <p className="text-xs text-white/40">Групповой чат</p>
        </div>
        <button className="text-white/30 hover:text-white/60 transition-colors"><Icon name="Phone" size={18} /></button>
        <button className="text-white/30 hover:text-white/60 transition-colors"><Icon name="Info" size={18} /></button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3,4].map(i => <div key={i} className={`glass rounded-2xl h-12 animate-pulse border border-white/8 ${i%2===0 ? "self-end w-48" : "w-56"}`} />)}
          </div>
        ) : messages.map((msg) => {
          const isMe = msg.author_id === api.ME_ID;
          return (
            <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
              {!isMe && (
                <button onClick={() => navigate("profiles")}>
                  <div className="avatar-ring w-8 h-8 shrink-0 self-end">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-sm">{msg.author_emoji}</div>
                  </div>
                </button>
              )}
              <div className={`max-w-xs lg:max-w-md flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
                {!isMe && <span className="text-xs text-white/30 px-1">{msg.author_name}</span>}
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? "grad-btn text-white rounded-br-md" : "glass border border-white/8 text-white/85 rounded-bl-md"}`}>
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
            placeholder="Написать в группу..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="grad-btn w-9 h-9 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40"
          >
            <Icon name="Send" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
