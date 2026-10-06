'use client';

import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/lib/portfolio-data';
import { useI18n } from '@/providers/LocaleProvider';

export default function Footer() {
  const { dict, fmt } = useI18n();

  return (
    <footer className="py-10 px-4 border-t border-primary/10 relative z-10 bg-background/60 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">{PERSONAL_INFO.fullName}</span>
          <span>•</span>
          <span className="font-mono text-primary">{PERSONAL_INFO.domain}</span>
        </div>

        <p className="text-center">{fmt(dict.footer.tagline, { name: PERSONAL_INFO.fullName })}</p>

        <div className="flex items-center gap-4 text-base">
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/tai-do"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            <FaLinkedin />
          </a>
          <a href={`mailto:${PERSONAL_INFO.email}`} className="hover:text-primary transition-colors">
            <FaEnvelope />
          </a>
        </div>
      </div>
    </footer>
  );
}
