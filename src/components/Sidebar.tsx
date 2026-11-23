import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Layers,
  ShieldCheck,
  Activity,
  Rocket,
  PieChart,
  Copy,
  Boxes,
  Stethoscope,
  Wrench,
  History,
  Settings,
} from 'lucide-react';
import { NavigationSection } from '../types';

interface SidebarProps {
  currentSection: NavigationSection;
  onSelectSection: (section: NavigationSection) => void;
}

const navItems: { id: NavigationSection; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'cleaner', label: 'Smart Cleaner', icon: Sparkles },
  { id: 'deep-cleaner', label: 'Deep Cleaner', icon: Layers },
  { id: 'privacy', label: 'Privacy Center', icon: ShieldCheck },
  { id: 'monitor', label: 'System Monitor', icon: Activity },
  { id: 'startup', label: 'Startup Manager', icon: Rocket },
  { id: 'disk-analyzer', label: 'Disk Analyzer', icon: PieChart },
  { id: 'duplicates', label: 'Duplicate Finder', icon: Copy },
  { id: 'applications', label: 'Applications', icon: Boxes },
  { id: 'diagnostics', label: 'Diagnostics', icon: Stethoscope },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'history', label: 'Activity History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentSection, onSelectSection }) => {
  return (
    <aside className="w-64 bg-[#0B0D13] border-r border-[#1D2230] flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-[#1D2230]/70">
        <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center p-0.5 shadow-lg shadow-[#02FEDC]/10">
          <div className="w-full h-full bg-[#08090D] rounded-[10px] flex items-center justify-center">
            <span className="font-black text-sm text-gradient">N</span>
          </div>
        </div>
        <div>
          <h1 className="font-bold text-base tracking-wider text-[#F5F7FA]">
            NEX<span className="text-gradient">ORA</span>
          </h1>
          <p className="text-[10px] tracking-wider text-[#969BAA] uppercase font-medium">Under Control</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#171A23] text-[#F5F7FA] border border-[#2B3245] shadow-sm relative'
                  : 'text-[#969BAA] hover:bg-[#12151D] hover:text-[#E2E8F0]'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-gradient-to-b from-[#02FEDC] via-[#5A5CFF] to-[#F502FD]" />
              )}
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#02FEDC]' : 'text-[#656C80]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Status */}
      <div className="p-4 border-t border-[#1D2230] bg-[#08090D]/50">
        <div className="flex items-center justify-between text-[11px] text-[#969BAA]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00E699] animate-pulse"></span>
            System Protected
          </span>
          <span className="font-mono text-[10px] text-[#656C80]">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
};
