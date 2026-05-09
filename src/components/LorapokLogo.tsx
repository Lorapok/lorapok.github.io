// src/components/LorapokLogo.tsx
// High-fidelity animated SVG logo for Lorapok Labs
export default function LorapokLogo({ className = "", size = 32 }: { className?: string; size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={`lorapok-svg-logo ${className}`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="larva-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67ff8f" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Outer Bio-Shell */}
      <path 
        d="M50 10C27.9 10 10 27.9 10 50C10 72.1 27.9 90 50 90C72.1 90 90 72.1 90 50C90 27.9 72.1 10 50 10ZM50 82C32.3 82 18 67.7 18 50C18 32.3 32.3 18 50 18C67.7 18 82 32.3 82 50C82 67.7 67.7 82 50 82Z" 
        fill="#67ff8f" 
        fillOpacity="0.1"
      />

      {/* Core Larva Segments */}
      <circle className="larva-seg-1" cx="50" cy="35" r="8" fill="url(#larva-grad)" filter="url(#glow)" />
      <circle className="larva-seg-2" cx="50" cy="50" r="10" fill="url(#larva-grad)" filter="url(#glow)" />
      <circle className="larva-seg-3" cx="50" cy="65" r="7" fill="url(#larva-grad)" filter="url(#glow)" />
      
      {/* Bio-Connectors */}
      <rect className="larva-link-1" x="48" y="40" width="4" height="5" fill="#67ff8f" fillOpacity="0.5" />
      <rect className="larva-link-2" x="48" y="58" width="4" height="4" fill="#67ff8f" fillOpacity="0.5" />

      <style>{`
        .lorapok-svg-logo {
          filter: drop-shadow(0 0 5px rgba(103, 255, 143, 0.4));
        }
        .larva-seg-1 { animation: bio-pulse 2s ease-in-out infinite; }
        .larva-seg-2 { animation: bio-pulse 2s ease-in-out infinite 0.3s; }
        .larva-seg-3 { animation: bio-pulse 2s ease-in-out infinite 0.6s; }
        
        @keyframes bio-pulse {
          0%, 100% { transform: scale(1); transform-origin: center; opacity: 0.8; }
          50% { transform: scale(1.15); transform-origin: center; opacity: 1; }
        }
      `}</style>
    </svg>
  );
}
