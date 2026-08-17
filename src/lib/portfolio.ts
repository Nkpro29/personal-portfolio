export type ArchitectureNode = {
  label: string;
  detail: string;
};

export type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  highlights: string[];
  technologies: string[];
};

export type ProjectItem = {
  id: string;
  slug: string;
  title: string;
  tag: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
  technologies: string[];
  imageUrl: string;
  projectUrl: string | null;
  pipeline: string[];
  architecture: ArchitectureNode[];
};

export type SkillItem = {
  id: string;
  name: string;
  category: string;
  related: string[];
};

export type PublicationItem = {
  id: string;
  title: string;
  description: string;
  url: string | null;
};

export type EducationItem = {
  id: string;
  institution: string;
  degree: string;
  detail: string | null;
  startDate: string;
  endDate: string;
};

export type SocialItem = {
  id: string;
  platform: string;
  label: string;
  url: string | null;
};

export type KnowledgeItem = {
  id: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
  sourceType: string;
  sourceId: string | null;
};

export type BuildingConcept = {
  id: string;
  index: string;
  title: string;
  items: string[];
};

export type Portfolio = {
  name: string;
  shortName: string;
  location: string;
  eyebrow: string;
  headline: string;
  typewriterPhrases: string[];
  supportingCopy: string;
  currentlyBuilding: string;
  stackLabel: string;
  availability: string;
  bio: string;
  aboutHeading: string;
  aboutBody: string[];
  systemLayers: string[];
  heroPoster: string;
  heroVideoUrl: string | null;
  nav: { href: string; label: string }[];
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  publications: PublicationItem[];
  education: EducationItem[];
  social: SocialItem[];
  building: BuildingConcept[];
  knowledge: KnowledgeItem[];
};

const linkedIn = process.env.NEXT_PUBLIC_LINKEDIN_URL || "";
const github = process.env.NEXT_PUBLIC_GITHUB_URL || "";
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
const heroVideo = process.env.NEXT_PUBLIC_HERO_VIDEO_URL || "";

export const portfolio: Portfolio = {
  name: "Naman Kulshresth",
  shortName: "Naman",
  location: "Pune, Maharashtra",
  eyebrow: "SOFTWARE ENGINEER · AI · SYSTEMS",
  headline: "I build intelligent products and the systems behind them.",
  typewriterPhrases: [
    "AI Products",
    "Voice Agents",
    "Scalable Systems",
    "Full-Stack Platforms",
    "Developer Infrastructure",
  ],
  supportingCopy:
    "Full-stack software engineer building production systems across AI, backend infrastructure, cloud, and product engineering.",
  currentlyBuilding: "Currently building AI systems",
  stackLabel: "Full Stack · AI · Infrastructure",
  availability: "Available for interesting problems",
  bio: "Naman is a full-stack software engineer who works across frontend, backend, databases, AI systems, and cloud infrastructure. His work is not limited to implementing UI — he designs the path from product surface to APIs, data, models, and the infrastructure that keeps it running.",
  aboutHeading: "Engineering with a systems mindset.",
  aboutBody: [
    "Naman is a full-stack software engineer who works across frontend, backend, databases, AI systems, and cloud infrastructure.",
    "The work is not limited to implementing UI. He designs the path from product surface through APIs, data, models, and the infrastructure that keeps it running in production.",
  ],
  systemLayers: [
    "USER",
    "NEXT.JS",
    "API / SERVICES",
    "POSTGRESQL / VECTOR STORAGE",
    "AI / RAG / LLM",
    "CLOUD INFRASTRUCTURE",
    "OBSERVABILITY",
  ],
  heroPoster: "/media/hero-poster.png",
  heroVideoUrl: heroVideo || null,
  nav: [
    { href: "#work", label: "Work" },
    { href: "#experience", label: "Experience" },
    { href: "#writing", label: "Writing" },
    { href: "#about", label: "About" },
  ],
  experiences: [
    {
      id: "alnex",
      company: "Alnex.ai",
      role: "Full Stack Developer",
      startDate: "July 2025",
      endDate: "Present",
      highlights: [
        "Built the memory system for a production voice agent, designing retrieval and context persistence logic that achieved 97% accuracy on recall/response benchmarks.",
        "Architected an RBAC based events dashboard with Next.js and PostgreSQL, enforcing fine-grained access control across 3+ user roles and lifting data security compliance by 40%.",
        "Engineered PostgreSQL schemas with relational mappings and indexing strategies, scaling to 10K+ event records while cutting query latency by 30%.",
        "Provisioned and operated API infrastructure on Microsoft Azure using Virtual Machines and Container Apps, configuring Nginx forward proxy and load routing.",
        "Established database backup strategies and observability tooling with Grafana.",
      ],
      technologies: [
        "Next.js",
        "Node.js",
        "PostgreSQL",
        "Vector Storage",
        "FastAPI",
        "Docker",
        "Azure",
      ],
    },
    {
      id: "india-accelerator",
      company: "India Accelerator Pvt. Ltd.",
      role: "Software Developer Intern",
      startDate: "November 2024",
      endDate: "July 2025",
      highlights: [
        "Shipped a full-stack web platform with Next.js, React.js, and Node.js, raising client onboarding efficiency by 35%.",
        "Engineered PostgreSQL schemas with Prisma ORM, cutting query latency by 40%.",
        "Built secure authentication and role-based access control supporting 3,000+ monthly active users.",
        "Enforced form validation and type safety using Zod and TypeScript, reducing frontend bugs by 50%.",
      ],
      technologies: ["Next.js", "Node.js", "Express.js", "PostgreSQL"],
    },
  ],
  projects: [
    {
      id: "augustun",
      slug: "augustun",
      title: "Augustun",
      tag: "AI · Healthcare · SaaS",
      startDate: "March 2026",
      endDate: "Present",
      description:
        "An AI scribe platform that records clinical sessions and converts them into accurate, structured clinical notes.",
      highlights: [
        "Saves doctors 2–3 hours daily on documentation.",
        "Built using Next.js and PostgreSQL.",
        "Designed modular architecture for EHR integrations.",
        "Built transparent per-employee billing settings.",
      ],
      technologies: ["Next.js", "PostgreSQL"],
      imageUrl: "/media/augustun.png",
      projectUrl: "https://augustun.com",
      pipeline: ["Conversation", "AI", "Structured Clinical Note"],
      architecture: [
        { label: "Frontend", detail: "Next.js" },
        { label: "API", detail: "Application services" },
        { label: "PostgreSQL", detail: "Clinical data" },
        { label: "AI Processing", detail: "Session to structured notes" },
        { label: "EHR Integrations", detail: "Modular adapters" },
      ],
    },
    {
      id: "newspod",
      slug: "newspod",
      title: "NewspoD",
      tag: "AI · RAG · Media",
      startDate: "October 2024",
      endDate: "Present",
      description:
        "An AI-driven platform that converts real-time news articles into listenable podcasts.",
      highlights: [
        "End-to-end AI pipeline.",
        "Retrieval-augmented generation (RAG).",
        "Automated summarization.",
        "Approximately 90% reduction in manual effort.",
      ],
      technologies: ["RAG", "LLM"],
      imageUrl: "/media/newspod.png",
      projectUrl: null,
      pipeline: [
        "News article",
        "Retrieval",
        "AI summarization",
        "Voice",
        "Podcast",
      ],
      architecture: [
        { label: "News Sources", detail: "Real-time articles" },
        { label: "RAG", detail: "Retrieval pipeline" },
        { label: "LLM", detail: "Language model" },
        { label: "Summarization", detail: "Automated condensation" },
        { label: "Audio Generation", detail: "Listenable podcast" },
      ],
    },
  ],
  skills: [
    { id: "cpp", name: "C/C++", category: "Languages", related: ["Python", "SQL"] },
    {
      id: "javascript",
      name: "JavaScript",
      category: "Languages",
      related: ["TypeScript", "React.js", "Node.js", "Express.js"],
    },
    {
      id: "typescript",
      name: "TypeScript",
      category: "Languages",
      related: ["JavaScript", "React.js", "Next.js", "Node.js", "Zod"],
    },
    {
      id: "python",
      name: "Python",
      category: "Languages",
      related: ["FastAPI", "SQLAlchemy", "Pydantic", "LangChain", "RAG"],
    },
    {
      id: "sql",
      name: "SQL",
      category: "Languages",
      related: ["PostgreSQL", "Prisma", "Node.js"],
    },
    {
      id: "html",
      name: "HTML",
      category: "Frontend",
      related: ["CSS", "React.js", "EJS"],
    },
    {
      id: "css",
      name: "CSS",
      category: "Frontend",
      related: ["HTML", "Tailwind CSS", "React.js"],
    },
    {
      id: "react",
      name: "React.js",
      category: "Frontend",
      related: ["Next.js", "TypeScript", "Redux", "Tailwind CSS"],
    },
    {
      id: "nextjs",
      name: "Next.js",
      category: "Frontend",
      related: ["React.js", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    },
    {
      id: "tailwind",
      name: "Tailwind CSS",
      category: "Frontend",
      related: ["CSS", "Next.js", "React.js"],
    },
    {
      id: "threejs",
      name: "Three.js",
      category: "Frontend",
      related: ["JavaScript", "React.js"],
    },
    {
      id: "redux",
      name: "Redux",
      category: "Frontend",
      related: ["React.js", "JavaScript"],
    },
    {
      id: "ejs",
      name: "EJS",
      category: "Frontend",
      related: ["HTML", "Node.js", "Express.js"],
    },
    {
      id: "nodejs",
      name: "Node.js",
      category: "Backend / Tools",
      related: ["Express.js", "Next.js", "PostgreSQL", "REST APIs", "Prisma"],
    },
    {
      id: "express",
      name: "Express.js",
      category: "Backend / Tools",
      related: ["Node.js", "REST APIs", "EJS"],
    },
    {
      id: "fastapi",
      name: "FastAPI",
      category: "Backend / Tools",
      related: ["Python", "Pydantic", "REST APIs"],
    },
    {
      id: "rest",
      name: "REST APIs",
      category: "Backend / Tools",
      related: ["Node.js", "Express.js", "FastAPI"],
    },
    {
      id: "socketio",
      name: "Socket.IO",
      category: "Backend / Tools",
      related: ["Node.js", "JavaScript"],
    },
    { id: "git", name: "Git", category: "Backend / Tools", related: ["GitHub"] },
    { id: "github", name: "GitHub", category: "Backend / Tools", related: ["Git"] },
    {
      id: "sqlalchemy",
      name: "SQLAlchemy",
      category: "Backend / Tools",
      related: ["Python", "SQL", "PostgreSQL"],
    },
    {
      id: "pydantic",
      name: "Pydantic",
      category: "Backend / Tools",
      related: ["Python", "FastAPI"],
    },
    {
      id: "prisma",
      name: "Prisma",
      category: "Backend / Tools",
      related: ["PostgreSQL", "SQL", "Node.js", "Next.js"],
    },
    {
      id: "mongodb",
      name: "MongoDB",
      category: "Database / Platforms",
      related: ["Node.js"],
    },
    {
      id: "postgresql",
      name: "PostgreSQL",
      category: "Database / Platforms",
      related: ["Prisma", "SQL", "Node.js", "Next.js", "Azure", "Supabase"],
    },
    {
      id: "supabase",
      name: "Supabase",
      category: "Database / Platforms",
      related: ["PostgreSQL", "Next.js"],
    },
    {
      id: "azure",
      name: "Azure",
      category: "Database / Platforms",
      related: ["Docker", "PostgreSQL", "Nginx"],
    },
    { id: "notion", name: "Notion", category: "Database / Platforms", related: [] },
    {
      id: "docker",
      name: "Docker",
      category: "Database / Platforms",
      related: ["Azure", "Nginx"],
    },
    {
      id: "rag",
      name: "RAG",
      category: "AI",
      related: ["LLM", "LangChain", "PostgreSQL", "Python"],
    },
    {
      id: "llm",
      name: "LLM",
      category: "AI",
      related: ["RAG", "LangChain", "Python"],
    },
    {
      id: "langchain",
      name: "LangChain",
      category: "AI",
      related: ["RAG", "LLM", "Python"],
    },
  ],
  publications: [
    {
      id: "devcraft",
      title: "The DevCraft",
      description:
        "Technical writing on system design patterns, scalability trade-offs, and real-world architecture decisions.",
      url: null,
    },
  ],
  education: [
    {
      id: "sliet",
      institution: "Sant Longowal Institute of Engineering and Technology",
      degree: "B.Tech",
      detail: "CGPA 8.98",
      startDate: "September 2021",
      endDate: "June 2025",
    },
  ],
  social: [
    { id: "linkedin", platform: "linkedin", label: "LinkedIn", url: linkedIn || null },
    { id: "github", platform: "github", label: "GitHub", url: github || null },
    {
      id: "email",
      platform: "email",
      label: "Email",
      url: email ? `mailto:${email}` : null,
    },
  ],
  building: [
    {
      id: "ai",
      index: "01",
      title: "AI Systems",
      items: ["RAG", "LLMs", "Voice Agents", "Memory Systems"],
    },
    {
      id: "backend",
      index: "02",
      title: "Backend Systems",
      items: ["APIs", "PostgreSQL", "Authentication", "RBAC", "Scalable architecture"],
    },
    {
      id: "infra",
      index: "03",
      title: "Infrastructure",
      items: ["Docker", "Azure", "Nginx", "Observability", "Backups"],
    },
  ],
  knowledge: [],
};

portfolio.knowledge = buildKnowledge(portfolio);

function buildKnowledge(data: Portfolio): KnowledgeItem[] {
  const items: KnowledgeItem[] = [
    {
      id: "profile-core",
      category: "profile",
      title: "Who Naman is",
      content:
        "Naman Kulshresth is a full-stack software engineer based in Pune, Maharashtra. He focuses on AI products, backend systems, system design, and scalable infrastructure. He currently works as a Full Stack Developer at Alnex.ai (July 2025 – Present).",
      keywords: [
        "who",
        "naman",
        "specialize",
        "about",
        "engineer",
        "location",
        "pune",
        "introduction",
        "profile",
      ],
      sourceType: "profile",
      sourceId: "profile",
    },
    {
      id: "profile-approach",
      category: "profile",
      title: "Engineering approach",
      content: data.bio,
      keywords: [
        "approach",
        "systems",
        "mindset",
        "full-stack",
        "fullstack",
        "product",
        "infrastructure",
      ],
      sourceType: "profile",
      sourceId: "approach",
    },
    {
      id: "contact-policy",
      category: "contact",
      title: "How to contact Naman",
      content: contactKnowledge(data),
      keywords: ["contact", "email", "hire", "reach", "linkedin", "github", "connect"],
      sourceType: "contact",
      sourceId: "contact",
    },
    {
      id: "education-sliet",
      category: "education",
      title: "Education",
      content:
        "Naman completed a B.Tech at Sant Longowal Institute of Engineering and Technology (September 2021 – June 2025) with a CGPA of 8.98.",
      keywords: [
        "education",
        "college",
        "university",
        "degree",
        "btech",
        "b.tech",
        "cgpa",
        "sliet",
        "longowal",
        "school",
      ],
      sourceType: "education",
      sourceId: "sliet",
    },
    {
      id: "off-topic",
      category: "policy",
      title: "Scope of this assistant",
      content:
        "This assistant only answers questions about Naman Kulshresth's work, experience, projects, skills, education, writing, and how to contact him. It does not answer unrelated general questions.",
      keywords: ["help", "what can you", "assistant"],
      sourceType: "policy",
      sourceId: "scope",
    },
  ];

  for (const job of data.experiences) {
    items.push({
      id: `exp-${job.id}`,
      category: "experience",
      title: `${job.role} at ${job.company}`,
      content: `${job.role} at ${job.company}, ${job.startDate} – ${job.endDate}. ${job.highlights.join(" ")} Technologies: ${job.technologies.join(", ")}.`,
      keywords: [
        job.company.toLowerCase(),
        job.role.toLowerCase(),
        "work",
        "job",
        "experience",
        "employer",
        "alnex",
        "internship",
        "intern",
        ...job.technologies.map((t) => t.toLowerCase()),
      ],
      sourceType: "experience",
      sourceId: job.id,
    });
  }

  for (const project of data.projects) {
    items.push({
      id: `proj-${project.id}`,
      category: "project",
      title: project.title,
      content: `${project.title} (${project.tag}, ${project.startDate} – ${project.endDate}): ${project.description} ${project.highlights.join(" ")} Architecture: ${project.architecture.map((n) => `${n.label} — ${n.detail}`).join("; ")}.`,
      keywords: [
        project.title.toLowerCase(),
        project.slug,
        "project",
        "built",
        "product",
        ...project.tag.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean),
        ...project.technologies.map((t) => t.toLowerCase()),
      ],
      sourceType: "project",
      sourceId: project.id,
    });
  }

  const byCategory = new Map<string, string[]>();
  for (const skill of data.skills) {
    const list = byCategory.get(skill.category) ?? [];
    list.push(skill.name);
    byCategory.set(skill.category, list);
  }

  items.push({
    id: "skills-all",
    category: "skills",
    title: "Technical skills",
    content: `Naman's skills, grouped as on his resume: ${[...byCategory.entries()].map(([cat, names]) => `${cat}: ${names.join(", ")}`).join(". ")}. Prisma, Zod, TypeScript, Nginx, Grafana, Vector Storage, and Microsoft Azure also appear in his professional work.`,
    keywords: [
      "skills",
      "technologies",
      "tech stack",
      "languages",
      "tools",
      "database",
      "ai",
      "know",
      "stack",
    ],
    sourceType: "skills",
    sourceId: "all",
  });

  for (const pub of data.publications) {
    items.push({
      id: `pub-${pub.id}`,
      category: "writing",
      title: pub.title,
      content: `${pub.title}: ${pub.description}${pub.url ? ` URL: ${pub.url}` : " No public article URL is configured in this portfolio."}`,
      keywords: ["writing", "blog", "publication", "devcraft", "article", "linkedin"],
      sourceType: "publication",
      sourceId: pub.id,
    });
  }

  items.push({
    id: "building-focus",
    category: "focus",
    title: "What Naman likes building",
    content:
      "Naman likes building AI systems (RAG, LLMs, voice agents, memory systems), backend systems (APIs, PostgreSQL, authentication, RBAC, scalable architecture), and infrastructure (Docker, Azure, Nginx, observability, backups).",
    keywords: ["building", "focus", "ai systems", "backend", "infrastructure", "like"],
    sourceType: "focus",
    sourceId: "building",
  });

  return items;
}

function contactKnowledge(data: Portfolio): string {
  const parts = [
    "The best way to reach Naman is through the contact form on this portfolio.",
  ];
  const mail = data.social.find((s) => s.platform === "email")?.url;
  const li = data.social.find((s) => s.platform === "linkedin")?.url;
  const gh = data.social.find((s) => s.platform === "github")?.url;
  if (mail) parts.push(`Email: ${mail.replace("mailto:", "")}.`);
  if (li) parts.push(`LinkedIn: ${li}.`);
  if (gh) parts.push(`GitHub: ${gh}.`);
  if (!mail && !li && !gh) {
    parts.push(
      "Public email, LinkedIn, and GitHub URLs are not configured in this portfolio yet.",
    );
  }
  return parts.join(" ");
}

export const skillCategories = [
  "Languages",
  "Frontend",
  "Backend / Tools",
  "Database / Platforms",
  "AI",
] as const;

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
