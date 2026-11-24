import React from 'react';

interface EmblemGreenShieldProps {
  className?: string;
  size?: number;
}

export const EmblemGreenShield: React.FC<EmblemGreenShieldProps> = ({ className = '', size = 110 }) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Emerald Floor Glow */}
      <div
        className="absolute inset-0 rounded-3xl bg-[#00E699]/35 blur-xl pointer-events-none transform translate-y-3"
      />

      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        className="relative overflow-visible"
      >
        <defs>
          {/* Outer Shield 3D Bevel Gradient */}
          <linearGradient id="shieldRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#48FFC2" />
            <stop offset="35%" stopColor="#00D287" />
            <stop offset="75%" stopColor="#008F56" />
            <stop offset="100%" stopColor="#004D2E" />
          </linearGradient>

          {/* Inner Shield Face Radiant Gradient */}
          <radialGradient id="shieldFaceGrad" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#00F59B" />
            <stop offset="45%" stopColor="#00A865" />
            <stop offset="85%" stopColor="#005C37" />
            <stop offset="100%" stopColor="#00331F" />
          </radialGradient>

          {/* Specular Glare Arc */}
          <linearGradient id="shieldGlare" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.85)" />
            <stop offset="30%" stopColor="rgba(255, 255, 255, 0.25)" />
            <stop offset="70%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>

          {/* Biometric Laser Glow */}
          <linearGradient id="fingerprintGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#D5FFF0" />
            <stop offset="100%" stopColor="#80FFD4" />
          </linearGradient>

          <filter id="shieldShadow" x="-20%" y="-10%" width="140%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#012616" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* 1. Shield Path Silhouette Outer Rim */}
        <path
          d="M 60 12 
             C 85 12, 102 18, 104 36 
             C 106 62, 92 88, 60 108 
             C 28 88, 14 62, 16 36 
             C 18 18, 35 12, 60 12 Z"
          fill="url(#shieldRimGrad)"
          filter="url(#shieldShadow)"
        />

        {/* 2. Inner Shield Face with Inset Bevel */}
        <path
          d="M 60 18 
             C 81 18, 95 23, 97 38 
             C 99 60, 86 82, 60 99 
             C 34 82, 21 60, 23 38 
             C 25 23, 39 18, 60 18 Z"
          fill="url(#shieldFaceGrad)"
        />

        {/* 3. Top-left Specular Glass Glare */}
        <path
          d="M 60 19 
             C 78 19, 90 23, 94 34 
             C 85 45, 45 42, 25 34 
             C 27 24, 42 19, 60 19 Z"
          fill="url(#shieldGlare)"
          opacity="0.65"
        />

        {/* 4. Biometric Fingerprint Artwork (CleanMyMac X Protection Centerpiece) */}
        <g stroke="url(#fingerprintGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.95">
          {/* Innermost loop */}
          <path d="M 57 60 C 57 56, 63 56, 63 60 C 63 64, 59 66, 59 70" />
          {/* Second ridge */}
          <path d="M 52 58 C 52 52, 68 52, 68 59 C 68 66, 62 69, 62 74" />
          {/* Third ridge */}
          <path d="M 47 56 C 47 46, 73 46, 73 57 C 73 66, 67 72, 67 78" />
          {/* Outer left arc */}
          <path d="M 43 62 C 43 43, 77 42, 78 54 C 78 61, 74 65, 73 70" />
          {/* Bottom base arches */}
          <path d="M 48 76 C 51 72, 54 71, 56 71" />
          <path d="M 45 68 C 45 65, 47 63, 49 63" />
        </g>

        {/* 5. Center Core Pulse Star */}
        <circle cx="60" cy="58" r="2" fill="#FFFFFF" />
        <circle cx="60" cy="58" r="5" fill="#FFFFFF" opacity="0.3" />
      </svg>
    </div>
  );
};
