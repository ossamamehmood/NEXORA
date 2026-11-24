import React from 'react';

interface EmblemBlueDriveProps {
  className?: string;
  size?: number;
}

export const EmblemBlueDrive: React.FC<EmblemBlueDriveProps> = ({ className = '', size = 110 }) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Floor Glow */}
      <div
        className="absolute inset-0 rounded-3xl bg-[#0088FF]/35 blur-xl pointer-events-none transform translate-y-3"
      />

      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        className="relative overflow-visible"
      >
        <defs>
          {/* Outer Drive Body Metallic Gradient */}
          <linearGradient id="driveBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4FA8FF" />
            <stop offset="40%" stopColor="#1B6DFB" />
            <stop offset="85%" stopColor="#083EB2" />
            <stop offset="100%" stopColor="#032575" />
          </linearGradient>

          {/* Top Surface Specular Gloss Bevel */}
          <linearGradient id="driveGloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.7)" />
            <stop offset="25%" stopColor="rgba(255, 255, 255, 0.2)" />
            <stop offset="60%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>

          {/* Platter Recess Gradient */}
          <radialGradient id="platterRecess" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#0B1A3D" />
            <stop offset="70%" stopColor="#061026" />
            <stop offset="100%" stopColor="#020713" />
          </radialGradient>

          {/* Spun Metallic Platter Gradient */}
          <linearGradient id="platterDisk" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EAF1FC" />
            <stop offset="25%" stopColor="#98B9E3" />
            <stop offset="50%" stopColor="#D5E4F8" />
            <stop offset="75%" stopColor="#7B9ECC" />
            <stop offset="100%" stopColor="#ADC8EE" />
          </linearGradient>

          {/* Spindle Chrome Cap */}
          <radialGradient id="spindleChrome" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#B0C4DE" />
            <stop offset="100%" stopColor="#4A6572" />
          </radialGradient>

          {/* Actuator Chrome Arm */}
          <linearGradient id="actuatorChrome" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>

          {/* Drop shadow */}
          <filter id="driveShadow" x="-20%" y="-10%" width="140%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#02143B" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* 1. Main 3D Drive Casing */}
        <rect
          x="12"
          y="10"
          width="96"
          height="100"
          rx="22"
          fill="url(#driveBodyGrad)"
          filter="url(#driveShadow)"
        />

        {/* 2. Top Rim Highlights & Inset Bevel */}
        <rect
          x="13.5"
          y="11.5"
          width="93"
          height="97"
          rx="20.5"
          fill="none"
          stroke="url(#driveGloss)"
          strokeWidth="2"
        />

        {/* 3. Center Recessed Circular Platter Bay */}
        <circle cx="60" cy="54" r="34" fill="url(#platterRecess)" />
        <circle
          cx="60"
          cy="54"
          r="34"
          fill="none"
          stroke="rgba(0, 136, 255, 0.4)"
          strokeWidth="1.5"
        />

        {/* 4. Mirrored Platter Disk with Light Track Rings */}
        <circle cx="60" cy="54" r="28" fill="url(#platterDisk)" />
        <circle cx="60" cy="54" r="24" fill="none" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="0.8" />
        <circle cx="60" cy="54" r="19" fill="none" stroke="rgba(100, 150, 220, 0.3)" strokeWidth="0.8" />
        <circle cx="60" cy="54" r="14" fill="none" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="0.8" />

        {/* 5. Center Spindle Chrome Hub */}
        <circle cx="60" cy="54" r="8" fill="url(#spindleChrome)" stroke="#1E293B" strokeWidth="0.8" />
        <circle cx="60" cy="54" r="3" fill="#0F172A" />

        {/* 6. Precision Actuator Arm (CleanMyMac Stylized Wiper/Arm) */}
        <path
          d="M 60 54 L 84 32 C 86 30 89 33 87 36 L 68 56 Z"
          fill="url(#actuatorChrome)"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="0.6"
        />
        <circle cx="85" cy="34" r="2.5" fill="#FFFFFF" />

        {/* 7. Bottom Front Status Slot & Cyan LED Indicator */}
        <rect x="36" y="94" width="48" height="4" rx="2" fill="#020E26" />
        <circle cx="42" cy="96" r="1.5" fill="#02FEDC" />
        <circle cx="42" cy="96" r="3.5" fill="#02FEDC" opacity="0.4" />

        {/* 8. Specular Glass Glare Streak across front */}
        <path
          d="M 22 14 C 45 14 85 24 98 48 C 88 34 50 22 22 18 Z"
          fill="white"
          opacity="0.35"
        />
      </svg>
    </div>
  );
};
