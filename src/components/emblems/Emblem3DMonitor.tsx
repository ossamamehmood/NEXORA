import React from 'react';

interface Emblem3DMonitorProps {
  className?: string;
  onClick?: () => void;
}

export const Emblem3DMonitor: React.FC<Emblem3DMonitorProps> = ({ className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center cursor-pointer select-none group transition-transform duration-500 hover:scale-[1.02] ${className}`}
    >
      {/* 1. Deep Atmospheric Ambient Lighting (Backdrop Glow) */}
      <div className="absolute -inset-10 bg-gradient-to-tr from-[#F502FD]/25 via-[#6E56FF]/30 to-[#02FEDC]/20 rounded-full blur-3xl pointer-events-none group-hover:blur-[60px] transition-all duration-700" />
      
      {/* Radiant Orbital Aura Rings */}
      <div className="absolute w-[360px] h-[360px] rounded-full border border-[#F502FD]/20 animate-pulse pointer-events-none" />
      <div className="absolute w-[440px] h-[440px] rounded-full border border-white/[0.05] pointer-events-none" />

      {/* 2. Main 3D Computer Enclosure (CleanMyMac X Hardware Architecture) */}
      <div className="relative w-[340px] h-[220px] rounded-[32px] p-[3px] bg-gradient-to-b from-[#FF52D9] via-[#9B25B8] to-[#400B6E] shadow-[0_25px_60px_-15px_rgba(245,2,253,0.45)] border border-white/30 z-10 overflow-hidden">
        {/* Top Surface Specular Highlight */}
        <div className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        {/* Inner Bezel & Screen Chassis */}
        <div className="relative w-full h-full rounded-[29px] bg-gradient-to-b from-[#1C0933] via-[#100422] to-[#080214] p-4 flex flex-col justify-between overflow-hidden shadow-inner">
          {/* Internal Specular Glass Glare Stripe */}
          <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent transform -rotate-45 pointer-events-none group-hover:translate-x-12 transition-transform duration-1000" />

          {/* Top Camera & Mic Sensors */}
          <div className="flex items-center justify-center gap-1.5 z-20">
            <div className="w-2 h-2 rounded-full bg-[#05010B] border border-white/20 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-[#00E699] animate-pulse" />
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
          </div>

          {/* Center Screen Display: Swirling Holographic Core */}
          <div className="relative flex-1 flex items-center justify-center">
            {/* Swirling Aurora Mesh */}
            <div className="absolute w-44 h-44 rounded-full bg-gradient-to-r from-[#F502FD]/30 via-[#6E56FF]/35 to-[#02FEDC]/30 blur-xl animate-spin" style={{ animationDuration: '14s' }} />

            {/* Glowing Brand Monogram / Core Emblem */}
            <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#F502FD] to-[#02FEDC] p-[2px] shadow-[0_0_30px_rgba(245,2,253,0.5)]">
              <div className="w-full h-full rounded-[14px] bg-[#0E031F]/90 backdrop-blur-md flex items-center justify-center">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#02FEDC] to-[#F502FD]">
                  N
                </span>
              </div>
            </div>

            {/* MECHANICAL ARTICULATED WIPER BLADE (CleanMyMac X Signature) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              {/* Wiper Pivot Hinge at Top Right */}
              <div className="absolute -top-3 right-8 w-6 h-6 rounded-full bg-gradient-to-b from-[#FFFFFF] to-[#718096] shadow-lg border border-white/50 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2D3748]" />
              </div>

              {/* Wiper Arm + Blade with Smooth Mechanical Kinematics */}
              <div
                className="absolute top-0 right-10 w-2 h-44 origin-top animate-wiper-sweep"
                style={{
                  filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.6))',
                }}
              >
                {/* Metallic Wiper Shaft */}
                <div className="w-2 h-36 bg-gradient-to-r from-[#CBD5E1] via-[#FFFFFF] to-[#64748B] rounded-full mx-auto" />
                
                {/* Rubber Wiper Blade Strip */}
                <div className="absolute bottom-2 -left-12 w-28 h-1.5 bg-gradient-to-r from-transparent via-[#02FEDC] to-white rounded-full shadow-[0_0_15px_#02FEDC]" />

                {/* Floating Cleaning Sparkles on Wiper Tip */}
                <div className="absolute bottom-0 -left-6 w-3 h-3 text-[#02FEDC] animate-ping" />
              </div>
            </div>
          </div>

          {/* Bottom Screen Bar: Telemetry Health Pill */}
          <div className="relative z-10 flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm text-[10px] font-mono">
            <span className="text-[#C8BEDC] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E699] animate-ping" />
              SYSTEM SHIELD
            </span>
            <span className="text-[#02FEDC] font-bold tracking-wider">CALIBRATED</span>
          </div>
        </div>
      </div>

      {/* 3. Ergonomic Aerospace Aluminum Stand & Base */}
      <div className="relative z-0 flex flex-col items-center -mt-1">
        {/* Stand Neck with Cable Grommet */}
        <div className="w-20 h-10 bg-gradient-to-b from-[#8C46C9] via-[#4D1D7A] to-[#240A3D] rounded-b-xl border-x border-b border-white/20 shadow-lg flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-[#120521] border border-white/10 shadow-inner" />
        </div>

        {/* Elliptic Weighted Base Casting Floor Shadow */}
        <div className="w-48 h-3.5 bg-gradient-to-r from-[#3B1560] via-[#8B3DB8] to-[#3B1560] rounded-full border border-white/20 shadow-2xl mt-0.5" />
        <div className="w-56 h-3 bg-black/60 rounded-full blur-md -mt-1" />
      </div>
    </div>
  );
};
