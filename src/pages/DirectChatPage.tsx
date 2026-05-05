import { useState, useRef, useEffect } from "react";
import { Page } from "@/App";
import Icon from "@/components/ui/icon";

const chatHistory: Record<string, { author: string; emoji: string; text: string; time: string; own: boolean }[]> = {
  "Алина": [
    { author: "Алина", emoji: "🌸", text: "Привет! Видела твою историю, как ты? 💕", time: "11:30", own: false },
    { author: "Я", emoji: "😊", text: "Привет! Всё хорошо, спасибо что спросила 😊", time: "11:32", own: true },
    { author: "Алина", emoji: "🌸", text: "Пойдёшь в субботу к костру? Катя придумала отличную идею!", time: "11:34", own: false },
  ],
  "Дима": [
    { author: "Дима", emoji: "⚡", text: "Ты видел мои фото с гор?", time: "09:00", own: false },
    { author: "Я", emoji: "😊", text: "Да, огонь! Как там было?", time: "09:05", own: true },
  ],
  "Катя": [
    { author: "Катя", emoji: "✨", text: "Закончила новую картину, хочу показать тебе первому!", time: "Вчера", own: false },
  ],
};

const contacts = [
  { name: "Алина", emoji: "🌸", status: true,  lastMsg: "Пойдёшь в субботу...", unread: 1 },
  { name: "Дима",  emoji: "⚡",  status: true,  lastMsg: "Да, огонь! Как там было?", unread: 0 },
  { name: "Катя",  emoji: "✨",  status: false, lastMsg: "Закончила новую картину...", unread: 2 },
  { name: "Максим",emoji: "🎮",  status: true,  lastMsg: "Gg wp 🎮", unread: 0 },
];

interface Props {
  name: string;
  navigate: (p: Page, extra?: string) => void;
}

export default function DirectChatPage({ name, navigate }: Props) {
  const [active, setActive] = useState(name);
  const [messages, setMessages] = useState(chatHistory[active] || []);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const switchChat = (n: string) => {
    setActive(n);
    setMessages(chatHistory[n] || []);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const newMsg = {
      author: "Я", emoji: "😊", text: input.trim(),
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }), own: true
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  const current = contacts.find(c => c.name === active);

  return (
    <div className="flex h-screen animate-fade-in">
      {/* Contacts sidebar */}
      <div className="w-64 glass border-r border-white/5 flex flex-col shrink-0">
        <div className="px-4 py-5 border-b border-white/5">
          <h2 className="font-display font-bold text-white text-sm">Личные чаты</h2>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {contacts.map((c) => (
            <button
              key={c.name}
              onClick={() => switchChat(c.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${active === c.name ? "bg-white/8 border-r-2 border-purple-500" : ""}`}
            >
              <div className="relative shrink-0">
                <div className="avatar-ring w-10 h-10">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xl">
                    {c.emoji}
                  </div>
                </div>
                {c.status && <div className="online-dot absolute bottom-0 right-0" />}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-white">{c.name}</p>
                <p className="text-xs text-white/35 truncate">{c.lastMsg}</p>
              </div>
              {c.unread > 0 && (
                <span className="text-xs bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold shrink-0">
                  {c.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="glass border-b border-white/5 px-6 py-4 flex items-center gap-3 shrink-0">
          <div className="avatar-ring w-10 h-10">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xl">
              {current?.emoji}
            </div>
          </div>
          <div className="flex-1">
            <button onClick={() => navigate("friend", active)} className="font-semibold text-white hover:grad-text transition-all">
              {active}
            </button>
            <p className="text-xs text-green-400">{current?.status ? "онлайн" : "офлайн"}</p>
          </div>
          <button className="text-white/30 hover:text-white/60 transition-colors">
            <Icon name="Phone" size={18} />
          </button>
          <button onClick={() => navigate("friend", active)} className="text-white/30 hover:text-white/60 transition-colors">
            <Icon name="User" size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.own ? "flex-row-reverse" : ""}`}>
              {!msg.own && (
                <div className="avatar-ring w-8 h-8 shrink-0 self-end">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-sm">
                    {msg.emoji}
                  </div>
                </div>
              )}
              <div className={`max-w-xs flex flex-col gap-1 ${msg.own ? "items-end" : "items-start"}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${msg.own ? "grad-btn text-white rounded-br-md" : "glass border border-white/8 text-white/85 rounded-bl-md"}`}>
                  {msg.text}
                </div>
                <span className="text-xs text-white/20 px-1">{msg.time}</span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="glass border-t border-white/5 px-4 py-4 shrink-0">
          <div className="flex items-center gap-3 glass rounded-2xl px-4 py-2.5 border border-white/10">
            <button className="text-white/30 hover:text-white/60 transition-colors">
              <Icon name="Smile" size={20} />
            </button>
            <input
              className="flex-1 bg-transparent text-white placeholder-white/30 text-sm outline-none"
              placeholder={`Написать ${active}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
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
    </div>
  );
}
