import React from 'react';

interface EmblemSpeedometerProps {
  className?: string;
  size?: number;
}

export const EmblemSpeedometer: React.FC<EmblemSpeedometerProps> = ({ className = '', size = 110 }) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Ruby Floor Glow */}
      <div
        className="absolute inset-0 rounded-3xl bg-[#FF3366]/35 blur-xl pointer-events-none transform translate-y-3"
      />

      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        className="relative overflow-visible"
      >
        <defs>
          {/* Metallic Crimson Rim */}
          <linearGradient id="speedRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B8B" />
            <stop offset="35%" stopColor="#FF2A55" />
            <stop offset="75%" stopColor="#C40833" />
            <stop offset="100%" stopColor="#660017" />
          </linearGradient>

          {/* Deep Dial Face Radiant Gradient */}
          <radialGradient id="dialFaceGrad" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#9E0C30" />
            <stop offset="65%" stopColor="#4A0213" />
            <stop offset="100%" stopColor="#220008" />
          </radialGradient>

          {/* Specular Chrome Bevel Gloss */}
          <linearGradient id="speedBevelGloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.85)" />
            <stop offset="30%" stopColor="rgba(255, 255, 255, 0.2)" />
            <stop offset="70%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>

          {/* Needle Gradient */}
          <linearGradient id="needleGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFD1DC" />
          </linearGradient>

          <filter id="speedShadow" x="-20%" y="-10%" width="140%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#3D000C" floodOpacity="0.65" />
          </filter>
        </defs>

        {/* 1. Outer Tachometer 3D Rim */}
        <circle cx="60" cy="60" r="48" fill="url(#speedRimGrad)" filter="url(#speedShadow)" />

        {/* 2. Top Specular Bevel Arc */}
        <circle
          cx="60"
          cy="60"
          r="46.5"
          fill="none"
          stroke="url(#speedBevelGloss)"
          strokeWidth="2.5"
        />

        {/* 3. Deep Gauge Dial Face */}
        <circle cx="60" cy="60" r="40" fill="url(#dialFaceGrad)" />
        <circle
          cx="60"
          cy="60"
          r="40"
          fill="none"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="1"
        />

        {/* 4. Gauge Arc Track & Graduation Ticks */}
        <path
          d="M 28 72 A 38 38 0 1 1 92 72"
          fill="none"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="3"
          strokeDasharray="4 6"
        />

        {/* High Performance Redline Arc Segment */}
        <path
          d="M 72 32 A 38 38 0 0 1 92 72"
          fill="none"
          stroke="#00FEDC"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Minor Dial Dots */}
        <circle cx="32" cy="68" r="1.5" fill="#FFFFFF" />
        <circle cx="34" cy="50" r="1.5" fill="#FFFFFF" />
        <circle cx="44" cy="36" r="1.5" fill="#FFFFFF" />
        <circle cx="60" cy="30" r="2" fill="#FFFFFF" />
        <circle cx="76" cy="36" r="1.5" fill="#02FEDC" />
        <circle cx="86" cy="50" r="1.5" fill="#02FEDC" />
        <circle cx="88" cy="68" r="2" fill="#02FEDC" />

        {/* 5. Angled White Performance Needle pointing high */}
        <path
          d="M 58 62 L 78 36 C 79 34 82 36 80 39 L 62 64 Z"
          fill="url(#needleGrad)"
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
        />

        {/* 6. Center Hub Cap */}
        <circle cx="60" cy="60" r="9" fill="#1C0309" stroke="#FF6B8B" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="5" fill="#FF2A55" />
        <circle cx="60" cy="60" r="2" fill="#FFFFFF" />

        {/* 7. Specular Top Glass Glare Arc */}
        <path
          d="M 32 36 C 45 26 75 26 88 36 C 78 44 42 44 32 36 Z"
          fill="white"
          opacity="0.3"
        />
      </svg>
    </div>
  );
};
