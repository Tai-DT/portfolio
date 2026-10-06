'use client';

import { FaGlobe } from 'react-icons/fa';
import { useI18n } from '@/providers/LocaleProvider';
import { LOCALES, type Locale } from '@/lib/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LanguageSwitcher() {
  const { locale, setLocale, dict } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="p-2 rounded-full hover:bg-primary/10 text-foreground transition-all hover:scale-105 flex items-center gap-1.5"
        aria-label={dict.language.label}
      >
        <FaGlobe className="text-base" />
        <span className="text-[10px] font-mono uppercase">{locale}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {LOCALES.map((l: Locale) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLocale(l)}
            className={`text-xs ${l === locale ? 'text-primary font-semibold' : ''}`}
          >
            {dict.language[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
