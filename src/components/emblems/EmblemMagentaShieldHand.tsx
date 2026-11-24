import React from 'react';

interface EmblemMagentaShieldHandProps {
  className?: string;
  size?: number;
}

export const EmblemMagentaShieldHand: React.FC<EmblemMagentaShieldHandProps> = ({ className = '', size = 95 }) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Magenta Floor Glow */}
      <div className="absolute inset-0 rounded-full bg-[#D946EF]/40 blur-xl pointer-events-none transform translate-y-2" />

      <svg viewBox="0 0 100 100" width={size} height={size} className="relative overflow-visible">
        <defs>
          {/* Hexagonal Shield 3D Bevel Gradient */}
          <linearGradient id="magentaHexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="35%" stopColor="#C026D3" />
            <stop offset="70%" stopColor="#86198F" />
            <stop offset="100%" stopColor="#4A044E" />
          </linearGradient>

          {/* Hexagonal Rim Specular */}
          <linearGradient id="hexRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.75)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.15)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0.4)" />
          </linearGradient>

          {/* 3D Frosted White Hand Gradient */}
          <linearGradient id="handGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#FDF2F8" />
            <stop offset="85%" stopColor="#FBCFE8" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>

          <filter id="handShadow" x="-20%" y="-15%" width="140%" height="150%">
            <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#3B0739" floodOpacity="0.75" />
          </filter>
        </defs>

        {/* 1. Hexagonal Beveled Shield Body */}
        <polygon
          points="50,10 88,30 88,70 50,90 12,70 12,30"
          fill="url(#magentaHexGrad)"
          filter="url(#handShadow)"
        />

        {/* 2. Top Rim Bevel Highlight */}
        <polygon
          points="50,12 86,31 86,69 50,88 14,69 14,31"
          fill="none"
          stroke="url(#hexRimGrad)"
          strokeWidth="1.8"
        />

        {/* 3. Diagonal Glass Glare */}
        <path
          d="M 28 22 L 72 22 L 40 78 L 16 68 Z"
          fill="white"
          opacity="0.16"
        />

        {/* 4. Embossed 3D Frosted White Hand (Moonlock / Protection Sign) */}
        <g fill="url(#handGrad)" filter="url(#handShadow)">
          {/* Palm */}
          <rect x="36" y="44" width="28" height="26" rx="8" />
          {/* Thumb */}
          <rect x="30" y="48" width="8" height="15" rx="4" transform="rotate(-25 34 55)" />
          {/* Index Finger */}
          <rect x="37" y="27" width="5.5" height="22" rx="2.75" />
          {/* Middle Finger (tallest) */}
          <rect x="44.5" y="24" width="5.5" height="25" rx="2.75" />
          {/* Ring Finger */}
          <rect x="52" y="27" width="5.5" height="22" rx="2.75" />
          {/* Pinky Finger */}
          <rect x="59.5" y="33" width="5.5" height="16" rx="2.75" />
        </g>

        {/* Hand Top Specular Glint */}
        <circle cx="47" cy="26" r="1.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
};
