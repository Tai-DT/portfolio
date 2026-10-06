import type { Dictionary } from './types';

const en: Dictionary = {
  meta: {
    title: 'Tài Đỗ (Kai) — Full-Stack Developer & AI Systems Engineer',
    description:
      'Portfolio of Tài Đỗ (Kai), a Full-Stack Developer & AI Engineer in Ho Chi Minh City building MCP servers, AI agents, Cloudflare edge apps, and native macOS/mobile software.',
  },
  language: {
    label: 'Language',
    en: 'English',
    vi: 'Tiếng Việt',
    jp: '日本語',
  },
  a11y: {
    skip: 'Skip to content',
    menu: 'Open menu',
    closeMenu: 'Close menu',
  },
  nav: {
    about: 'About',
    projects: 'Projects',
    skills: 'Skills',
    guestbook: 'Guestbook',
    contact: 'Contact',
  },
  hero: {
    status: 'Available for AI & Full-Stack Projects',
    greeting: "Hi, I'm {name}",
    bio: 'Full-Stack Developer & AI Engineer passionate about building high-performance MCP servers, intelligent autonomous agents, modern web platforms, and native macOS/mobile applications.',
    viewWork: 'View Featured Work',
    getInTouch: 'Get in Touch',
    downloadCV: 'Download CV',
    edgeHosted: 'Edge hosted on {domain}',
    scrollToAbout: 'Scroll to About section',
    highlights: ['38+ GitHub repos', '3+ years shipping', 'AI Agents & MCP', 'EN · VI · JA'],
  },
  about: {
    title: 'About Me',
    bio: [
      'I specialize in engineering full-stack cloud-native applications and intelligent agent systems. With hands-on experience spanning Model Context Protocol (MCP), Go high-throughput backends, modern Next.js/React frontends, and native Swift/SwiftUI for macOS & iOS, I love bridging deep technical architectures with stunning user experiences.',
      'Currently building open-source developer tooling, AI coding agent workflows, and scalable edge applications running on Cloudflare Workers and D1 databases.',
    ],
    stats: {
      repos: 'Public Repos',
      edge: 'Projects Shipped',
      platform: 'Years Building',
    },
    pillars: {
      ai: {
        title: 'AI Agents & MCP',
        desc: 'Building custom Model Context Protocol servers, LLM orchestration, and autonomous developer workflows.',
      },
      cloud: {
        title: 'Cloudflare D1 & Edge',
        desc: 'Sub-millisecond serverless execution via Cloudflare Workers, Pages, and distributed SQL D1 databases.',
      },
      mobile: {
        title: 'macOS & Mobile',
        desc: 'Crafting native Apple utilities in Swift/SwiftUI and cross-platform mobile apps with React Native.',
      },
      web: {
        title: 'Full-Stack Web',
        desc: 'High-performance Next.js 15, React 19, TypeScript, Go/Gin microservices, and interactive 3D WebGL.',
      },
    },
    experience: {
      title: 'Work Experience',
      items: [
        {
          role: 'Full-Stack Developer',
          company: 'VVMV',
          period: '2026 — Present',
          description: 'Developing full-stack web applications for customs and warehouse management.',
        },
        {
          role: 'App Tester & QA Guide Maintainer',
          company: 'Te2sr.com',
          period: '2025 — Present',
          description: 'Running a Google Play closed-testing service and community guide helping developers satisfy the 12 testers / 14 days requirement and ship apps to production.',
        },
      ],
    },
  },
  projects: {
    title: 'Featured Projects',
    subtitlePre: 'Real projects from my GitHub repository (',
    subtitlePost: '), spanning AI agent tooling, native macOS utilities, and full-stack platforms.',
    categories: {
      all: 'All',
      ai: 'AI & MCP',
      web: 'Full-Stack Web',
      mobile: 'Mobile & Native',
      tools: 'Dev Tools',
    },
    sourceCode: 'Source Code',
    visitDemo: 'Visit Demo',
    featured: 'Featured',
  },
  skills: {
    title: 'Technical Arsenal',
    subtitle:
      'Technologies, frameworks, and engineering methodologies applied across active production and open-source projects.',
  },
  guestbook: {
    title: 'Live Cloudflare D1 Guestbook',
    subtitlePre: 'Leave a note! Submissions are stored directly in ',
    subtitleDb: 'Cloudflare D1 SQL Database',
    subtitlePost: ' at the edge.',
    signTitle: 'Sign the Guestbook',
    signDesc: 'Persistent edge records stored on Cloudflare D1',
    nameLabel: 'Your Name',
    namePlaceholder: 'e.g. Satoshi',
    messageLabel: 'Message',
    messagePlaceholder: 'Leave a comment or say hi...',
    submit: 'Sign Guestbook',
    submitting: 'Saving to D1...',
    recent: 'Recent messages',
    connected: 'D1 Connected',
    connecting: 'Connecting to Cloudflare D1...',
    empty: 'No entries yet. Be the first to leave a message!',
    toastEmpty: 'Please provide your name and a brief message.',
    toastSuccess: 'Your message was added to the Cloudflare D1 Guestbook!',
    toastError: 'Failed to post guestbook entry.',
    toastNetwork: 'Network error posting to guestbook.',
  },
  contact: {
    title: 'Get In Touch',
    subtitle:
      'Have a project in mind, want to collaborate on AI tools, or need edge-scale engineering? Send me a message below.',
    infoTitle: 'Contact Information',
    infoDesc: 'Always reachable via email and GitHub',
    email: 'Email',
    github: 'GitHub',
    location: 'Location',
    domain: 'Production Domain',
    fastResponse: 'Fast response time within 24 hours',
    formTitle: 'Send Direct Message',
    formDesc: 'Submissions are routed and stored in Cloudflare D1',
    nameLabel: 'Your Name',
    namePlaceholder: 'Alex Morgan',
    emailLabel: 'Your Email',
    emailPlaceholder: 'alex@company.com',
    subjectLabel: 'Subject',
    subjectPlaceholder: 'MCP Tooling / Full-Stack Project / General Inquiry',
    messageLabel: 'Message',
    messagePlaceholder: 'Tell me about your project, timeline, or idea...',
    send: 'Send Message',
    sending: 'Saving to Cloudflare D1...',
    toastEmpty: 'Please fill in all required fields.',
    toastSuccess: 'Message sent successfully! Stored in Cloudflare D1.',
    toastError: 'Failed to send message.',
    toastNetwork: 'Network error. Please try again or email directly.',
  },
  kai: {
    ask: 'Ask Kai AI',
    greeting:
      "Hello! I'm Kai AI, the virtual assistant representing Tài Đỗ (Kai). I'm powered by Cloudflare Workers AI (Llama 3.1) running directly at the Edge. Ask me about Tài's MCP, full-stack projects, or skills!",
    thinking: 'Kai AI is thinking on Cloudflare Workers AI...',
    placeholder: "Ask anything about Tài's projects & skills...",
    errorApi: 'Sorry, cannot connect to Cloudflare Workers AI right now. Please try again later!',
    errorNetwork: 'Network error calling Cloudflare Workers AI. Please try again!',
    quickPrompts: [
      "Tài's most notable project?",
      'What does Tài do with Model Context Protocol (MCP)?',
      "This site's Cloudflare D1 & R2 architecture?",
      'How to contact for interviews or collaboration?',
    ],
  },
  footer: {
    tagline: 'Designed & Developed by {name}. Edge deployed on Cloudflare Workers (Astro • D1 • R2 • Workers AI).',
  },
};

export default en;
