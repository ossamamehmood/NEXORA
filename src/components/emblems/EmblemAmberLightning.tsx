import React from 'react';

interface EmblemAmberLightningProps {
  className?: string;
  size?: number;
}

export const EmblemAmberLightning: React.FC<EmblemAmberLightningProps> = ({ className = '', size = 95 }) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Amber Floor Glow */}
      <div className="absolute inset-0 rounded-full bg-[#F59E0B]/40 blur-xl pointer-events-none transform translate-y-2" />

      <svg viewBox="0 0 100 100" width={size} height={size} className="relative overflow-visible">
        <defs>
          {/* Amber / Bronze 3D Body Gradient */}
          <linearGradient id="amberRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="30%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Ribbon Specular Highlight */}
          <linearGradient id="amberRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.85)" />
            <stop offset="40%" stopColor="rgba(255, 255, 255, 0.2)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0.4)" />
          </linearGradient>

          {/* 3D Lightning Bolt Gradient */}
          <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#FEF3C7" />
            <stop offset="80%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          <filter id="lightningShadow" x="-20%" y="-15%" width="140%" height="150%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#451A03" floodOpacity="0.7" />
          </filter>
        </defs>

        {/* 1. 3D Rounded Polygon / Ribbon Shield */}
        <path
          d="M 50 12 
             C 75 12, 88 20, 88 42 
             C 88 68, 72 82, 50 88 
             C 28 82, 12 68, 12 42 
             C 12 20, 25 12, 50 12 Z"
          fill="url(#amberRibbonGrad)"
          filter="url(#lightningShadow)"
        />

        {/* 2. Top Specular Bevel Rim */}
        <path
          d="M 50 14 
             C 73 14, 86 21, 86 42 
             C 86 66, 71 80, 50 86 
             C 29 80, 14 66, 14 42 
             C 14 21, 27 14, 50 14 Z"
          fill="none"
          stroke="url(#amberRimGrad)"
          strokeWidth="1.8"
        />

        {/* 3. Diagonal Glass Streak */}
        <path
          d="M 35 15 C 55 15, 80 25, 86 38 C 76 46, 38 32, 22 28 Z"
          fill="white"
          opacity="0.3"
        />

        {/* 4. 3D Embossed Lightning Bolt (Performance Core) */}
        <polygon
          points="53,24 35,52 49,52 45,76 65,46 51,46"
          fill="url(#lightningGrad)"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1"
          filter="drop-shadow(0 2px 5px rgba(0,0,0,0.4))"
        />

        {/* Core Energy Spark */}
        <circle cx="51" cy="46" r="2.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
};
