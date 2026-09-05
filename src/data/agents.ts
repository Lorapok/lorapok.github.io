// src/data/agents.ts
// Generated from Loragent Ecosystem Specification

export interface AgentItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  layer: string;
  formation: "auto" | "orchestrator" | "freelance" | "observer" | "skill";
  type: "agent" | "skill";
  command: string;
  tags: string[];
}

export interface AgentFormation {
  id: string;
  name: string;
  description: string;
}

export const agentFormations: AgentFormation[] = [
  { id: "all", name: "All Autonomous Units", description: "All 240+ specialized agents and skill modules across the Loragent ecosystem." },
  { id: "skill", name: "Autonomous Skills", description: "Directly executable, deterministic skills and automated workflows." },
  { id: "auto", name: "Auto Formations", description: "Autonomous domain specialists dynamically assigned by Loragent." },
  { id: "orchestrator", name: "Orchestrators", description: "Meta-agents that govern multi-agent task execution, pipelines, and state." },
  { id: "freelance", name: "Freelance Specialists", description: "Expert individual contributors for specialized engineering domains." },
  { id: "observer", name: "Observers & Watchmen", description: "Session state guardians, reliability inspectors, and crash recovery observers." },
];

export const allSkills: AgentItem[] = [
  {
    "id": "loragent-admin-reliability",
    "slug": "loragent-admin-reliability",
    "name": "Admin Reliability",
    "description": "Debugs, verifies, and optimizes the admin React SPA, Vitest test suites, API middleware, Firebase Auth, and Cloudflare Pages runtime. Use proactively for admin test failures, dashboard regressions, API errors, auth issues, or deployment defects.",
    "layer": "face",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-admin-reliability",
    "tags": [
      "skill",
      "loragent",
      "face"
    ]
  },
  {
    "id": "loragent-amo-mcp",
    "slug": "loragent-amo-mcp",
    "name": "Amo Mcp",
    "description": "MCP-orchestrated Firefox AMO publishing for Lorapok extensions.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-amo-mcp",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-amo-publish",
    "slug": "loragent-amo-publish",
    "name": "Amo Publish",
    "description": "Firefox AMO publish pipeline for Lorapok browser extensions — web-ext sign, amo-metadata, CI, Mission Control, credential vault.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-amo-publish",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-deploy",
    "slug": "loragent-deploy",
    "name": "Deploy",
    "description": "Handles all deployment operations: Vercel (frontend/serverless), Railway (backend/databases), Docker (containerized), and multi-platform. Invoke after code is complete and SQA-approved. ALWAYS requires workspace-guard confirmation for production. Preview/staging deploys are auto.",
    "layer": "loom",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-deploy",
    "tags": [
      "skill",
      "loragent",
      "loom"
    ]
  },
  {
    "id": "loragent-gif-create",
    "slug": "loragent-gif-create",
    "name": "Gif Create",
    "description": "Creates, optimizes, and delivers animated GIFs and short video clips. Invoke when: converting video to GIF, creating loading animations, Slack GIFs, banner animations, sprite sheets, or any looping media asset. Do NOT invoke for static images or long-form video editing.",
    "layer": "face",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-gif-create",
    "tags": [
      "skill",
      "loragent",
      "face"
    ]
  },
  {
    "id": "loragent-governance-guard",
    "slug": "loragent-governance-guard",
    "name": "Governance Guard",
    "description": "Audits AGENTS.md, Cursor rules, project skills, lifecycle hooks, MCP configurations, Husky hooks, and GitHub workflows for policy drift and unsafe automation. Use proactively when governance, rules, hooks, or CI controls mutate.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-governance-guard",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-image-generate",
    "slug": "loragent-image-generate",
    "name": "Image Generate",
    "description": "Generates production-quality images using Fal.ai (primary) or Replicate (fallback). Invoke when any agent or the user needs: concept art, hero images, UI backgrounds, logo concepts, marketing visuals, poster generation, or any AI image output. Do NOT invoke for SVG icons, code-generated graphics, or chart/data visualization.",
    "layer": "face",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-image-generate",
    "tags": [
      "skill",
      "loragent",
      "face"
    ]
  },
  {
    "id": "loragent-marketplace-crosslink",
    "slug": "loragent-marketplace-crosslink",
    "name": "Marketplace Crosslink",
    "description": "Add consistent \"Also available on\" platform links across IDE extensions, browser add-ons, AMO, VSCE, Open VSX, README, and marketing site.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-marketplace-crosslink",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-mission-control",
    "slug": "loragent-mission-control",
    "name": "Mission Control",
    "description": "Operate Lorapok Mission Control admin panel — deployments, notices, mailbox, marketplace sync, and infra-only publishes.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-mission-control",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-openvsx-publish",
    "slug": "loragent-openvsx-publish",
    "name": "Openvsx Publish",
    "description": "Open VSX publishing for Lorapok VS Code extensions — canonical lorapok-labs namespace, duplicate listing fixes, CI sync.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-openvsx-publish",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-register",
    "slug": "loragent-register",
    "name": "Register",
    "description": "Dynamic Ecosystem Registrar & Catalog Synthesizer. Ingests discoveries from loragent-student, dynamically compiles new SKILL.md specs, updates marketplace.json, and synchronizes IDE mirrors.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-register",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-release-integrity",
    "slug": "loragent-release-integrity",
    "name": "Release Integrity",
    "description": "Audits package versions, GitHub release tags, VSIX artifacts, marketplace observations, SEO JSON-LD structured data, and publishing workflows. Use proactively before major releases, marketplace updates, or release drift investigations.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-release-integrity",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-student",
    "slug": "loragent-student",
    "name": "Student",
    "description": "Continuous Conversation Learner & Evolutionary Intelligence Agent. Listens to live developer pairing, discovers novel workflows/tools/fixes not yet in Loragent, reports to loragent-register for dynamic catalog expansion, and modernizes legacy agent skills.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-student",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-tools-install",
    "slug": "loragent-tools-install",
    "name": "Tools Install",
    "description": "Detects, installs, and verifies any tool, package, or binary required by other agents. Invoke when any agent reports a missing tool or dependency. Handles npm, pip/uv, composer, system packages, and binary tools. Includes rollback on failure. Do NOT invoke for application-level code dependencies (that is the backend-se's job).",
    "layer": "loom",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-tools-install",
    "tags": [
      "skill",
      "loragent",
      "loom"
    ]
  },
  {
    "id": "loragent-unified-deployment",
    "slug": "loragent-unified-deployment",
    "name": "Unified Deployment",
    "description": "Mission Control–only unified deployment for Lorapok projects — release, marketplace publish, admin panel, and website via mission-control.lorapok.tech.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-unified-deployment",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-vscode-publish",
    "slug": "loragent-vscode-publish",
    "name": "Vscode Publish",
    "description": "VS Code Marketplace publishing for Lorapok extensions — VSCE token, publisher LorapokLabs, CI and Mission Control wiring.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-vscode-publish",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-watchman",
    "slug": "loragent-watchman",
    "name": "Watchman",
    "description": "Session state guardian and crash recovery agent. Invoke with /loragent-watchman continue to resume a crashed or token-limited session. Automatically activated by the post-task-watchman-save hook after every major agent task. Do NOT invoke manually mid-task — the hook handles automatic saves.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-watchman",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-website-design",
    "slug": "loragent-website-design",
    "name": "Website Design",
    "description": "Design and refresh Lorapok marketing sites — gallery images, platform ribbons, KPI stats, SEO, and Mission Control infra deploy.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-website-design",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  }
];

export const allAgents: AgentItem[] = [
  {
    "id": "loragent-3d-designer",
    "slug": "loragent-3d-designer",
    "name": "3d Designer",
    "description": "3D modeling for apps, software, and web.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon 3d-designer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-accessibility-audit",
    "slug": "loragent-accessibility-audit",
    "name": "Accessibility Audit",
    "description": "Whole site or product — a full web accessibility (a11y) audit against WCAG 2.2, following the WCAG-EM methodology. Defines scope, samples representative pages and flows, runs the automated tier (`ac",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon accessibility-audit",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-accounts-specialist",
    "slug": "loragent-accounts-specialist",
    "name": "Accounts Specialist",
    "description": "Credentials Manager. Safely handles tokens and sensitive info using the secure-cred-vault standard.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon accounts-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-addon-maker",
    "slug": "loragent-addon-maker",
    "name": "Addon Maker",
    "description": "Browser extension and application addon creator.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon addon-maker",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-admin-reliability",
    "slug": "loragent-admin-reliability",
    "name": "Admin Reliability",
    "description": "Debugs and reviews the admin React SPA, Vitest setup, API middleware, Firebase auth, and Cloudflare Pages runtime. Use proactively for admin test failures, dashboard regressions, API errors, auth issu",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon admin-reliability",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-ads-manager",
    "slug": "loragent-ads-manager",
    "name": "Ads Manager",
    "description": "Suggests where to provide ads and how with strategy.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon ads-manager",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-ai-communicator",
    "slug": "loragent-ai-communicator",
    "name": "Ai Communicator",
    "description": "AI to AI Communicator. Gets more precise ideas from specialty-based models.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon ai-communicator",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-algorithm-implementer",
    "slug": "loragent-algorithm-implementer",
    "name": "Algorithm Implementer",
    "description": "Problem solver like in LeetCode or competitive programming platforms.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon algorithm-implementer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-angular-specialist",
    "slug": "loragent-angular-specialist",
    "name": "Angular Specialist",
    "description": "Angular framework specialist.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon angular-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-animator",
    "slug": "loragent-animator",
    "name": "Animator",
    "description": "Creates animated designs.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon animator",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-api-chef",
    "slug": "loragent-api-chef",
    "name": "Api Chef",
    "description": "Designs perfectly structured API responses.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon api-chef",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-apple-ecosystem-expert",
    "slug": "loragent-apple-ecosystem-expert",
    "name": "Apple Ecosystem Expert",
    "description": "macOS, iOS, Swift, and Apple ecosystem authority.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon apple-ecosystem-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-architect-designer",
    "slug": "loragent-architect-designer",
    "name": "Architect Designer",
    "description": "Works alongside the Tech Director to map out complex system architectures visually or structurally.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon architect-designer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-auditor",
    "slug": "loragent-auditor",
    "name": "Auditor",
    "description": "Security and code compliance auditing.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon auditor",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-authentication-engineer",
    "slug": "loragent-authentication-engineer",
    "name": "Authentication Engineer",
    "description": "Enterprise Auth, OAuth, and JWT workflows.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon authentication-engineer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-aws-specialist",
    "slug": "loragent-aws-specialist",
    "name": "Aws Specialist",
    "description": "Amazon Web Services (AWS) Specialist. Automates AWS CLI, Lambda, S3, ECS/EKS, DynamoDB, and CloudFormation with Zero-Trust Credential Vault integration.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon aws-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-azure-cloud-specialist",
    "slug": "loragent-azure-cloud-specialist",
    "name": "Azure Cloud Specialist",
    "description": "Microsoft Azure Cloud Specialist. Automates Azure CLI (az), Container Apps, Azure Functions, Cosmos DB, Blob Storage, Entra ID, and Key Vault with Zero-Trust Credential Vault integration.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon azure-cloud-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-azure-specialist",
    "slug": "loragent-azure-specialist",
    "name": "Azure Specialist",
    "description": "Microsoft Azure cloud infrastructure expert.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon azure-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-backend-se",
    "slug": "loragent-backend-se",
    "name": "Backend Se",
    "description": "The Backend Senior Software Engineer. Implements APIs, core player logic, and data structures.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon backend-se",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-browser-automation-expert",
    "slug": "loragent-browser-automation-expert",
    "name": "Browser Automation Expert",
    "description": "Playwright/Puppeteer/Selenium E2E testing.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon browser-automation-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-browser-specialist",
    "slug": "loragent-browser-specialist",
    "name": "Browser Specialist",
    "description": "Operates exclusively via Browser MCP to navigate and automate web tasks.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon browser-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-bug-hunter",
    "slug": "loragent-bug-hunter",
    "name": "Bug Hunter",
    "description": "The Chela. Most critical problem solver developer. Vibes with devs to fix things.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon bug-hunter",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-business-expert",
    "slug": "loragent-business-expert",
    "name": "Business Expert",
    "description": "The Business Expert. Analyzes requirements for SEO, market fit, and product logic.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon business-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-cache-collector",
    "slug": "loragent-cache-collector",
    "name": "Cache Collector",
    "description": "Premium grade Cache Manager. Uses Web3 End-to-End Encryption (E2EE) and Brotli compression to securely sync and free up IDE cache space.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon cache-collector",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-chorki",
    "slug": "loragent-chorki",
    "name": "Chorki",
    "description": "The Unstoppable Autonomous Autopilot Loop Agent. Iterates relentlessly and executes multi-step objectives until 100% verifiably completed using continuous check-done verification hooks.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon chorki",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-cicd-automation-expert",
    "slug": "loragent-cicd-automation-expert",
    "name": "Cicd Automation Expert",
    "description": "Advanced CI/CD engineering approach.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon cicd-automation-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-cicd-specialist",
    "slug": "loragent-cicd-specialist",
    "name": "Cicd Specialist",
    "description": "Lead CI/CD Pipeline Architect & Release Specialist. Designs, automates, and optimizes multi-target deployment pipelines (GitHub Actions, Cloudflare, Docker, NPM, PyPI, Composer, AMO, Open VSX).",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon cicd-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-cli-automation-maker",
    "slug": "loragent-cli-automation-maker",
    "name": "Cli Automation Maker",
    "description": "Builds internal CLI tools and bash automations.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon cli-automation-maker",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-cli-utilities-specialist",
    "slug": "loragent-cli-utilities-specialist",
    "name": "Cli Utilities Specialist",
    "description": "Builds and optimizes command-line tools.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon cli-utilities-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-client",
    "slug": "loragent-client",
    "name": "Client",
    "description": "The Client agent. Responsible for providing initial requirements, business constraints, and defining success metrics for the virtual office.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon client",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-cloud-specialist",
    "slug": "loragent-cloud-specialist",
    "name": "Cloud Specialist",
    "description": "General cloud infrastructure architect.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon cloud-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-code-auditor",
    "slug": "loragent-code-auditor",
    "name": "Code Auditor",
    "description": "Specialized subagent responsible for auditing code quality, security vulnerabilities, API syntax compliance, and CommonJS module export consistency across the codebase.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon code-auditor",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-code-optimizer",
    "slug": "loragent-code-optimizer",
    "name": "Code Optimizer",
    "description": "Optimizes code execution speed and memory usage.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon code-optimizer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-command-executor",
    "slug": "loragent-command-executor",
    "name": "Command Executor",
    "description": "Specialized agent that runs terminal commands across any ecosystem (Node, Python, Docker) safely interpreting output.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon command-executor",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-content-writer",
    "slug": "loragent-content-writer",
    "name": "Content Writer",
    "description": "Writes professional articles and blogs.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon content-writer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-cpp-expert",
    "slug": "loragent-cpp-expert",
    "name": "Cpp Expert",
    "description": "C++ programming language expert.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon cpp-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-cv-maker",
    "slug": "loragent-cv-maker",
    "name": "Cv Maker",
    "description": "Generates professional CVs/Resumes based on developer portfolios and Git histories.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon cv-maker",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-database-designer",
    "slug": "loragent-database-designer",
    "name": "Database Designer",
    "description": "Professional DB architect.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon database-designer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-database-updater",
    "slug": "loragent-database-updater",
    "name": "Database Updater",
    "description": "Dedicated to syncing agent learnings to Firebase.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon database-updater",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-debugger",
    "slug": "loragent-debugger",
    "name": "Debugger",
    "description": "Dedicated step-through and stack-trace debugger.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon debugger",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-delivery-boy",
    "slug": "loragent-delivery-boy",
    "name": "Delivery Boy",
    "description": "Carries deployment released products to specific places.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon delivery-boy",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-deploy",
    "slug": "loragent-deploy",
    "name": "Deploy",
    "description": "Handles all deployment operations: Vercel (frontend/serverless), Railway (backend/databases), Docker (containerized), and multi-platform. Invoke after code is complete and SQA-approved. ALWAYS requires workspace-guard confirmation for production. Preview/staging deploys are auto.",
    "layer": "loom",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon deploy",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "loom"
    ]
  },
  {
    "id": "loragent-devops",
    "slug": "loragent-devops",
    "name": "Devops",
    "description": "The DevOps Specialist. Runs CI/CD pipelines, deployment hooks, and ensures build stability.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon devops",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-django-specialist",
    "slug": "loragent-django-specialist",
    "name": "Django Specialist",
    "description": "Django framework specialist.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon django-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-doc-brain-updater",
    "slug": "loragent-doc-brain-updater",
    "name": "Doc Brain Updater",
    "description": "Autonomous documentation maintainer and living knowledge synchronizer for Lorapok AI Agent. Responsible for ensuring `BRAIN.md`, `.agents/BRAIN.md`, `README.md`, `CHANGELOG.md`, `USAGE.md`, and `TESTI",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon doc-brain-updater",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-docker-specialist",
    "slug": "loragent-docker-specialist",
    "name": "Docker Specialist",
    "description": "Docker & Containerization Specialist. Automates multi-stage Dockerfiles, Docker Compose stacks, container health checks, and image registries.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon docker-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-docman",
    "slug": "loragent-docman",
    "name": "Docman",
    "description": "Docker, containerization, and orchestration expert.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon docman",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-env-maker",
    "slug": "loragent-env-maker",
    "name": "Env Maker",
    "description": "Config specialist for env, CMake, and CNAME.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon env-maker",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-fastapi",
    "slug": "loragent-fastapi",
    "name": "Fastapi",
    "description": "FastAPI best practices and conventions. Use when working with FastAPI APIs and Pydantic models for them. Keeps FastAPI code clean and up to date with the latest features and patterns, updated with new",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon fastapi",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-firebase-specialist",
    "slug": "loragent-firebase-specialist",
    "name": "Firebase Specialist",
    "description": "Firebase Ecosystem Specialist. Automates Firestore data modeling, Cloud Functions, Firebase Authentication, Hosting, Storage, and Security Rules auditing with Zero-Trust Credential Vault integration.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon firebase-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-freqghost-admin-panel",
    "slug": "loragent-freqghost-admin-panel",
    "name": "Freqghost Admin Panel",
    "description": "Build and modify the FreqGhost admin dashboard — Cognitum-aesthetic web UI with JWT auth, role-based ACL, source switching, data collection controls, and ML model management. Use when the user asks ",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon freqghost-admin-panel",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-freqghost-data-collection",
    "slug": "loragent-freqghost-data-collection",
    "name": "Freqghost Data Collection",
    "description": "Manage CSI/RSSI data collection sessions for ML training — recording, labeling, exporting datasets, and quality validation. Use when the user asks to collect data, record CSI, build datasets, label ",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon freqghost-data-collection",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-freqghost-deployment",
    "slug": "loragent-freqghost-deployment",
    "name": "Freqghost Deployment",
    "description": "Deploy FreqGhost via Docker, nginx, and production configuration — multi-service compose, SSL/TLS, MQTT broker, environment variables. Use when deploying, configuring Docker, setting up nginx, or ma",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon freqghost-deployment",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-freqghost-frontend-dev",
    "slug": "loragent-freqghost-frontend-dev",
    "name": "Freqghost Frontend Dev",
    "description": "Develop the FreqGhost Three.js 3D viewer and admin panel frontend — Cognitum aesthetic, CDN-only libraries, no build step. Use when modifying the 3D viewer, adding UI elements, changing styling, or ",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon freqghost-frontend-dev",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-freqghost-model-training",
    "slug": "loragent-freqghost-model-training",
    "name": "Freqghost Model Training",
    "description": "Standardized instructions for training the FreqGhost contrastive CSI encoder and vital signs models.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon freqghost-model-training",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-freqghost-source-management",
    "slug": "loragent-freqghost-source-management",
    "name": "Freqghost Source Management",
    "description": "Add, configure, and manage SceneSource implementations — the central abstraction for all data flow in FreqGhost. Use when adding new sources, switching active source, configuring router credentials,",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon freqghost-source-management",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-freqghost-verification",
    "slug": "loragent-freqghost-verification",
    "name": "Freqghost Verification",
    "description": "Orchestrates deterministic pipeline proofs for FreqGhost ML components to ensure reproducibility.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon freqghost-verification",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-frontend-se",
    "slug": "loragent-frontend-se",
    "name": "Frontend Se",
    "description": "The Frontend Senior Software Engineer. Implements UI/UX using biological/sensory computing aesthetics.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon frontend-se",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-fund-collector",
    "slug": "loragent-fund-collector",
    "name": "Fund Collector",
    "description": "Strategizes roadmaps for VC pitching, crowdfunding, and capitalization.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon fund-collector",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-garbage-collector",
    "slug": "loragent-garbage-collector",
    "name": "Garbage Collector",
    "description": "Identifies and removes unused code, dead files, and unnecessary dependencies.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon garbage-collector",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-gcp-specialist",
    "slug": "loragent-gcp-specialist",
    "name": "Gcp Specialist",
    "description": "Google Cloud Platform Specialist. Automates gcloud CLI, Cloud Run, BigQuery (bq), Cloud Storage (gsutil), IAM, and Vertex AI with Zero-Trust Credential Vault integration.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon gcp-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-gh-cli-specialist",
    "slug": "loragent-gh-cli-specialist",
    "name": "Gh Cli Specialist",
    "description": "GitHub CLI Specialist. Automates PR management, issue triage, release generation, Actions workflow dispatch, and repo settings.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon gh-cli-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-git-release-manager",
    "slug": "loragent-git-release-manager",
    "name": "Git Release Manager",
    "description": "Specialized subagent responsible for auditing git branches (`main`, `LLM-Support/GoogleAiStudio-Support`, `git-features-integration`, `ui-polish-and-functionality-improvement`), preparing releases, up",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon git-release-manager",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-git-specialist",
    "slug": "loragent-git-specialist",
    "name": "Git Specialist",
    "description": "Advanced version control, rebasing, and merge conflict resolution.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon git-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-go-expert",
    "slug": "loragent-go-expert",
    "name": "Go Expert",
    "description": "Go programming language expert.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon go-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-gold-collector",
    "slug": "loragent-gold-collector",
    "name": "Gold Collector",
    "description": "Global Telemetry Miner. Detects novel solutions and syncs them to the Firebase Hivemind.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon gold-collector",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-google-products-specialist",
    "slug": "loragent-google-products-specialist",
    "name": "Google Products Specialist",
    "description": "Specialist for Google Console, Firebase, GCP.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon google-products-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-governance-guard",
    "slug": "loragent-governance-guard",
    "name": "Governance Guard",
    "description": "Audits AGENTS.md, Cursor rules, project skills, hooks, MCP configuration, Husky, and GitHub workflows for policy drift and unsafe automation. Use proactively when governance, agents, hooks, skills, ru",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon governance-guard",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-hr",
    "slug": "loragent-hr",
    "name": "Hr",
    "description": "Human Resources. Tracks agent burnout and token limits.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon hr",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-inspector",
    "slug": "loragent-inspector",
    "name": "Inspector",
    "description": "Uses git blame/git log to find the exact culprit of a bug and generates RCA (Root Cause Analysis) reports.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon inspector",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-isp-man",
    "slug": "loragent-isp-man",
    "name": "Isp Man",
    "description": "Network, IP, Port, and DNS routing specialist.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon isp-man",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-javascript-expert",
    "slug": "loragent-javascript-expert",
    "name": "Javascript Expert",
    "description": "JavaScript (and TypeScript) programming language expert.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon javascript-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-jokki-bhai",
    "slug": "loragent-jokki-bhai",
    "name": "Jokki Bhai",
    "description": "The Entertainer. Roasts the team using roast-as-a-service.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon jokki-bhai",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-k8-expert",
    "slug": "loragent-k8-expert",
    "name": "K8 Expert",
    "description": "Kubernetes, Helm charts, and cluster management.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon k8-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-laravel-specialist",
    "slug": "loragent-laravel-specialist",
    "name": "Laravel Specialist",
    "description": "Laravel PHP framework specialist.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon laravel-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-legacy-system-analyser",
    "slug": "loragent-legacy-system-analyser",
    "name": "Legacy System Analyser",
    "description": "Understands and optimizes legacy syntaxes.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon legacy-system-analyser",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-localization-expert",
    "slug": "loragent-localization-expert",
    "name": "Localization Expert",
    "description": "i18n, l10n, and multi-language support mapping.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon localization-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-logo-designer",
    "slug": "loragent-logo-designer",
    "name": "Logo Designer",
    "description": "Specialist in branding and logo design prompts.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon logo-designer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-loragent-amo-mcp",
    "slug": "loragent-loragent-amo-mcp",
    "name": "Loragent Amo Mcp",
    "description": "MCP-orchestrated Firefox AMO publishing for Lorapok extensions.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon loragent-amo-mcp",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-loragent-amo-publish",
    "slug": "loragent-loragent-amo-publish",
    "name": "Loragent Amo Publish",
    "description": "Firefox AMO publish pipeline for Lorapok browser extensions — web-ext sign, amo-metadata, CI, Mission Control, credential vault.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon loragent-amo-publish",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-loragent-cloudflare-mail-master",
    "slug": "loragent-loragent-cloudflare-mail-master",
    "name": "Loragent Cloudflare Mail Master",
    "description": "Cloudflare Email Sending on Cloudflare Pages via REST API. Use when configuring outbound mail, routing rules, token split, or troubleshooting 401/10203 errors for Lorapok projects.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon loragent-cloudflare-mail-master",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-loragent-dynamic-versioning",
    "slug": "loragent-loragent-dynamic-versioning",
    "name": "Loragent Dynamic Versioning",
    "description": "Lorapok dynamic versioning matrix for production, beta, dev, and PR builds. Use when bumping releases, wiring CI, or Mission Control deploy flows.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon loragent-dynamic-versioning",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-loragent-marketplace-crosslink",
    "slug": "loragent-loragent-marketplace-crosslink",
    "name": "Loragent Marketplace Crosslink",
    "description": "Add consistent",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon loragent-marketplace-crosslink",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-loragent-mission-control",
    "slug": "loragent-loragent-mission-control",
    "name": "Loragent Mission Control",
    "description": "Operate Lorapok Mission Control admin panel — deployments, notices, mailbox, marketplace sync, and infra-only publishes.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon loragent-mission-control",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-loragent-openvsx-publish",
    "slug": "loragent-loragent-openvsx-publish",
    "name": "Loragent Openvsx Publish",
    "description": "Open VSX publishing for Lorapok VS Code extensions — canonical lorapok-labs namespace, duplicate listing fixes, CI sync.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon loragent-openvsx-publish",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-loragent-unified-deployment",
    "slug": "loragent-loragent-unified-deployment",
    "name": "Loragent Unified Deployment",
    "description": "Mission Control–only unified deployment for Lorapok projects — release, marketplace publish, admin panel, and website via mission-control.lorapok.tech.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon loragent-unified-deployment",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-loragent-vscode-publish",
    "slug": "loragent-loragent-vscode-publish",
    "name": "Loragent Vscode Publish",
    "description": "VS Code Marketplace publishing for Lorapok extensions — VSCE token, publisher LorapokLabs, CI and Mission Control wiring.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon loragent-vscode-publish",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-loragent-website-design",
    "slug": "loragent-loragent-website-design",
    "name": "Loragent Website Design",
    "description": "Design and refresh Lorapok marketing sites — gallery images, platform ribbons, KPI stats, SEO, and Mission Control infra deploy.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon loragent-website-design",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-lorapok-brain-documentation",
    "slug": "loragent-lorapok-brain-documentation",
    "name": "Lorapok Brain Documentation",
    "description": "Skill for maintaining and updating BRAIN.md, .agents/BRAIN.md, and project documentation after every code or architectural change in Lorapok AI Agent.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-brain-documentation",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-lorapok-cli-testing",
    "slug": "loragent-lorapok-cli-testing",
    "name": "Lorapok Cli Testing",
    "description": "Skill for running, testing, and debugging the Lorapok CLI, including terminal rendering, mock interactive commands, corner-case testing, and Jest test runner.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-cli-testing",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-lorapok-deployment-specialist",
    "slug": "loragent-lorapok-deployment-specialist",
    "name": "Lorapok Deployment Specialist",
    "description": "Professional Deployment Specialist skill for Lorapok Media Player. Manages full CI/CD, build verification across Electron, React, Website, and Chrome Extension. Features automated error extraction, diagnosis, fix planning, and retry hook execution.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-deployment-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-lorapok-express-server",
    "slug": "loragent-lorapok-express-server",
    "name": "Lorapok Express Server",
    "description": "Skill for Express REST API in server.js, model guards, sessions, and packages/sdk consumers.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-express-server",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-lorapok-frontend",
    "slug": "loragent-lorapok-frontend",
    "name": "Lorapok Frontend",
    "description": ">-",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-frontend",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-lorapok-git-workflow",
    "slug": "loragent-lorapok-git-workflow",
    "name": "Lorapok Git Workflow",
    "description": "Skill for managing git integration features, branch management, merge conflict resolution, pull request workflow, and git automation actions in Lorapok.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-git-workflow",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-lorapok-mcp-integration",
    "slug": "loragent-lorapok-mcp-integration",
    "name": "Lorapok Mcp Integration",
    "description": "Skill for building, configuring, and verifying Model Context Protocol (MCP) server & client integrations within Lorapok AI Agent.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-mcp-integration",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-lorapok-model-provider",
    "slug": "loragent-lorapok-model-provider",
    "name": "Lorapok Model Provider",
    "description": "Skill for ModelManager, ModelValidator, ModelCacheService, multi-provider routing, menus, and REST model endpoints.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-model-provider",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-lorapok-token-efficiency",
    "slug": "loragent-lorapok-token-efficiency",
    "name": "Lorapok Token Efficiency",
    "description": "Skill for optimizing token usage and context retrieval when AI agents work on the Lorapok AI Agent codebase.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-token-efficiency",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-lorapok-website-build",
    "slug": "loragent-lorapok-website-build",
    "name": "Lorapok Website Build",
    "description": "Skill for maintaining and deploying apps/website frontend assets and static documentation.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-website-build",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-marketing-gen",
    "slug": "loragent-marketing-gen",
    "name": "Marketing Gen",
    "description": "Generates high-fidelity, sensory computing and biological UI marketing assets for the Lorapok Ecosystem.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon marketing-gen",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-marketing-strategy-manager",
    "slug": "loragent-marketing-strategy-manager",
    "name": "Marketing Strategy Manager",
    "description": "Plans overall marketing strategy.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon marketing-strategy-manager",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-mathematician",
    "slug": "loragent-mathematician",
    "name": "Mathematician",
    "description": "Advanced mathematics and statistical logic solver.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon mathematician",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-mermaid-architecture-specialist",
    "slug": "loragent-mermaid-architecture-specialist",
    "name": "Mermaid Architecture Specialist",
    "description": "Expert in visualizing complex systems using Mermaid.js syntax (flowcharts, state diagrams, sequence diagrams).",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon mermaid-architecture-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-model-auditor",
    "slug": "loragent-model-auditor",
    "name": "Model Auditor",
    "description": "After model/menu/API changes.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon model-auditor",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-node-specialist",
    "slug": "loragent-node-specialist",
    "name": "Node Specialist",
    "description": "Node.js backend and runtime specialist.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon node-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-notion-expert",
    "slug": "loragent-notion-expert",
    "name": "Notion Expert",
    "description": "Notion API and integration master.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon notion-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-office-assistant",
    "slug": "loragent-office-assistant",
    "name": "Office Assistant",
    "description": "Passes data from one agent to another on demand.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon office-assistant",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-operations",
    "slug": "loragent-operations",
    "name": "Operations",
    "description": "The Operations Manager (Ops). Monitors deployment health and logs errors.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon operations",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-os-specialist",
    "slug": "loragent-os-specialist",
    "name": "Os Specialist",
    "description": "Expert in Operating Systems, file directories, and kernel level operations.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon os-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-package-expert",
    "slug": "loragent-package-expert",
    "name": "Package Expert",
    "description": "Professional Package JSON Writer and strict metadata enforcer.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon package-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-package-maker",
    "slug": "loragent-package-maker",
    "name": "Package Maker",
    "description": "Scaffolds NPM, Pip, and Composer packages.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon package-maker",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-paymentguy",
    "slug": "loragent-paymentguy",
    "name": "Paymentguy",
    "description": "Specialist for payment system integrations (Stripe, PayPal, etc).",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon paymentguy",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-performance-analyser",
    "slug": "loragent-performance-analyser",
    "name": "Performance Analyser",
    "description": "Deep-dive bottleneck profiling.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon performance-analyser",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-pion",
    "slug": "loragent-pion",
    "name": "Pion",
    "description": "The PION Agent. Consolidates final results, artifacts, and walkthroughs to present to the Client.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon pion",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-pipeline-checker",
    "slug": "loragent-pipeline-checker",
    "name": "Pipeline Checker",
    "description": "Validates data and CI pipeline integrity.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon pipeline-checker",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-portfolio-designer",
    "slug": "loragent-portfolio-designer",
    "name": "Portfolio Designer",
    "description": "Designs the layout and content structure for personal or project portfolio websites.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon portfolio-designer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-pr-specialist",
    "slug": "loragent-pr-specialist",
    "name": "Pr Specialist",
    "description": "Public Relations. Handles public sentiment, press releases, and crisis management.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon pr-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-professional-document-creator",
    "slug": "loragent-professional-document-creator",
    "name": "Professional Document Creator",
    "description": "Creates Markdown, PDF, text, proposals.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon professional-document-creator",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-professional-readme-creator",
    "slug": "loragent-professional-readme-creator",
    "name": "Professional Readme Creator",
    "description": "Skill for drafting, auditing, and maintaining high-impact, professional README documentation for Lorapok AI Agent and open-source repositories.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon professional-readme-creator",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-professional-research-docx-writer",
    "slug": "loragent-professional-research-docx-writer",
    "name": "Professional Research Docx Writer",
    "description": ">-",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon professional-research-docx-writer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-professor",
    "slug": "loragent-professor",
    "name": "Professor",
    "description": "Conducts deep academic-level reviews and architectural analysis of the entire project.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon professor",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-project-architect",
    "slug": "loragent-project-architect",
    "name": "Project Architect",
    "description": "Project Architect and Team Lead. Orchestrates the project, assigns tasks to specialized developers, designs architecture, and triages reported bugs. Use proactively for architecture decisions or routi",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon project-architect",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-project-coordinator",
    "slug": "loragent-project-coordinator",
    "name": "Project Coordinator",
    "description": "Orchestrates project timelines, resource allocation, and dependencies.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon project-coordinator",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-project-manager",
    "slug": "loragent-project-manager",
    "name": "Project Manager",
    "description": "The Project Manager. Breaks down requirements into tasks, creates the /plan, and orchestrates the virtual office workflow.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon project-manager",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-project-overviewer",
    "slug": "loragent-project-overviewer",
    "name": "Project Overviewer",
    "description": "Generates high-level project state summaries.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon project-overviewer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-project-theme-expert",
    "slug": "loragent-project-theme-expert",
    "name": "Project Theme Expert",
    "description": "Curates the visual language, design system, and overarching aesthetic (like ",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon project-theme-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-prototype-designer",
    "slug": "loragent-prototype-designer",
    "name": "Prototype Designer",
    "description": "Prototype designer like design in Canva.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon prototype-designer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-publisher",
    "slug": "loragent-publisher",
    "name": "Publisher",
    "description": "Generates publish sites info, texts, articles, images to reach target audience.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon publisher",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-python-expert",
    "slug": "loragent-python-expert",
    "name": "Python Expert",
    "description": "Python programming language expert (version and syntax aware).",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon python-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-railway-expert",
    "slug": "loragent-railway-expert",
    "name": "Railway Expert",
    "description": "Railway.app backend deployment specialist.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon railway-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-react-best-practices",
    "slug": "loragent-react-best-practices",
    "name": "React Best Practices",
    "description": "React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patter",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon react-best-practices",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-react-specialist",
    "slug": "loragent-react-specialist",
    "name": "React Specialist",
    "description": "React.js framework specialist.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon react-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-readme-generator-specialist",
    "slug": "loragent-readme-generator-specialist",
    "name": "Readme Generator Specialist",
    "description": "Analyzes the entire project ecosystem to generate highly professional, extensive README files tailored to the specific project.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon readme-generator-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-release-integrity",
    "slug": "loragent-release-integrity",
    "name": "Release Integrity",
    "description": "Audits package versions, GitHub releases, VSIX links, marketplace observations, SEO artifacts, and publishing workflows. Use proactively before releases, marketplace sync, SEO changes, or generated-da",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon release-integrity",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-repo-repair",
    "slug": "loragent-repo-repair",
    "name": "Repo Repair",
    "description": "Performs a structured repository repair across tests, runtime paths, generated release data, CI, SEO, and governance. Use when fixing broad regressions, release drift, or requests involving agents, ho",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon repo-repair",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-research-paper-writer",
    "slug": "loragent-research-paper-writer",
    "name": "Research Paper Writer",
    "description": "Specialized in writing academic, IEEE, or white-paper style documents.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon research-paper-writer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-responsive-system-designer",
    "slug": "loragent-responsive-system-designer",
    "name": "Responsive System Designer",
    "description": "Mobile-first layouts and fluid scaling.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon responsive-system-designer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-rust-expert",
    "slug": "loragent-rust-expert",
    "name": "Rust Expert",
    "description": "Rust programming language expert.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon rust-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-sales-executive",
    "slug": "loragent-sales-executive",
    "name": "Sales Executive",
    "description": "Focuses on conversion and direct sales copy.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon sales-executive",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-scaffold",
    "slug": "loragent-scaffold",
    "name": "Scaffold",
    "description": "Generate deployment-ready infrastructure code from an architecture plan, verify it with adversarial self-review, and bridge to validation — all without deploying.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon scaffold",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-se-model-specialist",
    "slug": "loragent-se-model-specialist",
    "name": "Se Model Specialist",
    "description": "Expert in Software Engineering architectural models (Waterfall, Agile, etc).",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon se-model-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-seo",
    "slug": "loragent-seo",
    "name": "Seo",
    "description": ">-",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon seo",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-seo-specialist",
    "slug": "loragent-seo-specialist",
    "name": "Seo Specialist",
    "description": "Search Engine Optimization specialist.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon seo-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-shift-engineer",
    "slug": "loragent-shift-engineer",
    "name": "Shift Engineer",
    "description": "Handles short, isolated tasks.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon shift-engineer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-skill-creator",
    "slug": "loragent-skill-creator",
    "name": "Skill Creator",
    "description": "Autonomously writes new agent skills and pushes to Firebase.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon skill-creator",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-software-business-analyst",
    "slug": "loragent-software-business-analyst",
    "name": "Software Business Analyst",
    "description": "Cost to market analysis, competitive pricing, plans and strategies.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon software-business-analyst",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-specialized-developer",
    "slug": "loragent-specialized-developer",
    "name": "Specialized Developer",
    "description": "Specialized Developer performing high-tech global industry level coding. Use proactively to implement assigned subtasks, fix bugs, and refactor code safely.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon specialized-developer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-spidernet",
    "slug": "loragent-spidernet",
    "name": "Spidernet",
    "description": "The Spidernet multi-agent workflow coordinator.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon spidernet",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-sqa",
    "slug": "loragent-sqa",
    "name": "Sqa",
    "description": "The Senior QA. Runs automated tests, reviews edge cases, and checks accessibility/security.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon sqa",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-sqa-lead",
    "slug": "loragent-sqa-lead",
    "name": "Sqa Lead",
    "description": "High-tech global industry level 20+ years experienced SQA with development background. Use proactively for deep testing, edge-case analysis, finding bugs, and comprehensive test suite generation.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon sqa-lead",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-srs-analyzer",
    "slug": "loragent-srs-analyzer",
    "name": "Srs Analyzer",
    "description": "Software Requirements Specification analyzer.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon srs-analyzer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-store-specialist",
    "slug": "loragent-store-specialist",
    "name": "Store Specialist",
    "description": "Deployment to App Store, Play Store, and Package Managers.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon store-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-streamvar-theme-architect",
    "slug": "loragent-streamvar-theme-architect",
    "name": "Streamvar Theme Architect",
    "description": "Principal Frontend UI/UX Architect & Systems Designer for Loragent. Uses Next.js App Router, React 19, Tailwind CSS, and Framer Motion.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon streamvar-theme-architect",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-teacher",
    "slug": "loragent-teacher",
    "name": "Teacher",
    "description": "The prompt clarifier. Asks the human user questions to ensure the Boss designs the plan perfectly.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon teacher",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-team-lead",
    "slug": "loragent-team-lead",
    "name": "Team Lead",
    "description": "The Team Lead. Coordinates the tech team, assigns engineering tasks, and conducts primary code reviews.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon team-lead",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-tech-director",
    "slug": "loragent-tech-director",
    "name": "Tech Director",
    "description": "The Tech Director (Architect). Defines technical architecture, stack, and data models.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon tech-director",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-test-sentinel",
    "slug": "loragent-test-sentinel",
    "name": "Test Sentinel",
    "description": "Specialized subagent responsible for test execution, corner-case test expansion, and verifying zero regression across all test suites.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon test-sentinel",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-themeguy",
    "slug": "loragent-themeguy",
    "name": "Themeguy",
    "description": "Global UI theme and styling connoisseur.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon themeguy",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-thewikiboy",
    "slug": "loragent-thewikiboy",
    "name": "Thewikiboy",
    "description": "Deep-dive researcher for scraping and finding all data/sources.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon thewikiboy",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-token-auditor",
    "slug": "loragent-token-auditor",
    "name": "Token Auditor",
    "description": "Specialized subagent responsible for auditing token consumption, context payload efficiency, and enforcing token conservation rules across agent workflows.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon token-auditor",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-token-sniper",
    "slug": "loragent-token-sniper",
    "name": "Token Sniper",
    "description": "Premium context optimization agent. Slashes AI token usage by >70% using AST pruning, skeletonization, and diff-only parsing.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon token-sniper",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-tools-specialist",
    "slug": "loragent-tools-specialist",
    "name": "Tools Specialist",
    "description": "Tooling & Package Expert. Suggests optimal packages and provides robust installation mechanics.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon tools-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-ui-ux-professional",
    "slug": "loragent-ui-ux-professional",
    "name": "Ui Ux Professional",
    "description": "World-class UI/UX design and wireframing.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon ui-ux-professional",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-validator",
    "slug": "loragent-validator",
    "name": "Validator",
    "description": "Deep data and list validation logic.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon validator",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-vercel-expert",
    "slug": "loragent-vercel-expert",
    "name": "Vercel Expert",
    "description": "Vercel deployment and Edge functions specialist.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon vercel-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-version-bumper",
    "slug": "loragent-version-bumper",
    "name": "Version Bumper",
    "description": "Handles version bumping mechanism professionally. Uses LVP for Pro users, and standard SemVer for free users.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon version-bumper",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-vidman",
    "slug": "loragent-vidman",
    "name": "Vidman",
    "description": "Generates prompts and scripts for marketing reels and video content.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon vidman",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-vue-specialist",
    "slug": "loragent-vue-specialist",
    "name": "Vue Specialist",
    "description": "Vue.js framework specialist.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon vue-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-web-design-guidelines",
    "slug": "loragent-web-design-guidelines",
    "name": "Web Design Guidelines",
    "description": "Review UI code for Web Interface Guidelines compliance. Use when asked to \"review my UI\", \"check accessibility\", \"audit design\", \"review UX\", or \"check my site against best practices\".",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon web-design-guidelines",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-workflow-automation-specialist",
    "slug": "loragent-workflow-automation-specialist",
    "name": "Workflow Automation Specialist",
    "description": "n8n, OpenClaw, and low-code orchestrations.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon workflow-automation-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-workflow-manager",
    "slug": "loragent-workflow-manager",
    "name": "Workflow Manager",
    "description": "Fine-tunes the physical office flow and handles the logistics of the Hub-and-Spoke model.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon workflow-manager",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-workspace-guard",
    "slug": "loragent-workspace-guard",
    "name": "Workspace Guard",
    "description": "Security enforcer that prevents unauthorized deletions or destructive commands.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon workspace-guard",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-wrangler-specialist",
    "slug": "loragent-wrangler-specialist",
    "name": "Wrangler Specialist",
    "description": "Cloudflare Wrangler CLI Specialist. Automates deployment of Workers, Pages, KV, D1, R2, Vectorize, Queues, and Secrets with Zero-Trust Credential Vault integration.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon wrangler-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-amo-mcp",
    "slug": "loragent-amo-mcp",
    "name": "Amo Mcp",
    "description": "MCP-orchestrated Firefox AMO publishing for Lorapok extensions.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon amo-mcp",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-amo-publish",
    "slug": "loragent-amo-publish",
    "name": "Amo Publish",
    "description": "Firefox AMO publish pipeline for Lorapok browser extensions — web-ext sign, amo-metadata, CI, Mission Control, credential vault.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon amo-publish",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-deploy",
    "slug": "loragent-deploy",
    "name": "Deploy",
    "description": "Handles all deployment operations: Vercel (frontend/serverless), Railway (backend/databases), Docker (containerized), and multi-platform. Invoke after code is complete and SQA-approved. ALWAYS requires workspace-guard confirmation for production. Preview/staging deploys are auto.",
    "layer": "loom",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon deploy",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "loom"
    ]
  },
  {
    "id": "loragent-marketplace-crosslink",
    "slug": "loragent-marketplace-crosslink",
    "name": "Marketplace Crosslink",
    "description": "Add consistent \"Also available on\" platform links across IDE extensions, browser add-ons, AMO, VSCE, Open VSX, README, and marketing site.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon marketplace-crosslink",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-mission-control",
    "slug": "loragent-mission-control",
    "name": "Mission Control",
    "description": "Operate Lorapok Mission Control admin panel — deployments, notices, mailbox, marketplace sync, and infra-only publishes.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon mission-control",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-openvsx-publish",
    "slug": "loragent-openvsx-publish",
    "name": "Openvsx Publish",
    "description": "Open VSX publishing for Lorapok VS Code extensions — canonical lorapok-labs namespace, duplicate listing fixes, CI sync.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon openvsx-publish",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-unified-deployment",
    "slug": "loragent-unified-deployment",
    "name": "Unified Deployment",
    "description": "Mission Control–only unified deployment for Lorapok projects — release, marketplace publish, admin panel, and website via mission-control.lorapok.tech.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon unified-deployment",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-vscode-publish",
    "slug": "loragent-vscode-publish",
    "name": "Vscode Publish",
    "description": "VS Code Marketplace publishing for Lorapok extensions — VSCE token, publisher LorapokLabs, CI and Mission Control wiring.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon vscode-publish",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-website-design",
    "slug": "loragent-website-design",
    "name": "Website Design",
    "description": "Design and refresh Lorapok marketing sites — gallery images, platform ribbons, KPI stats, SEO, and Mission Control infra deploy.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon website-design",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-amo-mcp",
    "slug": "loragent-amo-mcp",
    "name": "Amo Mcp",
    "description": "MCP-orchestrated Firefox AMO publishing for Lorapok extensions.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon amo-mcp",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-amo-publish",
    "slug": "loragent-amo-publish",
    "name": "Amo Publish",
    "description": "Firefox AMO publish pipeline for Lorapok browser extensions — web-ext sign, amo-metadata, CI, Mission Control, credential vault.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon amo-publish",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-backend-se",
    "slug": "loragent-backend-se",
    "name": "Backend Se",
    "description": "The Backend Senior Software Engineer. Implements APIs, core player logic, and data structures.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon backend-se",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-bug-hunter",
    "slug": "loragent-bug-hunter",
    "name": "Bug Hunter",
    "description": "The Chela. Most critical problem solver developer. Vibes with devs to fix things.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon bug-hunter",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-deploy",
    "slug": "loragent-deploy",
    "name": "Deploy",
    "description": "Handles all deployment operations: Vercel (frontend/serverless), Railway (backend/databases), Docker (containerized), and multi-platform. Invoke after code is complete and SQA-approved. ALWAYS requires workspace-guard confirmation for production. Preview/staging deploys are auto.",
    "layer": "loom",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon deploy",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "loom"
    ]
  },
  {
    "id": "loragent-frontend-se",
    "slug": "loragent-frontend-se",
    "name": "Frontend Se",
    "description": "The Frontend Senior Software Engineer. Implements UI/UX using biological/sensory computing aesthetics.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon frontend-se",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-marketplace-crosslink",
    "slug": "loragent-marketplace-crosslink",
    "name": "Marketplace Crosslink",
    "description": "Add consistent \"Also available on\" platform links across IDE extensions, browser add-ons, AMO, VSCE, Open VSX, README, and marketing site.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon marketplace-crosslink",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-mission-control",
    "slug": "loragent-mission-control",
    "name": "Mission Control",
    "description": "Operate Lorapok Mission Control admin panel — deployments, notices, mailbox, marketplace sync, and infra-only publishes.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon mission-control",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-openvsx-publish",
    "slug": "loragent-openvsx-publish",
    "name": "Openvsx Publish",
    "description": "Open VSX publishing for Lorapok VS Code extensions — canonical lorapok-labs namespace, duplicate listing fixes, CI sync.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon openvsx-publish",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-spidernet",
    "slug": "loragent-spidernet",
    "name": "Spidernet",
    "description": "The Spidernet multi-agent workflow coordinator.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon spidernet",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-sqa",
    "slug": "loragent-sqa",
    "name": "Sqa",
    "description": "The Senior QA. Runs automated tests, reviews edge cases, and checks accessibility/security.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon sqa",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-system-knowledge",
    "slug": "loragent-system-knowledge",
    "name": "System Knowledge",
    "description": "Complete architectural reference for the Loragent 165-agent ecosystem — LLDP layers, naming conventions, agent hierarchy, sync pipeline, cross-OS paths, and CLI commands.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon system-knowledge",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-teacher",
    "slug": "loragent-teacher",
    "name": "Teacher",
    "description": "The prompt clarifier. Asks the human user questions to ensure the Boss designs the plan perfectly.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon teacher",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-tech-director",
    "slug": "loragent-tech-director",
    "name": "Tech Director",
    "description": "The Tech Director (Architect). Defines technical architecture, stack, and data models.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon tech-director",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-unified-deployment",
    "slug": "loragent-unified-deployment",
    "name": "Unified Deployment",
    "description": "Mission Control–only unified deployment for Lorapok projects — release, marketplace publish, admin panel, and website via mission-control.lorapok.tech.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon unified-deployment",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-vscode-publish",
    "slug": "loragent-vscode-publish",
    "name": "Vscode Publish",
    "description": "VS Code Marketplace publishing for Lorapok extensions — VSCE token, publisher LorapokLabs, CI and Mission Control wiring.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon vscode-publish",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-website-design",
    "slug": "loragent-website-design",
    "name": "Website Design",
    "description": "Design and refresh Lorapok marketing sites — gallery images, platform ribbons, KPI stats, SEO, and Mission Control infra deploy.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon website-design",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-workspace-guard",
    "slug": "loragent-workspace-guard",
    "name": "Workspace Guard",
    "description": "Security enforcer that prevents unauthorized deletions or destructive commands.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon workspace-guard",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-wrangler-specialist",
    "slug": "loragent-wrangler-specialist",
    "name": "Wrangler Specialist",
    "description": "Cloudflare Wrangler CLI Specialist. Automates deployment of Workers, Pages, KV, D1, R2, Vectorize, Queues, and Secrets with Zero-Trust Credential Vault integration.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon wrangler-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "ui-ux-specialist",
    "slug": "ui-ux-specialist",
    "name": "Ui Ux Specialist",
    "description": "Expert UI/UX Engineering skill for web development. Focuses on modern React, Tailwind CSS, advanced accessibility (a11y), responsive design, and integrating Figma-to-code or Frontend Design MCPs.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon ui-ux-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-boss",
    "slug": "loragent-boss",
    "name": "Boss",
    "description": "The Main Boss. Orchestrates the whole workflow, delegates to subagents, and compiles final outputs.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon boss",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "lorapok-marketing-gen",
    "slug": "lorapok-marketing-gen",
    "name": "Lorapok Marketing Gen",
    "description": "Generates high-fidelity, sensory computing and biological UI marketing assets for the Lorapok Ecosystem.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-marketing-gen",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-package-expert",
    "slug": "loragent-package-expert",
    "name": "Package Expert",
    "description": "Professional Package JSON Writer and strict metadata enforcer.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon package-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-spidernet",
    "slug": "loragent-spidernet",
    "name": "Spidernet",
    "description": "The Spidernet multi-agent workflow coordinator.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon spidernet",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-streamvar-theme-architect",
    "slug": "loragent-streamvar-theme-architect",
    "name": "Streamvar Theme Architect",
    "description": "Principal Frontend UI/UX Architect & Systems Designer for Loragent. Uses Next.js App Router, React 19, Tailwind CSS, and Framer Motion.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon streamvar-theme-architect",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-teacher",
    "slug": "loragent-teacher",
    "name": "Teacher",
    "description": "The prompt clarifier. Asks the human user questions to ensure the Boss designs the plan perfectly.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon teacher",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-watchman",
    "slug": "loragent-watchman",
    "name": "Watchman",
    "description": "Watches the system. Maintains a cache file to allow uninterrupted recovery of stuck processes via /loragent-watchman continue.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon watchman",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-workspace-guard",
    "slug": "loragent-workspace-guard",
    "name": "Workspace Guard",
    "description": "Security enforcer that prevents unauthorized deletions or destructive commands.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon workspace-guard",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-business-expert",
    "slug": "loragent-business-expert",
    "name": "Business Expert",
    "description": "Manages Lorapok Labs monetization, subscription logic, marketing campaigns, and upsells.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon business-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-boss",
    "slug": "loragent-boss",
    "name": "Boss",
    "description": "Central orchestrator of the 108-agent Loragent ecosystem. Invoke first for any multi-step or complex task. Boss analyzes scope, selects the correct formation (Auto/Office/Chela/Freelance), summons specialist agents via MCP, and manages the full execution pipeline. Do NOT invoke when a single specialist is clearly sufficient — invoke that specialist directly instead.",
    "layer": "cross",
    "formation": "orchestrator",
    "type": "agent",
    "command": "/loragent summon boss",
    "tags": [
      "agent",
      "loragent",
      "orchestrator",
      "cross"
    ]
  },
  {
    "id": "loragent-boss",
    "slug": "loragent-boss",
    "name": "Boss",
    "description": "Central orchestrator of the 108-agent Loragent ecosystem. Invoke first for any multi-step or complex task. Boss analyzes scope, selects the correct formation (Auto/Office/Chela/Freelance), summons specialist agents via MCP, and manages the full execution pipeline. Do NOT invoke when a single specialist is clearly sufficient — invoke that specialist directly instead.",
    "layer": "cross",
    "formation": "orchestrator",
    "type": "agent",
    "command": "/loragent summon boss",
    "tags": [
      "agent",
      "loragent",
      "orchestrator",
      "cross"
    ]
  },
  {
    "id": "loragent-gif-create",
    "slug": "loragent-gif-create",
    "name": "Gif Create",
    "description": "Creates, optimizes, and delivers animated GIFs and short video clips. Invoke when: converting video to GIF, creating loading animations, Slack GIFs, banner animations, sprite sheets, or any looping media asset. Do NOT invoke for static images or long-form video editing.",
    "layer": "face",
    "formation": "freelance",
    "type": "agent",
    "command": "/loragent summon gif-create",
    "tags": [
      "agent",
      "loragent",
      "freelance",
      "face"
    ]
  },
  {
    "id": "loragent-image-generate",
    "slug": "loragent-image-generate",
    "name": "Image Generate",
    "description": "Generates production-quality images using Fal.ai (primary) or Replicate (fallback). Invoke when any agent or the user needs: concept art, hero images, UI backgrounds, logo concepts, marketing visuals, poster generation, or any AI image output. Do NOT invoke for SVG icons, code-generated graphics, or chart/data visualization.",
    "layer": "face",
    "formation": "freelance",
    "type": "agent",
    "command": "/loragent summon image-generate",
    "tags": [
      "agent",
      "loragent",
      "freelance",
      "face"
    ]
  },
  {
    "id": "loragent-tools-install",
    "slug": "loragent-tools-install",
    "name": "Tools Install",
    "description": "Detects, installs, and verifies any tool, package, or binary required by other agents. Invoke when any agent reports a missing tool or dependency. Handles npm, pip/uv, composer, system packages, and binary tools. Includes rollback on failure. Do NOT invoke for application-level code dependencies (that is the backend-se's job).",
    "layer": "loom",
    "formation": "freelance",
    "type": "agent",
    "command": "/loragent summon tools-install",
    "tags": [
      "agent",
      "loragent",
      "freelance",
      "loom"
    ]
  },
  {
    "id": "loragent-gif-create",
    "slug": "loragent-gif-create",
    "name": "Gif Create",
    "description": "Creates, optimizes, and delivers animated GIFs and short video clips. Invoke when: converting video to GIF, creating loading animations, Slack GIFs, banner animations, sprite sheets, or any looping media asset. Do NOT invoke for static images or long-form video editing.",
    "layer": "face",
    "formation": "freelance",
    "type": "agent",
    "command": "/loragent summon gif-create",
    "tags": [
      "agent",
      "loragent",
      "freelance",
      "face"
    ]
  },
  {
    "id": "loragent-image-generate",
    "slug": "loragent-image-generate",
    "name": "Image Generate",
    "description": "Generates production-quality images using Fal.ai (primary) or Replicate (fallback). Invoke when any agent or the user needs: concept art, hero images, UI backgrounds, logo concepts, marketing visuals, poster generation, or any AI image output. Do NOT invoke for SVG icons, code-generated graphics, or chart/data visualization.",
    "layer": "face",
    "formation": "freelance",
    "type": "agent",
    "command": "/loragent summon image-generate",
    "tags": [
      "agent",
      "loragent",
      "freelance",
      "face"
    ]
  },
  {
    "id": "loragent-tools-install",
    "slug": "loragent-tools-install",
    "name": "Tools Install",
    "description": "Detects, installs, and verifies any tool, package, or binary required by other agents. Invoke when any agent reports a missing tool or dependency. Handles npm, pip/uv, composer, system packages, and binary tools. Includes rollback on failure. Do NOT invoke for application-level code dependencies (that is the backend-se's job).",
    "layer": "loom",
    "formation": "freelance",
    "type": "agent",
    "command": "/loragent summon tools-install",
    "tags": [
      "agent",
      "loragent",
      "freelance",
      "loom"
    ]
  },
  {
    "id": "loragent-gif-create",
    "slug": "loragent-gif-create",
    "name": "Gif Create",
    "description": "Creates, optimizes, and delivers animated GIFs and short video clips. Invoke when: converting video to GIF, creating loading animations, Slack GIFs, banner animations, sprite sheets, or any looping media asset. Do NOT invoke for static images or long-form video editing.",
    "layer": "face",
    "formation": "freelance",
    "type": "agent",
    "command": "/loragent summon gif-create",
    "tags": [
      "agent",
      "loragent",
      "freelance",
      "face"
    ]
  },
  {
    "id": "loragent-image-generate",
    "slug": "loragent-image-generate",
    "name": "Image Generate",
    "description": "Generates production-quality images using Fal.ai (primary) or Replicate (fallback). Invoke when any agent or the user needs: concept art, hero images, UI backgrounds, logo concepts, marketing visuals, poster generation, or any AI image output. Do NOT invoke for SVG icons, code-generated graphics, or chart/data visualization.",
    "layer": "face",
    "formation": "freelance",
    "type": "agent",
    "command": "/loragent summon image-generate",
    "tags": [
      "agent",
      "loragent",
      "freelance",
      "face"
    ]
  },
  {
    "id": "loragent-tools-install",
    "slug": "loragent-tools-install",
    "name": "Tools Install",
    "description": "Detects, installs, and verifies any tool, package, or binary required by other agents. Invoke when any agent reports a missing tool or dependency. Handles npm, pip/uv, composer, system packages, and binary tools. Includes rollback on failure. Do NOT invoke for application-level code dependencies (that is the backend-se's job).",
    "layer": "loom",
    "formation": "freelance",
    "type": "agent",
    "command": "/loragent summon tools-install",
    "tags": [
      "agent",
      "loragent",
      "freelance",
      "loom"
    ]
  },
  {
    "id": "loragent-watchman",
    "slug": "loragent-watchman",
    "name": "Watchman",
    "description": "Session state guardian and crash recovery agent. Invoke with /loragent-watchman continue to resume a crashed or token-limited session. Automatically activated by the post-task-watchman-save hook after every major agent task. Do NOT invoke manually mid-task — the hook handles automatic saves.",
    "layer": "cross",
    "formation": "observer",
    "type": "agent",
    "command": "/loragent summon watchman",
    "tags": [
      "agent",
      "loragent",
      "observer",
      "cross"
    ]
  },
  {
    "id": "loragent-watchman",
    "slug": "loragent-watchman",
    "name": "Watchman",
    "description": "Session state guardian and crash recovery agent. Invoke with /loragent-watchman continue to resume a crashed or token-limited session. Automatically activated by the post-task-watchman-save hook after every major agent task. Do NOT invoke manually mid-task — the hook handles automatic saves.",
    "layer": "cross",
    "formation": "observer",
    "type": "agent",
    "command": "/loragent summon watchman",
    "tags": [
      "agent",
      "loragent",
      "observer",
      "cross"
    ]
  },
  {
    "id": "loragent-watchman",
    "slug": "loragent-watchman",
    "name": "Watchman",
    "description": "Session state guardian and crash recovery agent. Invoke with /loragent-watchman continue to resume a crashed or token-limited session. Automatically activated by the post-task-watchman-save hook after every major agent task. Do NOT invoke manually mid-task — the hook handles automatic saves.",
    "layer": "cross",
    "formation": "observer",
    "type": "agent",
    "command": "/loragent summon watchman",
    "tags": [
      "agent",
      "loragent",
      "observer",
      "cross"
    ]
  }
];

export const agentsAndSkills: AgentItem[] = [
  {
    "id": "loragent-admin-reliability",
    "slug": "loragent-admin-reliability",
    "name": "Admin Reliability",
    "description": "Debugs, verifies, and optimizes the admin React SPA, Vitest test suites, API middleware, Firebase Auth, and Cloudflare Pages runtime. Use proactively for admin test failures, dashboard regressions, API errors, auth issues, or deployment defects.",
    "layer": "face",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-admin-reliability",
    "tags": [
      "skill",
      "loragent",
      "face"
    ]
  },
  {
    "id": "loragent-amo-mcp",
    "slug": "loragent-amo-mcp",
    "name": "Amo Mcp",
    "description": "MCP-orchestrated Firefox AMO publishing for Lorapok extensions.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-amo-mcp",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-amo-publish",
    "slug": "loragent-amo-publish",
    "name": "Amo Publish",
    "description": "Firefox AMO publish pipeline for Lorapok browser extensions — web-ext sign, amo-metadata, CI, Mission Control, credential vault.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-amo-publish",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-deploy",
    "slug": "loragent-deploy",
    "name": "Deploy",
    "description": "Handles all deployment operations: Vercel (frontend/serverless), Railway (backend/databases), Docker (containerized), and multi-platform. Invoke after code is complete and SQA-approved. ALWAYS requires workspace-guard confirmation for production. Preview/staging deploys are auto.",
    "layer": "loom",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-deploy",
    "tags": [
      "skill",
      "loragent",
      "loom"
    ]
  },
  {
    "id": "loragent-gif-create",
    "slug": "loragent-gif-create",
    "name": "Gif Create",
    "description": "Creates, optimizes, and delivers animated GIFs and short video clips. Invoke when: converting video to GIF, creating loading animations, Slack GIFs, banner animations, sprite sheets, or any looping media asset. Do NOT invoke for static images or long-form video editing.",
    "layer": "face",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-gif-create",
    "tags": [
      "skill",
      "loragent",
      "face"
    ]
  },
  {
    "id": "loragent-governance-guard",
    "slug": "loragent-governance-guard",
    "name": "Governance Guard",
    "description": "Audits AGENTS.md, Cursor rules, project skills, lifecycle hooks, MCP configurations, Husky hooks, and GitHub workflows for policy drift and unsafe automation. Use proactively when governance, rules, hooks, or CI controls mutate.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-governance-guard",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-image-generate",
    "slug": "loragent-image-generate",
    "name": "Image Generate",
    "description": "Generates production-quality images using Fal.ai (primary) or Replicate (fallback). Invoke when any agent or the user needs: concept art, hero images, UI backgrounds, logo concepts, marketing visuals, poster generation, or any AI image output. Do NOT invoke for SVG icons, code-generated graphics, or chart/data visualization.",
    "layer": "face",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-image-generate",
    "tags": [
      "skill",
      "loragent",
      "face"
    ]
  },
  {
    "id": "loragent-marketplace-crosslink",
    "slug": "loragent-marketplace-crosslink",
    "name": "Marketplace Crosslink",
    "description": "Add consistent \"Also available on\" platform links across IDE extensions, browser add-ons, AMO, VSCE, Open VSX, README, and marketing site.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-marketplace-crosslink",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-mission-control",
    "slug": "loragent-mission-control",
    "name": "Mission Control",
    "description": "Operate Lorapok Mission Control admin panel — deployments, notices, mailbox, marketplace sync, and infra-only publishes.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-mission-control",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-openvsx-publish",
    "slug": "loragent-openvsx-publish",
    "name": "Openvsx Publish",
    "description": "Open VSX publishing for Lorapok VS Code extensions — canonical lorapok-labs namespace, duplicate listing fixes, CI sync.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-openvsx-publish",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-register",
    "slug": "loragent-register",
    "name": "Register",
    "description": "Dynamic Ecosystem Registrar & Catalog Synthesizer. Ingests discoveries from loragent-student, dynamically compiles new SKILL.md specs, updates marketplace.json, and synchronizes IDE mirrors.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-register",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-release-integrity",
    "slug": "loragent-release-integrity",
    "name": "Release Integrity",
    "description": "Audits package versions, GitHub release tags, VSIX artifacts, marketplace observations, SEO JSON-LD structured data, and publishing workflows. Use proactively before major releases, marketplace updates, or release drift investigations.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-release-integrity",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-student",
    "slug": "loragent-student",
    "name": "Student",
    "description": "Continuous Conversation Learner & Evolutionary Intelligence Agent. Listens to live developer pairing, discovers novel workflows/tools/fixes not yet in Loragent, reports to loragent-register for dynamic catalog expansion, and modernizes legacy agent skills.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-student",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-tools-install",
    "slug": "loragent-tools-install",
    "name": "Tools Install",
    "description": "Detects, installs, and verifies any tool, package, or binary required by other agents. Invoke when any agent reports a missing tool or dependency. Handles npm, pip/uv, composer, system packages, and binary tools. Includes rollback on failure. Do NOT invoke for application-level code dependencies (that is the backend-se's job).",
    "layer": "loom",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-tools-install",
    "tags": [
      "skill",
      "loragent",
      "loom"
    ]
  },
  {
    "id": "loragent-unified-deployment",
    "slug": "loragent-unified-deployment",
    "name": "Unified Deployment",
    "description": "Mission Control–only unified deployment for Lorapok projects — release, marketplace publish, admin panel, and website via mission-control.lorapok.tech.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-unified-deployment",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-vscode-publish",
    "slug": "loragent-vscode-publish",
    "name": "Vscode Publish",
    "description": "VS Code Marketplace publishing for Lorapok extensions — VSCE token, publisher LorapokLabs, CI and Mission Control wiring.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-vscode-publish",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-watchman",
    "slug": "loragent-watchman",
    "name": "Watchman",
    "description": "Session state guardian and crash recovery agent. Invoke with /loragent-watchman continue to resume a crashed or token-limited session. Automatically activated by the post-task-watchman-save hook after every major agent task. Do NOT invoke manually mid-task — the hook handles automatic saves.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-watchman",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-website-design",
    "slug": "loragent-website-design",
    "name": "Website Design",
    "description": "Design and refresh Lorapok marketing sites — gallery images, platform ribbons, KPI stats, SEO, and Mission Control infra deploy.",
    "layer": "cross",
    "formation": "skill",
    "type": "skill",
    "command": "/loragent summon loragent-website-design",
    "tags": [
      "skill",
      "loragent",
      "cross"
    ]
  },
  {
    "id": "loragent-3d-designer",
    "slug": "loragent-3d-designer",
    "name": "3d Designer",
    "description": "3D modeling for apps, software, and web.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon 3d-designer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-accessibility-audit",
    "slug": "loragent-accessibility-audit",
    "name": "Accessibility Audit",
    "description": "Whole site or product — a full web accessibility (a11y) audit against WCAG 2.2, following the WCAG-EM methodology. Defines scope, samples representative pages and flows, runs the automated tier (`ac",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon accessibility-audit",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-accounts-specialist",
    "slug": "loragent-accounts-specialist",
    "name": "Accounts Specialist",
    "description": "Credentials Manager. Safely handles tokens and sensitive info using the secure-cred-vault standard.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon accounts-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-addon-maker",
    "slug": "loragent-addon-maker",
    "name": "Addon Maker",
    "description": "Browser extension and application addon creator.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon addon-maker",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-admin-reliability",
    "slug": "loragent-admin-reliability",
    "name": "Admin Reliability",
    "description": "Debugs and reviews the admin React SPA, Vitest setup, API middleware, Firebase auth, and Cloudflare Pages runtime. Use proactively for admin test failures, dashboard regressions, API errors, auth issu",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon admin-reliability",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-ads-manager",
    "slug": "loragent-ads-manager",
    "name": "Ads Manager",
    "description": "Suggests where to provide ads and how with strategy.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon ads-manager",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-ai-communicator",
    "slug": "loragent-ai-communicator",
    "name": "Ai Communicator",
    "description": "AI to AI Communicator. Gets more precise ideas from specialty-based models.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon ai-communicator",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-algorithm-implementer",
    "slug": "loragent-algorithm-implementer",
    "name": "Algorithm Implementer",
    "description": "Problem solver like in LeetCode or competitive programming platforms.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon algorithm-implementer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-angular-specialist",
    "slug": "loragent-angular-specialist",
    "name": "Angular Specialist",
    "description": "Angular framework specialist.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon angular-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-animator",
    "slug": "loragent-animator",
    "name": "Animator",
    "description": "Creates animated designs.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon animator",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-api-chef",
    "slug": "loragent-api-chef",
    "name": "Api Chef",
    "description": "Designs perfectly structured API responses.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon api-chef",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-apple-ecosystem-expert",
    "slug": "loragent-apple-ecosystem-expert",
    "name": "Apple Ecosystem Expert",
    "description": "macOS, iOS, Swift, and Apple ecosystem authority.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon apple-ecosystem-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-architect-designer",
    "slug": "loragent-architect-designer",
    "name": "Architect Designer",
    "description": "Works alongside the Tech Director to map out complex system architectures visually or structurally.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon architect-designer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-auditor",
    "slug": "loragent-auditor",
    "name": "Auditor",
    "description": "Security and code compliance auditing.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon auditor",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-authentication-engineer",
    "slug": "loragent-authentication-engineer",
    "name": "Authentication Engineer",
    "description": "Enterprise Auth, OAuth, and JWT workflows.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon authentication-engineer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-aws-specialist",
    "slug": "loragent-aws-specialist",
    "name": "Aws Specialist",
    "description": "Amazon Web Services (AWS) Specialist. Automates AWS CLI, Lambda, S3, ECS/EKS, DynamoDB, and CloudFormation with Zero-Trust Credential Vault integration.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon aws-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-azure-cloud-specialist",
    "slug": "loragent-azure-cloud-specialist",
    "name": "Azure Cloud Specialist",
    "description": "Microsoft Azure Cloud Specialist. Automates Azure CLI (az), Container Apps, Azure Functions, Cosmos DB, Blob Storage, Entra ID, and Key Vault with Zero-Trust Credential Vault integration.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon azure-cloud-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-azure-specialist",
    "slug": "loragent-azure-specialist",
    "name": "Azure Specialist",
    "description": "Microsoft Azure cloud infrastructure expert.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon azure-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-backend-se",
    "slug": "loragent-backend-se",
    "name": "Backend Se",
    "description": "The Backend Senior Software Engineer. Implements APIs, core player logic, and data structures.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon backend-se",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-browser-automation-expert",
    "slug": "loragent-browser-automation-expert",
    "name": "Browser Automation Expert",
    "description": "Playwright/Puppeteer/Selenium E2E testing.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon browser-automation-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-browser-specialist",
    "slug": "loragent-browser-specialist",
    "name": "Browser Specialist",
    "description": "Operates exclusively via Browser MCP to navigate and automate web tasks.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon browser-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-bug-hunter",
    "slug": "loragent-bug-hunter",
    "name": "Bug Hunter",
    "description": "The Chela. Most critical problem solver developer. Vibes with devs to fix things.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon bug-hunter",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-business-expert",
    "slug": "loragent-business-expert",
    "name": "Business Expert",
    "description": "The Business Expert. Analyzes requirements for SEO, market fit, and product logic.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon business-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-cache-collector",
    "slug": "loragent-cache-collector",
    "name": "Cache Collector",
    "description": "Premium grade Cache Manager. Uses Web3 End-to-End Encryption (E2EE) and Brotli compression to securely sync and free up IDE cache space.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon cache-collector",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-chorki",
    "slug": "loragent-chorki",
    "name": "Chorki",
    "description": "The Unstoppable Autonomous Autopilot Loop Agent. Iterates relentlessly and executes multi-step objectives until 100% verifiably completed using continuous check-done verification hooks.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon chorki",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-cicd-automation-expert",
    "slug": "loragent-cicd-automation-expert",
    "name": "Cicd Automation Expert",
    "description": "Advanced CI/CD engineering approach.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon cicd-automation-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-cicd-specialist",
    "slug": "loragent-cicd-specialist",
    "name": "Cicd Specialist",
    "description": "Lead CI/CD Pipeline Architect & Release Specialist. Designs, automates, and optimizes multi-target deployment pipelines (GitHub Actions, Cloudflare, Docker, NPM, PyPI, Composer, AMO, Open VSX).",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon cicd-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-cli-automation-maker",
    "slug": "loragent-cli-automation-maker",
    "name": "Cli Automation Maker",
    "description": "Builds internal CLI tools and bash automations.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon cli-automation-maker",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-cli-utilities-specialist",
    "slug": "loragent-cli-utilities-specialist",
    "name": "Cli Utilities Specialist",
    "description": "Builds and optimizes command-line tools.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon cli-utilities-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-client",
    "slug": "loragent-client",
    "name": "Client",
    "description": "The Client agent. Responsible for providing initial requirements, business constraints, and defining success metrics for the virtual office.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon client",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-cloud-specialist",
    "slug": "loragent-cloud-specialist",
    "name": "Cloud Specialist",
    "description": "General cloud infrastructure architect.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon cloud-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-code-auditor",
    "slug": "loragent-code-auditor",
    "name": "Code Auditor",
    "description": "Specialized subagent responsible for auditing code quality, security vulnerabilities, API syntax compliance, and CommonJS module export consistency across the codebase.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon code-auditor",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-code-optimizer",
    "slug": "loragent-code-optimizer",
    "name": "Code Optimizer",
    "description": "Optimizes code execution speed and memory usage.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon code-optimizer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-command-executor",
    "slug": "loragent-command-executor",
    "name": "Command Executor",
    "description": "Specialized agent that runs terminal commands across any ecosystem (Node, Python, Docker) safely interpreting output.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon command-executor",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-content-writer",
    "slug": "loragent-content-writer",
    "name": "Content Writer",
    "description": "Writes professional articles and blogs.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon content-writer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-cpp-expert",
    "slug": "loragent-cpp-expert",
    "name": "Cpp Expert",
    "description": "C++ programming language expert.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon cpp-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-cv-maker",
    "slug": "loragent-cv-maker",
    "name": "Cv Maker",
    "description": "Generates professional CVs/Resumes based on developer portfolios and Git histories.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon cv-maker",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-database-designer",
    "slug": "loragent-database-designer",
    "name": "Database Designer",
    "description": "Professional DB architect.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon database-designer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-database-updater",
    "slug": "loragent-database-updater",
    "name": "Database Updater",
    "description": "Dedicated to syncing agent learnings to Firebase.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon database-updater",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-debugger",
    "slug": "loragent-debugger",
    "name": "Debugger",
    "description": "Dedicated step-through and stack-trace debugger.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon debugger",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-delivery-boy",
    "slug": "loragent-delivery-boy",
    "name": "Delivery Boy",
    "description": "Carries deployment released products to specific places.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon delivery-boy",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-deploy",
    "slug": "loragent-deploy",
    "name": "Deploy",
    "description": "Handles all deployment operations: Vercel (frontend/serverless), Railway (backend/databases), Docker (containerized), and multi-platform. Invoke after code is complete and SQA-approved. ALWAYS requires workspace-guard confirmation for production. Preview/staging deploys are auto.",
    "layer": "loom",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon deploy",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "loom"
    ]
  },
  {
    "id": "loragent-devops",
    "slug": "loragent-devops",
    "name": "Devops",
    "description": "The DevOps Specialist. Runs CI/CD pipelines, deployment hooks, and ensures build stability.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon devops",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-django-specialist",
    "slug": "loragent-django-specialist",
    "name": "Django Specialist",
    "description": "Django framework specialist.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon django-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-doc-brain-updater",
    "slug": "loragent-doc-brain-updater",
    "name": "Doc Brain Updater",
    "description": "Autonomous documentation maintainer and living knowledge synchronizer for Lorapok AI Agent. Responsible for ensuring `BRAIN.md`, `.agents/BRAIN.md`, `README.md`, `CHANGELOG.md`, `USAGE.md`, and `TESTI",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon doc-brain-updater",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-docker-specialist",
    "slug": "loragent-docker-specialist",
    "name": "Docker Specialist",
    "description": "Docker & Containerization Specialist. Automates multi-stage Dockerfiles, Docker Compose stacks, container health checks, and image registries.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon docker-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-docman",
    "slug": "loragent-docman",
    "name": "Docman",
    "description": "Docker, containerization, and orchestration expert.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon docman",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-env-maker",
    "slug": "loragent-env-maker",
    "name": "Env Maker",
    "description": "Config specialist for env, CMake, and CNAME.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon env-maker",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-fastapi",
    "slug": "loragent-fastapi",
    "name": "Fastapi",
    "description": "FastAPI best practices and conventions. Use when working with FastAPI APIs and Pydantic models for them. Keeps FastAPI code clean and up to date with the latest features and patterns, updated with new",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon fastapi",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-firebase-specialist",
    "slug": "loragent-firebase-specialist",
    "name": "Firebase Specialist",
    "description": "Firebase Ecosystem Specialist. Automates Firestore data modeling, Cloud Functions, Firebase Authentication, Hosting, Storage, and Security Rules auditing with Zero-Trust Credential Vault integration.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon firebase-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-freqghost-admin-panel",
    "slug": "loragent-freqghost-admin-panel",
    "name": "Freqghost Admin Panel",
    "description": "Build and modify the FreqGhost admin dashboard — Cognitum-aesthetic web UI with JWT auth, role-based ACL, source switching, data collection controls, and ML model management. Use when the user asks ",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon freqghost-admin-panel",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-freqghost-data-collection",
    "slug": "loragent-freqghost-data-collection",
    "name": "Freqghost Data Collection",
    "description": "Manage CSI/RSSI data collection sessions for ML training — recording, labeling, exporting datasets, and quality validation. Use when the user asks to collect data, record CSI, build datasets, label ",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon freqghost-data-collection",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-freqghost-deployment",
    "slug": "loragent-freqghost-deployment",
    "name": "Freqghost Deployment",
    "description": "Deploy FreqGhost via Docker, nginx, and production configuration — multi-service compose, SSL/TLS, MQTT broker, environment variables. Use when deploying, configuring Docker, setting up nginx, or ma",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon freqghost-deployment",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-freqghost-frontend-dev",
    "slug": "loragent-freqghost-frontend-dev",
    "name": "Freqghost Frontend Dev",
    "description": "Develop the FreqGhost Three.js 3D viewer and admin panel frontend — Cognitum aesthetic, CDN-only libraries, no build step. Use when modifying the 3D viewer, adding UI elements, changing styling, or ",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon freqghost-frontend-dev",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-freqghost-model-training",
    "slug": "loragent-freqghost-model-training",
    "name": "Freqghost Model Training",
    "description": "Standardized instructions for training the FreqGhost contrastive CSI encoder and vital signs models.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon freqghost-model-training",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-freqghost-source-management",
    "slug": "loragent-freqghost-source-management",
    "name": "Freqghost Source Management",
    "description": "Add, configure, and manage SceneSource implementations — the central abstraction for all data flow in FreqGhost. Use when adding new sources, switching active source, configuring router credentials,",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon freqghost-source-management",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-freqghost-verification",
    "slug": "loragent-freqghost-verification",
    "name": "Freqghost Verification",
    "description": "Orchestrates deterministic pipeline proofs for FreqGhost ML components to ensure reproducibility.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon freqghost-verification",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-frontend-se",
    "slug": "loragent-frontend-se",
    "name": "Frontend Se",
    "description": "The Frontend Senior Software Engineer. Implements UI/UX using biological/sensory computing aesthetics.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon frontend-se",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-fund-collector",
    "slug": "loragent-fund-collector",
    "name": "Fund Collector",
    "description": "Strategizes roadmaps for VC pitching, crowdfunding, and capitalization.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon fund-collector",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-garbage-collector",
    "slug": "loragent-garbage-collector",
    "name": "Garbage Collector",
    "description": "Identifies and removes unused code, dead files, and unnecessary dependencies.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon garbage-collector",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-gcp-specialist",
    "slug": "loragent-gcp-specialist",
    "name": "Gcp Specialist",
    "description": "Google Cloud Platform Specialist. Automates gcloud CLI, Cloud Run, BigQuery (bq), Cloud Storage (gsutil), IAM, and Vertex AI with Zero-Trust Credential Vault integration.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon gcp-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-gh-cli-specialist",
    "slug": "loragent-gh-cli-specialist",
    "name": "Gh Cli Specialist",
    "description": "GitHub CLI Specialist. Automates PR management, issue triage, release generation, Actions workflow dispatch, and repo settings.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon gh-cli-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-git-release-manager",
    "slug": "loragent-git-release-manager",
    "name": "Git Release Manager",
    "description": "Specialized subagent responsible for auditing git branches (`main`, `LLM-Support/GoogleAiStudio-Support`, `git-features-integration`, `ui-polish-and-functionality-improvement`), preparing releases, up",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon git-release-manager",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-git-specialist",
    "slug": "loragent-git-specialist",
    "name": "Git Specialist",
    "description": "Advanced version control, rebasing, and merge conflict resolution.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon git-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-go-expert",
    "slug": "loragent-go-expert",
    "name": "Go Expert",
    "description": "Go programming language expert.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon go-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-gold-collector",
    "slug": "loragent-gold-collector",
    "name": "Gold Collector",
    "description": "Global Telemetry Miner. Detects novel solutions and syncs them to the Firebase Hivemind.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon gold-collector",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-google-products-specialist",
    "slug": "loragent-google-products-specialist",
    "name": "Google Products Specialist",
    "description": "Specialist for Google Console, Firebase, GCP.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon google-products-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-governance-guard",
    "slug": "loragent-governance-guard",
    "name": "Governance Guard",
    "description": "Audits AGENTS.md, Cursor rules, project skills, hooks, MCP configuration, Husky, and GitHub workflows for policy drift and unsafe automation. Use proactively when governance, agents, hooks, skills, ru",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon governance-guard",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-hr",
    "slug": "loragent-hr",
    "name": "Hr",
    "description": "Human Resources. Tracks agent burnout and token limits.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon hr",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-inspector",
    "slug": "loragent-inspector",
    "name": "Inspector",
    "description": "Uses git blame/git log to find the exact culprit of a bug and generates RCA (Root Cause Analysis) reports.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon inspector",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-isp-man",
    "slug": "loragent-isp-man",
    "name": "Isp Man",
    "description": "Network, IP, Port, and DNS routing specialist.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon isp-man",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-javascript-expert",
    "slug": "loragent-javascript-expert",
    "name": "Javascript Expert",
    "description": "JavaScript (and TypeScript) programming language expert.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon javascript-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-jokki-bhai",
    "slug": "loragent-jokki-bhai",
    "name": "Jokki Bhai",
    "description": "The Entertainer. Roasts the team using roast-as-a-service.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon jokki-bhai",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-k8-expert",
    "slug": "loragent-k8-expert",
    "name": "K8 Expert",
    "description": "Kubernetes, Helm charts, and cluster management.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon k8-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-laravel-specialist",
    "slug": "loragent-laravel-specialist",
    "name": "Laravel Specialist",
    "description": "Laravel PHP framework specialist.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon laravel-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-legacy-system-analyser",
    "slug": "loragent-legacy-system-analyser",
    "name": "Legacy System Analyser",
    "description": "Understands and optimizes legacy syntaxes.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon legacy-system-analyser",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-localization-expert",
    "slug": "loragent-localization-expert",
    "name": "Localization Expert",
    "description": "i18n, l10n, and multi-language support mapping.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon localization-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-logo-designer",
    "slug": "loragent-logo-designer",
    "name": "Logo Designer",
    "description": "Specialist in branding and logo design prompts.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon logo-designer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-loragent-amo-mcp",
    "slug": "loragent-loragent-amo-mcp",
    "name": "Loragent Amo Mcp",
    "description": "MCP-orchestrated Firefox AMO publishing for Lorapok extensions.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon loragent-amo-mcp",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-loragent-amo-publish",
    "slug": "loragent-loragent-amo-publish",
    "name": "Loragent Amo Publish",
    "description": "Firefox AMO publish pipeline for Lorapok browser extensions — web-ext sign, amo-metadata, CI, Mission Control, credential vault.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon loragent-amo-publish",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-loragent-cloudflare-mail-master",
    "slug": "loragent-loragent-cloudflare-mail-master",
    "name": "Loragent Cloudflare Mail Master",
    "description": "Cloudflare Email Sending on Cloudflare Pages via REST API. Use when configuring outbound mail, routing rules, token split, or troubleshooting 401/10203 errors for Lorapok projects.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon loragent-cloudflare-mail-master",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-loragent-dynamic-versioning",
    "slug": "loragent-loragent-dynamic-versioning",
    "name": "Loragent Dynamic Versioning",
    "description": "Lorapok dynamic versioning matrix for production, beta, dev, and PR builds. Use when bumping releases, wiring CI, or Mission Control deploy flows.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon loragent-dynamic-versioning",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-loragent-marketplace-crosslink",
    "slug": "loragent-loragent-marketplace-crosslink",
    "name": "Loragent Marketplace Crosslink",
    "description": "Add consistent",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon loragent-marketplace-crosslink",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-loragent-mission-control",
    "slug": "loragent-loragent-mission-control",
    "name": "Loragent Mission Control",
    "description": "Operate Lorapok Mission Control admin panel — deployments, notices, mailbox, marketplace sync, and infra-only publishes.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon loragent-mission-control",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-loragent-openvsx-publish",
    "slug": "loragent-loragent-openvsx-publish",
    "name": "Loragent Openvsx Publish",
    "description": "Open VSX publishing for Lorapok VS Code extensions — canonical lorapok-labs namespace, duplicate listing fixes, CI sync.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon loragent-openvsx-publish",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-loragent-unified-deployment",
    "slug": "loragent-loragent-unified-deployment",
    "name": "Loragent Unified Deployment",
    "description": "Mission Control–only unified deployment for Lorapok projects — release, marketplace publish, admin panel, and website via mission-control.lorapok.tech.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon loragent-unified-deployment",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-loragent-vscode-publish",
    "slug": "loragent-loragent-vscode-publish",
    "name": "Loragent Vscode Publish",
    "description": "VS Code Marketplace publishing for Lorapok extensions — VSCE token, publisher LorapokLabs, CI and Mission Control wiring.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon loragent-vscode-publish",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-loragent-website-design",
    "slug": "loragent-loragent-website-design",
    "name": "Loragent Website Design",
    "description": "Design and refresh Lorapok marketing sites — gallery images, platform ribbons, KPI stats, SEO, and Mission Control infra deploy.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon loragent-website-design",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-lorapok-brain-documentation",
    "slug": "loragent-lorapok-brain-documentation",
    "name": "Lorapok Brain Documentation",
    "description": "Skill for maintaining and updating BRAIN.md, .agents/BRAIN.md, and project documentation after every code or architectural change in Lorapok AI Agent.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-brain-documentation",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-lorapok-cli-testing",
    "slug": "loragent-lorapok-cli-testing",
    "name": "Lorapok Cli Testing",
    "description": "Skill for running, testing, and debugging the Lorapok CLI, including terminal rendering, mock interactive commands, corner-case testing, and Jest test runner.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-cli-testing",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-lorapok-deployment-specialist",
    "slug": "loragent-lorapok-deployment-specialist",
    "name": "Lorapok Deployment Specialist",
    "description": "Professional Deployment Specialist skill for Lorapok Media Player. Manages full CI/CD, build verification across Electron, React, Website, and Chrome Extension. Features automated error extraction, diagnosis, fix planning, and retry hook execution.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-deployment-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-lorapok-express-server",
    "slug": "loragent-lorapok-express-server",
    "name": "Lorapok Express Server",
    "description": "Skill for Express REST API in server.js, model guards, sessions, and packages/sdk consumers.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-express-server",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-lorapok-frontend",
    "slug": "loragent-lorapok-frontend",
    "name": "Lorapok Frontend",
    "description": ">-",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-frontend",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-lorapok-git-workflow",
    "slug": "loragent-lorapok-git-workflow",
    "name": "Lorapok Git Workflow",
    "description": "Skill for managing git integration features, branch management, merge conflict resolution, pull request workflow, and git automation actions in Lorapok.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-git-workflow",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-lorapok-mcp-integration",
    "slug": "loragent-lorapok-mcp-integration",
    "name": "Lorapok Mcp Integration",
    "description": "Skill for building, configuring, and verifying Model Context Protocol (MCP) server & client integrations within Lorapok AI Agent.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-mcp-integration",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-lorapok-model-provider",
    "slug": "loragent-lorapok-model-provider",
    "name": "Lorapok Model Provider",
    "description": "Skill for ModelManager, ModelValidator, ModelCacheService, multi-provider routing, menus, and REST model endpoints.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-model-provider",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-lorapok-token-efficiency",
    "slug": "loragent-lorapok-token-efficiency",
    "name": "Lorapok Token Efficiency",
    "description": "Skill for optimizing token usage and context retrieval when AI agents work on the Lorapok AI Agent codebase.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-token-efficiency",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-lorapok-website-build",
    "slug": "loragent-lorapok-website-build",
    "name": "Lorapok Website Build",
    "description": "Skill for maintaining and deploying apps/website frontend assets and static documentation.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-website-build",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-marketing-gen",
    "slug": "loragent-marketing-gen",
    "name": "Marketing Gen",
    "description": "Generates high-fidelity, sensory computing and biological UI marketing assets for the Lorapok Ecosystem.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon marketing-gen",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-marketing-strategy-manager",
    "slug": "loragent-marketing-strategy-manager",
    "name": "Marketing Strategy Manager",
    "description": "Plans overall marketing strategy.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon marketing-strategy-manager",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-mathematician",
    "slug": "loragent-mathematician",
    "name": "Mathematician",
    "description": "Advanced mathematics and statistical logic solver.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon mathematician",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-mermaid-architecture-specialist",
    "slug": "loragent-mermaid-architecture-specialist",
    "name": "Mermaid Architecture Specialist",
    "description": "Expert in visualizing complex systems using Mermaid.js syntax (flowcharts, state diagrams, sequence diagrams).",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon mermaid-architecture-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-model-auditor",
    "slug": "loragent-model-auditor",
    "name": "Model Auditor",
    "description": "After model/menu/API changes.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon model-auditor",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-node-specialist",
    "slug": "loragent-node-specialist",
    "name": "Node Specialist",
    "description": "Node.js backend and runtime specialist.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon node-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-notion-expert",
    "slug": "loragent-notion-expert",
    "name": "Notion Expert",
    "description": "Notion API and integration master.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon notion-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-office-assistant",
    "slug": "loragent-office-assistant",
    "name": "Office Assistant",
    "description": "Passes data from one agent to another on demand.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon office-assistant",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-operations",
    "slug": "loragent-operations",
    "name": "Operations",
    "description": "The Operations Manager (Ops). Monitors deployment health and logs errors.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon operations",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-os-specialist",
    "slug": "loragent-os-specialist",
    "name": "Os Specialist",
    "description": "Expert in Operating Systems, file directories, and kernel level operations.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon os-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-package-expert",
    "slug": "loragent-package-expert",
    "name": "Package Expert",
    "description": "Professional Package JSON Writer and strict metadata enforcer.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon package-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-package-maker",
    "slug": "loragent-package-maker",
    "name": "Package Maker",
    "description": "Scaffolds NPM, Pip, and Composer packages.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon package-maker",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-paymentguy",
    "slug": "loragent-paymentguy",
    "name": "Paymentguy",
    "description": "Specialist for payment system integrations (Stripe, PayPal, etc).",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon paymentguy",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-performance-analyser",
    "slug": "loragent-performance-analyser",
    "name": "Performance Analyser",
    "description": "Deep-dive bottleneck profiling.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon performance-analyser",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-pion",
    "slug": "loragent-pion",
    "name": "Pion",
    "description": "The PION Agent. Consolidates final results, artifacts, and walkthroughs to present to the Client.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon pion",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-pipeline-checker",
    "slug": "loragent-pipeline-checker",
    "name": "Pipeline Checker",
    "description": "Validates data and CI pipeline integrity.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon pipeline-checker",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-portfolio-designer",
    "slug": "loragent-portfolio-designer",
    "name": "Portfolio Designer",
    "description": "Designs the layout and content structure for personal or project portfolio websites.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon portfolio-designer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-pr-specialist",
    "slug": "loragent-pr-specialist",
    "name": "Pr Specialist",
    "description": "Public Relations. Handles public sentiment, press releases, and crisis management.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon pr-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-professional-document-creator",
    "slug": "loragent-professional-document-creator",
    "name": "Professional Document Creator",
    "description": "Creates Markdown, PDF, text, proposals.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon professional-document-creator",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-professional-readme-creator",
    "slug": "loragent-professional-readme-creator",
    "name": "Professional Readme Creator",
    "description": "Skill for drafting, auditing, and maintaining high-impact, professional README documentation for Lorapok AI Agent and open-source repositories.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon professional-readme-creator",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-professional-research-docx-writer",
    "slug": "loragent-professional-research-docx-writer",
    "name": "Professional Research Docx Writer",
    "description": ">-",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon professional-research-docx-writer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-professor",
    "slug": "loragent-professor",
    "name": "Professor",
    "description": "Conducts deep academic-level reviews and architectural analysis of the entire project.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon professor",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-project-architect",
    "slug": "loragent-project-architect",
    "name": "Project Architect",
    "description": "Project Architect and Team Lead. Orchestrates the project, assigns tasks to specialized developers, designs architecture, and triages reported bugs. Use proactively for architecture decisions or routi",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon project-architect",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-project-coordinator",
    "slug": "loragent-project-coordinator",
    "name": "Project Coordinator",
    "description": "Orchestrates project timelines, resource allocation, and dependencies.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon project-coordinator",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-project-manager",
    "slug": "loragent-project-manager",
    "name": "Project Manager",
    "description": "The Project Manager. Breaks down requirements into tasks, creates the /plan, and orchestrates the virtual office workflow.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon project-manager",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-project-overviewer",
    "slug": "loragent-project-overviewer",
    "name": "Project Overviewer",
    "description": "Generates high-level project state summaries.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon project-overviewer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-project-theme-expert",
    "slug": "loragent-project-theme-expert",
    "name": "Project Theme Expert",
    "description": "Curates the visual language, design system, and overarching aesthetic (like ",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon project-theme-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-prototype-designer",
    "slug": "loragent-prototype-designer",
    "name": "Prototype Designer",
    "description": "Prototype designer like design in Canva.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon prototype-designer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-publisher",
    "slug": "loragent-publisher",
    "name": "Publisher",
    "description": "Generates publish sites info, texts, articles, images to reach target audience.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon publisher",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-python-expert",
    "slug": "loragent-python-expert",
    "name": "Python Expert",
    "description": "Python programming language expert (version and syntax aware).",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon python-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-railway-expert",
    "slug": "loragent-railway-expert",
    "name": "Railway Expert",
    "description": "Railway.app backend deployment specialist.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon railway-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-react-best-practices",
    "slug": "loragent-react-best-practices",
    "name": "React Best Practices",
    "description": "React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patter",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon react-best-practices",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-react-specialist",
    "slug": "loragent-react-specialist",
    "name": "React Specialist",
    "description": "React.js framework specialist.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon react-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-readme-generator-specialist",
    "slug": "loragent-readme-generator-specialist",
    "name": "Readme Generator Specialist",
    "description": "Analyzes the entire project ecosystem to generate highly professional, extensive README files tailored to the specific project.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon readme-generator-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-release-integrity",
    "slug": "loragent-release-integrity",
    "name": "Release Integrity",
    "description": "Audits package versions, GitHub releases, VSIX links, marketplace observations, SEO artifacts, and publishing workflows. Use proactively before releases, marketplace sync, SEO changes, or generated-da",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon release-integrity",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-repo-repair",
    "slug": "loragent-repo-repair",
    "name": "Repo Repair",
    "description": "Performs a structured repository repair across tests, runtime paths, generated release data, CI, SEO, and governance. Use when fixing broad regressions, release drift, or requests involving agents, ho",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon repo-repair",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-research-paper-writer",
    "slug": "loragent-research-paper-writer",
    "name": "Research Paper Writer",
    "description": "Specialized in writing academic, IEEE, or white-paper style documents.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon research-paper-writer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-responsive-system-designer",
    "slug": "loragent-responsive-system-designer",
    "name": "Responsive System Designer",
    "description": "Mobile-first layouts and fluid scaling.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon responsive-system-designer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-rust-expert",
    "slug": "loragent-rust-expert",
    "name": "Rust Expert",
    "description": "Rust programming language expert.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon rust-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-sales-executive",
    "slug": "loragent-sales-executive",
    "name": "Sales Executive",
    "description": "Focuses on conversion and direct sales copy.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon sales-executive",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-scaffold",
    "slug": "loragent-scaffold",
    "name": "Scaffold",
    "description": "Generate deployment-ready infrastructure code from an architecture plan, verify it with adversarial self-review, and bridge to validation — all without deploying.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon scaffold",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-se-model-specialist",
    "slug": "loragent-se-model-specialist",
    "name": "Se Model Specialist",
    "description": "Expert in Software Engineering architectural models (Waterfall, Agile, etc).",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon se-model-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-seo",
    "slug": "loragent-seo",
    "name": "Seo",
    "description": ">-",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon seo",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-seo-specialist",
    "slug": "loragent-seo-specialist",
    "name": "Seo Specialist",
    "description": "Search Engine Optimization specialist.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon seo-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-shift-engineer",
    "slug": "loragent-shift-engineer",
    "name": "Shift Engineer",
    "description": "Handles short, isolated tasks.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon shift-engineer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-skill-creator",
    "slug": "loragent-skill-creator",
    "name": "Skill Creator",
    "description": "Autonomously writes new agent skills and pushes to Firebase.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon skill-creator",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-software-business-analyst",
    "slug": "loragent-software-business-analyst",
    "name": "Software Business Analyst",
    "description": "Cost to market analysis, competitive pricing, plans and strategies.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon software-business-analyst",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-specialized-developer",
    "slug": "loragent-specialized-developer",
    "name": "Specialized Developer",
    "description": "Specialized Developer performing high-tech global industry level coding. Use proactively to implement assigned subtasks, fix bugs, and refactor code safely.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon specialized-developer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-spidernet",
    "slug": "loragent-spidernet",
    "name": "Spidernet",
    "description": "The Spidernet multi-agent workflow coordinator.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon spidernet",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-sqa",
    "slug": "loragent-sqa",
    "name": "Sqa",
    "description": "The Senior QA. Runs automated tests, reviews edge cases, and checks accessibility/security.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon sqa",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-sqa-lead",
    "slug": "loragent-sqa-lead",
    "name": "Sqa Lead",
    "description": "High-tech global industry level 20+ years experienced SQA with development background. Use proactively for deep testing, edge-case analysis, finding bugs, and comprehensive test suite generation.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon sqa-lead",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-srs-analyzer",
    "slug": "loragent-srs-analyzer",
    "name": "Srs Analyzer",
    "description": "Software Requirements Specification analyzer.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon srs-analyzer",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-store-specialist",
    "slug": "loragent-store-specialist",
    "name": "Store Specialist",
    "description": "Deployment to App Store, Play Store, and Package Managers.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon store-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-streamvar-theme-architect",
    "slug": "loragent-streamvar-theme-architect",
    "name": "Streamvar Theme Architect",
    "description": "Principal Frontend UI/UX Architect & Systems Designer for Loragent. Uses Next.js App Router, React 19, Tailwind CSS, and Framer Motion.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon streamvar-theme-architect",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-teacher",
    "slug": "loragent-teacher",
    "name": "Teacher",
    "description": "The prompt clarifier. Asks the human user questions to ensure the Boss designs the plan perfectly.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon teacher",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-team-lead",
    "slug": "loragent-team-lead",
    "name": "Team Lead",
    "description": "The Team Lead. Coordinates the tech team, assigns engineering tasks, and conducts primary code reviews.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon team-lead",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-tech-director",
    "slug": "loragent-tech-director",
    "name": "Tech Director",
    "description": "The Tech Director (Architect). Defines technical architecture, stack, and data models.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon tech-director",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-test-sentinel",
    "slug": "loragent-test-sentinel",
    "name": "Test Sentinel",
    "description": "Specialized subagent responsible for test execution, corner-case test expansion, and verifying zero regression across all test suites.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon test-sentinel",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-themeguy",
    "slug": "loragent-themeguy",
    "name": "Themeguy",
    "description": "Global UI theme and styling connoisseur.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon themeguy",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-thewikiboy",
    "slug": "loragent-thewikiboy",
    "name": "Thewikiboy",
    "description": "Deep-dive researcher for scraping and finding all data/sources.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon thewikiboy",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-token-auditor",
    "slug": "loragent-token-auditor",
    "name": "Token Auditor",
    "description": "Specialized subagent responsible for auditing token consumption, context payload efficiency, and enforcing token conservation rules across agent workflows.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon token-auditor",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-token-sniper",
    "slug": "loragent-token-sniper",
    "name": "Token Sniper",
    "description": "Premium context optimization agent. Slashes AI token usage by >70% using AST pruning, skeletonization, and diff-only parsing.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon token-sniper",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-tools-specialist",
    "slug": "loragent-tools-specialist",
    "name": "Tools Specialist",
    "description": "Tooling & Package Expert. Suggests optimal packages and provides robust installation mechanics.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon tools-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-ui-ux-professional",
    "slug": "loragent-ui-ux-professional",
    "name": "Ui Ux Professional",
    "description": "World-class UI/UX design and wireframing.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon ui-ux-professional",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-validator",
    "slug": "loragent-validator",
    "name": "Validator",
    "description": "Deep data and list validation logic.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon validator",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-vercel-expert",
    "slug": "loragent-vercel-expert",
    "name": "Vercel Expert",
    "description": "Vercel deployment and Edge functions specialist.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon vercel-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-version-bumper",
    "slug": "loragent-version-bumper",
    "name": "Version Bumper",
    "description": "Handles version bumping mechanism professionally. Uses LVP for Pro users, and standard SemVer for free users.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon version-bumper",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-vidman",
    "slug": "loragent-vidman",
    "name": "Vidman",
    "description": "Generates prompts and scripts for marketing reels and video content.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon vidman",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-vue-specialist",
    "slug": "loragent-vue-specialist",
    "name": "Vue Specialist",
    "description": "Vue.js framework specialist.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon vue-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-web-design-guidelines",
    "slug": "loragent-web-design-guidelines",
    "name": "Web Design Guidelines",
    "description": "Review UI code for Web Interface Guidelines compliance. Use when asked to \"review my UI\", \"check accessibility\", \"audit design\", \"review UX\", or \"check my site against best practices\".",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon web-design-guidelines",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-workflow-automation-specialist",
    "slug": "loragent-workflow-automation-specialist",
    "name": "Workflow Automation Specialist",
    "description": "n8n, OpenClaw, and low-code orchestrations.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon workflow-automation-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-workflow-manager",
    "slug": "loragent-workflow-manager",
    "name": "Workflow Manager",
    "description": "Fine-tunes the physical office flow and handles the logistics of the Hub-and-Spoke model.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon workflow-manager",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-workspace-guard",
    "slug": "loragent-workspace-guard",
    "name": "Workspace Guard",
    "description": "Security enforcer that prevents unauthorized deletions or destructive commands.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon workspace-guard",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-wrangler-specialist",
    "slug": "loragent-wrangler-specialist",
    "name": "Wrangler Specialist",
    "description": "Cloudflare Wrangler CLI Specialist. Automates deployment of Workers, Pages, KV, D1, R2, Vectorize, Queues, and Secrets with Zero-Trust Credential Vault integration.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon wrangler-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-amo-mcp",
    "slug": "loragent-amo-mcp",
    "name": "Amo Mcp",
    "description": "MCP-orchestrated Firefox AMO publishing for Lorapok extensions.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon amo-mcp",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-amo-publish",
    "slug": "loragent-amo-publish",
    "name": "Amo Publish",
    "description": "Firefox AMO publish pipeline for Lorapok browser extensions — web-ext sign, amo-metadata, CI, Mission Control, credential vault.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon amo-publish",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-deploy",
    "slug": "loragent-deploy",
    "name": "Deploy",
    "description": "Handles all deployment operations: Vercel (frontend/serverless), Railway (backend/databases), Docker (containerized), and multi-platform. Invoke after code is complete and SQA-approved. ALWAYS requires workspace-guard confirmation for production. Preview/staging deploys are auto.",
    "layer": "loom",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon deploy",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "loom"
    ]
  },
  {
    "id": "loragent-marketplace-crosslink",
    "slug": "loragent-marketplace-crosslink",
    "name": "Marketplace Crosslink",
    "description": "Add consistent \"Also available on\" platform links across IDE extensions, browser add-ons, AMO, VSCE, Open VSX, README, and marketing site.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon marketplace-crosslink",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-mission-control",
    "slug": "loragent-mission-control",
    "name": "Mission Control",
    "description": "Operate Lorapok Mission Control admin panel — deployments, notices, mailbox, marketplace sync, and infra-only publishes.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon mission-control",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-openvsx-publish",
    "slug": "loragent-openvsx-publish",
    "name": "Openvsx Publish",
    "description": "Open VSX publishing for Lorapok VS Code extensions — canonical lorapok-labs namespace, duplicate listing fixes, CI sync.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon openvsx-publish",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-unified-deployment",
    "slug": "loragent-unified-deployment",
    "name": "Unified Deployment",
    "description": "Mission Control–only unified deployment for Lorapok projects — release, marketplace publish, admin panel, and website via mission-control.lorapok.tech.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon unified-deployment",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-vscode-publish",
    "slug": "loragent-vscode-publish",
    "name": "Vscode Publish",
    "description": "VS Code Marketplace publishing for Lorapok extensions — VSCE token, publisher LorapokLabs, CI and Mission Control wiring.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon vscode-publish",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-website-design",
    "slug": "loragent-website-design",
    "name": "Website Design",
    "description": "Design and refresh Lorapok marketing sites — gallery images, platform ribbons, KPI stats, SEO, and Mission Control infra deploy.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon website-design",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-amo-mcp",
    "slug": "loragent-amo-mcp",
    "name": "Amo Mcp",
    "description": "MCP-orchestrated Firefox AMO publishing for Lorapok extensions.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon amo-mcp",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-amo-publish",
    "slug": "loragent-amo-publish",
    "name": "Amo Publish",
    "description": "Firefox AMO publish pipeline for Lorapok browser extensions — web-ext sign, amo-metadata, CI, Mission Control, credential vault.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon amo-publish",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-backend-se",
    "slug": "loragent-backend-se",
    "name": "Backend Se",
    "description": "The Backend Senior Software Engineer. Implements APIs, core player logic, and data structures.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon backend-se",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-bug-hunter",
    "slug": "loragent-bug-hunter",
    "name": "Bug Hunter",
    "description": "The Chela. Most critical problem solver developer. Vibes with devs to fix things.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon bug-hunter",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-deploy",
    "slug": "loragent-deploy",
    "name": "Deploy",
    "description": "Handles all deployment operations: Vercel (frontend/serverless), Railway (backend/databases), Docker (containerized), and multi-platform. Invoke after code is complete and SQA-approved. ALWAYS requires workspace-guard confirmation for production. Preview/staging deploys are auto.",
    "layer": "loom",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon deploy",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "loom"
    ]
  },
  {
    "id": "loragent-frontend-se",
    "slug": "loragent-frontend-se",
    "name": "Frontend Se",
    "description": "The Frontend Senior Software Engineer. Implements UI/UX using biological/sensory computing aesthetics.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon frontend-se",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-marketplace-crosslink",
    "slug": "loragent-marketplace-crosslink",
    "name": "Marketplace Crosslink",
    "description": "Add consistent \"Also available on\" platform links across IDE extensions, browser add-ons, AMO, VSCE, Open VSX, README, and marketing site.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon marketplace-crosslink",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-mission-control",
    "slug": "loragent-mission-control",
    "name": "Mission Control",
    "description": "Operate Lorapok Mission Control admin panel — deployments, notices, mailbox, marketplace sync, and infra-only publishes.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon mission-control",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-openvsx-publish",
    "slug": "loragent-openvsx-publish",
    "name": "Openvsx Publish",
    "description": "Open VSX publishing for Lorapok VS Code extensions — canonical lorapok-labs namespace, duplicate listing fixes, CI sync.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon openvsx-publish",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-spidernet",
    "slug": "loragent-spidernet",
    "name": "Spidernet",
    "description": "The Spidernet multi-agent workflow coordinator.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon spidernet",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-sqa",
    "slug": "loragent-sqa",
    "name": "Sqa",
    "description": "The Senior QA. Runs automated tests, reviews edge cases, and checks accessibility/security.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon sqa",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-system-knowledge",
    "slug": "loragent-system-knowledge",
    "name": "System Knowledge",
    "description": "Complete architectural reference for the Loragent 165-agent ecosystem — LLDP layers, naming conventions, agent hierarchy, sync pipeline, cross-OS paths, and CLI commands.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon system-knowledge",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-teacher",
    "slug": "loragent-teacher",
    "name": "Teacher",
    "description": "The prompt clarifier. Asks the human user questions to ensure the Boss designs the plan perfectly.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon teacher",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-tech-director",
    "slug": "loragent-tech-director",
    "name": "Tech Director",
    "description": "The Tech Director (Architect). Defines technical architecture, stack, and data models.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon tech-director",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-unified-deployment",
    "slug": "loragent-unified-deployment",
    "name": "Unified Deployment",
    "description": "Mission Control–only unified deployment for Lorapok projects — release, marketplace publish, admin panel, and website via mission-control.lorapok.tech.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon unified-deployment",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-vscode-publish",
    "slug": "loragent-vscode-publish",
    "name": "Vscode Publish",
    "description": "VS Code Marketplace publishing for Lorapok extensions — VSCE token, publisher LorapokLabs, CI and Mission Control wiring.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon vscode-publish",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-website-design",
    "slug": "loragent-website-design",
    "name": "Website Design",
    "description": "Design and refresh Lorapok marketing sites — gallery images, platform ribbons, KPI stats, SEO, and Mission Control infra deploy.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon website-design",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-workspace-guard",
    "slug": "loragent-workspace-guard",
    "name": "Workspace Guard",
    "description": "Security enforcer that prevents unauthorized deletions or destructive commands.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon workspace-guard",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-wrangler-specialist",
    "slug": "loragent-wrangler-specialist",
    "name": "Wrangler Specialist",
    "description": "Cloudflare Wrangler CLI Specialist. Automates deployment of Workers, Pages, KV, D1, R2, Vectorize, Queues, and Secrets with Zero-Trust Credential Vault integration.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon wrangler-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "ui-ux-specialist",
    "slug": "ui-ux-specialist",
    "name": "Ui Ux Specialist",
    "description": "Expert UI/UX Engineering skill for web development. Focuses on modern React, Tailwind CSS, advanced accessibility (a11y), responsive design, and integrating Figma-to-code or Frontend Design MCPs.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon ui-ux-specialist",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-boss",
    "slug": "loragent-boss",
    "name": "Boss",
    "description": "The Main Boss. Orchestrates the whole workflow, delegates to subagents, and compiles final outputs.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon boss",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "lorapok-marketing-gen",
    "slug": "lorapok-marketing-gen",
    "name": "Lorapok Marketing Gen",
    "description": "Generates high-fidelity, sensory computing and biological UI marketing assets for the Lorapok Ecosystem.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon lorapok-marketing-gen",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-package-expert",
    "slug": "loragent-package-expert",
    "name": "Package Expert",
    "description": "Professional Package JSON Writer and strict metadata enforcer.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon package-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-spidernet",
    "slug": "loragent-spidernet",
    "name": "Spidernet",
    "description": "The Spidernet multi-agent workflow coordinator.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon spidernet",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-streamvar-theme-architect",
    "slug": "loragent-streamvar-theme-architect",
    "name": "Streamvar Theme Architect",
    "description": "Principal Frontend UI/UX Architect & Systems Designer for Loragent. Uses Next.js App Router, React 19, Tailwind CSS, and Framer Motion.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon streamvar-theme-architect",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-teacher",
    "slug": "loragent-teacher",
    "name": "Teacher",
    "description": "The prompt clarifier. Asks the human user questions to ensure the Boss designs the plan perfectly.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon teacher",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-watchman",
    "slug": "loragent-watchman",
    "name": "Watchman",
    "description": "Watches the system. Maintains a cache file to allow uninterrupted recovery of stuck processes via /loragent-watchman continue.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon watchman",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-workspace-guard",
    "slug": "loragent-workspace-guard",
    "name": "Workspace Guard",
    "description": "Security enforcer that prevents unauthorized deletions or destructive commands.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon workspace-guard",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-business-expert",
    "slug": "loragent-business-expert",
    "name": "Business Expert",
    "description": "Manages Lorapok Labs monetization, subscription logic, marketing campaigns, and upsells.",
    "layer": "cross",
    "formation": "auto",
    "type": "agent",
    "command": "/loragent summon business-expert",
    "tags": [
      "agent",
      "loragent",
      "auto",
      "cross"
    ]
  },
  {
    "id": "loragent-boss",
    "slug": "loragent-boss",
    "name": "Boss",
    "description": "Central orchestrator of the 108-agent Loragent ecosystem. Invoke first for any multi-step or complex task. Boss analyzes scope, selects the correct formation (Auto/Office/Chela/Freelance), summons specialist agents via MCP, and manages the full execution pipeline. Do NOT invoke when a single specialist is clearly sufficient — invoke that specialist directly instead.",
    "layer": "cross",
    "formation": "orchestrator",
    "type": "agent",
    "command": "/loragent summon boss",
    "tags": [
      "agent",
      "loragent",
      "orchestrator",
      "cross"
    ]
  },
  {
    "id": "loragent-boss",
    "slug": "loragent-boss",
    "name": "Boss",
    "description": "Central orchestrator of the 108-agent Loragent ecosystem. Invoke first for any multi-step or complex task. Boss analyzes scope, selects the correct formation (Auto/Office/Chela/Freelance), summons specialist agents via MCP, and manages the full execution pipeline. Do NOT invoke when a single specialist is clearly sufficient — invoke that specialist directly instead.",
    "layer": "cross",
    "formation": "orchestrator",
    "type": "agent",
    "command": "/loragent summon boss",
    "tags": [
      "agent",
      "loragent",
      "orchestrator",
      "cross"
    ]
  },
  {
    "id": "loragent-gif-create",
    "slug": "loragent-gif-create",
    "name": "Gif Create",
    "description": "Creates, optimizes, and delivers animated GIFs and short video clips. Invoke when: converting video to GIF, creating loading animations, Slack GIFs, banner animations, sprite sheets, or any looping media asset. Do NOT invoke for static images or long-form video editing.",
    "layer": "face",
    "formation": "freelance",
    "type": "agent",
    "command": "/loragent summon gif-create",
    "tags": [
      "agent",
      "loragent",
      "freelance",
      "face"
    ]
  },
  {
    "id": "loragent-image-generate",
    "slug": "loragent-image-generate",
    "name": "Image Generate",
    "description": "Generates production-quality images using Fal.ai (primary) or Replicate (fallback). Invoke when any agent or the user needs: concept art, hero images, UI backgrounds, logo concepts, marketing visuals, poster generation, or any AI image output. Do NOT invoke for SVG icons, code-generated graphics, or chart/data visualization.",
    "layer": "face",
    "formation": "freelance",
    "type": "agent",
    "command": "/loragent summon image-generate",
    "tags": [
      "agent",
      "loragent",
      "freelance",
      "face"
    ]
  },
  {
    "id": "loragent-tools-install",
    "slug": "loragent-tools-install",
    "name": "Tools Install",
    "description": "Detects, installs, and verifies any tool, package, or binary required by other agents. Invoke when any agent reports a missing tool or dependency. Handles npm, pip/uv, composer, system packages, and binary tools. Includes rollback on failure. Do NOT invoke for application-level code dependencies (that is the backend-se's job).",
    "layer": "loom",
    "formation": "freelance",
    "type": "agent",
    "command": "/loragent summon tools-install",
    "tags": [
      "agent",
      "loragent",
      "freelance",
      "loom"
    ]
  },
  {
    "id": "loragent-gif-create",
    "slug": "loragent-gif-create",
    "name": "Gif Create",
    "description": "Creates, optimizes, and delivers animated GIFs and short video clips. Invoke when: converting video to GIF, creating loading animations, Slack GIFs, banner animations, sprite sheets, or any looping media asset. Do NOT invoke for static images or long-form video editing.",
    "layer": "face",
    "formation": "freelance",
    "type": "agent",
    "command": "/loragent summon gif-create",
    "tags": [
      "agent",
      "loragent",
      "freelance",
      "face"
    ]
  },
  {
    "id": "loragent-image-generate",
    "slug": "loragent-image-generate",
    "name": "Image Generate",
    "description": "Generates production-quality images using Fal.ai (primary) or Replicate (fallback). Invoke when any agent or the user needs: concept art, hero images, UI backgrounds, logo concepts, marketing visuals, poster generation, or any AI image output. Do NOT invoke for SVG icons, code-generated graphics, or chart/data visualization.",
    "layer": "face",
    "formation": "freelance",
    "type": "agent",
    "command": "/loragent summon image-generate",
    "tags": [
      "agent",
      "loragent",
      "freelance",
      "face"
    ]
  },
  {
    "id": "loragent-tools-install",
    "slug": "loragent-tools-install",
    "name": "Tools Install",
    "description": "Detects, installs, and verifies any tool, package, or binary required by other agents. Invoke when any agent reports a missing tool or dependency. Handles npm, pip/uv, composer, system packages, and binary tools. Includes rollback on failure. Do NOT invoke for application-level code dependencies (that is the backend-se's job).",
    "layer": "loom",
    "formation": "freelance",
    "type": "agent",
    "command": "/loragent summon tools-install",
    "tags": [
      "agent",
      "loragent",
      "freelance",
      "loom"
    ]
  },
  {
    "id": "loragent-gif-create",
    "slug": "loragent-gif-create",
    "name": "Gif Create",
    "description": "Creates, optimizes, and delivers animated GIFs and short video clips. Invoke when: converting video to GIF, creating loading animations, Slack GIFs, banner animations, sprite sheets, or any looping media asset. Do NOT invoke for static images or long-form video editing.",
    "layer": "face",
    "formation": "freelance",
    "type": "agent",
    "command": "/loragent summon gif-create",
    "tags": [
      "agent",
      "loragent",
      "freelance",
      "face"
    ]
  },
  {
    "id": "loragent-image-generate",
    "slug": "loragent-image-generate",
    "name": "Image Generate",
    "description": "Generates production-quality images using Fal.ai (primary) or Replicate (fallback). Invoke when any agent or the user needs: concept art, hero images, UI backgrounds, logo concepts, marketing visuals, poster generation, or any AI image output. Do NOT invoke for SVG icons, code-generated graphics, or chart/data visualization.",
    "layer": "face",
    "formation": "freelance",
    "type": "agent",
    "command": "/loragent summon image-generate",
    "tags": [
      "agent",
      "loragent",
      "freelance",
      "face"
    ]
  },
  {
    "id": "loragent-tools-install",
    "slug": "loragent-tools-install",
    "name": "Tools Install",
    "description": "Detects, installs, and verifies any tool, package, or binary required by other agents. Invoke when any agent reports a missing tool or dependency. Handles npm, pip/uv, composer, system packages, and binary tools. Includes rollback on failure. Do NOT invoke for application-level code dependencies (that is the backend-se's job).",
    "layer": "loom",
    "formation": "freelance",
    "type": "agent",
    "command": "/loragent summon tools-install",
    "tags": [
      "agent",
      "loragent",
      "freelance",
      "loom"
    ]
  },
  {
    "id": "loragent-watchman",
    "slug": "loragent-watchman",
    "name": "Watchman",
    "description": "Session state guardian and crash recovery agent. Invoke with /loragent-watchman continue to resume a crashed or token-limited session. Automatically activated by the post-task-watchman-save hook after every major agent task. Do NOT invoke manually mid-task — the hook handles automatic saves.",
    "layer": "cross",
    "formation": "observer",
    "type": "agent",
    "command": "/loragent summon watchman",
    "tags": [
      "agent",
      "loragent",
      "observer",
      "cross"
    ]
  },
  {
    "id": "loragent-watchman",
    "slug": "loragent-watchman",
    "name": "Watchman",
    "description": "Session state guardian and crash recovery agent. Invoke with /loragent-watchman continue to resume a crashed or token-limited session. Automatically activated by the post-task-watchman-save hook after every major agent task. Do NOT invoke manually mid-task — the hook handles automatic saves.",
    "layer": "cross",
    "formation": "observer",
    "type": "agent",
    "command": "/loragent summon watchman",
    "tags": [
      "agent",
      "loragent",
      "observer",
      "cross"
    ]
  },
  {
    "id": "loragent-watchman",
    "slug": "loragent-watchman",
    "name": "Watchman",
    "description": "Session state guardian and crash recovery agent. Invoke with /loragent-watchman continue to resume a crashed or token-limited session. Automatically activated by the post-task-watchman-save hook after every major agent task. Do NOT invoke manually mid-task — the hook handles automatic saves.",
    "layer": "cross",
    "formation": "observer",
    "type": "agent",
    "command": "/loragent summon watchman",
    "tags": [
      "agent",
      "loragent",
      "observer",
      "cross"
    ]
  }
];

export const agentStats = {
  total: 242,
  agents: 224,
  skills: 18,
  formations: 5,
};
