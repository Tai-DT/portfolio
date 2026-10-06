'use client';

import { useMemo, useState } from 'react';
import { FaGithub, FaStar, FaExternalLinkAlt } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PROJECTS, PERSONAL_INFO, Project } from '@/lib/portfolio-data';
import { useI18n } from '@/providers/LocaleProvider';
import type { Dictionary } from '@/lib/i18n';

type CategoryFilter = 'All' | 'AI & MCP' | 'Full-Stack Web' | 'Mobile & Native' | 'Dev Tools';

const CATEGORIES: CategoryFilter[] = ['All', 'AI & MCP', 'Full-Stack Web', 'Mobile & Native', 'Dev Tools'];

const CATEGORY_KEYS: Record<CategoryFilter, keyof Dictionary['projects']['categories']> = {
  All: 'all',
  'AI & MCP': 'ai',
  'Full-Stack Web': 'web',
  'Mobile & Native': 'mobile',
  'Dev Tools': 'tools',
};

export default function ProjectsSection({
  sectionRef,
  onHover,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  onHover: (element: string | null) => void;
}) {
  const { dict } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');

  const filteredProjects = useMemo(
    () =>
      selectedCategory === 'All'
        ? PROJECTS
        : PROJECTS.filter((p) => p.category === selectedCategory),
    [selectedCategory]
  );

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-24 px-4 bg-primary/5 backdrop-blur-sm relative z-10"
      onMouseEnter={() => onHover('projects')}
      onMouseLeave={() => onHover(null)}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading title={dict.projects.title} />
        <p className="text-center text-muted-foreground max-w-xl mx-auto -mt-6 mb-8 text-sm">
          {dict.projects.subtitlePre}
          <span className="text-primary font-mono">{PERSONAL_INFO.githubUsername}</span>
          {dict.projects.subtitlePost}
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-card/70 hover:bg-primary/10 text-muted-foreground border border-border'
              }`}
            >
              {dict.projects.categories[CATEGORY_KEYS[category]]}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project: Project) => (
            <Card
              key={project.id}
              className="flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-primary/20 bg-card/70 backdrop-blur-md overflow-hidden group"
              onMouseEnter={() => onHover(`project-${project.id}`)}
              onMouseLeave={() => onHover('projects')}
            >
              <div>
                {/* Card Banner with category & badge */}
                <div className="p-4 bg-linear-to-r from-primary/15 via-accent/15 to-transparent border-b border-primary/10 flex items-center justify-between">
                  <Badge variant="outline" className="text-[11px] font-medium border-primary/30">
                    {project.category}
                  </Badge>
                  {project.badge && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary font-semibold flex items-center gap-1">
                      {project.stars && <FaStar className="text-[9px] text-amber-400" />}
                      {project.badge}
                    </span>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors flex items-center justify-between">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-xs font-medium text-foreground/80 mt-1">
                    {project.tagline}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-3">
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </div>

              <CardFooter className="pt-3 border-t border-border/50 flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild className="text-xs h-8 px-2 hover:text-primary">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <FaGithub className="mr-1.5" /> {dict.projects.sourceCode}
                  </a>
                </Button>

                {project.demoUrl ? (
                  <Button variant="link" size="sm" asChild className="text-xs h-8 px-2 text-primary">
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      {dict.projects.visitDemo} <FaExternalLinkAlt className="ml-1 text-[10px]" />
                    </a>
                  </Button>
                ) : (
                  <span className="text-[11px] text-muted-foreground font-mono">Tai-DT/{project.id}</span>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
