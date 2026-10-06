'use client';

import { FaGithub, FaDatabase } from 'react-icons/fa';
import { ModeToggle } from '@/components/theme-button';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { PERSONAL_INFO } from '@/lib/portfolio-data';
import { useI18n } from '@/providers/LocaleProvider';

type NavSection = 'about' | 'projects' | 'skills' | 'guestbook' | 'contact';

const NAV_ITEMS: NavSection[] = ['about', 'projects', 'skills', 'guestbook', 'contact'];

export default function Header({
  onHover,
}: {
  onHover: (element: string | null) => void;
}) {
  const { dict } = useI18n();

  return (
    <header className="fixed top-4 left-4 right-4 z-50 max-w-6xl mx-auto backdrop-blur-md bg-background/70 border border-primary/20 rounded-full px-5 py-2.5 shadow-lg flex items-center justify-between transition-all">
      <a href="#hero" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm shadow-md">
          TD
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm tracking-tight group-hover:text-primary transition-colors">
            {PERSONAL_INFO.name}
          </span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {PERSONAL_INFO.domain}
          </span>
        </div>
      </a>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
        {NAV_ITEMS.map((item) => (
          <a
            key={item}
            href={`#${item}`}
            className="hover:text-primary transition-colors py-1 flex items-center gap-1"
            onMouseEnter={() => onHover(`nav-${item}`)}
            onMouseLeave={() => onHover(null)}
          >
            {item === 'guestbook' && <FaDatabase className="text-[10px] text-primary" />}
            {dict.nav[item]}
          </a>
        ))}
      </nav>

      {/* Right Actions: Language, GitHub & Theme Mode */}
      <div className="flex items-center gap-1.5">
        <LanguageSwitcher />
        <a
          href={PERSONAL_INFO.github}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-primary/10 text-foreground transition-all hover:scale-105"
          aria-label="GitHub Profile"
        >
          <FaGithub className="text-lg" />
        </a>
        <div className="scale-90">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
