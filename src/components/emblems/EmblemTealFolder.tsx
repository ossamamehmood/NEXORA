import React from 'react';

interface EmblemTealFolderProps {
  className?: string;
  size?: number;
}

export const EmblemTealFolder: React.FC<EmblemTealFolderProps> = ({ className = '', size = 95 }) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Teal Floor Glow */}
      <div className="absolute inset-0 rounded-full bg-[#0D9488]/45 blur-xl pointer-events-none transform translate-y-2" />

      <svg viewBox="0 0 100 100" width={size} height={size} className="relative overflow-visible">
        <defs>
          {/* Teal Folder Gradients */}
          <linearGradient id="folderBackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14B8A6" />
            <stop offset="60%" stopColor="#0F766E" />
            <stop offset="100%" stopColor="#115E59" />
          </linearGradient>

          <linearGradient id="folderFrontGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5EEAD4" />
            <stop offset="35%" stopColor="#2DD4BF" />
            <stop offset="75%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#134E4A" />
          </linearGradient>

          <linearGradient id="docGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E0F2FE" />
          </linearGradient>

          <filter id="folderShadow" x="-20%" y="-15%" width="140%" height="150%">
            <feDropShadow dx="0" dy="5" stdDeviation="4.5" floodColor="#042F2E" floodOpacity="0.75" />
          </filter>
        </defs>

        {/* 1. Back Folder Flap */}
        <path
          d="M 16 32 C 16 26, 20 22, 26 22 L 42 22 L 48 28 L 80 28 C 84 28, 88 32, 88 36 L 88 72 C 88 78, 84 82, 78 82 L 26 82 C 20 82, 16 78, 16 72 Z"
          fill="url(#folderBackGrad)"
          filter="url(#folderShadow)"
        />

        {/* 2. White Paper Document Inside Folder */}
        <rect x="28" y="24" width="44" height="30" rx="4" fill="url(#docGrad)" opacity="0.95" />
        <line x1="34" y1="30" x2="52" y2="30" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="34" y1="35" x2="62" y2="35" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="34" y1="40" x2="58" y2="40" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

        {/* 3. Front Angled Folder Pocket */}
        <path
          d="M 14 42 C 14 38, 18 35, 23 35 L 77 35 C 82 35, 86 38, 86 42 L 84 76 C 84 82, 80 86, 74 86 L 26 86 C 20 86, 16 82, 14 76 Z"
          fill="url(#folderFrontGrad)"
          filter="drop-shadow(0 -3px 6px rgba(0,0,0,0.25))"
        />

        {/* 4. Top Rim Gloss Streak on Front Flap */}
        <path
          d="M 18 37 C 35 36, 65 36, 82 37"
          fill="none"
          stroke="rgba(255, 255, 255, 0.75)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Specular Glint */}
        <circle cx="24" cy="37" r="1.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
};
