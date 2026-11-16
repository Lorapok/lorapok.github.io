import { Pause, Play, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type RiboMood = 'curious' | 'focused' | 'celebrating' | 'thinking';

const MOODS: Array<{ id: RiboMood; label: string; signal: string }> = [
  { id: 'curious', label: 'Curious', signal: 'Exploring the universe' },
  { id: 'focused', label: 'Focused', signal: 'Deep work in progress' },
  { id: 'celebrating', label: 'Celebrating', signal: 'A release just landed' },
  { id: 'thinking', label: 'Thinking', signal: 'Research mode active' },
];

const MOTION_KEY = 'lorapok-motion-paused';
const MOOD_KEY = 'lorapok-ribo-mood';

function readMood(): RiboMood {
  const stored = localStorage.getItem(MOOD_KEY);
  return MOODS.some((mood) => mood.id === stored) ? (stored as RiboMood) : 'curious';
}

export default function ExperienceControls() {
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState<RiboMood>(readMood);
  const [paused, setPaused] = useState(() => localStorage.getItem(MOTION_KEY) === 'true');
  const activeMood = MOODS.find((item) => item.id === mood) ?? MOODS[0];

  useEffect(() => {
    document.documentElement.dataset.riboMood = mood;
    localStorage.setItem(MOOD_KEY, mood);
  }, [mood]);

  useEffect(() => {
    document.documentElement.classList.toggle('lp-motion-paused', paused);
    localStorage.setItem(MOTION_KEY, String(paused));
  }, [paused]);

  return (
    <aside className={`experience-controls${open ? ' open' : ''}`} aria-label="Ribo and motion controls">
      <button
        type="button"
        className="experience-controls__trigger"
        aria-expanded={open}
        aria-controls="ribo-controls-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <span className={`ribo-control-avatar mood-${mood}`} aria-hidden="true"><i /><i /><b /></span>
        <span><strong>Ribo</strong><small>{activeMood.label}</small></span>
        <Sparkles size={15} aria-hidden="true" />
      </button>

      <div id="ribo-controls-panel" className="experience-controls__panel" hidden={!open}>
        <div className="experience-controls__heading">
          <div><span>Living interface</span><strong>Set Ribo's mood</strong></div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close Ribo controls"><X size={17} /></button>
        </div>
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
        <button type="button" className="experience-controls__motion" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
          {paused ? <Play size={16} /> : <Pause size={16} />}
          <span><strong>{paused ? 'Resume motion' : 'Pause motion'}</strong><small>Persistent accessibility preference</small></span>
        </button>
      </div>
    </aside>
  );
}
