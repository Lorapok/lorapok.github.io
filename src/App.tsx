import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleHelp,
  Code2,
  Coffee,
  Copy,
  Cpu,
  Globe2,
  HeartPulse,
  Layers3,
  Mail,
  MapPin,
  MessageCircle,
  Network,
  Play,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
  Zap,
} from "lucide-react";
import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  brand,
  categories,
  founder,
  philosophy,
  projects,
  support,
  type Project,
  type ProjectCategory,
} from "./data/lorapok";
import "./App.css";

const heroImage = "/assets/lorapok-hero.png";
const badgeImage = "/assets/lorapok-badge.png";
const founderImage = "/assets/founder-avatar.jpg";
const bkashQrImage = "https://raw.githubusercontent.com/Maijied/Maijied/main/portfolio/bkash.jpg";
const gravatarUrl = "https://gravatar.com/lorapok";
const contactTargets = [
  { id: "labs", label: "Contact Lorapok Labs", subjectPrefix: "[Lorapok Labs]" },
  { id: "founder", label: "Contact Founder", subjectPrefix: "[Founder]" },
] as const;

type ContactTarget = (typeof contactTargets)[number]["id"];

function App() {
  const [activeCategory, setActiveCategory] = useState<"All" | ProjectCategory>("All");
  const [copied, setCopied] = useState("");
  const [supportOpen, setSupportOpen] = useState(false);
  const [contactTarget, setContactTarget] = useState<ContactTarget>("labs");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const shouldReduceMotion = useReducedMotion();

  // Close modal on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSupportOpen(false);
    };
    if (supportOpen) {
      document.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [supportOpen]);

  const openSupport = useCallback(() => setSupportOpen(true), []);
  const closeSupport = useCallback(() => setSupportOpen(false), []);

  const featuredProjects = projects.filter((project) => project.featured);
  const filteredProjects = useMemo(
    () =>
      activeCategory === "All"
        ? projects
        : projects.filter((project) => project.category === activeCategory),
    [activeCategory],
  );

  const copyValue = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 1600);
    } catch {
      setCopied("Copy failed");
      window.setTimeout(() => setCopied(""), 1600);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0 },
  };

  const submitContactForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const activeTarget =
      contactTargets.find((target) => target.id === contactTarget) ?? contactTargets[0];
    const subject = `${activeTarget.subjectPrefix} ${contactSubject || "New message"}`.trim();
    const body = [
      `Name: ${contactName || "Not provided"}`,
      `Email: ${contactEmail || "Not provided"}`,
      "",
      contactMessage || "Hello Lorapok,",
    ].join("\n");

    window.location.href = `mailto:${founder.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <main className="site-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <header className="topbar">
        <a className="brand-lockup" href="#home" aria-label="Lorapok Labs home">
          <img src={badgeImage} alt="" />
          <span>
            <strong>Lorapok</strong>
            <small>Labs</small>
          </span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#products">Products</a>
          <a href="#ecosystem">Ecosystem</a>
          <a href="#founder">Founder</a>
          <a href="#support">Support</a>
        </nav>
        <a className="icon-link" href={brand.githubOrg} target="_blank" rel="noreferrer">
          <Code2 size={18} />
          <span>GitHub Org</span>
        </a>
      </header>

      <section id="home" className="hero-section">
        <motion.div
          className="hero-copy"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="eyebrow">
            <Sparkles size={16} />
            Biological UI open-source ecosystem
          </div>
          <h1>
            <span>Lorapok</span>
            <span>Labs</span>
          </h1>
          <p className="hero-lede">{brand.tagline}</p>
          <p className="hero-body">{brand.description}</p>
          <div className="hero-actions">
            <a className="primary-action" href="#products">
              <Layers3 size={18} />
              Explore products
            </a>
            <a className="secondary-action" href={brand.sourceOrg} target="_blank" rel="noreferrer">
              <Code2 size={18} />
              View source
            </a>
            <a className="ghost-action" href="#support">
              <Coffee size={18} />
              Support Lorapok
            </a>
          </div>
          <div className="signal-row" aria-label="Lorapok metrics">
            <Metric value="14+" label="Curated projects" />
            <Metric value="7" label="Featured products" />
            <Metric value="100%" label="Open-source focused" />
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        >
          <img src={heroImage} alt="Lorapok open-source ecosystem poster with larva mascot" />
          <div className="hero-glass-card hero-card-top">
            <HeartPulse size={18} />
            <span>Alive interface language</span>
          </div>
          <div className="hero-glass-card hero-card-bottom">
            <Terminal size={18} />
            <span>Engineering-first products</span>
          </div>
        </motion.div>
      </section>

      <section className="philosophy-section" aria-labelledby="philosophy-title">
        <SectionIntro
          kicker="Operating system"
          title="Fast, intuitive, and alive by design"
          body="Lorapok treats software as a sensory product surface: visible signals, immediate feedback, and real utility under the glow."
          id="philosophy-title"
        />
        <div className="philosophy-grid">
          {philosophy.map((item, index) => (
            <motion.article
              className="philosophy-card"
              key={item.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="products" className="product-section" aria-labelledby="products-title">
        <SectionIntro
          kicker="Featured products"
          title="The core Lorapok product line"
          body="A curated set of branded projects spanning AI agents, local LLMs, media, language input, local-first communication, and Laravel tooling."
          id="products-title"
        />
        <div className="featured-grid">
          {featuredProjects.map((project, index) => (
            <ProjectCard project={project} key={project.name} index={index} featured />
          ))}
        </div>
      </section>

      <section id="ecosystem" className="ecosystem-section" aria-labelledby="ecosystem-title">
        <SectionIntro
          kicker="Open-source ecosystem"
          title="Explore the wider catalog"
          body="Filter the public project collection by product type. Lorapok leads with branded tools, then keeps useful experiments discoverable."
          id="ecosystem-title"
        />
        <div className="filter-bar" aria-label="Project category filters">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={category === activeCategory ? "active" : ""}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="project-grid">
          {filteredProjects.map((project, index) => (
            <ProjectCard project={project} key={project.name} index={index} />
          ))}
        </div>
      </section>

      <section id="founder" className="founder-section" aria-labelledby="founder-title">
        <div className="founder-profile">
          <div className="founder-portrait">
            <img src={founderImage} alt="Mohammad Maizied Hasan Majumder" />
            <span className="portrait-ring" aria-hidden="true" />
          </div>
          <div className="founder-copy">
            <span className="eyebrow compact">
              <BadgeCheck size={15} />
              Founder
            </span>
            <h2 id="founder-title">{founder.name}</h2>
            <p className="founder-roleline">{founder.role}</p>
            <p>{founder.bio}</p>
            <div className="founder-facts">
              <span>
                <Code2 size={16} />
                Open-source product builder
              </span>
              <span>
                <MapPin size={16} />
                {founder.location}
              </span>
            </div>
          </div>
        </div>
        <div className="contact-panel">
          <div className="contact-panel-mark">
            <img src={badgeImage} alt="" />
            <span>Lorapok Labs</span>
          </div>
          <h3>Build, collaborate, support</h3>
          <p>
            Available for select projects, technical collaborations, and meaningful open-source
            initiatives.
          </p>
          <div className="contact-links">
            <a href={founder.links.github} target="_blank" rel="noreferrer">
              <Code2 size={17} />
              GitHub
            </a>
            <a href={founder.links.linkedin} target="_blank" rel="noreferrer">
              <BriefcaseBusiness size={17} />
              LinkedIn
            </a>
            <a href={founder.links.telegram} target="_blank" rel="noreferrer">
              <MessageCircle size={17} />
              Telegram
            </a>
            <a href={`mailto:${founder.email}`}>
              <Mail size={17} />
              Email
            </a>
            <a href={gravatarUrl} target="_blank" rel="noreferrer">
              <Globe2 size={17} />
              Gravatar
            </a>
          </div>
        </div>
      </section>

      <section id="support" className="support-card-section">
        <motion.div
          className="support-compact-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="support-compact-left">
            <span className="coffee-icon-float" aria-hidden="true">
              <span className="coffee-steam steam-one" />
              <span className="coffee-steam steam-two" />
              <span className="coffee-steam steam-three" />
              <span className="coffee-cup">Tea</span>
            </span>
            <span className="eyebrow compact support-eyebrow">
              <Coffee size={15} />
              Buy me a coffee
            </span>
            <h2 id="support-title">Great ideas run on coffee.</h2>
            <p>
              Every open-source project, guide, and release takes hours of focused effort.
              A coffee keeps the momentum alive.
            </p>
            <p className="support-quote">
              "The best contributions happen when the creator has space to create freely."
            </p>
          </div>
          <div className="support-compact-right">
            <div className="support-stats">
              <div className="support-stat">
                <strong>14+</strong>
                <span>Projects</span>
              </div>
              <div className="support-stat">
                <strong>7</strong>
                <span>Featured</span>
              </div>
              <div className="support-stat">
                <strong>100%</strong>
                <span>Open Source</span>
              </div>
            </div>
            <button
              className="support-cta-btn"
              type="button"
              onClick={openSupport}
            >
              <Coffee size={18} />
              Support My Work
            </button>
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {supportOpen && (
          <motion.div
            className="support-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeSupport}
            role="dialog"
            aria-modal="true"
            aria-label="Support Lorapok"
          >
            <motion.div
              className="support-modal"
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.92, y: shouldReduceMotion ? 0 : 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.92, y: shouldReduceMotion ? 0 : 30 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" type="button" onClick={closeSupport} aria-label="Close">
                <X size={20} />
              </button>

              <div className="modal-bkash-section">
                <h3>
                  <Coffee size={20} />
                  Buy Me a Coffee - bKash
                </h3>
                <p className="bkash-subtitle">
                  Sending from Bangladesh? Support via <strong>bKash Send Money</strong>:
                </p>
                <div className="bkash-qr-wrap">
                  <img src={bkashQrImage} alt="bKash QR code for 01629158131" className="bkash-qr" />
                </div>
                <div className="bkash-number-row">
                  <span className="bkash-label">bKash Number:</span>
                  <code className="bkash-code">{support.bkash}</code>
                  <button
                    className="copy-btn"
                    type="button"
                    onClick={() => copyValue("bKash number", support.bkash)}
                  >
                    <Copy size={14} />
                    Copy
                  </button>
                </div>
                <p className="bkash-instructions">
                  Open bKash app {"->"} Send Money {"->"} Scan QR or enter number above
                </p>
              </div>

              <div className="modal-divider" />

              <div className="modal-crypto-section">
                <h3>
                  <HeartPulse size={20} />
                  Decentralized Support
                </h3>
                <p className="crypto-subtitle">
                  Support via USDT on any network below. No accounts, no middlemen - direct on-chain.
                </p>
                <div className="crypto-table-wrap">
                  <table className="crypto-table">
                    <thead>
                      <tr>
                        <th>Network</th>
                        <th>Token</th>
                        <th>Address</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {support.addresses.map((item) => (
                        <tr key={item.network}>
                          <td className="net-name">{item.network}</td>
                          <td className="net-token">{item.token}</td>
                          <td className="net-addr"><code>{item.address}</code></td>
                          <td>
                            <button
                              className="copy-btn"
                              type="button"
                              onClick={() => copyValue(item.network, item.address)}
                            >
                              <Copy size={14} />
                              Copy
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="support-note">
                  <ShieldCheck size={16} />
                  {support.note}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="contact-form-section" aria-labelledby="contact-form-title">
        <motion.div
          className="contact-form-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="contact-form-copy">
            <span className="eyebrow compact">
              <Mail size={15} />
              Contact
            </span>
            <h2 id="contact-form-title">Contact Lorapok or contact the founder</h2>
            <p>
              Use the form to draft a clean email right away. For detailed collaboration messages,
              email keeps everything organized.
            </p>
            <div className="contact-suggested-links">
              <a href={`mailto:${founder.email}`}>
                <Mail size={16} />
                Email
              </a>
              <a href={founder.links.linkedin} target="_blank" rel="noreferrer">
                <BriefcaseBusiness size={16} />
                LinkedIn
              </a>
            </div>
            <p className="contact-helper">
              If you want a true inbox later, Formspree or Resend would be the cleanest upgrade for
              receiving messages and replying professionally.
            </p>
          </div>

          <form className="contact-form" onSubmit={submitContactForm}>
            <div className="contact-targets" role="tablist" aria-label="Choose who to contact">
              {contactTargets.map((target) => (
                <button
                  key={target.id}
                  type="button"
                  className={contactTarget === target.id ? "active" : ""}
                  onClick={() => setContactTarget(target.id)}
                >
                  {target.label}
                </button>
              ))}
            </div>

            <label className="field">
              <span>Your name</span>
              <input
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                placeholder="Your name"
              />
            </label>

            <label className="field">
              <span>Your email</span>
              <input
                type="email"
                value={contactEmail}
                onChange={(event) => setContactEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label className="field">
              <span>Subject</span>
              <input
                value={contactSubject}
                onChange={(event) => setContactSubject(event.target.value)}
                placeholder="Project inquiry / support / collaboration"
              />
            </label>

            <label className="field">
              <span>Message</span>
              <textarea
                rows={6}
                value={contactMessage}
                onChange={(event) => setContactMessage(event.target.value)}
                placeholder="Tell Lorapok what you need, what you are building, and how you'd like to work together."
              />
            </label>

            <div className="contact-form-actions">
              <button type="submit" className="primary-action contact-submit">
                <Mail size={18} />
                Draft Email
              </button>
            </div>

            <p className="contact-note">
              <CircleHelp size={15} />
              This form opens your mail app with a ready-to-send message.
            </p>
          </form>
        </motion.div>
      </section>

      <div className={`copy-toast ${copied ? "visible" : ""}`} role="status" aria-live="polite">
        <Check size={15} />
        {copied ? `${copied} copied` : "Ready"}
      </div>

      <footer className="footer">
        <div>
          <a className="brand-lockup footer-brand" href="#home">
            <img src={badgeImage} alt="" />
            <span>
              <strong>Lorapok</strong>
              <small>Open-source ecosystem</small>
            </span>
          </a>
          <p>Biological UI, sensory computing, and practical tools for builders.</p>
        </div>
        <div className="footer-links">
          <a href={brand.githubOrg} target="_blank" rel="noreferrer">
            <Code2 size={16} />
            Org
          </a>
          <a href={founder.links.portfolio} target="_blank" rel="noreferrer">
            <Globe2 size={16} />
            Founder
          </a>
          <a href={gravatarUrl} target="_blank" rel="noreferrer">
            <Globe2 size={16} />
            Gravatar
          </a>
          <a href={founder.links.telegram} target="_blank" rel="noreferrer">
            <MessageCircle size={16} />
            Telegram
          </a>
          <a href={`mailto:${founder.email}`}>
            <Mail size={16} />
            Email
          </a>
        </div>
      </footer>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function SectionIntro({
  kicker,
  title,
  body,
  id,
}: {
  kicker: string;
  title: string;
  body: string;
  id: string;
}) {
  return (
    <div className="section-intro">
      <span className="eyebrow compact">
        <Network size={15} />
        {kicker}
      </span>
      <h2 id={id}>{title}</h2>
      <p>{body}</p>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: Project;
  index: number;
  featured?: boolean;
}) {
  const Icon = featured ? Zap : Cpu;

  return (
    <motion.article
      className={`project-card ${featured ? "featured" : ""}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.18) }}
    >
      <div className="project-card-head">
        <span className="project-icon">
          <Icon size={18} />
        </span>
        <span className="project-category">{project.category}</span>
      </div>
      <h3>{project.name}</h3>
      <p className="project-tagline">{project.tagline}</p>
      <p className="project-description">{project.description}</p>
      <div className="project-meta">
        <span>{project.language}</span>
        {project.demo ? <span>Live page</span> : <span>Repository</span>}
      </div>
      <div className="project-actions">
        <a href={project.repo} target="_blank" rel="noreferrer">
          <Code2 size={16} />
          Repo
        </a>
        {project.demo ? (
          <a href={project.demo} target="_blank" rel="noreferrer">
            <Play size={16} />
            Live
          </a>
        ) : null}
        <ChevronRight className="card-arrow" size={18} aria-hidden="true" />
      </div>
    </motion.article>
  );
}

export default App;
