import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, RefreshCw, Sun, Moon, ShieldCheck } from 'lucide-react';
import { NavigationSection, RealtimeMetrics } from '../types';

interface HeaderProps {
  currentSection: NavigationSection;
  metrics: RealtimeMetrics | null;
  onQuickRefresh: () => void;
  isRefreshing: boolean;
}

const titles: Record<NavigationSection, { title: string; subtitle: string }> = {
  overview: { title: 'System Overview', subtitle: 'Hardware telemetry, storage, and health status' },
  cleaner: { title: 'Smart Cleaner', subtitle: 'Automated scan and verified junk cache removal' },
  'deep-cleaner': { title: 'Deep Cleaner', subtitle: 'Granular application and developer cache rules' },
  privacy: { title: 'Privacy Center', subtitle: 'Browser history, temporary tokens, and activity traces' },
  monitor: { title: 'System Monitor', subtitle: 'Live processes, CPU usage, and resource consumption' },
  gaming: { title: 'Gaming Mode & System Performance', subtitle: 'Dynamic process scheduling, power scheme optimization, and latency reduction' },
  startup: { title: 'Startup Manager', subtitle: 'Manage background applications that launch with Windows' },
  'disk-analyzer': { title: 'Disk Analyzer', subtitle: 'Interactive folder hierarchy and storage consumption' },
  duplicates: { title: 'Duplicate Finder', subtitle: 'Cryptographic SHA-256 duplicate file detection' },
  applications: { title: 'Application Manager', subtitle: 'Installed software inventory and uninstaller interface' },
  diagnostics: { title: 'System Diagnostics', subtitle: 'Operating system health checks and error inspection' },
  maintenance: { title: 'Maintenance Center', subtitle: 'Actionable, non-destructive tuning recommendations' },
  history: { title: 'Activity History', subtitle: 'Audit log of past scans, cleanups, and quarantine items' },
  feedback: { title: 'Closed Beta Feedback & Telemetry Vault', subtitle: 'Report anomalies, suggest enhancements, and view feedback audit trail' },
  settings: { title: 'Application Settings', subtitle: 'Configure safety thresholds, quarantine, and appearance' },
};

export const Header: React.FC<HeaderProps> = ({ currentSection, metrics, onQuickRefresh, isRefreshing }) => {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    setIsLightMode(document.documentElement.classList.contains('light'));
  }, []);

  const toggleTheme = () => {
    if (isLightMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      setIsLightMode(false);
      localStorage.setItem('nexora-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      setIsLightMode(true);
      localStorage.setItem('nexora-theme', 'light');
    }
  };

  const sectionMeta = titles[currentSection] || { title: 'NEXORA', subtitle: 'Your system. Under control.' };

  const memoryPct = metrics
    ? Math.round((metrics.used_memory_bytes / metrics.total_memory_bytes) * 100)
    : 0;

  return (
    <header className="h-16 bg-[#090c13]/80 backdrop-blur-xl border-b border-[#1D2230]/70 px-6 flex items-center justify-between select-none z-10 relative">
      <div className="space-y-0.5">
        <h2 className="text-sm font-bold text-[#F5F7FA] tracking-tight">{sectionMeta.title}</h2>
        <p className="text-[11px] text-[#868D9F]">{sectionMeta.subtitle}</p>
      </div>

      <div className="flex items-center gap-3.5">
        {/* Real-time Telemetry Capsule */}
        {metrics && (
          <div className="flex items-center gap-3.5 bg-gradient-to-r from-[#111522] to-[#0e121c] border border-[#232A3D] px-4 py-1.5 rounded-full text-xs shadow-inner">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#02FEDC] shadow-[0_0_6px_#02FEDC]" />
              <Cpu className="w-3.5 h-3.5 text-[#02FEDC]" />
              <span className="text-[#868D9F] font-medium text-[11px]">CPU</span>
              <span className="font-mono text-[#F5F7FA] font-bold text-xs">{Math.round(metrics.cpu_usage_pct)}%</span>
            </div>
            <div className="w-[1px] h-3 bg-[#232A3D]" />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5A5CFF] shadow-[0_0_6px_#5A5CFF]" />
              <HardDrive className="w-3.5 h-3.5 text-[#5A5CFF]" />
              <span className="text-[#868D9F] font-medium text-[11px]">RAM</span>
              <span className="font-mono text-[#F5F7FA] font-bold text-xs">{memoryPct}%</span>
            </div>
          </div>
        )}

        {/* Protection Shield Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00E699]/10 border border-[#00E699]/25 text-[11px] font-semibold text-[#00E699] shadow-[0_0_12px_rgba(0,230,153,0.15)]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00E699]" />
          <span>Shield Active</span>
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-[#111522] hover:bg-[#181D2E] text-[#969BAA] hover:text-[#F5F7FA] border border-[#232A3D] transition-all hover:scale-105 active:scale-95 shadow-sm"
          title={isLightMode ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
          aria-label="Toggle theme"
        >
          {isLightMode ? <Moon className="w-4 h-4 text-[#5A5CFF]" /> : <Sun className="w-4 h-4 text-[#02FEDC]" />}
        </button>

        {/* Refresh Action */}
        <button
          onClick={onQuickRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-xl bg-[#111522] hover:bg-[#181D2E] text-[#969BAA] hover:text-[#F5F7FA] border border-[#232A3D] transition-all hover:scale-105 active:scale-95 shadow-sm"
          title="Refresh Telemetry"
          aria-label="Refresh telemetry"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#02FEDC]' : ''}`} />
        </button>
      </div>
    </header>
  );
};
