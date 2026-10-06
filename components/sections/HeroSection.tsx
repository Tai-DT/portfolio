'use client';

import { FaGithub, FaLinkedin, FaEnvelope, FaDownload, FaServer, FaPaperPlane, FaCode } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { PERSONAL_INFO } from '@/lib/portfolio-data';
import { useI18n } from '@/providers/LocaleProvider';

export default function HeroSection({
  sectionRef,
  onHover,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  onHover: (element: string | null) => void;
}) {
  const { dict, fmt } = useI18n();

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-4 pt-20"
      onMouseEnter={() => onHover('hero')}
    >
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-xs font-medium text-primary">{dict.hero.status}</span>
          <span className="text-xs text-muted-foreground">• {PERSONAL_INFO.location}</span>
        </div>

        {/* Name & Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4">
          {fmt(dict.hero.greeting, { name: PERSONAL_INFO.fullName }).split(PERSONAL_INFO.fullName)[0]}
          <span className="bg-linear-to-r from-primary via-primary/85 to-accent-foreground bg-clip-text text-transparent">
            {PERSONAL_INFO.fullName}
          </span>
          {fmt(dict.hero.greeting, { name: PERSONAL_INFO.fullName }).split(PERSONAL_INFO.fullName)[1]}
        </h1>

        <p className="text-xl sm:text-2xl font-medium text-foreground/90 mb-4">{PERSONAL_INFO.role}</p>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          {dict.hero.bio}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Button
            size="lg"
            asChild
            className="shadow-lg shadow-primary/25"
            onMouseEnter={() => onHover('cta-projects')}
            onMouseLeave={() => onHover(null)}
          >
            <a href="#projects">
              <FaCode className="mr-2" /> {dict.hero.viewWork}
            </a>
          </Button>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="backdrop-blur-sm border-primary/30 hover:bg-primary/10"
            onMouseEnter={() => onHover('cta-contact')}
            onMouseLeave={() => onHover(null)}
          >
            <a href="#contact">
              <FaPaperPlane className="mr-2" /> {dict.hero.getInTouch}
            </a>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            asChild
            className="hover:bg-primary/10"
            onMouseEnter={() => onHover('cta-cv')}
            onMouseLeave={() => onHover(null)}
          >
            <a href="/cv.pdf" download>
              <FaDownload className="mr-2 text-primary" /> {dict.hero.downloadCV}
            </a>
          </Button>
        </div>

        {/* Social Links & Domain Pill */}
        <div className="flex items-center justify-center gap-5 text-xl text-muted-foreground">
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-all hover:scale-110"
            title="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/tai-do"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-all hover:scale-110"
            title="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="hover:text-primary transition-all hover:scale-110"
            title="Email"
          >
            <FaEnvelope />
          </a>
          <div className="h-4 w-px bg-border"></div>
          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
            <FaServer className="text-xs text-primary" /> {fmt(dict.hero.edgeHosted, { domain: PERSONAL_INFO.domain })}
          </span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground">
        <a href="#about" aria-label={dict.hero.scrollToAbout} className="text-2xl hover:text-primary transition-colors">
          ↓
        </a>
      </div>
    </section>
  );
}
