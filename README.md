# 🧬 Lorapok Labs Ecosystem Portal

[![Deployment](https://github.com/Lorapok/lorapok.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/Lorapok/lorapok.github.io/actions/workflows/deploy.yml)
[![Live Site](https://img.shields.io/badge/Live-lorapok.github.io-67ff8f?style=flat-square&logo=github)](https://lorapok.github.io/)

The central hub for **Lorapok Labs**, a biological-glassmorphism ecosystem focused on sensory computing, premium developer tools, and high-fidelity open-source products. This portal serves as both a portfolio and a communication bridge between the founder and the global developer community.

---

## 🌌 Core Vision: Biological UI
Lorapok Labs operates on the philosophy of **Sensory Design**. Our interfaces are designed to feel "alive," using soft pulses, blur-based depth (glassmorphism), and interactive micro-animations that mimic biological evolution.

### Key Pillars:
- **Sensory Computing:** Interfaces that adapt and respond to human intent.
- **Open-Source Excellence:** 15+ high-performance libraries spanning Laravel, Python, and CLI utilities.
- **Premium UX:** A state-of-the-art aesthetic that pushes the boundaries of standard web design.

---

## 🛠 Tech Stack & Architecture
Built with performance and aesthetics at the core:
- **Frontend:** React + Vite + TypeScript.
- **Styling:** Tailwind CSS with custom glassmorphism tokens.
- **Animations:** Framer Motion for high-fidelity biological movement.
- **Icons:** Lucide-React (Custom curated set).
- **Communication Infrastructure:** 
  - **Cloudflare Workers:** Acts as a custom serverless proxy for mail routing.
  - **Resend API:** Powering premium, branded HTML email transmissions.


---

## 📬 Communication Infrastructure (The Proxy)
The site uses a custom-built **Mail Proxy** to bypass standard form limitations and deliver professional, branded emails.

### Features:
- **Branded Auto-Responder:** Visitors receive a professionally designed, animated HTML confirmation email upon contact.
- **Dynamic Routing:** Intelligent switching between "Founder Direct" and "Labs Enterprise" contact routes.
- **Biological Layouts:** Notification emails use a dark-mode glassmorphism theme matching the website.

### Configuration (GitHub Secrets):
To maintain the communication pipeline, the following secrets must be configured in the repository:
| Secret Name | Purpose |
| :--- | :--- |
| `VITE_MAIL_PROXY_URL` | The URL of your Cloudflare Worker proxy. |


---

## 🚀 Local Development

```bash
# Clone the repository
git clone https://github.com/Lorapok/lorapok.github.io.git

# Install dependencies
npm install

# Run the sensory development environment
npm run dev

# Build for production
npm run build
```

---

## 📂 Content & Data Structure
Most of the ecosystem content is data-driven and lives in:
`src/data/lorapok.ts`

To add a new project to the ecosystem:
1. Append your project to the `projects` array.
2. Define the links (npm, GitHub, PyPI, Web, etc.).
3. The UI will automatically generate the appropriate badges and interactive cards.

---

## 🏛 Community & Social
Stay connected with the Lorapok ecosystem:
- **Reddit:** [/r/LorapokLabs](https://www.reddit.com/r/LorapokLabs/)
- **X (Twitter):** [@LorapokLabs](https://x.com/LorapokLabs)
- **LinkedIn:** [Lorapok Labs](https://www.linkedin.com/showcase/lorapok/)

---

© 2026 Lorapok Labs. Biological UI & Sensory Computing. 🌿
