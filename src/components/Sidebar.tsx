import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Layers,
  ShieldCheck,
  Activity,
  Gamepad2,
  Rocket,
  PieChart,
  Copy,
  Boxes,
  Stethoscope,
  Wrench,
  History,
  MessageSquareQuote,
  Settings,
} from 'lucide-react';
import { NavigationSection } from '../types';

interface SidebarProps {
  currentSection: NavigationSection;
  onSelectSection: (section: NavigationSection) => void;
}

interface NavCategory {
  title: string;
  items: {
    id: NavigationSection;
    label: string;
    icon: React.ElementType;
    isBeta?: boolean;
    badge?: string;
  }[];
}

const navCategories: NavCategory[] = [
  {
    title: 'Core Engine',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'monitor', label: 'System Monitor', icon: Activity },
      { id: 'gaming', label: 'Gaming Mode', icon: Gamepad2, badge: 'Pro' },
    ],
  },
  {
    title: 'Cleaning & Privacy',
    items: [
      { id: 'cleaner', label: 'Smart Cleaner', icon: Sparkles },
      { id: 'deep-cleaner', label: 'Deep Cleaner', icon: Layers },
      { id: 'privacy', label: 'Privacy Center', icon: ShieldCheck },
    ],
  },
  {
    title: 'System Tools',
    items: [
      { id: 'startup', label: 'Startup Manager', icon: Rocket },
      { id: 'disk-analyzer', label: 'Disk Analyzer', icon: PieChart },
      { id: 'duplicates', label: 'Duplicate Finder', icon: Copy },
      { id: 'applications', label: 'Applications', icon: Boxes },
    ],
  },
  {
    title: 'Maintenance',
    items: [
      { id: 'diagnostics', label: 'Diagnostics', icon: Stethoscope },
      { id: 'maintenance', label: 'Maintenance Center', icon: Wrench },
      { id: 'history', label: 'Activity History', icon: History },
    ],
  },
  {
    title: 'Application',
    items: [
      { id: 'feedback', label: 'Beta Feedback', icon: MessageSquareQuote, isBeta: true },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentSection, onSelectSection }) => {
  return (
    <aside className="w-64 bg-gradient-to-b from-[#180A2E] via-[#120624] to-[#0B0418] border-r border-white/[0.08] flex flex-col h-full select-none shadow-2xl relative z-20">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-white/[0.08] bg-white/[0.02]">
        <div className="relative group">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center p-0.5 shadow-lg shadow-[#F502FD]/20 transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#1A0B33] rounded-[10px] flex items-center justify-center">
              <span className="font-black text-base text-gradient">N</span>
            </div>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00E699] ring-2 ring-[#120624] shadow-[0_0_8px_#00E699]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-base tracking-wider text-white">
              NEX<span className="text-gradient">ORA</span>
            </h1>
            <span className="px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest uppercase bg-[#02FEDC]/15 text-[#02FEDC] border border-[#02FEDC]/30 shadow-[0_0_10px_rgba(2,254,220,0.2)]">
              v1.0.1
            </span>
          </div>
          <p className="text-[10px] tracking-wider text-[#C8BEDC] uppercase font-medium truncate">System Under Control</p>
        </div>
      </div>

      {/* Categorized Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3.5 space-y-4">
        {navCategories.map((category) => (
          <div key={category.title} className="space-y-1">
            <h2 className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#8E80A8]">
              {category.title}
            </h2>
            <div className="space-y-0.5">
              {category.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectSection(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 relative group ${
                      isActive
                        ? 'bg-gradient-to-r from-[#F502FD]/20 via-[#6E56FF]/15 to-transparent text-white border border-[#F502FD]/35 shadow-[0_4px_20px_rgba(245,2,253,0.12)]'
                        : 'text-[#C8BEDC] hover:bg-white/[0.04] hover:text-white border border-transparent'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-[#02FEDC] via-[#6E56FF] to-[#F502FD] shadow-[0_0_12px_#F502FD]" />
                    )}
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-[#02FEDC]' : 'text-[#8E80A8]'}`} />
                      <span className={isActive ? 'font-semibold text-white' : ''}>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-gradient-to-r from-[#02FEDC]/20 to-[#6E56FF]/20 text-[#02FEDC] border border-[#02FEDC]/30">
                        {item.badge}
                      </span>
                    )}
                    {item.isBeta && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-[#6E56FF]/20 text-[#6E56FF] border border-[#6E56FF]/30">
                        Beta
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer System Status Banner */}
      <div className="p-3.5 m-3 rounded-xl bg-gradient-to-b from-[#240F44] to-[#140626] border border-white/[0.08] space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 font-semibold text-[#00E699]">
            <span className="w-2 h-2 rounded-full bg-[#00E699] animate-pulse shadow-[0_0_8px_#00E699]" />
            Native Rust Core
          </span>
          <span className="font-mono text-[9px] text-[#02FEDC] px-1.5 py-0.2 rounded bg-[#02FEDC]/10 border border-[#02FEDC]/20">Active</span>
        </div>
        <p className="text-[10px] text-[#C8BEDC] leading-tight">
          Zero background daemons. Zero telemetry battery drain.
        </p>
      </div>
    </aside>
  );
};
