'use client';

import Image from 'next/image';
import { FaRobot, FaDatabase, FaApple, FaLayerGroup, FaBriefcase } from 'react-icons/fa';
import { SectionHeading } from '@/components/ui/section-heading';
import { PERSONAL_INFO } from '@/lib/portfolio-data';
import { useI18n } from '@/providers/LocaleProvider';
import Reveal from '@/components/motion/Reveal';
import type { Pillar } from '@/lib/i18n';

const PILLAR_ICONS: Record<string, React.ReactNode> = {
  ai: <FaRobot className="text-2xl text-primary mb-3" />,
  cloud: <FaDatabase className="text-2xl text-primary mb-3" />,
  mobile: <FaApple className="text-2xl text-primary mb-3" />,
  web: <FaLayerGroup className="text-2xl text-primary mb-3" />,
};

export default function AboutSection({
  sectionRef,
  onHover,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  onHover: (element: string | null) => void;
}) {
  const { dict } = useI18n();
  const pillars: [string, Pillar][] = [
    ['ai', dict.about.pillars.ai],
    ['cloud', dict.about.pillars.cloud],
    ['mobile', dict.about.pillars.mobile],
    ['web', dict.about.pillars.web],
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 px-4 relative z-10"
      onMouseEnter={() => onHover('about')}
      onMouseLeave={() => onHover(null)}
    >
      <div className="max-w-5xl mx-auto">
        <SectionHeading title={dict.about.title} />

        <Reveal>
        <div className="grid md:grid-cols-12 gap-10 items-center mb-16">
          {/* Avatar Column */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="relative w-52 h-52 rounded-2xl overflow-hidden p-1 bg-linear-to-br from-primary via-accent to-primary/40 shadow-2xl hover:scale-105 transition-transform duration-300">
              <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-background">
                <Image
                  src={PERSONAL_INFO.avatarUrl}
                  alt={PERSONAL_INFO.name}
                  fill
                  sizes="(max-width: 768px) 208px, 208px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className="text-sm font-semibold text-foreground">{PERSONAL_INFO.fullName}</span>
              <p className="text-xs text-muted-foreground">{PERSONAL_INFO.location}</p>
            </div>
          </div>

          {/* Narrative Column */}
          <div className="md:col-span-8 space-y-4 text-foreground/90 leading-relaxed">
            {dict.about.bio.map((paragraph, idx) => (
              <p key={idx} className="text-base sm:text-lg">
                {paragraph}
              </p>
            ))}

            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-card/60 backdrop-blur-sm border border-primary/20">
                <span className="text-2xl font-bold text-primary">{PERSONAL_INFO.stats.publicRepos}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{dict.about.stats.repos}</p>
              </div>
              <div className="p-3 rounded-lg bg-card/60 backdrop-blur-sm border border-primary/20">
                <span className="text-2xl font-bold text-primary">Edge + D1</span>
                <p className="text-xs text-muted-foreground mt-0.5">{dict.about.stats.edge}</p>
              </div>
              <div className="p-3 rounded-lg bg-card/60 backdrop-blur-sm border border-primary/20 col-span-2 sm:col-span-1">
                <span className="text-2xl font-bold text-primary">Swift + Web</span>
                <p className="text-xs text-muted-foreground mt-0.5">{dict.about.stats.platform}</p>
              </div>
            </div>
          </div>
        </div>

        </Reveal>

        {/* Work Experience (ported from portfolio-dotai) */}
        <Reveal>
        <div className="mb-16 p-6 rounded-xl glass card-hover">
          <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
            <FaBriefcase className="text-primary" /> {dict.about.experience.title}
          </h3>
          <div className="space-y-4">
            {dict.about.experience.items.map((item, idx) => (
              <div key={idx} className="border-l-2 border-primary/50 pl-4 py-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-semibold text-sm">
                    {item.role} · <span className="text-primary">{item.company}</span>
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">{item.period}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        </Reveal>

        {/* 4 Architectural Pillars */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map(([key, pillar], i) => (
            <Reveal key={key} delay={i * 0.08}>
              <div className="p-5 rounded-xl glass card-hover h-full">
                {PILLAR_ICONS[key]}
                <h4 className="font-semibold text-base mb-1.5">{pillar.title}</h4>
                <p className="text-xs text-muted-foreground leading-normal">{pillar.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
