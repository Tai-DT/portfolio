'use client';

import { useState, useEffect, useRef, useMemo, FormEvent } from 'react';
import Image from 'next/image';
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaDownload,
  FaExternalLinkAlt,
  FaStar,
  FaMapMarkerAlt,
  FaDatabase,
  FaServer,
  FaPaperPlane,
  FaCheckCircle,
  FaCode,
  FaRobot,
  FaLayerGroup,
  FaApple,
  FaTerminal
} from 'react-icons/fa';
import DynamicBackground from '@/components/background/DynamicBackground';
import { ModeToggle } from '@/components/theme-button';
import ThreeScene from '@/components/3d/ThreeScene';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { PERSONAL_INFO, PROJECTS, SKILL_CATEGORIES, Project } from '@/lib/portfolio-data';
import { GuestbookEntry } from '@/lib/db';
import KaiAiChat from '@/components/ai/KaiAiChat';

type CategoryFilter = 'All' | 'AI & MCP' | 'Full-Stack Web' | 'Mobile & Native' | 'Dev Tools';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  // Guestbook state
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);
  const [guestbookName, setGuestbookName] = useState('');
  const [guestbookMessage, setGuestbookMessage] = useState('');
  const [isSubmittingGuestbook, setIsSubmittingGuestbook] = useState(false);
  const [isLoadingGuestbook, setIsLoadingGuestbook] = useState(true);

  // Section refs for scroll tracking & 3D character reaction
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const guestbookRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const sectionRefs = useMemo(
    () => ({
      hero: heroRef,
      about: aboutRef,
      projects: projectsRef,
      skills: skillsRef,
      guestbook: guestbookRef,
      contact: contactRef,
    }),
    []
  );

  // Detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of Object.keys(sectionRefs)) {
        const element = sectionRefs[section as keyof typeof sectionRefs].current;
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const offsetTop = rect.top + window.scrollY;
        const isVisible = scrollPosition >= offsetTop && scrollPosition < offsetTop + rect.height;

        if (isVisible) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionRefs]);

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

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return PROJECTS;
    return PROJECTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Handle Contact Form Submit -> saves to Cloudflare D1
  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      toast.error('Please fill in all required fields.');
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
        toast.success('Message sent successfully! Stored in Cloudflare D1.');
        setContactName('');
        setContactEmail('');
        setContactSubject('');
        setContactMessage('');
      } else {
        toast.error(data.error || 'Failed to send message.');
      }
    } catch {
      toast.error('Network error. Please try again or email directly.');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  // Handle Guestbook Submit -> saves to Cloudflare D1
  const handleGuestbookSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!guestbookName.trim() || !guestbookMessage.trim()) {
      toast.error('Please provide your name and a brief message.');
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
        toast.success('Your message was added to the Cloudflare D1 Guestbook!');
        setGuestbookEntries((prev) => [data.entry, ...prev]);
        setGuestbookName('');
        setGuestbookMessage('');
      } else {
        toast.error(data.error || 'Failed to post guestbook entry.');
      }
    } catch {
      toast.error('Network error posting to guestbook.');
    } finally {
      setIsSubmittingGuestbook(false);
    }
  };

  return (
    <main className="min-h-screen relative text-foreground">
      {/* Dynamic Background Canvas */}
      <DynamicBackground />

      {/* Interactive 3D Companion Scene */}
      <ThreeScene activeSection={activeSection} hoveredElement={hoveredElement} />

      {/* Floating Glassmorphic Navigation Bar */}
      <header className="fixed top-4 left-4 right-4 z-50 max-w-6xl mx-auto backdrop-blur-md bg-background/70 border border-primary/20 rounded-full px-5 py-2.5 shadow-lg flex items-center justify-between transition-all">
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm shadow-md">
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
          <a
            href="#about"
            className="hover:text-primary transition-colors py-1"
            onMouseEnter={() => setHoveredElement('nav-about')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            About
          </a>
          <a
            href="#projects"
            className="hover:text-primary transition-colors py-1"
            onMouseEnter={() => setHoveredElement('nav-projects')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            Projects
          </a>
          <a
            href="#skills"
            className="hover:text-primary transition-colors py-1"
            onMouseEnter={() => setHoveredElement('nav-skills')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            Skills
          </a>
          <a
            href="#guestbook"
            className="hover:text-primary transition-colors py-1 flex items-center gap-1"
            onMouseEnter={() => setHoveredElement('nav-guestbook')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <FaDatabase className="text-[10px] text-primary" /> Guestbook
          </a>
          <a
            href="#contact"
            className="hover:text-primary transition-colors py-1"
            onMouseEnter={() => setHoveredElement('nav-contact')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            Contact
          </a>
        </nav>

        {/* Right Actions: GitHub & Theme Mode */}
        <div className="flex items-center gap-3">
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

      {/* Hero Section */}
      <section
        ref={heroRef}
        id="hero"
        className="relative min-h-screen flex items-center justify-center px-4 pt-20"
        onMouseEnter={() => setHoveredElement('hero')}
      >
        <div className="text-center max-w-4xl mx-auto z-10">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-medium text-primary">
              Available for AI & Full-Stack Projects
            </span>
            <span className="text-xs text-muted-foreground">• {PERSONAL_INFO.location}</span>
          </div>

          {/* Name & Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4">
            Hi, I&apos;m{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary/80 bg-clip-text text-transparent">
              {PERSONAL_INFO.fullName}
            </span>
          </h1>

          <p className="text-xl sm:text-2xl font-medium text-foreground/90 mb-4">
            {PERSONAL_INFO.role}
          </p>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            {PERSONAL_INFO.bio}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Button
              size="lg"
              asChild
              className="shadow-lg shadow-primary/25"
              onMouseEnter={() => setHoveredElement('cta-projects')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <a href="#projects">
                <FaCode className="mr-2" /> View Featured Work
              </a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="backdrop-blur-sm border-primary/30 hover:bg-primary/10"
              onMouseEnter={() => setHoveredElement('cta-contact')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <a href="#contact">
                <FaPaperPlane className="mr-2" /> Get in Touch
              </a>
            </Button>

            <Button
              variant="ghost"
              size="lg"
              asChild
              className="hover:bg-primary/10"
              onMouseEnter={() => setHoveredElement('cta-cv')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <a href="/cv.pdf" download>
                <FaDownload className="mr-2 text-primary" /> Download CV
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
              <FaServer className="text-xs text-primary" /> Edge hosted on {PERSONAL_INFO.domain}
            </span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground">
          <a href="#about" aria-label="Scroll to About section" className="text-2xl hover:text-primary transition-colors">
            ↓
          </a>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        ref={aboutRef}
        className="py-24 px-4 relative z-10"
        onMouseEnter={() => setHoveredElement('about')}
        onMouseLeave={() => setHoveredElement(null)}
      >
        <div className="max-w-5xl mx-auto">
          <SectionHeading title="About Me" />

          <div className="grid md:grid-cols-12 gap-10 items-center mb-16">
            {/* Avatar Column */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="relative w-52 h-52 rounded-2xl overflow-hidden p-1 bg-gradient-to-br from-primary via-accent to-primary/40 shadow-2xl hover:scale-105 transition-transform duration-300">
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
              {PERSONAL_INFO.extendedBio.map((paragraph, idx) => (
                <p key={idx} className="text-base sm:text-lg">
                  {paragraph}
                </p>
              ))}

              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-card/60 backdrop-blur-sm border border-primary/20">
                  <span className="text-2xl font-bold text-primary">{PERSONAL_INFO.stats.publicRepos}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Public Repositories</p>
                </div>
                <div className="p-3 rounded-lg bg-card/60 backdrop-blur-sm border border-primary/20">
                  <span className="text-2xl font-bold text-primary">Edge + D1</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Cloudflare Native</p>
                </div>
                <div className="p-3 rounded-lg bg-card/60 backdrop-blur-sm border border-primary/20 col-span-2 sm:col-span-1">
                  <span className="text-2xl font-bold text-primary">Swift + Web</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Multi-Platform</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Architectural Pillars */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-xl bg-card/60 backdrop-blur-sm border border-primary/20 hover:border-primary/50 transition-all hover:-translate-y-1">
              <FaRobot className="text-2xl text-primary mb-3" />
              <h4 className="font-semibold text-base mb-1.5">AI Agents & MCP</h4>
              <p className="text-xs text-muted-foreground leading-normal">
                Building custom Model Context Protocol servers, LLM orchestration, and autonomous developer workflows.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-card/60 backdrop-blur-sm border border-primary/20 hover:border-primary/50 transition-all hover:-translate-y-1">
              <FaDatabase className="text-2xl text-primary mb-3" />
              <h4 className="font-semibold text-base mb-1.5">Cloudflare D1 & Edge</h4>
              <p className="text-xs text-muted-foreground leading-normal">
                Sub-millisecond serverless execution via Cloudflare Workers, Pages, and distributed SQL D1 databases.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-card/60 backdrop-blur-sm border border-primary/20 hover:border-primary/50 transition-all hover:-translate-y-1">
              <FaApple className="text-2xl text-primary mb-3" />
              <h4 className="font-semibold text-base mb-1.5">macOS & Mobile</h4>
              <p className="text-xs text-muted-foreground leading-normal">
                Crafting native Apple utilities in Swift/SwiftUI and cross-platform mobile apps with React Native.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-card/60 backdrop-blur-sm border border-primary/20 hover:border-primary/50 transition-all hover:-translate-y-1">
              <FaLayerGroup className="text-2xl text-primary mb-3" />
              <h4 className="font-semibold text-base mb-1.5">Full-Stack Web</h4>
              <p className="text-xs text-muted-foreground leading-normal">
                High-performance Next.js 15, React 19, TypeScript, Go/Gin microservices, and interactive 3D WebGL.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        ref={projectsRef}
        className="py-24 px-4 bg-primary/5 backdrop-blur-sm relative z-10"
        onMouseEnter={() => setHoveredElement('projects')}
        onMouseLeave={() => setHoveredElement(null)}
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeading title="Featured Projects" />
          <p className="text-center text-muted-foreground max-w-xl mx-auto -mt-6 mb-8 text-sm">
            Real projects from my GitHub repository (<span className="text-primary font-mono">Tai-DT</span>), spanning AI agent tooling, native macOS utilities, and full-stack platforms.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {(['All', 'AI & MCP', 'Full-Stack Web', 'Mobile & Native', 'Dev Tools'] as CategoryFilter[]).map(
              (category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-card/70 hover:bg-primary/10 text-muted-foreground border border-border'
                  }`}
                >
                  {category}
                </button>
              )
            )}
          </div>

          {/* Project Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: Project) => (
              <Card
                key={project.id}
                className="flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-primary/20 bg-card/70 backdrop-blur-md overflow-hidden group"
                onMouseEnter={() => setHoveredElement(`project-${project.id}`)}
                onMouseLeave={() => setHoveredElement('projects')}
              >
                <div>
                  {/* Card Banner with category & badge */}
                  <div className="p-4 bg-gradient-to-r from-primary/15 via-accent/15 to-transparent border-b border-primary/10 flex items-center justify-between">
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
                      <FaGithub className="mr-1.5" /> Source Code
                    </a>
                  </Button>

                  {project.demoUrl ? (
                    <Button variant="link" size="sm" asChild className="text-xs h-8 px-2 text-primary">
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        Visit Demo <FaExternalLinkAlt className="ml-1 text-[10px]" />
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

      {/* Skills Section */}
      <section
        id="skills"
        ref={skillsRef}
        className="py-24 px-4 relative z-10"
        onMouseEnter={() => setHoveredElement('skills')}
        onMouseLeave={() => setHoveredElement(null)}
      >
        <div className="max-w-5xl mx-auto">
          <SectionHeading title="Technical Arsenal" />
          <p className="text-center text-muted-foreground max-w-xl mx-auto -mt-6 mb-12 text-sm">
            Technologies, frameworks, and engineering methodologies applied across active production and open-source projects.
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
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                        {skill.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Cloudflare D1 Guestbook Showcase */}
      <section
        id="guestbook"
        ref={guestbookRef}
        className="py-24 px-4 bg-primary/5 backdrop-blur-sm relative z-10"
        onMouseEnter={() => setHoveredElement('guestbook')}
        onMouseLeave={() => setHoveredElement(null)}
      >
        <div className="max-w-4xl mx-auto">
          <SectionHeading title="Live Cloudflare D1 Guestbook" />
          <p className="text-center text-muted-foreground max-w-xl mx-auto -mt-6 mb-10 text-sm">
            Leave a note! Submissions are stored directly in <span className="text-primary font-semibold">Cloudflare D1 SQL Database</span> at the edge.
          </p>

          <div className="grid md:grid-cols-12 gap-8">
            {/* Input Form */}
            <div className="md:col-span-5">
              <Card className="bg-card/80 backdrop-blur-md border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <FaDatabase className="text-primary" /> Sign the Guestbook
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Persistent edge records stored on Cloudflare D1
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGuestbookSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">Your Name *</label>
                      <input
                        type="text"
                        value={guestbookName}
                        onChange={(e) => setGuestbookName(e.target.value)}
                        placeholder="e.g. Satoshi"
                        required
                        className="w-full text-xs px-3 py-2 rounded-md bg-background/60 border border-input focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Message *</label>
                      <textarea
                        value={guestbookMessage}
                        onChange={(e) => setGuestbookMessage(e.target.value)}
                        rows={3}
                        placeholder="Leave a comment or say hi..."
                        required
                        className="w-full text-xs px-3 py-2 rounded-md bg-background/60 border border-input focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <Button type="submit" size="sm" className="w-full" disabled={isSubmittingGuestbook}>
                      {isSubmittingGuestbook ? 'Saving to D1...' : 'Sign Guestbook'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Entries Display */}
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span>Recent messages ({guestbookEntries.length})</span>
                <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> D1 Connected
                </span>
              </div>

              <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
                {isLoadingGuestbook ? (
                  <div className="text-center py-10 text-xs text-muted-foreground">
                    Connecting to Cloudflare D1...
                  </div>
                ) : guestbookEntries.length === 0 ? (
                  <div className="text-center py-10 text-xs text-muted-foreground">
                    No entries yet. Be the first to leave a message!
                  </div>
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
                          {new Date(entry.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed pl-8">
                        {entry.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        ref={contactRef}
        className="py-24 px-4 relative z-10"
        onMouseEnter={() => setHoveredElement('contact')}
        onMouseLeave={() => setHoveredElement(null)}
      >
        <div className="max-w-4xl mx-auto">
          <SectionHeading title="Get In Touch" />
          <p className="text-center text-muted-foreground max-w-xl mx-auto -mt-6 mb-12 text-sm">
            Have a project in mind, want to collaborate on AI tools, or need edge-scale engineering? Send me a message below.
          </p>

          <div className="grid md:grid-cols-12 gap-8">
            {/* Contact Details Card */}
            <div className="md:col-span-5">
              <Card className="bg-card/70 backdrop-blur-md border-primary/20 h-full flex flex-col justify-between">
                <div>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Contact Information</CardTitle>
                    <CardDescription className="text-xs">
                      Always reachable via email and GitHub
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <FaEnvelope />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-[10px]">Email</p>
                        <a href={`mailto:${PERSONAL_INFO.email}`} className="font-medium hover:text-primary transition-colors">
                          {PERSONAL_INFO.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <FaGithub />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-[10px]">GitHub</p>
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
                        <p className="text-muted-foreground text-[10px]">Location</p>
                        <span className="font-medium">{PERSONAL_INFO.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <FaServer />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-[10px]">Production Domain</p>
                        <span className="font-mono text-primary font-medium">{PERSONAL_INFO.domain}</span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="pt-4 border-t border-border/50 text-[11px] text-muted-foreground">
                  <FaCheckCircle className="text-emerald-500 mr-1.5" /> Fast response time within 24 hours
                </CardFooter>
              </Card>
            </div>

            {/* Message Form (saves to Cloudflare D1) */}
            <div className="md:col-span-7">
              <Card className="bg-card/70 backdrop-blur-md border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Send Direct Message</CardTitle>
                  <CardDescription className="text-xs">
                    Submissions are routed and stored in Cloudflare D1
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-name" className="block font-medium mb-1">
                          Your Name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Alex Morgan"
                          required
                          className="w-full px-3 py-2 rounded-md bg-background/60 border border-input focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block font-medium mb-1">
                          Your Email *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="alex@company.com"
                          required
                          className="w-full px-3 py-2 rounded-md bg-background/60 border border-input focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className="block font-medium mb-1">
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        placeholder="MCP Tooling / Full-Stack Project / General Inquiry"
                        className="w-full px-3 py-2 rounded-md bg-background/60 border border-input focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block font-medium mb-1">
                        Message *
                      </label>
                      <textarea
                        id="contact-message"
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        rows={5}
                        placeholder="Tell me about your project, timeline, or idea..."
                        required
                        className="w-full px-3 py-2 rounded-md bg-background/60 border border-input focus:outline-none focus:ring-1 focus:ring-primary"
                      ></textarea>
                    </div>

                    <Button type="submit" size="default" className="w-full mt-2" disabled={isSubmittingContact}>
                      <FaPaperPlane className="mr-2 text-xs" />
                      {isSubmittingContact ? 'Saving to Cloudflare D1...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-primary/10 relative z-10 bg-background/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{PERSONAL_INFO.fullName}</span>
            <span>•</span>
            <span className="font-mono text-primary">{PERSONAL_INFO.domain}</span>
          </div>

          <p className="text-center">
            Designed & Developed by Tài Đỗ. Edge deployed on Cloudflare Pages (Hono • D1 • R2 • Workers AI).
          </p>

          <div className="flex items-center gap-4 text-base">
            <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <FaGithub />
            </a>
            <a href="https://linkedin.com/in/tai-do" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <FaLinkedin />
            </a>
            <a href={`mailto:${PERSONAL_INFO.email}`} className="hover:text-primary transition-colors">
              <FaEnvelope />
            </a>
          </div>
        </div>
      </footer>

      {/* Cloudflare Workers AI Assistant Widget */}
      <KaiAiChat />
    </main>
  );
}
