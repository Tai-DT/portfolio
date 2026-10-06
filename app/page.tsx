'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import ThreeScene from '@/components/3d/ThreeScene';
import KaiAiChat from '@/components/ai/KaiAiChat';
import Header from '@/components/sections/Header';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';
import GuestbookSection from '@/components/sections/GuestbookSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/sections/Footer';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

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
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionRefs]);

  return (
    <main className="min-h-screen relative text-foreground">
      {/* Interactive 3D Companion Scene */}
      <ThreeScene activeSection={activeSection} hoveredElement={hoveredElement} />

      {/* Floating Glassmorphic Navigation Bar */}
      <Header onHover={setHoveredElement} />

      <HeroSection sectionRef={heroRef} onHover={setHoveredElement} />
      <AboutSection sectionRef={aboutRef} onHover={setHoveredElement} />
      <ProjectsSection sectionRef={projectsRef} onHover={setHoveredElement} />
      <SkillsSection sectionRef={skillsRef} onHover={setHoveredElement} />
      <GuestbookSection sectionRef={guestbookRef} onHover={setHoveredElement} />
      <ContactSection sectionRef={contactRef} onHover={setHoveredElement} />
      <Footer />

      {/* Cloudflare Workers AI Assistant Widget */}
      <KaiAiChat />
    </main>
  );
}
