export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'AI & MCP' | 'Full-Stack Web' | 'Mobile & Native' | 'Dev Tools';
  tags: string[];
  githubUrl: string;
  demoUrl?: string;
  featured: boolean;
  stars?: number;
  badge?: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: {
    name: string;
    level: string;
    description: string;
  }[];
}

export const PERSONAL_INFO = {
  name: 'Tài Đỗ',
  alias: 'Kai',
  fullName: 'Tài Đỗ (Kai)',
  role: 'Full-Stack Developer & AI Systems Engineer',
  bio: 'Full-Stack Developer & AI Engineer passionate about building high-performance MCP servers, intelligent autonomous agents, modern web platforms, and native macOS/mobile applications.',
  extendedBio: [
    'I specialize in engineering full-stack cloud-native applications and intelligent agent systems. With hands-on experience spanning Model Context Protocol (MCP), Go high-throughput backends, modern Next.js/React frontends, and native Swift/SwiftUI for macOS & iOS, I love bridging deep technical architectures with stunning user experiences.',
    'Currently building open-source developer tooling, AI coding agent workflows, and scalable edge applications running on Cloudflare Workers and D1 databases.',
  ],
  location: 'Ho Chi Minh City, Vietnam 🇻🇳',
  email: 'contact@taido.dev',
  domain: 'taido.dev',
  github: 'https://github.com/Tai-DT',
  githubUsername: 'Tai-DT',
  avatarUrl: 'https://avatars.githubusercontent.com/u/112989159?v=4',
  hireable: true,
  stats: {
    publicRepos: '38+',
    focusAreas: ['AI Agents & MCP', 'Full-Stack Web', 'Swift & macOS', 'Cloudflare Edge'],
    experienceYears: '5+ Years',
  }
};

export const PROJECTS: Project[] = [
  {
    id: 'archify-mcp',
    title: 'Archify MCP',
    tagline: 'Comprehensive 23-tool Architecture & Lifecycle MCP Server',
    description: 'A production-grade Model Context Protocol (MCP) server providing 23 specialized tools for architectural analysis, technology stack recommendations, cloud cost estimation, and complete project lifecycle planning for AI coding agents.',
    category: 'AI & MCP',
    tags: ['TypeScript', 'Model Context Protocol', 'Node.js', 'AI Agents', 'Architecture'],
    githubUrl: 'https://github.com/Tai-DT/archify-mcp',
    featured: true,
    badge: '23 MCP Tools'
  },
  {
    id: 'codex-desk',
    title: 'Codex Desk',
    tagline: 'Multi-Account ChatGPT Plus & Codex Desktop Manager',
    description: 'Cross-platform desktop application crafted to organize, switch, and synchronize multiple ChatGPT Plus and OpenAI Codex accounts across macOS and Windows with zero friction.',
    category: 'Dev Tools',
    tags: ['TypeScript', 'Electron', 'React', 'Tailwind CSS', 'macOS / Windows'],
    githubUrl: 'https://github.com/Tai-DT/codex-desk',
    featured: true,
    stars: 15,
    badge: '15★ Stars'
  },
  {
    id: 'echolens',
    title: 'EchoLens',
    tagline: 'Low-Latency Android to Mac Camera & Audio Streaming',
    description: 'Streams Android camera feed and microphone to macOS in real-time via hardware-accelerated H.264/JPEG streaming. Features a sleek, native macOS Liquid Glass interface with dynamic controls.',
    category: 'Mobile & Native',
    tags: ['Swift', 'SwiftUI', 'macOS Native', 'Kotlin / Android', 'H.264', 'Liquid Glass'],
    githubUrl: 'https://github.com/Tai-DT/EchoLens',
    featured: true,
    stars: 4,
    badge: 'macOS Native'
  },
  {
    id: 'hue-travel',
    title: 'Huế Travel Platform',
    tagline: 'Full-Stack Tourism Ecosystem: Go API + React Native + Next.js',
    description: 'An enterprise-ready travel and culture platform featuring a high-concurrency Go (Gin) REST API backend, a cross-platform React Native mobile application for travelers, and a Next.js provider & admin portal.',
    category: 'Full-Stack Web',
    tags: ['Go (Gin)', 'React Native', 'Next.js 15', 'PostgreSQL', 'Tailwind CSS'],
    githubUrl: 'https://github.com/Tai-DT/Hue_Travel',
    featured: true,
    badge: 'Go + Next.js'
  },
  {
    id: 'datashuttle',
    title: 'DataShuttle',
    tagline: 'High-Speed Smart Data Shuttling Utility for macOS',
    description: 'Native macOS utility application engineered in Swift for smart, verifiable data shuttling and backup pipelines between internal NVMe SSDs, external Thunderbolt drives, and cloud targets.',
    category: 'Mobile & Native',
    tags: ['Swift', 'SwiftUI', 'macOS', 'File Operations', 'Storage API'],
    githubUrl: 'https://github.com/Tai-DT/DataShuttle',
    featured: false,
    badge: 'Swift Utility'
  },
  {
    id: 'aistemx',
    title: 'AISTEM X',
    tagline: 'International STEM Knowledge Vault & Scholarship Engine',
    description: 'Global STEM educational platform featuring automated CAS problem practice, AI-assisted question breakdown, and an international scholarship discovery engine (aistemx.com).',
    category: 'AI & MCP',
    tags: ['Python', 'Next.js', 'AI Solvers', 'STEM Engine', 'Cloudflare'],
    githubUrl: 'https://github.com/Tai-DT/aistemx',
    featured: false,
    badge: 'aistemx.com'
  },
  {
    id: 'google-play-testing',
    title: 'Google Play Closed Testing Guide',
    tagline: 'DevOps Checklist for 12 Testers / 14 Days & App Store Deploy',
    description: 'Curated technical guide, automated testing checklists, and community resources helping mobile developers satisfy Google Play Console 12 testers / 14 days closed testing requirement and streamline App Store reviews.',
    category: 'Dev Tools',
    tags: ['Android QA', 'Play Console', 'App Store', 'Mobile DevOps', 'Testing'],
    githubUrl: 'https://github.com/Tai-DT/awesome-google-play-closed-testing',
    demoUrl: 'https://te2sr.com',
    featured: false,
    badge: 'te2sr.com'
  },
  {
    id: 'studygrid-neostudy',
    title: 'StudyGrid & NeoStudy',
    tagline: 'AI Time-Blocking Planner & Smart Mathematics Solver',
    description: 'Productivity suite combining an AI-powered time-blocking study planner designed with clean macOS light aesthetics and NeoStudy, an AI math problem solver with step-by-step reasoning.',
    category: 'Full-Stack Web',
    tags: ['TypeScript', 'Next.js', 'React', 'AI Problem Solver', 'Tailwind'],
    githubUrl: 'https://github.com/Tai-DT/StudyGrid',
    demoUrl: 'https://studygridstudy-grid.vercel.app',
    featured: false,
    badge: 'AI EdTech'
  }
];

export const STACK_MARQUEE: string[] = [
  'TypeScript', 'Go', 'Rust', 'Swift', 'SwiftUI', 'Model Context Protocol', 'AI Agents',
  'Cloudflare Workers', 'Cloudflare D1', 'Workers AI', 'Astro', 'Next.js', 'React 19',
  'React Native', 'Kotlin / Android', 'Tailwind CSS', 'Three.js', 'Docker', 'PostgreSQL',
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'AI & Agentic Engineering',
    icon: 'Bot',
    skills: [
      { name: 'Model Context Protocol (MCP)', level: 'Advanced', description: 'Custom MCP server architecture, tools, resources & prompts' },
      { name: 'Autonomous Agent Workflows', level: 'Advanced', description: 'Multi-agent orchestration, tool calling & eval-driven development' },
      { name: 'LLM Integration', level: 'Advanced', description: 'OpenAI, Anthropic Claude, Gemini API, local on-device models' },
      { name: 'Prompt & Context Engineering', level: 'Advanced', description: 'Structured outputs, function schemas, dynamic prompt routing' },
    ]
  },
  {
    title: 'Frontend & UI/UX',
    icon: 'Layout',
    skills: [
      { name: 'Next.js 15 & React 19', level: 'Expert', description: 'App Router, Server/Client components, Turbopack, SSR/SSG' },
      { name: 'TypeScript', level: 'Expert', description: 'Strict typing, generic types, robust schema validation' },
      { name: 'Tailwind CSS v4 & Radix UI', level: 'Expert', description: 'Responsive design, design tokens, accessible components' },
      { name: 'Three.js & 3D WebGL', level: 'Intermediate', description: 'React Three Fiber, GLTF models, interactive shaders & lighting' },
      { name: 'Framer Motion & Spring', level: 'Advanced', description: 'Micro-animations, layout transitions, gesture physics' },
    ]
  },
  {
    title: 'Backend, Cloud & Cloudflare',
    icon: 'Server',
    skills: [
      { name: 'Cloudflare Ecosystem', level: 'Advanced', description: 'Workers, Pages, Cloudflare D1 (SQL), KV, Edge compute' },
      { name: 'Go (Golang)', level: 'Advanced', description: 'Gin framework, high-throughput REST APIs, goroutines & channels' },
      { name: 'Node.js & Express', level: 'Expert', description: 'RESTful microservices, WebSocket real-time feeds, auth' },
      { name: 'Python', level: 'Advanced', description: 'FastAPI, data parsing, machine learning & automation scripts' },
      { name: 'SQL & Database Design', level: 'Advanced', description: 'Cloudflare D1, SQLite, PostgreSQL, relational schema modeling' },
    ]
  },
  {
    title: 'Mobile, Desktop & Systems',
    icon: 'Smartphone',
    skills: [
      { name: 'Swift & SwiftUI (macOS / iOS)', level: 'Advanced', description: 'Native Apple platform applications, Liquid Glass UI, storage APIs' },
      { name: 'React Native & Expo', level: 'Advanced', description: 'Cross-platform mobile apps for iOS and Android' },
      { name: 'Electron & Tauri', level: 'Advanced', description: 'Cross-platform desktop tools for macOS and Windows' },
      { name: 'Rust', level: 'Intermediate', description: 'Systems programming, Tauri backends, memory-safe high-performance tooling' },
      { name: 'Hardware & Media Streaming', level: 'Intermediate', description: 'Real-time camera/audio streaming, H.264 encoding' },
    ]
  },
  {
    title: 'DevOps & Tooling',
    icon: 'Terminal',
    skills: [
      { name: 'Git & GitHub Workflows', level: 'Expert', description: 'Branch management, CI/CD actions, release automation' },
      { name: 'Cloudflare Wrangler CLI', level: 'Advanced', description: 'Edge deployment, D1 database migrations, routing rules' },
      { name: 'Docker & Containerization', level: 'Intermediate', description: 'Multi-stage Docker builds, development environments' },
      { name: 'Mobile App Publishing', level: 'Advanced', description: 'Google Play Console closed testing & Apple App Store review cycles' },
    ]
  }
];
