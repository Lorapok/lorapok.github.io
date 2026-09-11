// src/components/LorapokLogo.tsx
// High-fidelity Master Brand Mark for Lorapok Labs
// Vector bio-shield architecture with biomorphic metamorphosis core

import React from "react";

interface LorapokLogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
  variant?: "icon" | "full";
}

export default function LorapokLogo({
  className = "",
  size = 32,
  animated = true,
  variant = "icon",
}: LorapokLogoProps) {
  if (variant === "full") {
    const src = animated
      ? "/assets/lorapok-labs-logo-animated.svg"
      : "/assets/lorapok-labs-logo.svg";
    const height = size;
    // Aspect ratio 900:240 = 3.75:1
    const width = Math.round(height * 3.75);

    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src={src}
          alt="Lorapok Labs // Systems Architecture"
          width={width}
          height={height}
          className="h-auto max-w-full object-contain filter drop-shadow-[0_0_15px_rgba(103,255,143,0.3)]"
        />
      </div>
    );
  }

  // Icon variant
  if (animated) {
    return (
      <div
        className={`inline-flex items-center justify-center select-none ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src="/assets/lorapok-icon-animated.svg"
          alt="Lorapok Labs Mark"
          width={size}
          height={size}
          className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(103,255,143,0.35)]"
        />
      </div>
    );
  }

  // Static high-res SVG Icon
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      className={`lorapok-master-logo select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lp-core-grad-cmp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67ff8f" />
          <stop offset="60%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        <linearGradient id="lp-ring-grad-cmp" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#67ff8f" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#67ff8f" stopOpacity="0.9" />
        </linearGradient>
        <filter id="lp-bloom-cmp" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer Bio-Shield Ring */}
      <circle
        cx="250"
        cy="250"
        r="215"
        stroke="url(#lp-ring-grad-cmp)"
        strokeWidth="4"
        strokeDasharray="12 8"
        opacity="0.75"
      />
      <circle cx="250" cy="250" r="195" stroke="#ffffff" strokeWidth="1.5" opacity="0.15" />

      {/* Hexagonal Tech Lattice Nodes */}
      <polygon
        points="250,75 390,155 390,345 250,425 110,345 110,155"
        stroke="#67ff8f"
        strokeWidth="2"
        strokeOpacity="0.25"
        strokeDasharray="6 10"
        fill="none"
      />

      {/* Metamorphic Orbital Guides */}
      <path
        d="M 250 55 A 195 195 0 0 1 445 250"
        stroke="#38bdf8"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="30 180"
        opacity="0.85"
      />
      <path
        d="M 250 445 A 195 195 0 0 1 55 250"
        stroke="#67ff8f"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="30 180"
        opacity="0.85"
      />

      {/* Inner Dynamic Biomorphic Arcs */}
      <path
        d="M 170 190 Q 250 110 330 190"
        stroke="url(#lp-core-grad-cmp)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      <path
        d="M 170 310 Q 250 390 330 310"
        stroke="url(#lp-core-grad-cmp)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />

      {/* Synaptic Connectors */}
      <line
        x1="250"
        y1="165"
        x2="250"
        y2="225"
        stroke="#67ff8f"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.75"
      />
      <line
        x1="250"
        y1="275"
        x2="250"
        y2="335"
        stroke="#38bdf8"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Segment 1: Sensory Nucleus */}
      <circle cx="250" cy="165" r="30" fill="url(#lp-core-grad-cmp)" filter="url(#lp-bloom-cmp)" />
      <circle cx="250" cy="165" r="14" fill="#ffffff" opacity="0.9" />

      {/* Segment 2: Central Reactor */}
      <circle
        cx="250"
        cy="250"
        r="44"
        fill="#090d14"
        stroke="url(#lp-core-grad-cmp)"
        strokeWidth="4"
        filter="url(#lp-bloom-cmp)"
      />
      <circle cx="250" cy="250" r="30" fill="url(#lp-core-grad-cmp)" opacity="0.9" />
      <circle cx="250" cy="250" r="16" fill="#ffffff" />
      <circle cx="250" cy="250" r="8" fill="#090d14" />

      {/* Segment 3: Base Nucleus */}
      <circle cx="250" cy="335" r="26" fill="url(#lp-core-grad-cmp)" filter="url(#lp-bloom-cmp)" />
      <circle cx="250" cy="335" r="12" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}
