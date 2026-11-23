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
    <aside className="w-64 bg-[#0B0D13] border-r border-[#1D2230] flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-[#1D2230]/70">
        <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center p-0.5 shadow-lg shadow-[#02FEDC]/15">
          <div className="w-full h-full bg-[#08090D] rounded-[10px] flex items-center justify-center">
            <span className="font-black text-sm text-gradient">N</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-base tracking-wider text-[#F5F7FA]">
              NEX<span className="text-gradient">ORA</span>
            </h1>
            <span className="px-1.5 py-0.2 rounded text-[8px] font-black tracking-widest uppercase bg-[#02FEDC]/20 text-[#02FEDC] border border-[#02FEDC]/40">
              v1.0.0
            </span>
          </div>
          <p className="text-[10px] tracking-wider text-[#969BAA] uppercase font-medium">Your system. Under control.</p>
        </div>
      </div>

      {/* Categorized Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navCategories.map((category) => (
          <div key={category.title} className="space-y-1">
            <h2 className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#656C80]">
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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 relative ${
                      isActive
                        ? 'bg-[#171A24] text-[#F5F7FA] border border-[#2B3245] shadow-sm'
                        : 'text-[#969BAA] hover:bg-[#12151E] hover:text-[#E2E8F0] border border-transparent'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-gradient-to-b from-[#02FEDC] via-[#5A5CFF] to-[#F502FD]" />
                    )}
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#02FEDC]' : 'text-[#656C80]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-[#02FEDC]/15 text-[#02FEDC] border border-[#02FEDC]/30">
                        {item.badge}
                      </span>
                    )}
                    {item.isBeta && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-[#5A5CFF]/20 text-[#5A5CFF] border border-[#5A5CFF]/30">
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

      {/* Footer Status */}
      <div className="p-4 border-t border-[#1D2230] bg-[#08090D]/50">
        <div className="flex items-center justify-between text-[11px] text-[#969BAA]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00E699] animate-pulse"></span>
            System Protected
          </span>
          <span className="font-mono text-[10px] text-[#656C80]">Windows 64-bit</span>
        </div>
      </div>
    </aside>
  );
};
