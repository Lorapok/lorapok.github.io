import { Bot, Pause, Play, Send, Settings2, Sparkles, X } from 'lucide-react';
import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  askSystemAssistant,
  isSystemAssistantConfigured,
  type AssistantTurn,
} from '../../lib/systemAssistant';

type RiboMood = 'curious' | 'focused' | 'celebrating' | 'thinking' | 'presenting' | 'exploring';
type PanelView = 'assistant' | 'experience';
type MotionMode = 'system' | 'active' | 'paused';

const MOODS: Array<{ id: RiboMood; label: string; signal: string }> = [
  { id: 'curious', label: 'Curious', signal: 'Exploring the universe' },
  { id: 'focused', label: 'Focused', signal: 'Deep work in progress' },
  { id: 'celebrating', label: 'Celebrating', signal: 'A release just landed' },
  { id: 'thinking', label: 'Thinking', signal: 'Research mode active' },
  { id: 'presenting', label: 'Presenting', signal: 'Sharing the next useful thing' },
  { id: 'exploring', label: 'Exploring', signal: 'Following a fresh signal' },
];

const QUICK_ROUTES = [
  { label: 'Explore projects', href: '/projects/' },
  { label: 'Meet the agents', href: '/agents/' },
  { label: 'Open Labs Office', href: '/dev/' },
];

const MOTION_KEY = 'lorapok-motion-mode-v2';
const MOOD_KEY = 'lorapok-ribo-mood';

function readMood(): RiboMood {
  const stored = localStorage.getItem(MOOD_KEY);
  return MOODS.some((mood) => mood.id === stored) ? (stored as RiboMood) : 'curious';
}

function readMotionMode(): MotionMode {
  const stored = localStorage.getItem(MOTION_KEY);
  return stored === 'active' || stored === 'paused' || stored === 'system' ? stored : 'system';
}

export default function ExperienceControls() {
  const configured = isSystemAssistantConfigured();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<PanelView>('assistant');
  const [mood, setMood] = useState<RiboMood>(readMood);
  const [motionMode, setMotionMode] = useState<MotionMode>(readMotionMode);
  const [systemReduced, setSystemReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<AssistantTurn[]>([
    {
      role: 'assistant',
      content: configured
        ? 'Hello — I’m Ribo, your Lorapok system guide. What would you like to explore?'
        : 'Hello — I’m Ribo, your Lorapok system guide. Gemini is not connected yet, but the quick routes below are ready.',
    },
  ]);
  const panelRef = useRef<HTMLDivElement>(null);
  const activeMood = MOODS.find((item) => item.id === mood) ?? MOODS[0];
  const lastMessage = useMemo(() => messages[messages.length - 1], [messages]);
  const paused = motionMode === 'paused' || (motionMode === 'system' && systemReduced);

  useEffect(() => {
    document.documentElement.dataset.riboMood = mood;
    localStorage.setItem(MOOD_KEY, mood);
  }, [mood]);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setSystemReduced(preference.matches);
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('lp-motion-paused', motionMode === 'paused');
    document.documentElement.classList.toggle('lp-motion-force', motionMode === 'active');
    localStorage.setItem(MOTION_KEY, motionMode);
  }, [motionMode]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  useEffect(() => {
    panelRef.current?.querySelector('.assistant-message:last-child')?.scrollIntoView({
      block: 'nearest',
      behavior: paused ? 'auto' : 'smooth',
    });
  }, [lastMessage, paused]);

  const submitMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message || sending) return;

    const userTurn: AssistantTurn = { role: 'user', content: message };
    setMessages((current) => [...current, userTurn]);
    setDraft('');

    if (!configured) {
      setMessages((current) => [...current, {
        role: 'assistant',
        content: 'Gemini is awaiting secure server configuration through Antigravity. No API key is stored in this website or browser.',
      }]);
      return;
    }

    setSending(true);
    try {
      const result = await askSystemAssistant(message, [...messages, userTurn]);
      setMessages((current) => [...current, { role: 'assistant', content: result.reply }]);
    } catch (error) {
      setMessages((current) => [...current, {
        role: 'assistant',
        content: error instanceof Error ? error.message : 'The assistant is currently unavailable.',
      }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <aside className={`experience-controls${open ? ' open' : ''}`} aria-label="Lorapok system assistant and experience controls">
      <button
        type="button"
        className="experience-controls__trigger"
        aria-expanded={open}
        aria-controls="lorapok-assistant-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="assistant-trigger-visual">
          <img className="ribo-control-avatar" src="/assets/ribo/collections/system-guide.webp" alt="" aria-hidden="true" />
          <i className={configured ? 'connected' : ''} aria-hidden="true" />
        </span>
        <span><strong>Ask Ribo</strong><small>{paused ? 'Motion reduced · open to enable' : (configured ? 'AI assistant ready' : 'System guide')}</small></span>
        <Sparkles size={15} aria-hidden="true" />
      </button>

      <div id="lorapok-assistant-panel" ref={panelRef} className="experience-controls__panel" hidden={!open}>
        <div className="experience-controls__heading assistant-heading">
          <div>
            <span>Lorapok system assistant</span>
            <strong>Ribo is here</strong>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close Ribo assistant"><X size={17} /></button>
        </div>

        <div className="assistant-view-tabs" role="tablist" aria-label="Ribo panel views">
          <button type="button" role="tab" aria-selected={view === 'assistant'} className={view === 'assistant' ? 'active' : ''} onClick={() => setView('assistant')}><Bot size={14} /> Assistant</button>
          <button type="button" role="tab" aria-selected={view === 'experience'} className={view === 'experience' ? 'active' : ''} onClick={() => setView('experience')}><Settings2 size={14} /> Experience</button>
        </div>

        {view === 'assistant' ? (
          <div className="assistant-conversation" role="tabpanel">
            <div className={`assistant-runtime-status ${configured ? 'connected' : 'pending'}`}>
              <i aria-hidden="true" />
              <span><strong>{configured ? 'Secure assistant connected' : 'Gemini setup pending'}</strong><small>{configured ? 'Requests use the protected server endpoint.' : 'Navigation works now. AI answers activate after Antigravity configures the protected endpoint.'}</small></span>
            </div>
            <div className="assistant-messages" aria-live="polite">
              {messages.map((message, index) => (
                <p key={`${message.role}-${index}`} className={`assistant-message ${message.role}`}>{message.content}</p>
              ))}
              {sending && <p className="assistant-message assistant thinking">Ribo is thinking…</p>}
            </div>
            <div className="assistant-quick-routes" aria-label="Quick routes">
              {QUICK_ROUTES.map((route) => <a key={route.href} href={route.href}>{route.label}</a>)}
            </div>
            <form className="assistant-compose" onSubmit={submitMessage}>
              <label htmlFor="ribo-assistant-input" className="sr-only">Ask Ribo</label>
              <input id="ribo-assistant-input" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={configured ? 'Ask about Lorapok…' : 'Test the assistant boundary…'} maxLength={4000} />
              <button type="submit" aria-label="Send message" disabled={!draft.trim() || sending}><Send size={16} /></button>
            </form>
            <p className="assistant-privacy-note">Secrets stay server-side. This interface never requests or stores a Gemini key.</p>
          </div>
        ) : (
          <div className="assistant-experience" role="tabpanel">
            <p>{activeMood.signal}. The choice follows you through the site.</p>
            <div className="experience-controls__moods" role="group" aria-label="Ribo mood">
              {MOODS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={mood === item.id ? 'active' : ''}
                  aria-pressed={mood === item.id}
                  onClick={() => setMood(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button type="button" className="experience-controls__motion" aria-pressed={!paused} onClick={() => setMotionMode(paused ? 'active' : 'paused')}>
              {paused ? <Play size={16} /> : <Pause size={16} />}
              <span>
                <strong>{paused ? 'Enable full animation' : 'Pause animation'}</strong>
                <small>{motionMode === 'system' && systemReduced ? 'Your device currently requests reduced motion' : motionMode === 'active' && systemReduced ? 'Site override active on this device' : 'Persistent accessibility preference'}</small>
              </span>
            </button>
            {motionMode !== 'system' && (
              <button type="button" className="experience-controls__motion-system" onClick={() => setMotionMode('system')}>
                Follow device motion setting
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
