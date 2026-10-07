'use client';

import { useEffect, useRef, useState } from 'react';

interface KaiDict {
  ask: string;
  greeting: string;
  thinking: string;
  placeholder: string;
  errorApi: string;
  errorNetwork: string;
  quickPrompts: string[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function KaiChat({ dict }: { dict: KaiDict }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const history = messages;
    setMessages((m) => [...m, { role: 'user', content: trimmed }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history }),
      });
      const data = (await res.json()) as { reply?: string };
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: data.reply || dict.errorApi },
      ]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: dict.errorNetwork }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="btn-gradient fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl"
        aria-label={dict.ask}
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8V4H8" /><rect x="4" y="8" width="16" height="12" rx="2" />
          <path d="M2 14h2m16 0h2M9 13v2m6-2v2" />
        </svg>
      </button>

      {open && (
        <div className="glass fixed bottom-24 right-5 z-50 flex w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl shadow-2xl">
          <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
            <span className="btn-gradient flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold">K</span>
            <div>
              <p className="text-sm font-semibold">Kai AI</p>
              <p className="text-[11px] text-muted-foreground">Cloudflare Workers AI · Llama 3.1</p>
            </div>
          </div>

          <div className="flex max-h-80 min-h-48 flex-col gap-3 overflow-y-auto p-4">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-primary/10 bg-background/70 px-3.5 py-2.5 text-sm leading-relaxed">
              {dict.greeting}
            </div>
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === 'user'
                    ? 'ml-auto max-w-[85%] rounded-2xl rounded-tr-sm btn-gradient px-3.5 py-2.5 text-sm leading-relaxed'
                    : 'max-w-[85%] rounded-2xl rounded-tl-sm border border-primary/10 bg-background/70 px-3.5 py-2.5 text-sm leading-relaxed'
                }
              >
                {m.content}
              </div>
            ))}
            {loading && <p className="text-xs italic text-muted-foreground">{dict.thinking}</p>}
            <div ref={bottomRef} />
          </div>

          {messages.length === 0 && (
            <div className="flex flex-wrap gap-1.5 border-t border-border px-4 py-3">
              {dict.quickPrompts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-aurora-1/50 hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            className="flex gap-2 border-t border-border p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dict.placeholder}
              className="min-w-0 flex-1 rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-aurora-1/60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-xl disabled:opacity-40"
              aria-label="Send"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
