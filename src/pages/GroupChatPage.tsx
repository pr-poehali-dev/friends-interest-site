import { useState, useRef, useEffect } from "react";
import { Page } from "@/App";
import Icon from "@/components/ui/icon";

const initialMessages = [
  { author: "Алина", emoji: "🌸", text: "Привет всем! Как дела? 🌸", time: "10:02", own: false },
  { author: "Дима", emoji: "⚡", text: "Отлично! Только вернулся с гор 🏔️", time: "10:04", own: false },
  { author: "Максим", emoji: "🎮", text: "Топ! Нам надо собраться в эти выходные", time: "10:07", own: false },
  { author: "Я", emoji: "😊", text: "Поддерживаю! Суббота всем подходит?", time: "10:09", own: true },
  { author: "Алина", emoji: "🌸", text: "Да, я свободна в субботу 🎉", time: "10:11", own: false },
  { author: "Катя", emoji: "✨", text: "Возьмём гитару, сделаем костёр 🔥", time: "10:15", own: false },
];

interface Props {
  navigate: (p: Page) => void;
}

export default function GroupChatPage({ navigate }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, {
      author: "Я", emoji: "😊", text: input.trim(), time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }), own: true
    }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen animate-fade-in">
      {/* Header */}
      <div className="glass border-b border-white/5 px-6 py-4 flex items-center gap-4 shrink-0">
        <div className="relative w-10 h-10">
          {["🌸", "⚡", "✨"].map((e, i) => (
            <div
              key={i}
              className="absolute w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-sm border-2 border-[#0a0a12]"
              style={{ left: i * 12, zIndex: 3 - i }}
            >{e}</div>
          ))}
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-white">Наша орбита 🚀</h1>
          <p className="text-xs text-white/40">6 участников • 4 онлайн</p>
        </div>
        <button className="text-white/30 hover:text-white/60 transition-colors">
          <Icon name="Phone" size={18} />
        </button>
        <button className="text-white/30 hover:text-white/60 transition-colors">
          <Icon name="Info" size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.own ? "flex-row-reverse" : ""} animate-fade-in`}>
            {!msg.own && (
              <div className="avatar-ring w-8 h-8 shrink-0 self-end">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-sm">
                  {msg.emoji}
                </div>
              </div>
            )}
            <div className={`max-w-xs lg:max-w-md ${msg.own ? "items-end" : "items-start"} flex flex-col gap-1`}>
              {!msg.own && <span className="text-xs text-white/30 px-1">{msg.author}</span>}
              <div
                className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.own
                    ? "grad-btn rounded-br-md text-white"
                    : "glass border border-white/8 text-white/85 rounded-bl-md"
                }`}
              >
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
            placeholder="Написать что-нибудь..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="text-white/30 hover:text-white/60 transition-colors">
            <Icon name="Paperclip" size={18} />
          </button>
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
