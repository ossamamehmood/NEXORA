import React from 'react';

interface EmblemGreenOrbProps {
  className?: string;
  size?: number;
}

export const EmblemGreenOrb: React.FC<EmblemGreenOrbProps> = ({ className = '', size = 95 }) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Emerald Floor Glow */}
      <div className="absolute inset-0 rounded-full bg-[#10B981]/40 blur-xl pointer-events-none transform translate-y-2" />

      <svg viewBox="0 0 100 100" width={size} height={size} className="relative overflow-visible">
        <defs>
          {/* 3D Glossy Sphere Radial Gradient */}
          <radialGradient id="greenSphereGrad" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="25%" stopColor="#34D399" />
            <stop offset="55%" stopColor="#059669" />
            <stop offset="85%" stopColor="#065F46" />
            <stop offset="100%" stopColor="#022C22" />
          </radialGradient>

          {/* Outer Ring Ambient Shadow */}
          <filter id="orbShadow" x="-20%" y="-15%" width="140%" height="150%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#01241B" floodOpacity="0.65" />
          </filter>

          {/* Specular Glare Arc */}
          <linearGradient id="orbSpecular" x1="0%" y1="0%" x2="60%" y2="80%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="35%" stopColor="rgba(255, 255, 255, 0.25)" />
            <stop offset="70%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>

          {/* Secondary Ring Gradient */}
          <linearGradient id="innerRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
          </linearGradient>
        </defs>

        {/* Outer Shadowed Spherical Body */}
        <circle cx="50" cy="50" r="42" fill="url(#greenSphereGrad)" filter="url(#orbShadow)" />

        {/* Inner Beveled Rim Ring */}
        <circle cx="50" cy="50" r="40" fill="none" stroke="url(#innerRimGrad)" strokeWidth="1.5" opacity="0.6" />

        {/* Center Indentation Detail (CleanMyMac 3D Orb indentation) */}
        <circle cx="58" cy="38" r="8" fill="#047857" opacity="0.4" />
        <circle cx="58" cy="38" r="5" fill="#A7F3D0" opacity="0.75" />
        <circle cx="68" cy="48" r="4" fill="#A7F3D0" opacity="0.5" />

        {/* Primary Specular Highlight Arc */}
        <ellipse cx="36" cy="32" rx="16" ry="10" transform="rotate(-30 36 32)" fill="url(#orbSpecular)" />

        {/* Bottom Bounce Light Reflection */}
        <path d="M 28 72 C 38 82, 62 82, 72 72" fill="none" stroke="#6EE7B7" strokeWidth="2.5" opacity="0.45" strokeLinecap="round" />
      </svg>
    </div>
  );
};
