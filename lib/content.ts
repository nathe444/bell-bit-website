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

export const services = [
  {
    id: "understand",
    stage: "Understand",
    title: "System analysis & requirement gathering",
    description:
      "We study the real business problem before writing a line of code — how the organization works today and what the software needs to do.",
  },
  {
    id: "design",
    stage: "Design",
    title: "UI/UX design",
    description:
      "Interfaces designed around how people actually work, so the system is usable from day one.",
  },
  {
    id: "architect",
    stage: "Architect",
    title: "System architecture design & solution engineering",
    description:
      "We define the structure underneath the software — how it will scale, integrate, and hold up under real use.",
  },
  {
    id: "build",
    stage: "Build",
    title: "Custom software & system design and development",
    description:
      "Products and custom digital solutions engineered end-to-end for the client's actual requirements.",
  },
  {
    id: "extend",
    stage: "Extend",
    title: "Mobile application development",
    description:
      "Native and cross-platform mobile experiences that extend a system beyond the desktop.",
  },
  {
    id: "deploy",
    stage: "Deploy",
    title: "Software deployment & infrastructure management",
    description:
      "We take systems live and keep the infrastructure behind them reliable.",
  },
] as const;

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
      "A system designed for hospitals and clinics to track patient flow and medical records across departments.",
    url: null,
  },
] as const;

export const projects = [
  {
    id: "hoomez",
    name: "Hoomez",
    category: "Commerce",
    summary:
      "An e-commerce platform developed for a UAE-based client, focused on construction materials, furniture, and property management.",
    detail:
      "Full e-commerce functionality, AI-powered search using RAG and LLM integration, tender request creation, and video reel uploads for product promotion.",
    industry: "Commerce / Construction",
    image: "/assets/bellbit/projects/hoomez.jpeg",
    imageOrientation: "portrait",
  },
  {
    id: "csms",
    name: "CSMS",
    category: "Optimization",
    summary:
      "A university-level scheduling system developed for Addis Ababa University.",
    detail:
      "Manages academic resources and includes a constraint satisfaction engine that automatically generates semester schedules based on curriculum, instructors, classrooms, and availability.",
    industry: "Education",
    image: "/assets/bellbit/projects/csms.png",
    imageOrientation: "landscape",
  },
  {
    id: "guansa",
    name: "Guansa",
    category: "Enterprise",
    summary:
      "A corporate platform for Guansa PLC that showcases all subsidiary companies, including Guansa Mead and Guansa Export.",
    detail:
      "Designed with a modern, clean style and optimized for fast loading and easy use. Includes a custom CMS, allowing the company to manage and update content independently.",
    industry: "Enterprise / Corporate",
    image: "/assets/bellbit/projects/guansa.png",
    imageOrientation: "landscape",
  },
  {
    id: "tena-bit",
    name: "Tena-BIT",
    category: "Healthcare",
    summary:
      "A healthcare system designed to track patient movement and medical records.",
    detail:
      "Covers registration, OPD, laboratory testing, results management, and medication prescription workflows.",
    industry: "Healthcare",
    image: "/assets/bellbit/projects/tena-bit-dashboard.jpeg",
    imageOrientation: "landscape",
  },
] as const;

export const technologies = {
  backend: ["Nest.js", "Spring Boot"],
  mobile: ["Flutter", "React Native"],
  frontend: ["React", "SvelteKit"],
  platform: ["DevOps", "Software Architecture"],
} as const;

export const architectureStages = [
  { id: "problem", label: "Problem", description: "A real business challenge, as it exists before any solution." },
  { id: "requirements", label: "Requirements", description: "System analysis and requirement gathering with the client." },
  { id: "architecture", label: "Architecture", description: "Solution engineering and system architecture design." },
  { id: "engineering", label: "Engineering", description: "Custom software and system development." },
  { id: "deployment", label: "Deployment", description: "Software deployment and infrastructure management." },
  { id: "system", label: "System", description: "A reliable, scalable, well-designed system in production." },
] as const;

/**
 * Logos come from the real logo marks embedded in BellBit Company Profile.pdf
 * (extracted and matched by their own visible name/wordmark). Where a name's
 * logo couldn't be confidently identified in the source document, `logo` is
 * `null` and the UI falls back to a plain wordmark rather than guessing.
 */
export const clients = [
  { name: "Addis Ababa University", logo: "/assets/bellbit/logos/addis-ababa-university.png" },
  { name: "Guansa PLC", logo: null },
  { name: "Lucky Path Construction PLC", logo: "/assets/bellbit/logos/lucky-path-construction.png" },
  { name: "Abyssinia Medium Clinic", logo: "/assets/bellbit/logos/abyssinia-medium-clinic.png" },
  { name: "DAK Trading PLC", logo: "/assets/bellbit/logos/dak-trading.png" },
  { name: "Hoomez LTD", logo: "/assets/bellbit/logos/hoomez.png" },
  { name: "Nain MCH Specialty Center", logo: "/assets/bellbit/logos/nain-mch.jpeg" },
] as const;

export const partners = [
  { name: "Africom Technologies", logo: "/assets/bellbit/logos/africom-technologies.png" },
  { name: "BE Technologies", logo: null },
  { name: "Muyalogy", logo: "/assets/bellbit/logos/muyalogy.png" },
  { name: "SkyKin Technologies", logo: null },
  { name: "Yesar Business Group", logo: "/assets/bellbit/logos/yesar-business-group.jpeg" },
] as const;

export const industries = [
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Patient movement and medical-record workflows, from registration through prescription.",
    project: "Tena-BIT",
  },
  {
    id: "education",
    name: "Education",
    description: "Academic scheduling built on a constraint satisfaction engine.",
    project: "CSMS",
  },
  {
    id: "commerce-construction",
    name: "Commerce & Construction",
    description: "E-commerce, tendering, and property management for the construction sector.",
    project: "Hoomez",
  },
  {
    id: "enterprise",
    name: "Enterprise & Corporate",
    description: "Corporate platforms and content systems for multi-subsidiary organizations.",
    project: "Guansa",
  },
  {
    id: "business-inventory",
    name: "Business & Inventory",
    description: "Cloud-based stock and inventory management for growing businesses.",
    project: "BinWise",
  },
] as const;

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
  { label: "Approach", href: "#architecture" },
  { label: "Contact", href: "#contact" },
] as const;
