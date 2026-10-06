'use client';

import { useEffect, useState } from 'react';

interface GuestbookDict {
  signTitle: string;
  signDesc: string;
  nameLabel: string;
  namePlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submit: string;
  submitting: string;
  recent: string;
  connected: string;
  connecting: string;
  empty: string;
  toastEmpty: string;
  toastSuccess: string;
  toastError: string;
  toastNetwork: string;
}

interface Entry {
  id: number;
  name: string;
  message: string;
  avatar_url?: string;
  created_at: string;
}

export default function GuestbookApp({ dict }: { dict: GuestbookDict }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sending'>('loading');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/guestbook')
      .then((r) => r.json() as Promise<{ success?: boolean; entries?: Entry[] }>)
      .then((data) => {
        if (data.success && data.entries) setEntries(data.entries);
        setStatus('idle');
      })
      .catch(() => setStatus('idle'));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setToast(dict.toastEmpty);
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });
      const data = (await res.json()) as { success?: boolean; entry?: Entry };
      if (data.success && data.entry) {
        setEntries((prev) => [data.entry!, ...prev]);
        setName('');
        setMessage('');
        setToast(dict.toastSuccess);
      } else {
        setToast(dict.toastError);
      }
    } catch {
      setToast(dict.toastNetwork);
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={submit} className="glass card-hover h-fit rounded-2xl p-6">
        <h3 className="font-semibold">{dict.signTitle}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{dict.signDesc}</p>

        <label className="mt-5 block text-sm font-medium">
          {dict.nameLabel}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={dict.namePlaceholder}
            maxLength={50}
            className="mt-1.5 w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-aurora-1/60"
          />
        </label>
        <label className="mt-4 block text-sm font-medium">
          {dict.messageLabel}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={dict.messagePlaceholder}
            maxLength={500}
            rows={4}
            className="mt-1.5 w-full resize-none rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-aurora-1/60"
          />
        </label>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn-gradient mt-5 w-full rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-40"
        >
          {status === 'sending' ? dict.submitting : dict.submit}
        </button>
        {toast && <p className="mt-3 text-center text-sm text-aurora-2">{toast}</p>}
      </form>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">{dict.recent}</h3>
          <span className="flex items-center gap-1.5 font-mono text-xs text-aurora-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aurora-2 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-aurora-2"></span>
            </span>
            {status === 'loading' ? dict.connecting : dict.connected}
          </span>
        </div>
        <div className="max-h-[26rem] space-y-3 overflow-y-auto pr-1">
          {entries.length === 0 && status !== 'loading' && (
            <p className="glass rounded-2xl p-5 text-sm text-muted-foreground">{dict.empty}</p>
          )}
          {entries.map((entry) => (
            <article key={entry.id} className="glass card-hover flex gap-3 rounded-2xl p-4">
              <img
                src={entry.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(entry.name)}`}
                alt=""
                width={40}
                height={40}
                loading="lazy"
                className="h-10 w-10 shrink-0 rounded-full border border-border"
              />
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className="truncate text-sm font-semibold">{entry.name}</p>
                  <time className="shrink-0 text-[11px] text-muted-foreground/70">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </time>
                </div>
                <p className="mt-1 break-words text-sm leading-relaxed text-muted-foreground">{entry.message}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
