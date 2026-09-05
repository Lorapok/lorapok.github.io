export interface TeammateExperience {
  role: string;
  organization: string;
  period: string;
  description: string;
  highlights?: string[];
}

export interface TeammateEducation {
  degree: string;
  institution: string;
  year: string;
}

export type TeamDepartment =
  | "All"
  | "Core Engineering"
  | "AI Research & Agents"
  | "Clinical & Sensory Tech"
  | "Brand Strategy & DevRel";

export interface TeammateProfile {
  id: string; // URL-safe slug
  name: string;
  handle: string;
  role: string;
  department: Exclude<TeamDepartment, "All">;
  avatar: string;
  location: string;
  email?: string;
  phone?: string;
  tagline: string;
  bio: string;
  cvSummary?: string;
  skills: string[];
  experience?: TeammateExperience[];
  education?: TeammateEducation[];
  featuredProjects?: string[]; // Names matching projects in lorapok.ts
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
    telegram?: string;
  };
  resumeUrl?: string; // Path to downloadable CV PDF
  status: "core" | "contributor" | "maintainer";
  featured?: boolean;
}

export const teamMembers: TeammateProfile[] = [
  {
    id: "maizied",
    name: "Mohammad Maizied Hasan Majumder",
    handle: "@Maijied",
    role: "Founder & Lead Systems Architect",
    department: "Core Engineering",
    avatar: "/assets/founder-avatar.jpg",
    location: "Dhaka, Bangladesh",
    email: "mdshvo40@gmail.com",
    tagline: "Building biological UI, sensory computing, and high-throughput developer platforms.",
    bio: "Full Stack Software Engineer designing digital products with performance, precision, and sensory computing at the core. Architect of the Lorapok ecosystem spanning 24+ products across 7 global distribution platforms.",
    cvSummary:
      "Senior Software Engineer at Shohoz with extensive background in distributed systems, high-concurrency ticketing, edge computing, and open-source collective engineering.",
    skills: [
      "TypeScript",
      "React 19",
      "Node.js",
      "Go",
      "Python",
      "PHP / Laravel",
      "Cloudflare Workers",
      "Firebase",
      "Framer Motion",
      "Tailwind CSS v4",
      "Distributed Systems",
      "Browser Extensions (AMO/Chrome)",
    ],
    experience: [
      {
        role: "Senior Software Engineer",
        organization: "Shohoz Ltd",
        period: "2023 — Present",
        description:
          "Leading core platform infrastructure, high-throughput microservices, and ticketing distributed systems across national scale services in Bangladesh.",
        highlights: [
          "Engineered resilient, high-concurrency event-driven processing pipelines.",
          "Optimized runtime execution latency and database throughput.",
          "Championed modern frontend architecture and developer experience standards.",
        ],
      },
      {
        role: "Lead Architect & Maintainer",
        organization: "Lorapok Labs Collective",
        period: "2022 — Present",
        description:
          "Founded and directing the Lorapok open-source ecosystem, overseeing engineering, security, and distribution across VS Code, Open VSX, Firefox AMO, and npm.",
        highlights: [
          "Shipped Lorapok Atlas with 2,100+ catalogued APIs and launched on Product Hunt.",
          "Created Cursor Curse Monitor used by thousands of AI engineers for usage auditing.",
          "Built Loragent enterprise multi-agent orchestration framework with 250+ resources.",
        ],
      },
    ],
    education: [
      {
        degree: "B.Sc. in Computer Science & Engineering",
        institution: "Leading University, Bangladesh",
        year: "2018",
      },
    ],
    featuredProjects: [
      "Cursor Curse Monitor",
      "Lorapok API Atlas",
      "Loragent",
      "Lorapok Media Player",
      "ReportKit Core",
    ],
    social: {
      github: "https://github.com/Maijied",
      linkedin: "https://www.linkedin.com/in/maizied",
      portfolio: "https://maijied.github.io/Maijied/",
      telegram: "https://t.me/Maijied",
      twitter: "https://x.com/LorapokLabs",
    },
    status: "core",
    featured: true,
  },
  {
    id: "touker-ahmed",
    name: "S.M. Touker Ahmed",
    handle: "@toukerahmed",
    role: "Senior Full-Stack & Backend Systems Engineer",
    department: "Core Engineering",
    avatar: "/assets/team/touker.jpg",
    location: "Dhaka, Bangladesh",
    email: "ahamed.touker@gmail.com",
    phone: "+8801794621250",
    tagline: "Scalable enterprise web applications, role-based security, and cloud APIs.",
    bio: "Analytical, flexible Computer Science engineer with comprehensive experience building responsive, high-performance web applications and backend systems in Laravel, PHP, React, and TypeScript.",
    cvSummary:
      "Full Stack Software Engineer with a strong track record at DebugVision, TechWeb BD IT, and Avanteca Limited. Specialized in complex management systems, healthcare operations, and secure API architectures.",
    skills: [
      "PHP",
      "Laravel",
      "JavaScript",
      "TypeScript",
      "React JS",
      "Angular JS",
      "MySQL",
      "MariaDB",
      "SQLite",
      "Oracle",
      "API & Ajax",
      "Arduino & Raspberry Pi",
      "C / C++",
    ],
    experience: [
      {
        role: "Software Engineer",
        organization: "DebugVision, Dhaka",
        period: "Jan 2024 — Ongoing",
        description:
          "Developing and maintaining enterprise management systems, gathering client requirements, and implementing granular role-based access control (RBAC).",
        highlights: [
          "Optimized database indexing and queries to boost system reliability and lower query latency.",
          "Collaborated closely with cross-functional engineering teams to streamline deployment pipelines.",
        ],
      },
      {
        role: "Software Engineer",
        organization: "TechWeb BD IT, Dhaka",
        period: "Feb 2022 — Dec 2023",
        description:
          "Conceptualized and developed system architectures ensuring efficient workflows, clean code, and standardized CI/CD procedures.",
        highlights: [
          "Standardized deployment guidelines and comprehensive technical documentation for clients.",
        ],
      },
      {
        role: "Software Engineer",
        organization: "Avanteca Limited, Dhaka",
        period: "May 2020 — Jan 2022",
        description:
          "Developed customized IT solutions and elevated in-house platforms utilizing PHP, SQL, JavaScript, and modern backend toolchains.",
      },
    ],
    education: [
      {
        degree: "B.Sc. in Computer Science & Engineering",
        institution: "American International University-Bangladesh (AIUB)",
        year: "2019",
      },
    ],
    featuredProjects: [
      "ReportKit Core",
      "Laravel Execution Monitor",
      "Spotlight Tickets",
      "Lorapok LocalSync",
    ],
    social: {
      github: "https://github.com/toukerahmed",
      linkedin: "https://www.linkedin.com/in/toukerahmed",
    },
    resumeUrl: "/assets/team/touker-ahmed-cv.pdf",
    status: "core",
    featured: true,
  },
  {
    id: "raisa-meem",
    name: "Raisa Fairooz Meem",
    handle: "@RXX17",
    role: "Senior AI & Computer Vision Research Engineer",
    department: "AI Research & Agents",
    avatar: "https://github.com/RXX17.png",
    location: "Dhaka, Bangladesh",
    email: "r.f.meem@gmail.com",
    tagline: "Deep learning, YOLO real-time vision, and clinical AI transfer learning models.",
    bio: "Computer Vision and Deep Learning Research Engineer with a Master's degree in Computer Science (Best Thesis VC Award recipient). Expert in real-time object detection (YOLOv8) and medical image classification.",
    cvSummary:
      "Award-winning AI Researcher with publications in arXiv, Clinical Imaging and Case Reports, and Journal of Carcinogenesis. Extensive experience training transformer models (BERT) and neural vision pipelines.",
    skills: [
      "Python",
      "PyTorch",
      "TensorFlow",
      "YOLOv8",
      "Computer Vision",
      "Transfer Learning",
      "BERT & Transformers",
      "Clinical Imaging AI",
      "NumPy & Pandas",
      "Docker",
      "OpenCV",
    ],
    experience: [
      {
        role: "Research Engineer",
        organization: "DebugVision, Dhaka",
        period: "Jun 2023 — Aug 2025",
        description:
          "Led computer vision initiatives training YOLOv8 models for real-time object detection and behavioral analysis on live CCTV camera feeds.",
        highlights: [
          "Curated, pre-processed, and annotated proprietary image datasets for edge vision models.",
          "Achieved 91.6% to 98.9% detection accuracy across targeted object classifications.",
        ],
      },
      {
        role: "Head of Internal Affairs",
        organization: "AUS-BAN International Study Edu-Care",
        period: "Sep 2020 — Sep 2021",
        description:
          "Directed strategic partnerships with international higher-education institutes and supervised operational workflows.",
      },
    ],
    education: [
      {
        degree: "M.Sc. in Computer Science (CGPA: 3.77/4.0 — VC Best Thesis Award)",
        institution: "American International University-Bangladesh (AIUB)",
        year: "2023",
      },
      {
        degree: "B.Sc. in Electronics & Communication Engineering",
        institution: "Khulna University of Engineering and Technology (KUET)",
        year: "2017",
      },
    ],
    featuredProjects: [
      "Loragent",
      "Dynamic Ollama LLM Chat",
      "Bangla Character Recognition",
    ],
    social: {
      github: "https://github.com/RXX17",
      linkedin: "https://www.linkedin.com/in/raisa-fairooz-meem/",
      portfolio: "https://raisafmeem.lovable.app/",
    },
    resumeUrl: "/assets/team/raisa-fairooz-meem-cv.pdf",
    status: "core",
    featured: true,
  },
  {
    id: "dr-rabiul-islam",
    name: "Dr. Md. Rabiul Islam",
    handle: "@DrRabiul",
    role: "Clinical Medical Advisor & Healthcare Systems Specialist",
    department: "Clinical & Sensory Tech",
    avatar: "/assets/team/rabiul.jpg",
    location: "Chittagong, Bangladesh",
    email: "piashcmc@gmail.com",
    phone: "01971629209",
    tagline: "Clinical healthcare administration, SGBV trauma care, and medical systems.",
    bio: "MBBS Physician with extensive expertise in hospital administration, clinical care, emergency medicine, and public health interventions. Medical Officer with Médecins Sans Frontières (MSF).",
    cvSummary:
      "Expert physician combining clinical emergency experience with healthcare data analysis, patient-centered care, and medical outreach in humanitarian environments.",
    skills: [
      "Clinical Patient Care",
      "Emergency Medicine",
      "SGBV Clinical Care (MSF)",
      "Hospital Administration",
      "Health Data Analytics",
      "Community Health Outreach",
      "Pediatric & Trauma Emergencies",
    ],
    experience: [
      {
        role: "Medical Officer",
        organization: "Médecins Sans Frontières (MSF)",
        period: "Recent",
        description:
          "Providing survivor-centered clinical management of Sexual and Gender-Based Violence (SGBV) and comprehensive post-exposure prophylaxis.",
      },
      {
        role: "Intern Doctor & Pediatric Ward Officer",
        organization: "Chittagong Medical College Hospital (CMCH)",
        period: "May 2022 — May 2023",
        description:
          "Managed primary medicine, surgical, and pediatric emergencies for over 1,000 patients with critical diagnostic care.",
      },
      {
        role: "Emergency Medical Officer",
        organization: "Sheba Clinic & Chittagong Sishu Hospital",
        period: "2023 — 2024",
        description:
          "Managed pediatric, cardiac, poisoning, and trauma cases across OPD and IPD environments.",
      },
    ],
    education: [
      {
        degree: "Bachelor of Medicine & Bachelor of Surgery (MBBS)",
        institution: "Chittagong Medical College (CMCH)",
        year: "2022",
      },
      {
        degree: "Higher Secondary Certificate (HSC)",
        institution: "Notre Dame College, Dhaka",
        year: "2014",
      },
    ],
    featuredProjects: [
      "Lorapok Media Player",
      "Hadi-Memoriam",
    ],
    social: {
      portfolio: "mailto:piashcmc@gmail.com",
    },
    resumeUrl: "/assets/team/dr-rabiul-islam-cv.pdf",
    status: "core",
    featured: true,
  },
  {
    id: "nusrat-supti",
    name: "Nusrat Jahan Supti",
    handle: "@NusratSupti",
    role: "Speech-Language Pathologist & Sensory Accessibility Specialist",
    department: "Clinical & Sensory Tech",
    avatar: "https://ui-avatars.com/api/?name=Nusrat+Jahan+Supti&background=0a0a0f&color=67ff8f&size=256",
    location: "Dhaka, Bangladesh",
    email: "raiafnan141015@gmail.com",
    phone: "+8801941607981",
    tagline: "Sensory computing, augmentative communication (AAC), and speech therapy.",
    bio: "Compassionate Speech-Language Pathologist with clinical experience at BSMMU (PG Hospital). Specialized in Augmentative and Alternative Communication (AAC) devices, sensory stimulation, and voice rehabilitation.",
    cvSummary:
      "Master's graduate from the University of Dhaka focused on evidence-based speech-language pathology, assistive tech integration for neurodivergent individuals, and sensory feedback loops.",
    skills: [
      "Sensory Accessibility",
      "AAC Selection & Customization",
      "Speech & Language Assessment",
      "Voice Rehabilitation",
      "Language Stimulation",
      "Assistive Hardware Consulting",
      "Clinical Documentation",
    ],
    experience: [
      {
        role: "Intern Speech & Language Pathologist",
        organization: "Bangabandhu Sheikh Mujib Medical University (BSMMU / PG)",
        period: "2024 — 2025",
        description:
          "Delivered diagnostic assessments and individualized rehabilitation for pediatric and adult communication disorders.",
      },
      {
        role: "Speech Therapist",
        organization: "Speech Aid Bangladesh & Hi-Care Hearing Centre",
        period: "2023 — 2024",
        description:
          "Supported intervention for children with autism spectrum disorder, cerebral palsy, and developmental delays using AAC and sensory tools.",
      },
    ],
    education: [
      {
        degree: "Master’s of Social Science in Communication Disorders",
        institution: "University of Dhaka",
        year: "2023",
      },
      {
        degree: "Bachelor’s of Social Science in Communication Disorders",
        institution: "University of Dhaka",
        year: "2017",
      },
    ],
    featuredProjects: [
      "Lorapok Keyboard",
      "Lorapok Media Player",
    ],
    social: {
      linkedin: "https://www.linkedin.com/in/nusrat-jahan-supti/",
    },
    resumeUrl: "/assets/team/nusrat-jahan-supti-cv.pdf",
    status: "core",
    featured: true,
  },
  {
    id: "wahid-songket",
    name: "Aszadul Wahid Khan Songket",
    handle: "@Songket",
    role: "Lead Brand Strategist, Storyteller & Communications Director",
    department: "Brand Strategy & DevRel",
    avatar: "https://ui-avatars.com/api/?name=Wahid+Khan+Songket&background=0a0a0f&color=22d3ee&size=256",
    location: "Gulshan 2, Dhaka, Bangladesh",
    email: "s.songket@gmail.com",
    phone: "+8801780503993",
    tagline: "Narrative architecture, brand development, scriptwriting, and video storytelling.",
    bio: "Sociology graduate from the University of Dhaka with a decade of creative storytelling experience across Leo Burnett, RedOrange, and Next Bell. Co-author of published humanitarian research.",
    cvSummary:
      "Strategic communications specialist leading narrative positioning, creative copy, OVC video productions, and public engagement for enterprise brands and global humanitarian agencies.",
    skills: [
      "Brand Narrative & Positioning",
      "Copywriting & Scriptwriting",
      "OVC & Documentary Direction",
      "Development Communications",
      "Public Relations & Media Strategy",
      "Field Qualitative Research",
      "Sociological Analysis",
    ],
    experience: [
      {
        role: "Lead Scriptwriter & Development Storyteller",
        organization: "Next Bell Ltd",
        period: "2025 — Present",
        description:
          "Directing video scripting and brand narratives for clients including SEEP, NGDO, Mr. Baker, and Bashundhara Housing.",
      },
      {
        role: "Copywriter",
        organization: "Spellbound Leo Burnett",
        period: "2024",
        description:
          "Crafted high-impact national and regional ad campaigns for United Group, IMF, Chevron, and National Bank.",
      },
      {
        role: "Content Writer",
        organization: "RedOrange Communication",
        period: "2023",
        description:
          "Developed communication assets and public policy materials for GIZ, Save the Children, and ETI.",
      },
      {
        role: "Field Operation Manager",
        organization: "4C Communication",
        period: "2021",
        description:
          "Managed field communication execution for JANO project (Care, PLAN, ESDO, European Union).",
      },
    ],
    education: [
      {
        degree: "Master’s in Sociology",
        institution: "University of Dhaka",
        year: "2021",
      },
      {
        degree: "Bachelor’s in Sociology",
        institution: "University of Dhaka",
        year: "2018",
      },
    ],
    featuredProjects: [
      "Roast as a Service",
      "Lorapok API Atlas",
    ],
    social: {
      portfolio: "https://tinyurl.com/66su5wsv",
      twitter: "https://tinyurl.com/2s4xzn5b",
    },
    resumeUrl: "/assets/team/wahid-khan-songket-cv.pdf",
    status: "core",
    featured: true,
  },
];

export const teamDepartments: TeamDepartment[] = [
  "All",
  "Core Engineering",
  "AI Research & Agents",
  "Clinical & Sensory Tech",
  "Brand Strategy & DevRel",
];

export function getTeamByDepartment(dept: TeamDepartment): TeammateProfile[] {
  if (dept === "All") return teamMembers;
  return teamMembers.filter((m) => m.department === dept);
}

export function getTeammateById(id: string): TeammateProfile | undefined {
  return teamMembers.find((m) => m.id === id);
}
