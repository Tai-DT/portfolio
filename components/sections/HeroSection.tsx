'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload, FaServer, FaPaperPlane, FaCode } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { PERSONAL_INFO } from '@/lib/portfolio-data';
import { useI18n } from '@/providers/LocaleProvider';

const container = {
  hidden: {},
  // delayChildren syncs with IntroOverlay: curtain lifts ~2.1s, hero staggers in behind it
  show: { transition: { staggerChildren: 0.12, delayChildren: 1.9 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function HeroSection({
  sectionRef,
  onHover,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  onHover: (element: string | null) => void;
}) {
  const { dict, fmt } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-4 pt-20"
      onMouseEnter={() => onHover('hero')}
    >
      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto"
        variants={reduce ? undefined : container}
        initial={reduce ? false : 'hidden'}
        animate="show"
      >
        {/* Status Badge */}
        <motion.div variants={item} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass mb-6">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-medium text-primary">{dict.hero.status}</span>
          <span className="text-xs text-muted-foreground">• {PERSONAL_INFO.location}</span>
        </motion.div>

        {/* Name & Title */}
        <motion.h1 variants={item} className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4">
          {fmt(dict.hero.greeting, { name: PERSONAL_INFO.fullName }).split(PERSONAL_INFO.fullName)[0]}
          <span className="text-gradient">
            {PERSONAL_INFO.fullName}
          </span>
          {fmt(dict.hero.greeting, { name: PERSONAL_INFO.fullName }).split(PERSONAL_INFO.fullName)[1]}
        </motion.h1>

        <motion.p variants={item} className="text-xl sm:text-2xl font-medium text-foreground/90 mb-4">
          {PERSONAL_INFO.role}
        </motion.p>

        <motion.p variants={item} className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          {dict.hero.bio}
        </motion.p>

        {/* Action Buttons */}
        <motion.div variants={item} className="flex flex-wrap justify-center gap-4 mb-10">
          <Button
            size="lg"
            asChild
            className="btn-gradient border-0 shadow-lg shadow-primary/25"
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
            className="glass border-primary/30 hover:bg-primary/10"
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
        </motion.div>

        {/* Social Links & Domain Pill */}
        <motion.div variants={item} className="flex items-center justify-center gap-5 text-xl text-muted-foreground">
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
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground">
        <a href="#about" aria-label={dict.hero.scrollToAbout} className="text-2xl hover:text-primary transition-colors">
          ↓
        </a>
      </div>
    </section>
  );
}
