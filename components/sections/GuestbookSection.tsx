'use client';

import { useEffect, useState, FormEvent } from 'react';
import Image from 'next/image';
import { FaDatabase } from 'react-icons/fa';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { GuestbookEntry } from '@/lib/db';
import { useI18n } from '@/providers/LocaleProvider';

export default function GuestbookSection({
  sectionRef,
  onHover,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  onHover: (element: string | null) => void;
}) {
  const { dict, dateLocale } = useI18n();
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);
  const [guestbookName, setGuestbookName] = useState('');
  const [guestbookMessage, setGuestbookMessage] = useState('');
  const [isSubmittingGuestbook, setIsSubmittingGuestbook] = useState(false);
  const [isLoadingGuestbook, setIsLoadingGuestbook] = useState(true);

  // Load guestbook entries from Cloudflare D1
  useEffect(() => {
    async function loadGuestbook() {
      try {
        setIsLoadingGuestbook(true);
        const res = await fetch('/api/guestbook');
        const data = await res.json();
        if (data.success && Array.isArray(data.entries)) {
          setGuestbookEntries(data.entries);
        }
      } catch {
        console.warn('Could not load guestbook entries');
      } finally {
        setIsLoadingGuestbook(false);
      }
    }

    loadGuestbook();
  }, []);

  // Handle Guestbook Submit -> saves to Cloudflare D1
  const handleGuestbookSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!guestbookName.trim() || !guestbookMessage.trim()) {
      toast.error(dict.guestbook.toastEmpty);
      return;
    }

    try {
      setIsSubmittingGuestbook(true);
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: guestbookName,
          message: guestbookMessage,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.entry) {
        toast.success(dict.guestbook.toastSuccess);
        setGuestbookEntries((prev) => [data.entry, ...prev]);
        setGuestbookName('');
        setGuestbookMessage('');
      } else {
        toast.error(data.error || dict.guestbook.toastError);
      }
    } catch {
      toast.error(dict.guestbook.toastNetwork);
    } finally {
      setIsSubmittingGuestbook(false);
    }
  };

  return (
    <section
      id="guestbook"
      ref={sectionRef}
      className="py-24 px-4 bg-primary/5 backdrop-blur-sm relative z-10"
      onMouseEnter={() => onHover('guestbook')}
      onMouseLeave={() => onHover(null)}
    >
      <div className="max-w-4xl mx-auto">
        <SectionHeading title={dict.guestbook.title} />
        <p className="text-center text-muted-foreground max-w-xl mx-auto -mt-6 mb-10 text-sm">
          {dict.guestbook.subtitlePre}
          <span className="text-primary font-semibold">{dict.guestbook.subtitleDb}</span>
          {dict.guestbook.subtitlePost}
        </p>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Input Form */}
          <div className="md:col-span-5">
            <Card className="bg-card/80 backdrop-blur-md border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <FaDatabase className="text-primary" /> {dict.guestbook.signTitle}
                </CardTitle>
                <CardDescription className="text-xs">{dict.guestbook.signDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGuestbookSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">{dict.guestbook.nameLabel} *</label>
                    <input
                      type="text"
                      value={guestbookName}
                      onChange={(e) => setGuestbookName(e.target.value)}
                      placeholder={dict.guestbook.namePlaceholder}
                      required
                      className="w-full text-xs px-3 py-2 rounded-md bg-background/60 border border-input focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">{dict.guestbook.messageLabel} *</label>
                    <textarea
                      value={guestbookMessage}
                      onChange={(e) => setGuestbookMessage(e.target.value)}
                      rows={3}
                      placeholder={dict.guestbook.messagePlaceholder}
                      required
                      className="w-full text-xs px-3 py-2 rounded-md bg-background/60 border border-input focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <Button type="submit" size="sm" className="w-full" disabled={isSubmittingGuestbook}>
                    {isSubmittingGuestbook ? dict.guestbook.submitting : dict.guestbook.submit}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Entries Display */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>
                {dict.guestbook.recent} ({guestbookEntries.length})
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {dict.guestbook.connected}
              </span>
            </div>

            <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
              {isLoadingGuestbook ? (
                <div className="text-center py-10 text-xs text-muted-foreground">
                  {dict.guestbook.connecting}
                </div>
              ) : guestbookEntries.length === 0 ? (
                <div className="text-center py-10 text-xs text-muted-foreground">{dict.guestbook.empty}</div>
              ) : (
                guestbookEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3.5 rounded-lg bg-card/60 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="relative w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                          {entry.avatar_url ? (
                            <Image
                              src={entry.avatar_url}
                              alt={entry.name}
                              width={24}
                              height={24}
                              unoptimized
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            entry.name.charAt(0)
                          )}
                        </div>
                        <span className="text-xs font-semibold">{entry.name}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {new Date(entry.created_at).toLocaleDateString(dateLocale)}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed pl-8">{entry.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
