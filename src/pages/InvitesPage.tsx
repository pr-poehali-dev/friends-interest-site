import { useState } from "react";
import { Page } from "@/App";
import Icon from "@/components/ui/icon";

const existingInvites = [
  { code: "ORBIT-7X2K9", used: false, created: "Сегодня",       note: "Для Лены" },
  { code: "ORBIT-3M8PQ", used: true,  created: "3 дня назад",   note: "Андрей — использовал" },
  { code: "ORBIT-9N4WV", used: false, created: "Неделю назад",  note: "Для Пети" },
];

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "ORBIT-";
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

interface Props {
  navigate: (p: Page) => void;
}

export default function InvitesPage({ navigate }: Props) {
  const [invites, setInvites] = useState(existingInvites);
  const [newNote, setNewNote] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const createInvite = () => {
    const code = generateCode();
    setInvites((prev) => [
      { code, used: false, created: "Только что", note: newNote || "Без заметки" },
      ...prev,
    ]);
    setNewNote("");
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Инвайты</h1>
        <p className="text-white/40 mt-1 text-sm">Пригласи только своих. Орбита — закрытый круг.</p>
      </div>

      {/* Info block */}
      <div className="glass rounded-2xl p-5 mb-8 border border-purple-500/20" style={{ background: "var(--grad-card)" }}>
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl grad-btn flex items-center justify-center shrink-0">
            <Icon name="Shield" size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Только по приглашению</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Каждый участник орбиты может пригласить до 5 человек. Инвайт — одноразовый, действует 7 дней.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "Использовано", value: invites.filter(i => i.used).length, color: "text-green-400" },
          { label: "Активных", value: invites.filter(i => !i.used).length, color: "text-purple-400" },
          { label: "Доступно создать", value: 5 - invites.length, color: "text-pink-400" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4 text-center border border-white/8">
            <p className={`font-display font-bold text-2xl ${s.color}`}>{s.value}</p>
            <p className="text-xs text-white/35 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Create new */}
      <div className="glass rounded-2xl p-5 mb-8 border border-white/8">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Icon name="Plus" size={16} className="text-purple-400" />
          Создать инвайт
        </h3>
        <div className="flex gap-3">
          <input
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 outline-none focus:border-purple-500/50 transition-colors"
            placeholder="Для кого? (необязательно)"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createInvite()}
          />
          <button
            onClick={createInvite}
            disabled={invites.length >= 5}
            className="grad-btn px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-40"
          >
            <Icon name="Zap" size={15} />
            Создать
          </button>
        </div>
        {invites.length >= 5 && (
          <p className="text-xs text-white/35 mt-2">Достигнут лимит инвайтов (5 шт)</p>
        )}
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-white/60 text-sm uppercase tracking-wider">Мои инвайты</h3>
        {invites.map((inv, i) => (
          <div
            key={i}
            className={`glass rounded-2xl p-4 border border-white/8 flex items-center gap-4 animate-fade-in-up stagger-${Math.min(i + 1, 6)} ${inv.used ? "opacity-50" : ""}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${inv.used ? "bg-white/5" : "grad-btn"}`}>
              <Icon name={inv.used ? "CheckCircle" : "Key"} size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <code className="text-sm font-bold text-white font-mono tracking-wider">{inv.code}</code>
                {inv.used && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Использован</span>}
                {!inv.used && <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">Активен</span>}
              </div>
              <p className="text-xs text-white/35 mt-0.5">{inv.note} · {inv.created}</p>
            </div>
            {!inv.used && (
              <button
                onClick={() => copyCode(inv.code)}
                className="text-white/30 hover:text-purple-400 transition-colors p-2 rounded-lg hover:bg-purple-500/10"
              >
                {copied === inv.code
                  ? <Icon name="Check" size={16} className="text-green-400" />
                  : <Icon name="Copy" size={16} />
                }
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
