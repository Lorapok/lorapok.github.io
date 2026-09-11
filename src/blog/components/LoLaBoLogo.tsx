// src/blog/components/LoLaBoLogo.tsx
// Autonomous Content & Technical Intelligence Engine Brand Mark
// Lorapok Labs Child Brand: LoLaBo

import React from "react";

interface LoLaBoLogoProps {
  variant?: "full" | "icon";
  animated?: boolean;
  size?: number;
  className?: string;
  showSubtitle?: boolean;
}

export default function LoLaBoLogo({
  variant = "icon",
  animated = false,
  size,
  className = "",
  showSubtitle = true,
}: LoLaBoLogoProps) {
  if (variant === "full") {
    const src = animated
      ? "/assets/lolabo-logo-animated.svg"
      : "/assets/lolabo-logo.svg";
    const height = size || 56;
    // Aspect ratio 920:240 = 3.83:1
    const width = Math.round(height * 3.83);

    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src={src}
          alt="LoLaBo // Autonomous Content Engine"
          width={width}
          height={height}
          className="h-auto max-w-full object-contain filter drop-shadow-[0_0_20px_rgba(56,189,248,0.25)]"
        />
      </div>
    );
  }

  // Icon only variant
  const iconSize = size || 40;
  const iconSrc = animated
    ? "/assets/lolabo-icon-animated.svg"
    : "/assets/lolabo-icon.svg";

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: iconSize, height: iconSize }}
    >
      <img
        src={iconSrc}
        alt="LoLaBo Mark"
        width={iconSize}
        height={iconSize}
        className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]"
      />
    </div>
  );
}
