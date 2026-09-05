import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, Code2, BriefcaseBusiness, Briefcase } from 'lucide-react';
import { brand, founder } from '../data/lorapok';

const contactTargets = [
  {
    id: 'labs',
    title: 'Contact Lorapok Labs',
    description: 'For business inquiries, partnerships, or open-source collaboration.',
    icon: Briefcase
  },
  {
    id: 'founder',
    title: 'Contact the Founder',
    description: 'For personal inquiries, speaking engagements, or direct messages.',
    icon: Mail
  }
];

export default function ContactPage() {
  const [activeTarget, setActiveTarget] = useState(contactTargets[0].id);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    document.title = `Contact | ${brand.name}`;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-16 px-4 max-w-5xl mx-auto w-full"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Get in Touch</h1>
        <p className="text-lg text-gray-400">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        {/* Sidebar / Targets */}
        <div className="md:col-span-4 space-y-4">
          {contactTargets.map((target) => {
            const Icon = target.icon;
            const isActive = activeTarget === target.id;
            
            return (
              <button
                key={target.id}
                onClick={() => setActiveTarget(target.id)}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/10 border-[#67ff8f]/50' 
                    : 'bg-white/5 border-white/10 hover:bg-white/[0.07]'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon size={20} className={isActive ? 'text-[#67ff8f]' : 'text-gray-400'} />
                  <h3 className={`font-bold ${isActive ? 'text-white' : 'text-gray-300'}`}>{target.title}</h3>
                </div>
                <p className="text-sm text-gray-400">{target.description}</p>
              </button>
            );
          })}

          <div className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h4 className="text-xs font-mono font-semibold text-[#67ff8f] uppercase tracking-wider mb-4">Ecosystem Bridges</h4>
            <div className="flex flex-col gap-2.5 text-xs font-mono text-gray-300">
              <a href="https://github.com/Lorapok" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <Code2 size={16} className="text-[#67ff8f]" /> GitHub Organization (@Lorapok)
              </a>
              <a href="https://github.com/Maijied" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <Code2 size={16} className="text-[#67ff8f]" /> Founder GitHub (@Maijied)
              </a>
              <a href="https://www.linkedin.com/showcase/lorapok/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <BriefcaseBusiness size={16} className="text-[#67ff8f]" /> LinkedIn Showcase
              </a>
              <a href="https://x.com/LorapokLabs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <MessageSquare size={16} className="text-[#67ff8f]" /> X / Twitter (@LorapokLabs)
              </a>
              {founder.links.telegram && (
                <a href={founder.links.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <MessageSquare size={16} className="text-[#67ff8f]" /> Telegram (@Maijied)
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-8 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-16 h-16 bg-[#67ff8f]/20 text-[#67ff8f] rounded-full flex items-center justify-center mb-6">
                <MessageSquare size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
              <p className="text-gray-400">Thanks for reaching out. We'll get back to you shortly.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-300">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#67ff8f]/50 focus:ring-1 focus:ring-[#67ff8f]/50 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#67ff8f]/50 focus:ring-1 focus:ring-[#67ff8f]/50 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-gray-300">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#67ff8f]/50 focus:ring-1 focus:ring-[#67ff8f]/50 transition-all"
                  placeholder="How can we help?"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-300">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#67ff8f]/50 focus:ring-1 focus:ring-[#67ff8f]/50 transition-all resize-none"
                  placeholder="Write your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#67ff8f] text-[#0a0a0f] px-6 py-3.5 rounded-lg font-bold hover:bg-[#52cc72] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                {!isSubmitting && <Send size={18} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
}
