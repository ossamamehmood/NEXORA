import React from 'react';

interface EmblemSystemCareScanProps {
  className?: string;
  onClick?: () => void;
  isScanning?: boolean;
}

export const EmblemSystemCareScan: React.FC<EmblemSystemCareScanProps> = ({
  className = '',
  onClick,
  isScanning = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center cursor-pointer select-none group transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] ${className}`}
      style={{ width: 480, height: 260 }}
    >
      {/* 1. Horizontal Frequency Wave Particle Grid (SystemCare Signature Wave) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="0 0 480 260"
      >
        <defs>
          <linearGradient id="waveGradLeft" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="waveGradRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Left Side Audio-Frequency Particle Stream */}
        <g stroke="url(#waveGradLeft)" strokeWidth="1" opacity="0.7">
          <path d="M 140 130 C 90 115, 60 145, 10 130" fill="none" strokeDasharray="2 3" />
          <path d="M 140 120 C 100 100, 70 140, 20 120" fill="none" strokeDasharray="3 4" />
          <path d="M 140 140 C 90 160, 50 110, 15 140" fill="none" strokeDasharray="2 2" />
          <path d="M 140 110 C 80 85, 40 135, 5 110" fill="none" opacity="0.4" />
          <path d="M 140 150 C 80 175, 40 125, 5 150" fill="none" opacity="0.4" />
        </g>

        {/* Right Side Audio-Frequency Particle Stream */}
        <g stroke="url(#waveGradRight)" strokeWidth="1" opacity="0.7">
          <path d="M 340 130 C 390 115, 420 145, 470 130" fill="none" strokeDasharray="2 3" />
          <path d="M 340 120 C 380 100, 410 140, 460 120" fill="none" strokeDasharray="3 4" />
          <path d="M 340 140 C 390 160, 430 110, 465 140" fill="none" strokeDasharray="2 2" />
          <path d="M 340 110 C 400 85, 440 135, 475 110" fill="none" opacity="0.4" />
          <path d="M 340 150 C 400 175, 440 125, 475 150" fill="none" opacity="0.4" />
        </g>
      </svg>

      {/* 2. Giant Glowing Circular Center Button */}
      <div className="relative w-52 h-52 flex items-center justify-center">
        {/* Outer Radiant Ambient Blue Halo */}
        <div className="absolute inset-0 rounded-full bg-[#00D2FF]/30 blur-2xl pointer-events-none group-hover:bg-[#00D2FF]/45 transition-all duration-500" />

        {/* Segmented Cyan Outer Ring */}
        <svg
          viewBox="0 0 200 200"
          className={`absolute inset-0 w-full h-full overflow-visible ${
            isScanning ? 'animate-spin' : ''
          }`}
          style={{ animationDuration: '8s' }}
        >
          <defs>
            <linearGradient id="ascRingSegment" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F2FE" />
              <stop offset="50%" stopColor="#4FACFE" />
              <stop offset="100%" stopColor="#0072FF" />
            </linearGradient>
          </defs>

          {/* Segmented 8-section border with spacing */}
          <circle
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke="url(#ascRingSegment)"
            strokeWidth="5"
            strokeDasharray="64 8"
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.7))',
            }}
          />
        </svg>

        {/* Inner Solid Gradient Core (Advanced SystemCare SCAN button) */}
        <div className="relative w-44 h-44 rounded-full p-[3px] bg-gradient-to-tr from-[#0052D4] via-[#4364F7] to-[#6FB1FC] shadow-[0_15px_40px_rgba(0,114,255,0.5),inset_0_2px_4px_rgba(255,255,255,0.6)] flex items-center justify-center">
          {/* Internal Blue Dial Face */}
          <div className="w-full h-full rounded-full bg-gradient-to-b from-[#2B66FF] via-[#1A45D8] to-[#0D238A] flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
            {/* Top Glass Specular Arc */}
            <div className="absolute top-0 inset-x-6 h-16 bg-white/20 rounded-t-full blur-[2px] pointer-events-none" />

            {/* Glowing Text */}
            <span className="text-3xl font-black text-white tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              SCAN
            </span>
            <span className="text-[10px] text-[#A5C9FF] font-mono tracking-wider uppercase mt-0.5">
              1-Click Clean
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
