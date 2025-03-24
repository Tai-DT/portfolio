'use client';

import { FaGithub, FaLinkedin, FaEnvelope, FaDownload } from 'react-icons/fa';
import { useState, useEffect, useRef, useMemo } from 'react';
import DynamicBackground from '@/components/background/DynamicBackground';
import { ModeToggle } from '@/components/theme-button';
import ThreeScene from '@/components/3d/ThreeScene';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('hero');
  // Update the type to allow string values
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  
  // Create refs outside of useMemo with proper HTML element types
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  
  // Assemble refs into an object with useMemo
  const sectionRefs = useMemo(() => ({
    hero: heroRef,
    about: aboutRef,
    projects: projectsRef,
    skills: skillsRef,
    contact: contactRef
  }), []); // Empty dependency array means this will only run once
  
  // Detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      // Check which section is currently in view
      for (const section of Object.keys(sectionRefs)) {
        const element = sectionRefs[section as keyof typeof sectionRefs].current;
        if (!element) continue;

        // Now TypeScript knows element is an HTMLElement
        const rect = element.getBoundingClientRect();
        const offsetTop = rect.top + window.scrollY;
        const isVisible = (scrollPosition >= offsetTop) &&
          (scrollPosition < offsetTop + rect.height);

        if (isVisible) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once to set initial active section
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection, sectionRefs]);

  return (
    <main className="min-h-screen relative">
      {/* Updated positioning and z-index for the clock */}
      <div 
        className="fixed top-4 right-10 z-50" 
        style={{ 
          pointerEvents: 'auto',
          cursor: 'pointer'
        }}
      >
        <ModeToggle />
      </div>
      
      <DynamicBackground />

      {/* Interactive 3D Character */}
      <ThreeScene activeSection={activeSection} hoveredElement={hoveredElement} />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center px-4"
        id="hero"
        onMouseEnter={() => setHoveredElement('hero')}
      >
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[--primary] to-[color:var(--primary)]/70 bg-clip-text text-transparent">
            Your Name
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-[--foreground]/90">
            Full-Stack Developer | Web Designer | Tech Enthusiast
          </p>
          <div className="flex justify-center gap-4 mb-12">
            {/* Fix download CV button */}
            <Button 
              size="lg"
              asChild
              onMouseEnter={() => setHoveredElement('download')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <a href="/cv.pdf" download>
                <FaDownload className="mr-2" /> 
                Download CV
              </a>
            </Button>
            
            {/* Fix contact button */}
            <Button 
              variant="outline" 
              size="lg"
              asChild
              onMouseEnter={() => setHoveredElement('contact-button')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <a href="#contact">
                Contact Me
              </a>
            </Button>
          </div>
          <div className="flex justify-center gap-6 mt-8">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-all text-2xl"
              onMouseEnter={() => setHoveredElement('github')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <FaGithub />
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-all text-2xl"
              onMouseEnter={() => setHoveredElement('linkedin')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <FaLinkedin />
            </a>
            <a
              href="mailto:your.email@example.com"
              className="text-foreground hover:text-primary transition-all text-2xl"
              onMouseEnter={() => setHoveredElement('email')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <a href="#about" className="text-foreground text-4xl">
            ↓
          </a>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        ref={aboutRef}
        className="py-20 px-4"
        onMouseEnter={() => setHoveredElement('about')}
        onMouseLeave={() => setHoveredElement(null)}
      >
        <div className="max-w-5xl mx-auto">
          <SectionHeading title="About Me" />
          
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1 flex justify-center">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary shadow-xl">
                {/* Replace with your actual profile image */}
                <div className="w-full h-full bg-gradient-to-br from-primary to-primary/50"></div>
                {/* Uncomment and use your actual image
                <Image 
                  src="/profile.jpg" 
                  alt="Your Name"
                  fill
                  className="object-cover"
                />
                */}
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-lg mb-6 text-foreground">
                Hello! I&apos;m a passionate developer with expertise in building beautiful, functional, and user-centered digital experiences.
                With a background in [your background], I combine technical skills with creative problem-solving.
              </p>
              <p className="text-lg mb-6 text-foreground/90">
                I enjoy tackling complex challenges and turning them into simple, elegant solutions. My focus is on [your focus areas],
                and I&apos;m constantly learning new technologies and methodologies to improve my craft.
              </p>
              <p className="text-lg text-foreground/80">
                When I&apos;m not coding, you can find me [your hobbies or interests].
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        ref={projectsRef}
        className="py-20 px-4 bg-primary/5 backdrop-blur-sm"
        onMouseEnter={() => setHoveredElement('projects')}
        onMouseLeave={() => setHoveredElement(null)}
      >
        <div className="max-w-5xl mx-auto">
          <SectionHeading title="My Projects" />

          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((project) => (
              <Card 
                key={project}
                className="transition-all hover:-translate-y-2 border-primary/20"
                onMouseEnter={() => setHoveredElement(`project-${project}`)}
                onMouseLeave={() => setHoveredElement('projects')}
              >
                <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-xl font-medium text-primary">Project Image</span>
                </div>
                
                <CardHeader>
                  <CardTitle>Project Title {project}</CardTitle>
                  <CardDescription>
                    A brief description of the project, what technologies were used, and what problems it solves.
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge>React</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                    <Badge variant="outline">Tailwind</Badge>
                  </div>
                </CardContent>
                
                <CardFooter className="flex gap-4">
                  {/* Fix GitHub button */}
                  <Button variant="ghost" size="sm" asChild>
                    <a href="#" className="flex items-center gap-1">
                      <FaGithub className="mr-1" /> Source Code
                    </a>
                  </Button>
                  
                  {/* Fix Live Demo button */}
                  <Button variant="link" size="sm" asChild>
                    <a href="#" className="flex items-center gap-1">
                      Live Demo →
                    </a>
                  </Button>
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
        className="py-20 px-4"
        onMouseEnter={() => setHoveredElement('skills')}
        onMouseLeave={() => setHoveredElement(null)}
      >
        <div className="max-w-5xl mx-auto">
          <SectionHeading title="My Skills" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              "JavaScript", "TypeScript", "React", "Next.js",
              "Node.js", "Express", "MongoDB", "PostgreSQL",
              "HTML/CSS", "Tailwind CSS", "Git", "Docker"
            ].map((skill) => (
              <div
                key={skill}
                className="bg-card/60 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-primary/10 hover:scale-105 transition-all border border-primary/10"
              >
                <div className="text-xl font-semibold text-foreground">{skill}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        ref={contactRef}
        className="py-20 px-4 bg-primary/5 backdrop-blur-sm"
        onMouseEnter={() => setHoveredElement('contact')}
        onMouseLeave={() => setHoveredElement(null)}
      >
        <div className="max-w-3xl mx-auto">
          <SectionHeading title="Get In Touch" />

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-primary" />
                  <a href="mailto:your.email@example.com" className="hover:text-primary transition-colors">your.email@example.com</a>
                </div>
                <div className="flex items-center gap-3">
                  <FaLinkedin className="text-primary" />
                  <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">linkedin.com/in/yourusername</a>
                </div>
                <div className="flex items-center gap-3">
                  <FaGithub className="text-primary" />
                  <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">github.com/yourusername</a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Send Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-foreground">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full p-3 bg-background/50 rounded-md border border-input focus:ring-2 focus:ring-ring focus:border-primary"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-foreground">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full p-3 bg-background/50 rounded-md border border-input focus:ring-2 focus:ring-ring focus:border-primary"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block mb-2 text-sm font-medium text-foreground">Your Message</label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full p-3 bg-background/50 rounded-md border border-input focus:ring-2 focus:ring-ring focus:border-primary"
                      placeholder="Hello, I'd like to talk about..."
                      required
                    ></textarea>
                  </div>
                  <Button 
                    type="submit"
                    className="mt-4"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-primary/10">
        <p className="text-foreground/60">© {new Date().getFullYear()} Your Name. All rights reserved.</p>
      </footer>
    </main>
  );
}
