export type Locale = 'en' | 'vi' | 'jp';

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Pillar {
  title: string;
  desc: string;
}

export interface Dictionary {
  language: {
    label: string;
    en: string;
    vi: string;
    jp: string;
  };
  nav: {
    about: string;
    projects: string;
    skills: string;
    guestbook: string;
    contact: string;
  };
  hero: {
    status: string;
    greeting: string;
    bio: string;
    viewWork: string;
    getInTouch: string;
    downloadCV: string;
    edgeHosted: string;
    scrollToAbout: string;
  };
  about: {
    title: string;
    bio: string[];
    stats: {
      repos: string;
      edge: string;
      platform: string;
    };
    pillars: {
      ai: Pillar;
      cloud: Pillar;
      mobile: Pillar;
      web: Pillar;
    };
    experience: {
      title: string;
      items: ExperienceItem[];
    };
  };
  projects: {
    title: string;
    subtitlePre: string;
    subtitlePost: string;
    categories: {
      all: string;
      ai: string;
      web: string;
      mobile: string;
      tools: string;
    };
    sourceCode: string;
    visitDemo: string;
  };
  skills: {
    title: string;
    subtitle: string;
  };
  guestbook: {
    title: string;
    subtitlePre: string;
    subtitleDb: string;
    subtitlePost: string;
    signTitle: string;
    signDesc: string;
    nameLabel: string;
    namePlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    recent: string;
    connected: string;
    connecting: string;
    empty: string;
    toastEmpty: string;
    toastSuccess: string;
    toastError: string;
    toastNetwork: string;
  };
  contact: {
    title: string;
    subtitle: string;
    infoTitle: string;
    infoDesc: string;
    email: string;
    github: string;
    location: string;
    domain: string;
    fastResponse: string;
    formTitle: string;
    formDesc: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    toastEmpty: string;
    toastSuccess: string;
    toastError: string;
    toastNetwork: string;
  };
  kai: {
    ask: string;
    greeting: string;
    thinking: string;
    placeholder: string;
    errorApi: string;
    errorNetwork: string;
    quickPrompts: string[];
  };
  footer: {
    tagline: string;
  };
}
