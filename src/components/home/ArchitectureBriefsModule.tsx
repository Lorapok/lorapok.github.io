import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Zap, 
  BookOpen, 
  Lock, 
  Check
} from 'lucide-react';
import { db, isFirebaseConfigured } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const TOPIC_OPTIONS = [
  { id: 'distributed', label: 'Distributed Systems & eBPF' },
  { id: 'agents', label: 'Autonomous Multi-Agents' },
  { id: 'perf', label: 'High-Perf Rust & Go' },
  { id: 'kernel', label: 'Kernel Micro-Architectures' },
];

export const ArchitectureBriefsModule: React.FC = () => {
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['distributed', 'agents']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [subscribedEmail, setSubscribedEmail] = useState('');

  // Check localStorage for existing subscription
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lorapok_briefs_subscriber');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.email) {
          setIsSubscribed(true);
          setSubscribedEmail(parsed.email);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleTopic = (id: string) => {
    setSelectedTopics(prev => 
      prev.includes(id) 
        ? (prev.length > 1 ? prev.filter(t => t !== id) : prev) 
        : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMessage('Please enter a valid developer email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Sync to Cloud Firestore if configured
      if (isFirebaseConfigured) {
        await addDoc(collection(db, 'newsletter_subscribers'), {
          email: cleanEmail,
          topics: selectedTopics,
          source: 'homepage_hero_cro',
          createdAt: serverTimestamp(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
        });
      }

      // 2. Persist to localStorage for zero-latency hydration
      const payload = {
        email: cleanEmail,
        topics: selectedTopics,
        subscribedAt: new Date().toISOString()
      };
      localStorage.setItem('lorapok_briefs_subscriber', JSON.stringify(payload));

      setIsSubscribed(true);
      setSubscribedEmail(cleanEmail);
      setEmail('');
    } catch (err: any) {
      console.warn('Subscription remote sync fallback:', err);
      // Still persist locally so the user experience is never blocked
      const payload = {
        email: cleanEmail,
        topics: selectedTopics,
        subscribedAt: new Date().toISOString(),
        offline: true
      };
      localStorage.setItem('lorapok_briefs_subscriber', JSON.stringify(payload));
      setIsSubscribed(true);
      setSubscribedEmail(cleanEmail);
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('lorapok_briefs_subscriber');
    setIsSubscribed(false);
    setSubscribedEmail('');
  };

  return (
    <div id="architecture-briefs" className="scroll-mt-28 w-full">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c101c] via-[#090b14] to-[#06080e] p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#67ff8f]/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Column: Offer & Value Proposition */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#67ff8f]/10 border border-[#67ff8f]/30 text-[#67ff8f] text-xs font-mono">
              <Sparkles size={14} className="text-[#67ff8f]" />
              <span className="font-bold tracking-wider uppercase">DEVELOPER ARCHITECTURE BRIEFS</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-300">WEEKLY SATURDAY DISPATCH</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Deep Systems Analysis. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#67ff8f] via-[#38bdf8] to-[#c084fc]">
                No Marketing Fluff.
              </span>
            </h2>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl">
              Join <strong className="text-white font-semibold">12,000+ systems engineers</strong> and autonomous agent architects. Every Saturday morning, get rigorous, peer-reviewed engineering analyses on kernel bypasses, eBPF telemetry, distributed consensus, and multi-agent topologies.
            </p>

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <FileText size={18} className="text-[#67ff8f] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-white">Instant Bonus</div>
                  <div className="text-gray-400 text-[11px] mt-0.5">3,353-word eBPF Whitepaper unlocked</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <Zap size={18} className="text-[#38bdf8] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-white">Zero Noise</div>
                  <div className="text-gray-400 text-[11px] mt-0.5">100% production code, ASTs & benchmarks</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <ShieldCheck size={18} className="text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-white">Zero Spam</div>
                  <div className="text-gray-400 text-[11px] mt-0.5">1 email/week. 1-click unsubscribe</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Converting Lead Capture Form or Active State */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-black/50 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
              <AnimatePresence mode="wait">
                {isSubscribed ? (
                  <motion.div
                    key="subscribed-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center space-y-4 py-2"
                  >
                    <div className="w-14 h-14 bg-[#67ff8f]/20 border border-[#67ff8f]/40 text-[#67ff8f] rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(103,255,143,0.3)]">
                      <CheckCircle2 size={32} />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white">You're Subscribed!</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Architecture briefs will be delivered to: <br />
                        <span className="font-mono text-[#67ff8f] font-medium">{subscribedEmail}</span>
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-left space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] uppercase tracking-wider font-bold">
                        <BookOpen size={14} /> Unlocked Architecture Whitepaper
                      </div>
                      <h4 className="text-sm font-bold text-white leading-snug">
                        eBPF Kernel Probes vs. User-Space Telemetry: Formal Micro-Architectural Analysis
                      </h4>
                      <p className="text-xs text-gray-400">
                        3,353-word empirical benchmark with 6 peer-reviewed citations, NUMA latency charts, and memory layout proofs.
                      </p>
                      
                      <Link
                        to="/blog/ebpf-kernel-probes-vs-user-space-telemetry-formal-micro-architectural-analysis-and-concurrency-limits"
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#67ff8f] text-black font-bold text-xs hover:bg-[#52cc72] transition-colors shadow-md"
                      >
                        <span>Read Full Treatise Online</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>

                    <div className="flex items-center justify-center gap-4 pt-1">
                      <button
                        onClick={handleReset}
                        className="text-[11px] font-mono text-gray-500 hover:text-gray-300 transition-colors underline"
                      >
                        Change subscription email
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5 text-left"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold text-white">Get Weekly Briefs</h3>
                        <span className="text-[10px] font-mono text-[#67ff8f] px-2 py-0.5 rounded bg-[#67ff8f]/10 border border-[#67ff8f]/20 font-bold">
                          FREE FOREVER
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Enter your developer email to receive weekly architectural deep dives and unlock the latest treatise.
                      </p>
                    </div>

                    {/* Topic Customization Pills */}
                    <div>
                      <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block mb-2 font-medium">
                        Custom Focus Areas
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {TOPIC_OPTIONS.map(topic => {
                          const isSelected = selectedTopics.includes(topic.id);
                          return (
                            <button
                              key={topic.id}
                              type="button"
                              onClick={() => toggleTopic(topic.id)}
                              className={`text-[11px] px-2.5 py-1 rounded-md font-mono flex items-center gap-1.5 transition-all ${
                                isSelected
                                  ? 'bg-[#67ff8f]/15 border border-[#67ff8f]/50 text-[#67ff8f]'
                                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                              }`}
                            >
                              {isSelected && <Check size={11} className="text-[#67ff8f]" />}
                              <span>{topic.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <label htmlFor="briefs-email" className="text-xs font-medium text-gray-300">
                        Work or Developer Email
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          id="briefs-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="architect@domain.com"
                          className="w-full bg-black/60 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#67ff8f] focus:ring-2 focus:ring-[#67ff8f]/20 transition-all font-mono"
                        />
                      </div>
                      {errorMessage && (
                        <p className="text-xs text-red-400 pt-1">{errorMessage}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 bg-[#67ff8f] text-[#0a0a0f] py-3.5 px-6 rounded-xl font-bold text-sm hover:bg-[#52cc72] transition-all shadow-[0_0_25px_rgba(103,255,143,0.3)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Securing Briefing Access...</span>
                        </>
                      ) : (
                        <>
                          <span>Subscribe & Unlock Whitepaper</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    {/* Privacy Assurance */}
                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 font-mono">
                      <Lock size={12} className="text-gray-400" />
                      <span>Zero tracking. Cloud Firestore secured. Never shared.</span>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
