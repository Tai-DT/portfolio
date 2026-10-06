'use client';

import { FaTerminal } from 'react-icons/fa';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SKILL_CATEGORIES } from '@/lib/portfolio-data';
import { useI18n } from '@/providers/LocaleProvider';

export default function SkillsSection({
  sectionRef,
  onHover,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  onHover: (element: string | null) => void;
}) {
  const { dict } = useI18n();

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 px-4 relative z-10"
      onMouseEnter={() => onHover('skills')}
      onMouseLeave={() => onHover(null)}
    >
      <div className="max-w-5xl mx-auto">
        <SectionHeading title={dict.skills.title} />
        <p className="text-center text-muted-foreground max-w-xl mx-auto -mt-6 mb-12 text-sm">
          {dict.skills.subtitle}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILL_CATEGORIES.map((cat) => (
            <Card
              key={cat.title}
              className="bg-card/60 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
                  <FaTerminal className="text-sm" />
                  {cat.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cat.skills.map((skill) => (
                  <div key={skill.name} className="border-b border-border/40 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>{skill.name}</span>
                      <span className="text-[10px] text-primary/80 font-mono px-1.5 py-0.5 rounded bg-primary/10">
                        {skill.level}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{skill.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
