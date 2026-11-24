import React from 'react';

interface EmblemHoloLaptopProps {
  className?: string;
  size?: number;
}

export const EmblemHoloLaptop: React.FC<EmblemHoloLaptopProps> = ({ className = '', size = 260 }) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none transition-transform duration-500 hover:scale-105 ${className}`}
      style={{ width: size, height: size * 0.75 }}
    >
      {/* Cyan Holographic Ambient Under-glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[#02FEDC]/25 via-[#1B6DFB]/20 to-transparent blur-2xl pointer-events-none" />

      {/* Floating Sparkle Stars (MacCleaner Pro Image 3 Signature) */}
      <div className="absolute top-4 left-1/3 w-3 h-3 text-[#02FEDC] animate-ping" style={{ animationDuration: '3s' }}>
        ✦
      </div>
      <div className="absolute top-10 right-1/4 w-4 h-4 text-white animate-pulse" style={{ animationDuration: '2s' }}>
        ✧
      </div>
      <div className="absolute bottom-12 left-1/4 w-3.5 h-3.5 text-[#4FA8FF] animate-pulse" style={{ animationDuration: '2.5s' }}>
        ✦
      </div>

      <svg
        viewBox="0 0 320 240"
        width={size}
        height={size * 0.75}
        className="relative overflow-visible"
      >
        <defs>
          {/* Holographic Wireframe Neon Gradients */}
          <linearGradient id="holoScreenLid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#80DFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#1B6DFB" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0B2365" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="holoScreenBezel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#02FEDC" />
            <stop offset="50%" stopColor="#4FA8FF" />
            <stop offset="100%" stopColor="#1B6DFB" />
          </linearGradient>

          <linearGradient id="holoScreenGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(2, 254, 220, 0.25)" />
            <stop offset="50%" stopColor="rgba(27, 109, 251, 0.15)" />
            <stop offset="100%" stopColor="rgba(11, 35, 101, 0.4)" />
          </linearGradient>

          <linearGradient id="holoBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4FA8FF" />
            <stop offset="50%" stopColor="#1B6DFB" />
            <stop offset="100%" stopColor="#091A48" />
          </linearGradient>

          <linearGradient id="holoKeybed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0F2459" />
            <stop offset="100%" stopColor="#06102B" />
          </linearGradient>

          <filter id="holoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Holographic Laptop Display (Angled Perspective) */}
        {/* Outer Lid Frame */}
        <path
          d="M 60 40 
             L 260 40 
             C 268 40, 274 44, 272 52 
             L 252 160 
             L 68 160 
             L 48 52 
             C 46 44, 52 40, 60 40 Z"
          fill="url(#holoScreenLid)"
          stroke="url(#holoScreenBezel)"
          strokeWidth="2.5"
          filter="url(#holoGlow)"
        />

        {/* Inner Screen Display Glass */}
        <path
          d="M 68 48 
             L 252 48 
             L 242 152 
             L 78 152 Z"
          fill="url(#holoScreenGlass)"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1"
        />

        {/* Screen Specular Diagonal Glare */}
        <path
          d="M 120 48 L 180 48 L 130 152 L 95 152 Z"
          fill="rgba(255, 255, 255, 0.15)"
        />

        {/* Camera Sensor Notch */}
        <circle cx="160" cy="44" r="2" fill="#02FEDC" />

        {/* Center Sparkles Inside Screen */}
        <g fill="#FFFFFF" opacity="0.9">
          {/* Big Sparkle */}
          <path d="M 160 85 L 163 95 L 173 98 L 163 101 L 160 111 L 157 101 L 147 98 L 157 95 Z" fill="#02FEDC" />
          <circle cx="160" cy="98" r="2" fill="#FFFFFF" />

          {/* Small Sparkle Left */}
          <path d="M 120 115 L 122 120 L 127 122 L 122 124 L 120 129 L 118 124 L 113 122 L 118 120 Z" fill="#FFFFFF" opacity="0.75" />

          {/* Small Sparkle Right */}
          <path d="M 205 75 L 206.5 79 L 211 80.5 L 206.5 82 L 205 86 L 203.5 82 L 199 80.5 L 203.5 79 Z" fill="#80DFFF" opacity="0.85" />
        </g>

        {/* 2. Laptop Lower Base / Chassis (Isometric Perspective) */}
        {/* Base Rim */}
        <polygon
          points="20,188 300,188 266,160 54,160"
          fill="url(#holoBaseGrad)"
          stroke="url(#holoScreenBezel)"
          strokeWidth="2"
        />

        {/* Keyboard Well */}
        <polygon
          points="68,164 252,164 266,178 54,178"
          fill="url(#holoKeybed)"
          stroke="rgba(2, 254, 220, 0.3)"
          strokeWidth="1"
        />

        {/* Trackpad */}
        <polygon
          points="134,180 186,180 190,186 130,186"
          fill="rgba(2, 254, 220, 0.1)"
          stroke="rgba(2, 254, 220, 0.4)"
          strokeWidth="1"
        />

        {/* Front Edge Lip / Drop */}
        <polygon
          points="20,188 300,188 296,194 24,194"
          fill="#061230"
          stroke="rgba(2, 254, 220, 0.6)"
          strokeWidth="1.5"
        />
        {/* Front Center Notch */}
        <rect x="144" y="188" width="32" height="3" rx="1.5" fill="#02FEDC" />
      </svg>
    </div>
  );
};
