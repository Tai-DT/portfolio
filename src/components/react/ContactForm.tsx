'use client';

import { useEffect, useState } from 'react';

interface ContactDict {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  send: string;
  sending: string;
  toastEmpty: string;
  toastSuccess: string;
  toastError: string;
  toastNetwork: string;
}

export default function ContactForm({ dict }: { dict: ContactDict }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', website: '' });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setToast(dict.toastEmpty);
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim() || undefined,
          message: form.message.trim(),
          website: form.website,
        }),
      });
      const data = (await res.json()) as { success?: boolean };
      if (data.success) {
          setForm({ name: '', email: '', subject: '', message: '', website: '' });
        setToast(dict.toastSuccess);
      } else {
        setToast(dict.toastError);
      }
    } catch {
      setToast(dict.toastNetwork);
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    'mt-1.5 w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-aurora-1/60';

  return (
    <form onSubmit={submit} className="mt-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          {dict.nameLabel}
          <input value={form.name} onChange={set('name')} placeholder={dict.namePlaceholder} maxLength={100} className={inputCls} />
        </label>
        <label className="block text-sm font-medium">
          {dict.emailLabel}
          <input type="email" value={form.email} onChange={set('email')} placeholder={dict.emailPlaceholder} className={inputCls} />
        </label>
      </div>
      <label className="mt-4 block text-sm font-medium">
        {dict.subjectLabel}
        <input value={form.subject} onChange={set('subject')} placeholder={dict.subjectPlaceholder} maxLength={150} className={inputCls} />
      </label>
      <label className="mt-4 block text-sm font-medium">
        {dict.messageLabel}
        <textarea value={form.message} onChange={set('message')} placeholder={dict.messagePlaceholder} maxLength={2000} rows={5} className={`${inputCls} resize-none`} />
      </label>
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={set('website')}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <button type="submit" disabled={sending} className="btn-gradient mt-5 w-full rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-40">
        {sending ? dict.sending : dict.send}
      </button>
      {toast && <p className="mt-3 text-center text-sm text-aurora-2">{toast}</p>}
    </form>
  );
}
