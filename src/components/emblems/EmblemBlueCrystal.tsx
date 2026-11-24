import React from 'react';

interface EmblemBlueCrystalProps {
  className?: string;
  size?: number;
}

export const EmblemBlueCrystal: React.FC<EmblemBlueCrystalProps> = ({ className = '', size = 95 }) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Electric Blue Floor Glow */}
      <div className="absolute inset-0 rounded-full bg-[#0284C7]/45 blur-xl pointer-events-none transform translate-y-2" />

      <svg viewBox="0 0 100 100" width={size} height={size} className="relative overflow-visible">
        <defs>
          {/* Blue Crystal Facet Gradients */}
          <linearGradient id="crystalTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          <linearGradient id="crystalBottomGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="60%" stopColor="#075985" />
            <stop offset="100%" stopColor="#082F49" />
          </linearGradient>

          <linearGradient id="crystalRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.85)" />
            <stop offset="40%" stopColor="rgba(255, 255, 255, 0.2)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0.3)" />
          </linearGradient>

          <filter id="crystalShadow" x="-20%" y="-15%" width="140%" height="150%">
            <feDropShadow dx="0" dy="5" stdDeviation="4.5" floodColor="#041E30" floodOpacity="0.75" />
          </filter>
        </defs>

        {/* 1. Main Faceted Crystal Rounded Hexagon */}
        <polygon
          points="50,12 85,26 85,68 50,88 15,68 15,26"
          fill="url(#crystalBottomGrad)"
          filter="url(#crystalShadow)"
        />

        {/* 2. Top Angled Facet Plate */}
        <polygon
          points="50,14 83,27 50,48 17,27"
          fill="url(#crystalTopGrad)"
        />

        {/* 3. Outer Rim Specular Highlight */}
        <polygon
          points="50,12 85,26 85,68 50,88 15,68 15,26"
          fill="none"
          stroke="url(#crystalRimGrad)"
          strokeWidth="1.8"
        />

        {/* 4. White & Cyan Dot Matrix Motif (Application Updates) */}
        <g fill="#FFFFFF" opacity="0.9">
          <circle cx="50" cy="38" r="3.5" />
          <circle cx="42" cy="48" r="3" />
          <circle cx="58" cy="48" r="3" />
          <circle cx="34" cy="58" r="2.5" opacity="0.7" />
          <circle cx="50" cy="58" r="3.5" />
          <circle cx="66" cy="58" r="2.5" opacity="0.7" />
          <circle cx="42" cy="68" r="2.5" opacity="0.6" />
          <circle cx="58" cy="68" r="2.5" opacity="0.6" />
          <circle cx="50" cy="76" r="2" opacity="0.5" />
        </g>

        {/* Top Glint */}
        <circle cx="50" cy="14" r="2" fill="#FFFFFF" />
      </svg>
    </div>
  );
};
