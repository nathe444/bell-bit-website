/**
 * Single source of truth for every factual claim on the site.
 *
 * Every string here is traceable to either the master build brief or
 * "BellBit Company Profile.pdf". Nothing in this file is invented.
 * Components should import from here rather than hardcoding copy,
 * so the whole site can be audited against the source material in one place.
 */

export const company = {
  name: "BellBit Software Technologies PLC",
  shortName: "BellBit",
  founded: "01/10/2024",
  licensed: "08/10/2025",
  teamSize: 8,
  overview:
    "BellBit Software Technologies is a software development company that builds both software products and custom digital solutions for clients. We help organizations and individuals solve real business problems through reliable, scalable, and well-designed software systems.",
  footerBlurb: "Software products and custom solutions for real business problems.",
  mission:
    "To create digital solutions and technologies that help people run their businesses efficiently.",
  vision:
    "To ensure everyone has access to the tools and solutions needed to manage their businesses effectively and confidently.",
  values: ["Continuous learning", "Integrity", "Professionalism"],
  history:
    "BellBit Software Technologies was established on 01/10/2024 and officially licensed on 08/10/2025. The company began with a small group of developers focused on building solutions that benefit the general public. As client needs grew, BellBit expanded its focus to solving real-world business challenges by transforming them into practical digital solutions. The team grew steadily, from three members to five, then seven, and now eight professionals.",
  historyContinued:
    "After becoming a legally registered entity, BellBit started delivering larger projects for both domestic and international clients. Over time, the company has successfully completed numerous projects, ranging from simple corporate websites to complex, constraint-based systems for well-known organizations nationwide. BellBit continues to grow with a strong focus on quality and impact.",
} as const;

export const contact = {
  phonePrimary: "+251949878306",
  phoneSecondary: "0968127581",
  email: "info@bell-bit.com",
  closingStatement:
    "At BellBit Software Technologies, we believe the best solutions come from close collaboration. Whether you are starting a new idea, improving an existing system, or looking for a reliable technology partner, we are ready to help.",
  closingStatementContinued:
    "We take time to understand your needs, design the right solution, and build software that works for your business. From planning and development to deployment and support, we work with you at every step.",
  referencesNote: "Client references and case studies are available upon request.",
} as const;

export const servicesSection = {
  title: "Our Services",
} as const;

export const servicePhases = [
  { id: "discover", label: "Discover" },
  { id: "design", label: "Design" },
  { id: "build", label: "Build" },
  { id: "operate", label: "Operate" },
] as const;

export type ServicePhaseId = (typeof servicePhases)[number]["id"];

export const services = [
  {
    id: "analysis",
    phase: "discover" as const,
    title: "System analysis and requirement gathering",
    tagline: "Map the real problem before a single line of code is written.",
  },
  {
    id: "custom-software",
    phase: "design" as const,
    title: "Custom software design and development",
    tagline: "Shape and build software tailored to how your organization works.",
  },
  {
    id: "system-design",
    phase: "build" as const,
    title: "System design and implementation",
    tagline: "Turn requirements into working systems — designed right, built to last.",
  },
  {
    id: "architecture",
    phase: "build" as const,
    title: "System architecture design & Solution engineering",
    tagline: "Structure that scales, integrates, and holds up under load.",
  },
  {
    id: "deployment",
    phase: "operate" as const,
    title: "Software deployment and infrastructure management",
    tagline: "Take it live and keep the infrastructure behind it reliable.",
  },
  {
    id: "mobile",
    phase: "build" as const,
    title: "Mobile application development",
    tagline: "Extend the system into native and cross-platform experiences.",
  },
  {
    id: "uiux",
    phase: "design" as const,
    title: "UI/UX design",
    tagline: "Interfaces built around how people actually work.",
  },
] as const;

/** Globe markers / arcs for the services section. */
const HQ: [number, number] = [9.032, 38.746];

export const servicesGlobe = {
  markers: [
    { id: "hq", location: HQ, label: "Addis Ababa" },
    { id: "europe", location: [51.507, -0.127] as [number, number], label: "Europe" },
    { id: "dubai", location: [25.2048, 55.2708] as [number, number], label: "Dubai" },
    { id: "china", location: [39.9042, 116.4074] as [number, number], label: "China" },
    {
      id: "south-africa",
      location: [-26.2041, 28.0473] as [number, number],
      label: "South Africa",
    },
  ],
  arcs: [
    { id: "arc-london", from: HQ, to: [51.507, -0.127] as [number, number] },
    { id: "arc-dubai", from: HQ, to: [25.2048, 55.2708] as [number, number] },
    { id: "arc-china", from: HQ, to: [39.9042, 116.4074] as [number, number] },
    { id: "arc-south-africa", from: HQ, to: [-26.2041, 28.0473] as [number, number] },
  ],
} as const;

export const products = [
  {
    id: "binwise",
    name: "BinWise",
    tag: "Inventory Management System",
    description:
      "A cloud-based inventory and stock management system that allows businesses to easily register, manage inventory, track stock movement, and generate reports.",
    url: "binwise.bell-bit.com",
  },
  {
    id: "tena-bit-product",
    name: "Tena-Bit",
    tag: "Patient Record Tracking Management System",
    description:
      "A healthcare system designed to track patient movement and medical records across registration, OPD, laboratory testing, results management, and medication prescription workflows.",
    url: null,
  },
] as const;

export const projectsSection = {
  eyebrow: "Case dossiers",
  title: "One engineering capability. Different systems.",
  description:
    "BellBit has delivered large projects for both domestic and international clients, from small scale website development to complex system development. These are some of the works we have done previously.",
} as const;

export const projects = [
  {
    id: "hoomez",
    name: "Hoomez",
    category: "Commerce",
    clientId: "hoomez",
    summary:
      "An e-commerce platform developed for a UAE-based client, focused on construction materials, furniture, and property management.",
    detail:
      "The system includes full e-commerce functionality, AI-powered search using RAG and LLM integration, tender request creation, and video reel uploads for product promotion.",
    industry: "Commerce / Construction",
    image: "/assets/bellbit/projects/hoomez.png",
    imageAspect: "636 / 852",
  },
  {
    id: "lucky-path",
    name: "Lucky Path",
    category: "ERP",
    clientId: "lucky-path",
    summary:
      "A custom and tailored semi-complete ERP system implemented to support the company's core business operations, workflows, and management processes.",
    detail: "",
    industry: "Construction",
    image: "/assets/bellbit/projects/lucky-path.png",
    imageAspect: "664 / 436",
  },
  {
    id: "csms",
    name: "AAU CSMS",
    category: "Optimization",
    clientId: "csms",
    summary: "A university-level scheduling system developed for Addis Ababa University.",
    detail:
      "It manages academic resources and includes a constraint satisfaction engine that automatically generates semester schedules based on curriculum, instructors, classrooms, and availability.",
    industry: "Education",
    image: "/assets/bellbit/projects/csms.png",
    imageAspect: "540 / 369",
  },
  {
    id: "guansa",
    name: "Guansa",
    category: "Enterprise",
    clientId: "guansa",
    summary:
      "The Guansa PLC website is a corporate platform that showcases all subsidiary companies, including Guansa Mead and Guansa Export.",
    detail:
      "It was designed with a modern, clean style and optimized for fast loading and easy use. The website includes a custom CMS, allowing the company to manage and update content independently.",
    industry: "Enterprise / Corporate",
    image: "/assets/bellbit/projects/guansa.png",
    imageAspect: "576 / 289",
  },
  {
    id: "tena-bit",
    name: "Tena-BIT",
    category: "Healthcare",
    clientId: null,
    summary:
      "A healthcare system designed to track patient movement and medical records across registration, OPD, laboratory testing, results management, and medication prescription workflows.",
    detail:
      "This system has been implemented in two health care facilities, Abyssinia Clinic and Nain MCH.",
    industry: "Healthcare",
    image: "/assets/bellbit/projects/tena-bit-dashboard.jpeg",
    imageAspect: "16 / 9",
  },
] as const;

export const technologySection = {
  title: "Our Technology stack",
} as const;

export const technologyGroups = [
  {
    id: "frontend-mobile",
    label: "Frontend & Mobile",
    title: "Interfaces and applications",
    description:
      "From web experiences to native and cross-platform apps — the full surface area users touch.",
    items: [
      "React",
      "Next.js",
      "Tailwind",
      "HTML",
      "CSS",
      "SvelteKit",
      "WordPress",
      "Flutter",
      "React Native",
      "Swift",
      "Dart",
    ],
    iconSlugs: [
      "react",
      "nextdotjs",
      "tailwindcss",
      "html5",
      "css",
      "svelte",
      "wordpress",
      "flutter",
      "swift",
      "dart",
      "expo",
    ],
  },
  {
    id: "backend",
    label: "Backend",
    title: "Services and APIs",
    description:
      "Server-side systems, APIs, and content layers engineered for reliability and scale.",
    items: [
      "Nest.js",
      "Spring Boot",
      "Java",
      "FastAPI",
      "Node.js",
      "Payload CMS",
      "TypeScript",
    ],
    iconSlugs: [
      "nestjs",
      "springboot",
      "openjdk",
      "fastapi",
      "nodedotjs",
      "typescript",
    ],
  },
  {
    id: "database-infrastructure",
    label: "Database, Infrastructure & Tools",
    title: "Data and operations",
    description:
      "Persistence, messaging, containers, and the tooling that keeps systems running in production.",
    items: [
      "PostgreSQL",
      "Docker",
      "Kubernetes",
      "RabbitMQ",
      "Kafka",
      "Redis",
      "GitHub",
      "Postman",
      "Jest",
    ],
    iconSlugs: [
      "postgresql",
      "docker",
      "kubernetes",
      "rabbitmq",
      "apachekafka",
      "redis",
      "github",
      "postman",
      "jest",
    ],
  },
  {
    id: "automation-ai",
    label: "Automation & AI",
    title: "Intelligent workflows",
    description:
      "Automation pipelines, LLM integrations, and retrieval systems for modern AI-powered products.",
    items: [
      "LangChain",
      "n8n",
      "LangGraph",
      "Vector Database",
      "RAG",
      "Claude",
      "OpenAI",
    ],
    iconSlugs: [
      "langchain",
      "n8n",
      "langgraph",
      "pinecone",
      "weaviate",
      "anthropic",
      "openai",
    ],
  },
] as const;

export type TechnologyGroup = (typeof technologyGroups)[number];

/** @deprecated Use technologyGroups — kept for inline copy references. */
export const technologies = {
  backend: ["Nest.js", "Spring Boot"],
  mobile: ["Flutter", "React Native"],
  frontend: ["React", "SvelteKit"],
  platform: ["DevOps", "Software Architecture"],
} as const;

export const trustSection = {
  title: "Organizations Working With Us",
  description: "Trusted by big names across industries",
} as const;

/**
 * Logos come from the real logo marks embedded in BellBit Company Profile.pdf
 * (extracted and matched by their own visible name/wordmark). Where a name's
 * logo couldn't be confidently identified in the source document, `logo` is
 * `null` and the UI falls back to a typographic monogram rather than guessing.
 */
export const clients = [
  {
    name: "Addis Ababa University",
    logo: "/assets/bellbit/logos/addis-ababa-university.png",
    sector: "Education",
    projectId: "csms",
  },
  {
    name: "Guansa PLC",
    logo: "/assets/bellbit/logos/guansa.svg",
    sector: "Enterprise",
    projectId: "guansa",
  },
  {
    name: "Lucky Path Construction PLC",
    logo: "/assets/bellbit/logos/lucky-path-construction.png",
    sector: "Construction",
    projectId: "lucky-path",
  },
  {
    name: "Abyssinia Medium Clinic",
    logo: "/assets/bellbit/logos/abyssinia-medium-clinic.png",
    sector: "Healthcare",
    projectId: null,
  },
  {
    name: "DAK Trading PLC",
    logo: "/assets/bellbit/logos/dak-trading-plc.png",
    sector: "Commerce",
    projectId: null,
  },
  {
    name: "Hoomez LTD",
    logo: "/assets/bellbit/logos/hoomez.png",
    sector: "Commerce / Construction",
    projectId: "hoomez",
  },
  {
    name: "Nain MCH Specialty Center",
    logo: "/assets/bellbit/logos/nain-mch.jpeg",
    sector: "Healthcare",
    projectId: null,
  },
] as const;

export const partners = [
  {
    name: "Africom Technologies",
    logo: "/assets/bellbit/logos/africom-technologies.png",
    focus: "Technology",
  },
  {
    name: "BE Technologies",
    logo: "/assets/bellbit/logos/be-technologies.png",
    focus: "Technology",
  },
  {
    name: "Muyalogy",
    logo: "/assets/bellbit/logos/muyalogy.png",
    focus: "Technology",
  },
  {
    name: "SkyKin Technologies",
    logo: null,
    focus: "Technology",
  },
  {
    name: "Yesar Business Group",
    logo: "/assets/bellbit/logos/yesar-business-group.jpeg",
    focus: "Business",
  },
] as const;

export const industries = [
  {
    id: "healthcare",
    name: "Healthcare",
    description:
      "We build reliable digital solutions that help healthcare organizations manage their daily operations, improve patient services, and keep important information organized and accessible.",
  },
  {
    id: "education",
    name: "Education",
    description:
      "We help educational institutions simplify their daily operations with reliable digital solutions, including class scheduling and management systems that make planning and coordination easier.",
  },
  {
    id: "commerce-construction",
    name: "Commerce & Construction",
    description:
      "We build e-commerce platforms that make selling easier and help construction companies automate their daily business processes, saving time and improving efficiency.",
  },
  {
    id: "ngos-development",
    name: "NGOs & Development Organizations",
    description:
      "We help NGOs and development organizations manage their research, projects, and data with simple and reliable digital solutions built around their needs.",
  },
  {
    id: "professional-services",
    name: "Professional Services",
    description:
      "We provide digital and AI-powered solutions that help professional service businesses automate routine tasks, improve their workflows, and work more efficiently.",
  },
] as const;

export const whyBellBitSection = {
  title: "Why Work With Us",
  description: "Built by people who are close to the problem and are technically fit!",
} as const;

export const whyBellBit = [
  {
    title: "Real-world problem solving",
    description: "We help organizations and individuals solve real business problems, not hypothetical ones.",
  },
  {
    title: "Reliable, scalable systems",
    description: "Software built to hold up under real use and grow with the client's needs.",
  },
  {
    title: "End-to-end delivery",
    description: "From planning and development to deployment and support, at every step.",
  },
  {
    title: "Technical breadth",
    description: "Backend, mobile, frontend, DevOps, and architecture capability within one team.",
  },
  {
    title: "Continuous learning",
    description: "Regular knowledge-sharing sessions to stay current with modern technologies.",
  },
] as const;

export const team = {
  description:
    "BellBit is built by a team of skilled software engineers, designers, and solution architects with experience across multiple industries. Some specific talent present are Nest.js and Spring Boot backend developers, Flutter and React Native mobile developers, React and SvelteKit frontend developers, DevOps engineers, and architectural experts.",
  size: 8,
  values: ["Continuous learning", "Integrity", "Professionalism"],
} as const;

export const nav = [
  { label: "Work", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
] as const;

/** Fades in on the hero's right side after the primary headline scrolls away. */
export const heroSecondary = {
  title: "What we deliver",
  items: [
    "End To End Solution — From problem to production.",
    "Reliable, Scalable and Relevant",
    "Security, Support and Training",
  ],
} as const;
