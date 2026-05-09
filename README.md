# 🧬 Lorapok Labs — Digital Ecosystem & Developer Portal

[![Deployment](https://github.com/Lorapok/lorapok.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/Lorapok/lorapok.github.io/actions/workflows/deploy.yml)
[![Live Site](https://img.shields.io/badge/Live-lorapok.github.io-67ff8f?style=flat-square&logo=github)](https://lorapok.github.io/)

**Lorapok Labs** is a premium, open-source software collective focused on **Sensory Computing** and **Biological UI**. This portal is a high-fidelity bridge between high-performance developer tools and a stunning, living user interface.

---

## 🌓 The Dual-Mode Architecture

The portal operates as a unified platform with two distinct environments:

### 1. Standard Mode (Public Portfolio)
A high-performance landing page showcasing the Lorapok ecosystem, vision, and core products.
- **Aesthetic:** Glassmorphism, 4K ambient grids, and biological micro-animations.
- **Content:** Curated project cards, founder philosophy, and a secure contact bridge.

### 2. Developer Mode (Integrated Workspace)
An authenticated, full-screen workspace for developers and administrators.
- **AI Labs:** Multi-provider chat (Claude, OpenAI, Gemini) and productivity tools.
- **Blog CMS:** AI-assisted blog generation with real-time Firestore persistence.
- **API Playground:** A live environment to test prompts and inspect raw API responses.
- **Admin Panel:** Google-authenticated control center for analytics and site management.

---

## 🛠 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, TypeScript |
| **Logic** | Framer Motion (Animations), React Router |
| **Styling** | Tailwind CSS 4, Custom "DevMode" CSS system |
| **Backend** | Firebase (Auth & Firestore), Cloudflare Workers (Mail Proxy) |
| **AI Tools** | Anthropic Claude, OpenAI GPT, Google Gemini integrations |
| **Editors** | CodeMirror (API Playground) |

---

## ⚙ Configuration & Environment

To unlock the full potential of Developer Mode, you must configure your environment variables.

### 1. Firebase Backend (Auth & Database)
Required for the Admin Panel, Blog system, and Analytics.

1.  Create a project at [Firebase Console](https://console.firebase.google.com/).
2.  Enable **Google Authentication** in the "Authentication" tab.
3.  Create a **Firestore Database** in production or test mode.
4.  Add a Web App to get your config.

Create a `.env` file in the root directory:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Mail Proxy (Cloudflare/Resend)
VITE_MAIL_PROXY_URL=your_proxy_url
```

### 2. AI Provider Keys
Individual developer tools in **AI Labs** require provider-specific keys.
- **Security:** These keys are stored **locally in your browser's `localStorage`**. They are never transmitted to Lorapok servers or Firebase.
- **Setup:** Simply paste your key into the "Active Provider" chip in Developer Mode.

---

## 📂 Project Structure

```bash
src/
├── components/     # High-fidelity UI components
├── data/           # lorapok.ts (Ecosystem source of truth)
├── dev/            # Developer Mode ecosystem
│   ├── panels/     # AI Labs, Blog, Playground, etc.
│   ├── DevAuth.tsx # Firebase Auth logic
│   └── DevMode.css # Workspace styling
├── lib/            # firebase.ts, api.ts
└── App.tsx         # Main entry with Dual-Mode toggle
```

---

## 🚀 Getting Started

```bash
# Install the ecosystem
npm install

# Start the sensory development environment
npm run dev

# Build for high-fidelity production
npm run build
```

---

## 🤝 Contributing
Lorapok Labs is community-driven. All libraries under the ecosystem are MIT licensed. Whether you're fixing a bug in `formkraft` or adding a new prompt to the `Library`, your contributions power the open-source future.

© 2026 Lorapok Labs. Biological UI & Sensory Computing. 🌿
