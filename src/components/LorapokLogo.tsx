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
          src="/assets/ribo/ribo-curious.webp"
          alt="Lorapok Labs Mark"
          width={size}
          height={size}
          className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(103,255,143,0.35)]"
        />
      </div>
    );
  }

  // Static mascot icon
  return (
    <img
      src="/assets/ribo/ribo-curious.webp"
      alt="Lorapok Labs Ribo mascot"
      width={size}
      height={size}
      className={`lorapok-master-logo select-none object-contain ${className}`}
    />
  );
}
