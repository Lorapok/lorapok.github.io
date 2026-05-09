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
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
  Zap,
  Package,
  Download,
  Cloud,
  Box,
  Server,
  Monitor,
  Smartphone,
  Gamepad2,
  Book,
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
const web3FormsAccessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "8022b84d-8a91-4b69-a24a-c9a9cc1f5099";
const labsAccessKey = import.meta.env.VITE_WEB3FORMS__LORAPOK_LABS_ACCESS_KEY || "28051c1f-ed3d-4130-8a3b-c6e0cef7353c";
const mailProxyUrl = import.meta.env.VITE_MAIL_PROXY_URL as string | undefined;
const contactTargets = [
  {
    id: "labs",
    label: "Contact Lorapok Labs",
    eyebrow: "Contact",
    title: "Contact Lorapok Labs",
    description:
      "Use this route for product ideas, open-source support, ecosystem partnerships, and collaboration around Lorapok projects.",
    helper:
      "Best for structured requests where the reply should include scope, timeline, links, or technical details.",
    recipientLabel: "Lorapok Labs",
    recipientEmail: "lorapokdev@gmail.com",
    subjectPrefix: "[Lorapok Labs]",
    subjectPlaceholder: "Project inquiry / support / collaboration",
    messagePlaceholder:
      "Tell Lorapok what you need, what you are building, and how the project should move forward.",
    submitLabel: "Send to Labs",
    suggestedLinks: [
      { label: "Email", href: "mailto:lorapokdev@gmail.com", icon: "mail" },
      { label: "LinkedIn", href: "https://www.linkedin.com/showcase/lorapok/", icon: "briefcase" },
      { label: "Reddit", href: "https://www.reddit.com/r/LorapokLabs/", icon: "globe" },
      { label: "X (Twitter)", href: "https://x.com/LorapokLabs", icon: "globe" },
      { label: "Gravatar", href: "https://gravatar.com/lorapok", icon: "globe" },
    ],
  },
  {
    id: "founder",
    label: "Contact Founder",
    eyebrow: "Founder",
    title: `Contact ${founder.name.split(" ")[0]}`,
    submitLabel: `Send to ${founder.name.split(" ")[0]}`,
    description:
      "Use this route for founder-level conversations, personal collaboration, hiring, advising, or direct professional messages.",
    helper:
      "Best for direct messages where context, intent, and the next step should be clear from the first email.",
    recipientLabel: founder.name,
    recipientEmail: founder.email,
    subjectPrefix: "[Founder]",
    subjectPlaceholder: "Founder conversation / hiring / advisory",
    messagePlaceholder:
      "Write the context, what you want to discuss, and the best next action for the founder.",
    suggestedLinks: [
      { label: "Email", href: `mailto:${founder.email}`, icon: "mail" },
      { label: "Portfolio", href: founder.links.portfolio, icon: "globe" },
      { label: "LinkedIn", href: founder.links.linkedin, icon: "briefcase" },
    ],
  },
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
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [contactStatusText, setContactStatusText] = useState("");
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
  const activeContactTarget =
    contactTargets.find((target) => target.id === contactTarget) ?? contactTargets[0];

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

  const submitContactForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!web3FormsAccessKey) {
      setContactStatus("error");
      setContactStatusText("Add VITE_WEB3FORMS_ACCESS_KEY to enable direct sending.");
      return;
    }

    const subject =
      `${activeContactTarget.subjectPrefix} ${contactSubject || "New message"}`.trim();

    const targetAccessKey = activeContactTarget.id === "labs" ? labsAccessKey : web3FormsAccessKey;

    // DRAFT FALLBACK: Only if no access key is provided at all
    if (!targetAccessKey) {
      const body = `Name: ${contactName || "Visitor"}\nEmail: ${contactEmail || "No email provided"}\n\n${contactMessage}`;
      const mailtoUrl = `mailto:${activeContactTarget.recipientEmail}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;

      setContactStatus("success");
      setContactStatusText(`Drafting email to ${activeContactTarget.recipientLabel}...`);
      return;
    }

    setContactStatus("sending");
    setContactStatusText("Sending your message...");

    try {
      let response;
      
      // Attempt to use custom Mail Proxy (Cloudflare/Resend) for premium HTML design
      if (mailProxyUrl) {
        try {
          response = await fetch(mailProxyUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: contactName || "Visitor",
              email: contactEmail,
              message: contactMessage,
              route: activeContactTarget.label,
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Mail Proxy Error:", errorData);
            // If proxy exists but fails, we might still want to fallback, 
            // but let's log it clearly.
          }
        } catch (err) {
          console.error("Mail Proxy Fetch Failed:", err);
        }
      } 
      
      // Fallback to Web3Forms only if proxy is missing or failed to connect
      if (!response || !response.ok) {
        console.log("Falling back to Web3Forms...");
        response = await fetch("https://api.web3forms.com/submit", {
          body: JSON.stringify({
            access_key: targetAccessKey,
            from_name: "Lorapok Labs Portal",
            subject,
            "👤 Visitor Name": contactName || "Anonymous Builder",
            "📧 Contact Email": contactEmail,
            "📝 Message": contactMessage,
            "---": "---",
            "🚀 Interaction Route": activeContactTarget.label,
            "📂 Project Scope": activeContactTarget.id === "labs" ? "Lorapok Labs / Enterprise" : "Founder Direct",
            "🌐 Source Node": "lorapok.github.io",
            replyto: contactEmail,
            botcheck: "",
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          method: "POST",
        });
      }

      const result = (await response.json()) as { message?: string; success?: boolean; id?: string };

      // Success if response is OK and (Web3Forms success OR Resend ID exists)
      const isSuccessful = response.ok && (result.success || result.id || mailProxyUrl);

      if (!isSuccessful) {
        throw new Error(result.message || "Message could not be sent.");
      }

      setContactStatus("success");
      setContactStatusText(`Message sent to ${activeContactTarget.recipientLabel}.`);
      setContactName("");
      setContactEmail("");
      setContactSubject("");
      setContactMessage("");
    } catch (error) {
      setContactStatus("error");
      setContactStatusText(error instanceof Error ? error.message : "Message could not be sent.");
    }
  };

  return (
    <main className="site-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <header className="topbar">
        <a className="brand-lockup" href="#home" aria-label="Lorapok Labs home">
          <img 
            src={badgeImage} 
            alt="" 
            className={contactStatus === "sending" ? "animate-pulse-slow" : ""}
            style={contactStatus === "sending" ? { animation: "spin 3s linear infinite" } : {}}
          />
          <span>
            <strong>Lorapok</strong>
            <small>Labs</small>
          </span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#products">Products</a>
          <a href="#ecosystem">Ecosystem</a>
          <a href="#founder">Founder</a>
          <a href="#contact">Contact</a>
          <a className="nav-support" href="#support">Support</a>
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

      <section id="contact" className="contact-form-section" aria-labelledby="contact-form-title">
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
              {activeContactTarget.eyebrow}
            </span>
            <h2 id="contact-form-title">{activeContactTarget.title}</h2>
            <p>{activeContactTarget.description}</p>
            <div className="contact-suggested-links">
              {activeContactTarget.suggestedLinks.map((link) => (
                <a
                  href={link.href}
                  key={link.label}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
                >
                  <ContactLinkIcon icon={link.icon} />
                  {link.label}
                </a>
              ))}
            </div>
            <div className="contact-route">
              <span>Route</span>
              <strong>{activeContactTarget.recipientLabel}</strong>
              <small>{activeContactTarget.recipientEmail}</small>
            </div>
            <p className="contact-helper">{activeContactTarget.helper}</p>
          </div>

          <form className="contact-form" onSubmit={submitContactForm}>
            <input
              name="botcheck"
              className="hidden-field"
              tabIndex={-1}
              autoComplete="off"
            />
            <div className="contact-targets" role="tablist" aria-label="Choose who to contact">
              {contactTargets.map((target) => (
                <button
                  key={target.id}
                  type="button"
                  className={contactTarget === target.id ? "active" : ""}
                  aria-selected={contactTarget === target.id}
                  onClick={() => setContactTarget(target.id)}
                >
                  {target.label}
                </button>
              ))}
            </div>

            <label className="field">
              <span>Your name</span>
              <input
                name="name"
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                placeholder="Your name"
                required
              />
            </label>

            <label className="field">
              <span>Your email</span>
              <input
                name="email"
                type="email"
                value={contactEmail}
                onChange={(event) => setContactEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="field">
              <span>Subject</span>
              <input
                name="subject"
                value={contactSubject}
                onChange={(event) => setContactSubject(event.target.value)}
                placeholder={activeContactTarget.subjectPlaceholder}
                required
              />
            </label>

            <label className="field">
              <span>Message</span>
              <textarea
                name="message"
                rows={6}
                value={contactMessage}
                onChange={(event) => setContactMessage(event.target.value)}
                placeholder={activeContactTarget.messagePlaceholder}
                required
              />
            </label>

            <div className="contact-form-actions">
              <button
                type="submit"
                className="primary-action contact-submit"
                disabled={contactStatus === "sending"}
              >
                <Mail size={18} />
                {contactStatus === "sending" ? "Sending..." : activeContactTarget.submitLabel}
              </button>
            </div>

            <p
              className={`contact-note ${contactStatus !== "idle" ? contactStatus : ""}`}
              role="status"
              aria-live="polite"
            >
              <CircleHelp size={15} />
              {contactStatusText ||
                `This form sends directly to ${activeContactTarget.recipientLabel}.`}
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
          <a href="https://www.reddit.com/r/LorapokLabs/" target="_blank" rel="noreferrer">
            <Globe2 size={16} />
            Reddit
          </a>
          <a href="https://x.com/LorapokLabs" target="_blank" rel="noreferrer">
            <Globe2 size={16} />
            X
          </a>
          <a href="mailto:lorapokdev@gmail.com">
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

function ContactLinkIcon({ icon }: { icon: "briefcase" | "code" | "globe" | "mail" }) {
  switch (icon) {
    case "briefcase":
      return <BriefcaseBusiness size={16} />;
    case "code":
      return <Code2 size={16} />;
    case "globe":
      return <Globe2 size={16} />;
    case "mail":
      return <Mail size={16} />;
  }
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
      </div>
      <div className="project-actions">
        {project.links?.map((link, i) => (
          <a href={link.url} target="_blank" rel="noreferrer" key={i} className="project-link-badge">
            <ProjectLinkIcon icon={link.icon} />
            {link.label}
          </a>
        ))}
      </div>
    </motion.article>
  );
}

function ProjectLinkIcon({ icon }: { icon?: string }) {
  switch (icon) {
    case "web": return <Globe2 size={16} />;
    case "npm":
    case "pypi":
    case "packagist": return <Package size={16} />;
    case "github": return <Code2 size={16} />;
    case "vscode": return <Terminal size={16} />;
    case "api": return <Network size={16} />;
    case "snap":
    case "download": return <Download size={16} />;
    case "firefox":
    case "chrome":
    case "monitor": return <Monitor size={16} />;
    case "terminal": return <Terminal size={16} />;
    case "android": return <Smartphone size={16} />;
    case "gamepad": return <Gamepad2 size={16} />;
    case "book": return <Book size={16} />;
    case "cloud": return <Cloud size={16} />;
    case "box": return <Box size={16} />;
    case "cpu": return <Cpu size={16} />;
    case "server": return <Server size={16} />;
    case "layers": return <Layers3 size={16} />;
    default: return <ChevronRight size={16} />;
  }
}

export default App;
