import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  ShieldCheck,
  Activity,
  Boxes,
  Stethoscope,
  Wrench,
  Settings,
  Orbit,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { NavigationSection } from '../types';

interface SidebarProps {
  currentSection: NavigationSection;
  onSelectSection: (section: NavigationSection) => void;
  isAssistantActive?: boolean;
  onToggleAssistant?: () => void;
}

interface NavItem {
  id: NavigationSection;
  label: string;
  icon: React.ElementType;
  hasPip?: boolean;
  badge?: string;
}

const railItems: NavItem[] = [
  { id: 'overview', label: 'Smart Care', icon: Sparkles },
  { id: 'cleaner', label: 'Cleanup', icon: Layers, hasPip: true },
  { id: 'privacy', label: 'Protection', icon: ShieldCheck },
  { id: 'gaming', label: 'Speed', icon: Zap, hasPip: true, badge: 'Pro' },
  { id: 'applications', label: 'Applications', icon: Boxes },
  { id: 'disk-analyzer', label: 'Space Lens', icon: Orbit, hasPip: true },
  { id: 'monitor', label: 'System Monitor', icon: Activity },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'diagnostics', label: 'Diagnostics', icon: Stethoscope },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  isAssistantActive = false,
  onToggleAssistant,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      className={`bg-gradient-to-b from-[#18082D] via-[#120524] to-[#0A0216] border-r border-white/[0.08] flex flex-col h-full select-none shadow-2xl relative z-30 transition-all duration-300 ${
        isExpanded ? 'w-60' : 'w-[72px]'
      }`}
    >
      {/* 1. Window Controls (CleanMyMac X Traffic Lights) */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] shadow-sm hover:opacity-80 cursor-pointer" title="Close" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-sm hover:opacity-80 cursor-pointer" title="Minimize" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] shadow-sm hover:opacity-80 cursor-pointer" title="Expand" />
        </div>
        {isExpanded && (
          <span className="text-[10px] font-mono text-[#02FEDC] px-1.5 py-0.5 rounded bg-[#02FEDC]/10 border border-[#02FEDC]/20">
            v1.0.1
          </span>
        )}
      </div>

      {/* 2. Brand Crest (Compact / Full) */}
      <div className="px-3.5 py-2.5 mb-2 border-b border-white/[0.06] flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F502FD] to-[#02FEDC] p-[2px] shadow-lg shadow-[#F502FD]/20 flex-shrink-0">
          <div className="w-full h-full bg-[#16062A] rounded-[14px] flex items-center justify-center">
            <span className="font-black text-base text-transparent bg-clip-text bg-gradient-to-r from-[#02FEDC] to-[#F502FD]">
              N
            </span>
          </div>
        </div>
        {isExpanded && (
          <div className="min-w-0 flex-1">
            <h1 className="font-extrabold text-sm text-white tracking-wider truncate">
              NEX<span className="text-[#02FEDC]">ORA</span>
            </h1>
            <p className="text-[9px] text-[#C8BEDC] uppercase tracking-wider font-mono">Ultra Care</p>
          </div>
        )}
      </div>

      {/* 3. Iconic Navigation Rail List (CleanMyMac X Signature) */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-2 space-y-1.5 flex flex-col items-center">
        {railItems.map((item) => {
          const Icon = item.icon;
          const isActive = !isAssistantActive && currentSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (isAssistantActive && onToggleAssistant) {
                  onToggleAssistant();
                }
                onSelectSection(item.id);
              }}
              title={!isExpanded ? item.label : undefined}
              className={`w-full flex items-center ${
                isExpanded ? 'justify-start px-3 py-2.5 gap-3' : 'justify-center p-2.5'
              } rounded-2xl transition-all duration-200 relative group ${
                isActive
                  ? 'bg-gradient-to-r from-[#F502FD]/30 via-[#6E56FF]/25 to-white/[0.08] text-white border border-[#F502FD]/45 shadow-[0_4px_20px_rgba(245,2,253,0.25)]'
                  : 'text-[#C8BEDC] hover:bg-white/[0.06] hover:text-white border border-transparent'
              }`}
            >
              {/* Active Left Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#02FEDC] shadow-[0_0_8px_#02FEDC]" />
              )}

              {/* Icon Container with Floating Indicator Pip */}
              <div className="relative flex items-center justify-center flex-shrink-0">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-[#02FEDC]' : 'text-[#A093BC]'
                  }`}
                />

                {/* White / Cyan Notification Pip (CleanMyMac X Rail Pip) */}
                {item.hasPip && !isActive && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                )}
              </div>

              {/* Label for Expanded Mode */}
              {isExpanded && (
                <div className="flex-1 flex items-center justify-between text-left min-w-0">
                  <span className={`text-xs truncate ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#F502FD]/20 text-[#F502FD] border border-[#F502FD]/40 ml-1">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* 4. Bottom Assistant & Rail Toggle Area (CleanMyMac Assistant) */}
      <div className="p-2.5 border-t border-white/[0.08] flex flex-col items-center gap-2">
        {/* Assistant Portal Button with Dual Pips */}
        <button
          onClick={onToggleAssistant}
          title={!isExpanded ? 'System Assistant' : undefined}
          className={`w-full flex items-center ${
            isExpanded ? 'justify-start px-3 py-2.5 gap-3' : 'justify-center p-2.5'
          } rounded-2xl transition-all duration-200 relative group ${
            isAssistantActive
              ? 'bg-gradient-to-r from-[#02FEDC]/30 via-[#6E56FF]/25 to-white/[0.08] text-white border border-[#02FEDC]/50 shadow-[0_4px_20px_rgba(2,254,220,0.3)]'
              : 'text-[#C8BEDC] hover:bg-white/[0.06] hover:text-white border border-transparent'
          }`}
        >
          <div className="relative flex items-center justify-center flex-shrink-0">
            <div className="w-5 h-5 rounded-full border-2 border-[#02FEDC] flex items-center justify-center p-0.5 shadow-[0_0_8px_#02FEDC]">
              <div className="w-2 h-2 rounded-full bg-[#02FEDC] animate-pulse" />
            </div>
            {/* Dual pips */}
            <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#F502FD]" />
          </div>

          {isExpanded && (
            <div className="text-left min-w-0">
              <span className="text-xs font-bold text-white block truncate">Assistant</span>
              <span className="text-[9px] text-[#02FEDC] block font-mono">Live Guidance</span>
            </div>
          )}
        </button>

        {/* Expand / Collapse Rail Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-xl hover:bg-white/10 text-[#8E80A8] hover:text-white transition-all text-xs flex items-center gap-1.5"
          title={isExpanded ? 'Collapse to Icon Rail' : 'Expand Navigation'}
        >
          {isExpanded ? (
            <>
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="text-[10px]">Collapse</span>
            </>
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </aside>
  );
};
