'use client';

import { useState, FormEvent } from 'react';
import { FaEnvelope, FaGithub, FaMapMarkerAlt, FaServer, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PERSONAL_INFO } from '@/lib/portfolio-data';
import { useI18n } from '@/providers/LocaleProvider';

export default function ContactSection({
  sectionRef,
  onHover,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  onHover: (element: string | null) => void;
}) {
  const { dict } = useI18n();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  // Handle Contact Form Submit -> saves to Cloudflare D1
  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      toast.error(dict.contact.toastEmpty);
      return;
    }

    try {
      setIsSubmittingContact(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject || 'Portfolio Inquiry',
          message: contactMessage,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(dict.contact.toastSuccess);
        setContactName('');
        setContactEmail('');
        setContactSubject('');
        setContactMessage('');
      } else {
        toast.error(data.error || dict.contact.toastError);
      }
    } catch {
      toast.error(dict.contact.toastNetwork);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 px-4 relative z-10"
      onMouseEnter={() => onHover('contact')}
      onMouseLeave={() => onHover(null)}
    >
      <div className="max-w-4xl mx-auto">
        <SectionHeading title={dict.contact.title} />
        <p className="text-center text-muted-foreground max-w-xl mx-auto -mt-6 mb-12 text-sm">
          {dict.contact.subtitle}
        </p>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Contact Details Card */}
          <div className="md:col-span-5">
            <Card className="glass card-hover h-full flex flex-col justify-between">
              <div>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">{dict.contact.infoTitle}</CardTitle>
                  <CardDescription className="text-xs">{dict.contact.infoDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <FaEnvelope />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[10px]">{dict.contact.email}</p>
                      <a
                        href={`mailto:${PERSONAL_INFO.email}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {PERSONAL_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <FaGithub />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[10px]">{dict.contact.github}</p>
                      <a
                        href={PERSONAL_INFO.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-primary transition-colors"
                      >
                        github.com/{PERSONAL_INFO.githubUsername}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[10px]">{dict.contact.location}</p>
                      <span className="font-medium">{PERSONAL_INFO.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <FaServer />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[10px]">{dict.contact.domain}</p>
                      <span className="font-mono text-primary font-medium">{PERSONAL_INFO.domain}</span>
                    </div>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="pt-4 border-t border-border/50 text-[11px] text-muted-foreground">
                <FaCheckCircle className="text-emerald-500 mr-1.5" /> {dict.contact.fastResponse}
              </CardFooter>
            </Card>
          </div>

          {/* Message Form (saves to Cloudflare D1) */}
          <div className="md:col-span-7">
            <Card className="glass card-hover">
              <CardHeader>
                <CardTitle className="text-lg font-bold">{dict.contact.formTitle}</CardTitle>
                <CardDescription className="text-xs">{dict.contact.formDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block font-medium mb-1">
                        {dict.contact.nameLabel} *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder={dict.contact.namePlaceholder}
                        required
                        className="w-full px-3 py-2 rounded-md bg-background/60 border border-input focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block font-medium mb-1">
                        {dict.contact.emailLabel} *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder={dict.contact.emailPlaceholder}
                        required
                        className="w-full px-3 py-2 rounded-md bg-background/60 border border-input focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block font-medium mb-1">
                      {dict.contact.subjectLabel}
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder={dict.contact.subjectPlaceholder}
                      className="w-full px-3 py-2 rounded-md bg-background/60 border border-input focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block font-medium mb-1">
                      {dict.contact.messageLabel} *
                    </label>
                    <textarea
                      id="contact-message"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      rows={5}
                      placeholder={dict.contact.messagePlaceholder}
                      required
                      className="w-full px-3 py-2 rounded-md bg-background/60 border border-input focus:outline-none focus:ring-1 focus:ring-primary"
                    ></textarea>
                  </div>

                  <Button type="submit" size="default" className="w-full mt-2 btn-gradient border-0" disabled={isSubmittingContact}>
                    <FaPaperPlane className="mr-2 text-xs" />
                    {isSubmittingContact ? dict.contact.sending : dict.contact.send}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
