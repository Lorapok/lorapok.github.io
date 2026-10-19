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
  | "Strategic Technology Advisory"
  | "AI Research & Agents"
  | "Clinical & Sensory Tech"
  | "Brand Strategy & DevRel"
  | "Quality Assurance"
  | "3D Art & Design"
  | "Visual Media & Legal Strategy"
  | "Business Operations & Strategy";

export interface TeammateProfile {
  id: string; // URL-safe slug
  name: string;
  handle: string;
  role: string;
  department: Exclude<TeamDepartment, "All">;
  avatar: string;
  location: string;
  email?: string;
  tagline: string;
  bio: string;
  cvSummary?: string;
  skills: string[];
  experience?: TeammateExperience[];
  education?: TeammateEducation[];
  achievements?: string[];
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
    bio: "Full Stack Software Engineer designing digital products with performance, precision, and sensory computing at the core. Maintains the public Lorapok repositories and the Loragent skill catalog.",
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
          "Shipped Lorapok Atlas, a public directory for browsing open APIs, and listed it on Product Hunt.",
          "Published Cursor Curse Monitor, a local dashboard for Cursor usage limits and billing cycles.",
          "Built Loragent, the multi-agent skill catalog maintained in this repository.",
        ],
      },
    ],
    education: [
      {
        degree: "B.Sc. in Computer Science & Engineering",
        institution: "Shahjalal University of Science and Technology (SUST)",
        year: "2019",
      },
    ],
    achievements: [
      "🥉 3rd Place — IUT National Hackathon (Islamic University of Technology)",
      "Productivity Management & Leadership Certified — Maslow Bangladesh (Cert ID: 000439)",
      "Mozilla Firefox Help — Open Source Localization Contributor (5+ years)",
      "CSE Society, SUST — Career Development Seminar Organizer (4 years)",
    ],
    featuredProjects: [
      "Cursor Curse Monitor",
      "Lorapok API Atlas",
      "Loragent",
      "CLoraMF",
      "Lorapok Media Player",
      "ReportKit Core",
    ],
    social: {
      github: "https://github.com/Maijied",
      linkedin: "https://www.linkedin.com/in/maijied/",
      portfolio: "https://maijied.github.io/Maijied/",
      telegram: "https://t.me/Maijied",
      twitter: "https://x.com/LorapokLabs",
    },
    status: "core",
    featured: true,
  },
  {
    id: "ishtiak-shovon",
    name: "Ishtiak Shovon",
    handle: "@ishtiak-shovon",
    role: "Principal Technical Advisor & Systems Architect",
    department: "Strategic Technology Advisory",
    avatar: "/assets/team/ishtiak-shovon.jpg",
    location: "Dhaka, Bangladesh",
    tagline:
      "Guiding high-throughput system architecture, enterprise software engineering, and strategic tech evolution.",
    bio:
      "Principal Technical Advisor at Lorapok Labs with a deep software engineering foundation across enterprise platforms, distributed services, and database architectures. Formerly Software Engineer at Infinity Infotech Ltd and Junior Software Engineer at Sheba Technologies Limited. Holds a B.Sc. in Computer Science from East West University (EWU), advising the collective on architectural scalability, service reliability, and modern software craftsmanship.",
    cvSummary:
      "Technical Advisor and seasoned Software Engineer with over 5+ years of verified industry expertise delivering scalable enterprise platforms, database architectures, and microservices at Infinity Infotech Ltd and Sheba Technologies. Advises the Lorapok collective on architectural strategy, tech stack modernization, and engineering governance.",
    skills: [
      "Technical Advisory & Strategy",
      "System Architecture",
      "Enterprise Software Engineering",
      "Distributed Systems",
      "Cloud Infrastructure & Microservices",
      "Database Modeling & Optimization",
      "RESTful & GraphQL APIs",
      "Relational DBMS (MySQL / PostgreSQL)",
      "High-Concurrency Backends",
      "Code Governance & CI/CD",
      "Agile Engineering Leadership",
      "Docker & Containerization",
    ],
    experience: [
      {
        role: "Principal Technical Advisor & Systems Architect",
        organization: "Lorapok Labs Collective",
        period: "2024 — Present",
        description:
          "Guiding core engineering leadership on architectural vision, system resilience, and technological governance across autonomous agent frameworks and developer tools.",
        highlights: [
          "Steering the architectural roadmap for distributed state coordination, multi-agent autonomous frameworks, and high-performance developer platforms.",
          "Advising engineering squads on high-concurrency backend patterns, database normalization, and fault-tolerant service design.",
          "Benchmarking code quality, CI/CD automation pipelines, and automated test coverage across open-source and enterprise deliverables.",
        ],
      },
      {
        role: "Software Engineer",
        organization: "Infinity Infotech Ltd",
        period: "2021 — 2024",
        description:
          "Engineered enterprise-grade software systems, responsive web applications, and database architectures for institutional and commercial clients.",
        highlights: [
          "Architected multi-tier backend microservices and RESTful API endpoints, reducing query latency by over 30%.",
          "Led relational database schema modeling, query indexing, and transactional data migrations.",
          "Spearheaded code reviews, architectural discussions, and automated deployment pipelines, maintaining 99.9% service reliability.",
        ],
      },
      {
        role: "Junior Software Engineer",
        organization: "Sheba Technologies Limited (Sheba Group)",
        period: "2019 — 2021",
        description:
          "Developed core functional modules, business logic, and API endpoints for enterprise and telecom-grade IT solutions.",
        highlights: [
          "Contributed to enterprise web application development, bug resolution, and backend API enhancements within Sheba Group.",
          "Collaborated with senior architects on relational database design, query optimization, and frontend responsive interfaces.",
          "Delivered high-reliability features and integration tests within fast-paced agile development sprint cycles.",
        ],
      },
    ],
    education: [
      {
        degree: "Bachelor of Science (B.Sc.) in Computer Science",
        institution: "East West University (EWU)",
        year: "2015 — 2018",
      },
    ],
    achievements: [
      "Principal Technical Advisor to Lorapok Labs, steering architectural scalability and technological innovation",
      "Over 5+ years of verified software engineering excellence delivering mission-critical applications at Infinity Infotech Ltd and Sheba Technologies",
      "B.Sc. in Computer Science graduate from East West University (Class of 2018)",
      "Architected resilient enterprise web solutions and optimized high-throughput database systems",
      "Pioneered architectural reviews that optimized API throughput and established automated continuous delivery standards",
    ],
    featuredProjects: [
      "Lorapok API Atlas",
      "Loragent",
      "CLoraMF",
      "Lorapok LocalSync",
      "ReportKit Core",
    ],
    social: {
      linkedin: "https://www.linkedin.com/in/ishtiak-shovon",
      portfolio: "https://lorapok.tech",
    },
    resumeUrl: "/assets/team/ishtiak-shovon-cv.pdf",
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
    achievements: [
      "Enterprise Multi-Tenant Systems Architect (DebugVision & Avanteca)",
      "Role-Based Access Control (RBAC) & High-Performance DB Indexing Specialist",
      "Lead Systems Developer for Scalable Healthcare Operations Platforms",
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
    id: "shamim-ahammed",
    name: "Shamim Ahammed",
    handle: "@sasoibal",
    role: "Senior Full-Stack Software Engineer",
    department: "Core Engineering",
    avatar: "/assets/team/shamim-ahammed.jpg",
    location: "Dhaka, Bangladesh",
    email: "sa.soibal@gmail.com",
    tagline: "High-concurrency ERP/HRMS architecture, Laravel/Lumen REST APIs, and scalable React/Next.js platforms.",
    bio: "Senior Full-Stack Software Engineer with over 8 years of production experience architecting scalable web applications across ERP, HRMS, multi-vendor e-commerce, and enterprise CRM platforms. Specialist in PHP (Laravel/Lumen) high-throughput backend services and modern reactive frontends (React, Next.js, Vue).",
    cvSummary:
      "Senior Software Engineer with 8+ years leading full-stack delivery across Akaar IT, BYSL Global Technology Group, Infinity Infotech, OfficeNeeds, and jhoroTEK. Expert in modular web architectures, payment gateway integrations, and distributed relational/NoSQL datastores.",
    skills: [
      "PHP",
      "Laravel",
      "Lumen",
      "React",
      "Next.js",
      "Vue.js",
      "Angular",
      "TypeScript",
      "JavaScript",
      "REST APIs & Auth",
      "Payment Integrations (Stripe, PayPal, SSLCOMMERZ)",
      "MySQL",
      "MongoDB",
      "Docker",
      "CI/CD",
      "Redux",
      "ERP / HRMS Architecture",
    ],
    experience: [
      {
        role: "Senior Software Engineer (Full-time)",
        organization: "Akaar IT, Uttara, Dhaka",
        period: "Jun 2026 — Present",
        description:
          "Own and deliver full-stack features using PHP/Laravel and modern frontend frameworks; ensure clean, maintainable code and scalable design.",
        highlights: [
          "Develop and maintain REST APIs, database schemas, and integrations aligned with product and business requirements.",
          "Collaborate cross-functionally (Product, UI/UX, SQA) to improve delivery quality, performance, and user experience.",
        ],
      },
      {
        role: "Sr. Executive Software Engineer (Full-time)",
        organization: "BYSL Global Technology Group, Gulshan, Dhaka",
        period: "Mar 2025 — Jun 2026",
        description:
          "Collaborated with Product, SQA, and UI/UX teams to translate requirements into deliverable features and release-ready implementations.",
        highlights: [
          "Implemented key product capabilities including advanced filtering and customizable fields to improve usability and workflow flexibility.",
          "Contributed to code reviews and technical discussions focused on maintainability, performance, and quality.",
        ],
      },
      {
        role: "Full Stack Software Engineer (Full-time)",
        organization: "Infinity Infotech Ltd., Gulshan 1, Dhaka",
        period: "Dec 2021 — Feb 2025",
        description:
          "Delivered full-stack features in collaboration with stakeholders; clarified scope, broke down work into sprints, and ensured on-time delivery.",
        highlights: [
          "Built and maintained REST APIs, database schemas, and frontend components across multiple modules and client requirements.",
          "Mentored junior engineers through code reviews, task guidance, and best-practice enforcement to maintain consistent code quality.",
        ],
      },
      {
        role: "Sr. Software Engineer (Full-time)",
        organization: "OfficeNeeds, Bashundhara R/A, Dhaka",
        period: "Sep 2018 — Dec 2021",
        description:
          "Developed and maintained production web applications with a focus on reliability, user experience, and clean delivery. Worked closely with designers and QA to ship bug-free features using Agile practices.",
        highlights: [
          "Contributed to e-commerce customization and integrations (Magento-based platform) to support multi-vendor operations.",
        ],
      },
      {
        role: "Software Engineer (Full-time)",
        organization: "jhoroTEK, Badda Link Rd, Dhaka",
        period: "Oct 2015 — Aug 2018",
        description:
          "Assisted in selecting technologies and frameworks for new projects aligned with client requirements and delivery timelines. Provided technical support for production systems including server/hosting setup and dependency configuration.",
      },
    ],
    education: [
      {
        degree: "B.Sc. in Computer Science and Engineering",
        institution: "World University of Bangladesh (WUB), Dhaka",
        year: "2013 — 2016",
      },
      {
        degree: "Diploma in Computer Engineering (4 Years) – CGPA: 3.14/4.00",
        institution: "Dhaka Polytechnic Institute, Dhaka",
        year: "2008 — 2012",
      },
      {
        degree: "Secondary School Certificate (S.S.C.), Science – GPA: 4.63/5.00",
        institution: "Naba Kishalay High School, Narayangonj",
        year: "2008",
      },
    ],
    achievements: [
      "8+ years of production full-stack engineering across ERP/HRMS, E-commerce, and CRM platforms",
      "Lead Architect for enterprise products: SmartOffice.ai, Property Index (propertyindexbd.com), and Maslowbd LMS",
      "Payment Gateway Integration Specialist across Stripe, PayPal, and SSLCOMMERZ multi-channel checkouts",
      "Co-Founder, Onirban Foundation (Demra, Dhaka) — Voluntary blood donation initiatives and community support",
    ],
    featuredProjects: [
      "HomeDyn Restaurant System",
      "SmartOffice.ai",
      "Property Index",
      "ReportKit Core",
      "Maslowbd",
    ],
    social: {
      github: "https://github.com/sasoibal",
      linkedin: "https://www.linkedin.com/in/sasoibal",
    },
    resumeUrl: "/assets/team/shamim-ahammed-cv.pdf",
    status: "core",
    featured: true,
  },
  {
    id: "raisa-meem",
    name: "Raisa Fairooz Meem",
    handle: "@RXX17",
    role: "Senior AI & Computer Vision Research Engineer",
    department: "AI Research & Agents",
    avatar: "/assets/team/meem.png",
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
    achievements: [
      "🏆 Vice-Chancellor's Best Thesis Gold Medal & Award Recipient (AIUB)",
      "Author of 3+ high-impact research publications in Computer Vision & Oncology (arXiv, Journal of Carcinogenesis)",
      "Edge Computer Vision Specialist with 98.9% target classification benchmarks",
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
    achievements: [
      "Registered Clinical Physician — Bangladesh Medical & Dental Council (BMDC Reg: A-132333)",
      "Advanced Cardiac Life Support (ACLS) & Basic Life Support (BLS) Certified",
      "Specialist in Clinical Health Informatics & Sensory Accessibility Tech",
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
    avatar: "/assets/team/supti.png",
    location: "Dhaka, Bangladesh",
    email: "raiafnan141015@gmail.com",
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
    achievements: [
      "Certified Speech-Language Pathologist & Clinical Communication Specialist (University of Dhaka)",
      "Clinical Intervention Specialist for Autism Spectrum Disorder (ASD) & AAC Assistive Tech",
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
    avatar: "/assets/team/songket.png",
    location: "Gulshan 2, Dhaka, Bangladesh",
    email: "s.songket@gmail.com",
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
    achievements: [
      "Lead Creative Strategist for National Brand Campaigns (IMF, Chevron, United Group, National Bank)",
      "Co-Author of Published Qualitative Field & Humanitarian Development Research",
      "Executive Narrative Director for Over 20+ Commercial & Social Impact Video Productions",
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
  {
    id: "toufiq-ahmed",
    name: "Toufiq Ahmed",
    handle: "@ToufiqLarvox",
    role: "Junior Software Engineer & Full-Stack Developer",
    department: "Core Engineering",
    avatar: "/assets/team/toufiq.jpg",
    location: "Dhaka, Bangladesh",
    email: "toufiqahmed650@gmail.com",
    tagline: "Full-stack web engineering, C#/.NET services, and graphics programming.",
    bio: "Junior Software Engineer and Full-Stack Developer at Lorapok Labs with a solid foundation in object-oriented architecture, data structures, algorithms, and web application development. Experienced across C, C++, C#, Java, Python, and JavaScript with practical experience in .NET, Node.js, SQL database pipelines, and OpenGL graphics.",
    cvSummary:
      "B.Sc. in Computer Science & Engineering from American International University-Bangladesh (AIUB). Passionate about reliable full-stack software solutions, algorithmic problem solving, and open-source collective engineering.",
    skills: [
      "C# / .NET",
      "Node.js",
      "JavaScript",
      "C++",
      "C",
      "Java",
      "Python",
      "SQL & Relational DBs",
      "Data Structures & Algorithms",
      "Object-Oriented Programming (OOP)",
      "OpenGL Graphics",
      "Git & GitHub",
      "Full-Stack Development",
      "Software Debugging",
    ],
    experience: [
      {
        role: "Junior Software Engineer (Intern)",
        organization: "Lorapok Labs",
        period: "September 2026 — Present",
        description:
          "Contributing to development and maintenance of full-stack software and web applications across the Lorapok ecosystem.",
        highlights: [
          "Developing responsive application features across frontend and backend components.",
          "Building backend services and data workflows using .NET, Node.js, JavaScript, and SQL.",
          "Writing clean, maintainable, reusable code and implementing effective debugging solutions.",
          "Collaborating with engineering team members throughout development, peer review, and testing.",
        ],
      },
    ],
    education: [
      {
        degree: "B.Sc. in Computer Science & Engineering",
        institution: "American International University-Bangladesh (AIUB)",
        year: "2026",
      },
    ],
    achievements: [
      "Developed School Management System in C# leveraging structured object-oriented programming",
      "Implemented comprehensive Data Structures & Algorithms suite in C++ (trees, queues, sorting, searching)",
      "Engineered 2D rendering and coordinate primitive scenes using C++ and OpenGL graphics pipelines",
      "Active open-source contributor and software developer under @ToufiqLarvox",
    ],
    featuredProjects: [
      "LARVOX",
      "ReportKit",
      "dCursor",
    ],
    social: {
      github: "https://github.com/ToufiqLarvox",
      linkedin: "https://www.linkedin.com/in/toufiq-ahmed",
    },
    resumeUrl: "/assets/team/toufiq-ahmed-cv.pdf",
    status: "contributor",
    featured: true,
  },
  {
    id: "tanjil-bhoiyan",
    name: "Tanjil Bhoiyan",
    handle: "@TanjilBhoiyan",
    role: "SQA Engineer",
    department: "Quality Assurance",
    avatar: "/assets/team/tanjil-bhoiyan.jpg",
    location: "Dhaka, Bangladesh",
    email: "tanjilbhoiyan@gmail.com",
    tagline: "Manual and automated testing for web products, APIs, and payment flows.",
    bio: "SQA Engineer at SeedLink Innovation. Previously a Junior Software QA Engineer at Progoti Systems Limited on TallyKhata. Builds Playwright and Cypress automation and tests backend payment flows with Postman and SQL.",
    cvSummary:
      "B.Sc. in Computer Science and Engineering from Shahjalal University of Science and Technology. Works on end-to-end, regression, API, and performance testing.",
    skills: [
      "Cypress",
      "Playwright",
      "REST Assured",
      "Postman",
      "JMeter",
      "JIRA",
      "Git",
      "Java",
      "JavaScript",
      "C++",
      "MongoDB",
      "MySQL",
      "PostgreSQL",
    ],
    experience: [
      {
        role: "SQA Engineer",
        organization: "SeedLink Innovation",
        period: "October 2025 — Present",
        description:
          "Tests SendCopy.ai automation, PinkBounce, and E-Warmup. The supplied CV describes end-to-end manual testing, Playwright automation with the Page Object Model, and defect tracking with the development team.",
      },
      {
        role: "Junior Software QA Engineer",
        organization: "Progoti Systems Limited (TallyKhata)",
        period: "July 2024 — September 2025",
        description:
          "Tested TallyPay backend flows, including financial transactions, APIs, and third-party payment integrations, using Postman and SQL. The CV also describes Cypress frontend automation and REST Assured API automation.",
      },
    ],
    education: [
      {
        degree: "B.Sc. in Computer Science and Engineering",
        institution: "Shahjalal University of Science and Technology (SUST), Sylhet",
        year: "February 2018 — March 2024",
      },
    ],
    achievements: [
      "Codeforces: Tanjilbhuyan — https://codeforces.com/profile/Tanjilbhuyan",
      "LeetCode: Tanjil03 — https://leetcode.com/u/Tanjil03/",
      "HackerRank: Tanjil03 — https://www.hackerrank.com/Tanjil03",
      "Shohoz.com Playwright automation and a Cypress shopping-flow project, as listed on the CV",
    ],
    social: {
      linkedin: "https://www.linkedin.com/in/tanjil-bhoiyan-0982a125a",
    },
    resumeUrl: "/assets/team/tanjil-bhoiyan-cv.pdf",
    status: "contributor",
    featured: true,
  },
  {
    id: "borshon-mondol",
    name: "Borshon Mondol",
    handle: "@BorshonMondol",
    role: "3D Artist & Designer",
    department: "3D Art & Design",
    avatar: "/assets/team/borshon-mondol.jpg",
    location: "Dhaka, Bangladesh",
    email: "borshonm563@gmail.com",
    tagline: "Figurative sculpture, kinetic-illusion installations, and craft-rooted object making.",
    bio: "BFA candidate in 3D Art and Design at Jagannath University. Studio practice bridges figurative sculpture, kinetic-illusion installations, and craft-rooted object making, with a focus on material research, structural armature fabrication, anatomical modelling, and spatial narrative.",
    cvSummary:
      "Works with materials in motion — paint, clay, thread, metal — to hold duration open for the viewer to measure. Studio profile and CV are on her public site.",
    skills: [
      "Figurative modelling",
      "Animal anatomy",
      "Clay relief",
      "Armature building",
      "Mixed-media construction",
      "Plaster and stone carving",
      "Composite inlay",
      "Terracotta surface treatment",
      "Folk-art painting",
      "Alpana-style ornament",
      "Wood and bamboo craft",
      "Maquette development",
      "3D visualization",
    ],
    experience: [
      {
        role: "BFA Candidate, 3D Art and Design",
        organization: "Faculty of Fine Arts, Jagannath University, Dhaka",
        period: "September 2023 — Present",
        description:
          "Studio and coursework in sculptural engineering, spatial installation, material chemistry, anatomical modelling, and craft-led 3D design. Faculty advisor: Mohammad Jahidul Hoque, Assistant Professor.",
        highlights: [
          "FAS-4102: Kinetic Illusion Installations & Structural Armatures",
          "FAS-3102 / 3103: Advanced Animal & Human Life Modelling",
          "Subtractive stone, terracotta inlay, ceramic bas-relief, and Alpana folk painting",
        ],
      },
      {
        role: "The Weave of Memory and the Inner Cage",
        organization: "Independent studio practice",
        period: "2026",
        description:
          "Mixed-media sculpture and spatial installation — reclaimed textiles, wire armatures, and a canvas backdrop. An ascending helical sculpture investigating subconscious memory and protective psychological architectures.",
      },
      {
        role: "The Frozen Liquidity",
        organization: "Independent studio practice",
        period: "2025 — 2026",
        description:
          "Mixed-media sculpture and installation — acrylic, wire armature, adhesive compounds, and canvas. A suspended paint can pours red and blue acrylic; the stream and splash are held as a single frozen kinetic sculpture.",
      },
    ],
    education: [
      {
        degree: "Bachelor of Fine Arts, 3D Art and Design (candidate)",
        institution: "Jagannath University, Dhaka, Bangladesh",
        year: "September 2023 — Present (session 2023–2026)",
      },
    ],
    achievements: [
      "Annual Faculty Art Exhibition — Faculty of Fine Arts Gallery, Jagannath University, Dhaka (Group, 2024, 2025)",
      "Departmental 3D Studio Showcase — Department of 3D Art and Design, Jagannath University, Dhaka (Group, 2023–2025)",
      "Studio works listed on the public CV include Sleeping Dog Study, Cape Buffalo Head, Female Torso Study, Bird and Foliage Relief, Terracotta-Inlay Head Study, Alpana Pidi, painted Kula, and ceremonial painted vessel",
    ],
    social: {
      linkedin: "https://www.linkedin.com/in/borshon-mondol-7ab4bb436/",
      portfolio: "https://borshon.lorapok.tech/",
    },
    featuredProjects: [
      "The Frozen Liquidity",
      "The Weave of Memory and the Inner Cage",
      "Sleeping Dog Study",
      "Cape Buffalo Head",
      "Female Torso Study",
      "Traditional Painted Wooden Panel (Alpana Pidi)",
    ],
    resumeUrl: "/assets/team/borshon-mondol-cv.pdf",
    status: "contributor",
    featured: true,
  },
  {
    id: "ashraf-joy",
    name: "Ashraf Uddin Ahmed (Joy)",
    handle: "@LawyerJoy",
    role: "Visual Media Director, Cinematographer & Legal Counsel",
    department: "Visual Media & Legal Strategy",
    avatar: "/assets/team/ashraf-joy.jpg",
    location: "Dhaka, Bangladesh",
    email: "joy@lorapok.tech",
    tagline: "Cinematography, AI-assisted visual generation, documentary filmmaking, and media law.",
    bio: "Cross-disciplinary Visual Director, Cinematographer, and Legal Counsel. Alumnus of the School of Law at BRAC University and Executive Committee Member of the Law Alumni Association of BRAC University (LAABRACU). Blends cinematic lenswork, documentary storytelling, and generative AI prompting with rigorous legal frameworks across intellectual property, entertainment media, and digital contracts.",
    cvSummary:
      "Advocate and Visual Media Director with extensive credits across institutional documentaries (Dhaka Central Jail, BRAC University BIL), rock band music visual productions (Arbovirus - 'Obastob' via AIA Lemonsky), narrative cinema ('Mala\\'r Sanglap'), and internationally recognized street photography (35AWARDS, PROWEDaward). Executive Committee Member of LAABRACU specializing in media law, copyright, and entertainment compliance.",
    skills: [
      "Cinematography & Camera Direction",
      "Generative AI Visuals & Prompting",
      "Documentary Filmmaking",
      "Post-Production & Video Editing",
      "Street Photography (35AWARDS)",
      "Corporate & Media Law",
      "Intellectual Property & Copyright",
      "Contract Drafting & Negotiation",
      "Visual Narrative Architecture",
      "Audio-Visual Institutional Production",
      "Lighting Design & Color Grading",
      "Digital Media Rights & Licensure",
    ],
    experience: [
      {
        role: "Visual Director & Cinematographer",
        organization: "Independent Studio Practice & AIA Lemonsky Collaborations",
        period: "2020 — Present",
        description:
          "Directing, shooting, and editing narrative film projects, rock music visuals, and multi-camera institutional productions.",
        highlights: [
          "Prompting, visualization, and artwork for ARBOVIRUS — 'OBASTOB' Official Animated Visual (Republic of Arbovirus) with AIA Lemonsky & Lumastrike Studios.",
          "Directed, filmed, and edited 'Mala\\'r Sanglap' (Trailer), exploring high-contrast dramatic cinematography and character-driven framing.",
          "Produced institutional AV documentary for the BRAC Institute of Languages (BIL) at BRAC University.",
          "Cinematography and photography for the 2020 official documentary on Dhaka Central Jail, Keraniganj with Storybox 360, highlighting modern humane correctional reform.",
        ],
      },
      {
        role: "Executive Committee Member",
        organization: "Law Alumni Association of BRAC University (LAABRACU)",
        period: "2024 — Present",
        description:
          "Serving on the executive board guiding legal alumni networks, legal literacy initiatives, and professional compliance symposia across Bangladesh.",
        highlights: [
          "Advising on intellectual property governance, media distribution compliance, and entertainment legal rights.",
          "Fostering professional collaboration between legal practitioners, academic institutions, and technology collectives.",
        ],
      },
      {
        role: "Documentary & Street Photographer",
        organization: "Dossi Photographic Portfolio (35AWARDS)",
        period: "2019 — Present",
        description:
          "Capturing urban street life, architectural shadows, and evocative human moments across Dhaka and international circuits.",
        highlights: [
          "Featured portfolio on 35AWARDS for cinematic street photography from Dhaka.",
          "Recognized on international photography networks for atmospheric compositions, dramatic silhouettes, and narrative depth.",
        ],
      },
    ],
    education: [
      {
        degree: "Bachelor of Laws (LL.B. Hons)",
        institution: "School of Law, BRAC University (BRACU), Dhaka",
        year: "Alumnus / Executive Committee (LAABRACU)",
      },
    ],
    achievements: [
      "Executive Committee Member — Law Alumni Association of BRAC University (LAABRACU, 2024–2026)",
      "Visual Artist & Prompting Collaborator for ARBOVIRUS 'OBASTOB' Official Animated Visual (Album: Republic of Arbovirus)",
      "Cinematographer & Photographer — Dhaka Central Jail, Keraniganj Official Documentary 2020",
      "Director, Cinematographer & Editor — 'Mala\\'r Sanglap' (মালার সংলাপ) Narrative Film Trailer",
      "Featured Photographer — 35AWARDS (Cinematic Street Photography from Dhaka)",
      "Producer & Director — BRAC University BIL (BRAC Institute of Languages) Institutional AV",
    ],
    featuredProjects: [
      "Arbovirus: Obastob [Official Animated Visual]",
      "Dhaka Central Jail Official Documentary",
      "Mala'r Sanglap (মালার সংলাপ)",
      "BRAC University BIL Audio-Visual",
      "Lorapok Media Player",
      "Lorapok Sorcerer",
    ],
    social: {
      portfolio: "https://35awards.com/en/author/dossi/",
      twitter: "https://www.youtube.com/@Joy-rx8lo",
    },
    resumeUrl: "/assets/team/ashraf-uddin-ahmed-cv.pdf",
    status: "core",
    featured: true,
  },
  {
    id: "taif-ul-islam",
    name: "Taif Ul Islam",
    handle: "@TaifUlIslam",
    role: "Executive Director of Business Operations & Strategic Client Partnerships",
    department: "Business Operations & Strategy",
    avatar: "/assets/team/taif-ul-islam.jpg",
    location: "Mohammadpur, Dhaka, Bangladesh",
    email: "taifulislam9m@gmail.com",
    tagline: "Leading high-touch enterprise client engagement, commercial discovery, and seamless software onboarding.",
    bio: "Executive Director of Business Operations and Strategic Client Partnerships at Lorapok Labs and DebugVision. Spearheads high-touch client acquisition, solution scoping, executive stakeholder consensus, and end-to-end client onboarding across enterprise SaaS platforms, bespoke web ecosystems, and multi-tenant systems. Translates complex technical capabilities into measurable business ROI and long-term client retention.",
    cvSummary:
      "Accomplished Business Operations and Marketing Executive at DebugVision and Lorapok Labs with a proven track record of acquiring, structuring, and onboarding 50+ enterprise and SME accounts. Specialist in commercial SLA design, B2B solution architecture, client success frameworks, and multi-quarter revenue retention.",
    skills: [
      "Enterprise Client Onboarding",
      "Strategic Client Partnerships",
      "B2B Solution Discovery",
      "Business Operations (BizOps)",
      "Revenue Operations (RevOps)",
      "Executive Stakeholder Alignment",
      "Commercial SLA & Contract Design",
      "Client Success & Retention",
      "Go-To-Market (GTM) Strategy",
      "Scope & SOW Architecture",
      "Commercial Pricing Models",
      "Account Lifecycle Governance",
    ],
    experience: [
      {
        role: "Executive Director of Business Operations & Client Partnerships",
        organization: "Lorapok Labs Collective",
        period: "2024 — Present",
        description:
          "Directing enterprise client engagement pipelines, commercial governance, and rapid onboarding for flagship software deployments.",
        highlights: [
          "Spearheaded enterprise client discovery and onboarding for marquee platforms including HomeDyn Restaurant System and SmartOffice.ai.",
          "Engineered high-velocity onboarding workflows, cutting client ramp-up time by 40% and maintaining a 98% on-time milestone delivery benchmark.",
          "Aligned client executive sponsors with Lorapok deep-tech engineering squads to guarantee transparent project velocity and SLA fidelity.",
        ],
      },
      {
        role: "Executive Director Marketing & Business Operations",
        organization: "DebugVision, Shyamoli, Dhaka",
        period: "2023 — Present",
        description:
          "Overseeing commercial positioning, marketing governance, and B2B client acquisition for advanced software solutions and innovative SaaS applications development.",
        highlights: [
          "Successfully originated, negotiated, and onboarded 50+ enterprise and SME accounts across healthcare, multi-tenant ERP, and custom SaaS platforms.",
          "Partnered with CEO & Business Analysis Lead to translate client operational bottlenecks into high-value technical deliverables.",
          "Achieved a 95%+ client retention and renewal rate through structured quarterly business reviews (QBRs) and proactive account health governance.",
        ],
      },
    ],
    education: [
      {
        degree: "Bachelor of Business Administration (BBA) in Marketing & Operations",
        institution: "Dhaka, Bangladesh",
        year: "Executive Alumnus",
      },
    ],
    achievements: [
      "Successfully engaged and onboarded 50+ enterprise and SME clients across high-value SaaS, ERP, and bespoke web platforms",
      "Executive Director of Marketing & Business Operations at DebugVision (Shyamoli Cinema Complex, Dhaka)",
      "Pioneered structured onboarding SLAs, reducing client time-to-deployment while ensuring strict technical scope adherence",
      "Achieved 95%+ client retention and renewal rate across multi-quarter software development and maintenance agreements",
      "Lead Commercial Strategist for flagship enterprise deployments including HomeDyn Restaurant System and SmartOffice.ai",
    ],
    featuredProjects: [
      "HomeDyn Restaurant System",
      "SmartOffice.ai",
      "Property Index",
      "ReportKit Core",
      "Lorapok LocalSync",
    ],
    social: {
      portfolio: "https://www.debugvision.com",
    },
    resumeUrl: "/assets/team/taif-ul-islam-cv.pdf",
    status: "core",
    featured: true,
  },
];

export const teamDepartments: TeamDepartment[] = [
  "All",
  "Core Engineering",
  "Strategic Technology Advisory",
  "AI Research & Agents",
  "Clinical & Sensory Tech",
  "Brand Strategy & DevRel",
  "Quality Assurance",
  "3D Art & Design",
  "Visual Media & Legal Strategy",
  "Business Operations & Strategy",
];

export function getTeamByDepartment(dept: TeamDepartment): TeammateProfile[] {
  if (dept === "All") return teamMembers;
  return teamMembers.filter((m) => m.department === dept);
}

export function getTeammateById(id: string): TeammateProfile | undefined {
  return teamMembers.find((m) => m.id === id);
}
