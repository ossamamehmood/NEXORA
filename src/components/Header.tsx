import React from 'react';
import { Cpu, HardDrive, RefreshCw } from 'lucide-react';
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
  startup: { title: 'Startup Manager', subtitle: 'Manage background applications that launch with Windows' },
  'disk-analyzer': { title: 'Disk Analyzer', subtitle: 'Interactive folder hierarchy and storage consumption' },
  duplicates: { title: 'Duplicate Finder', subtitle: 'Cryptographic SHA-256 duplicate file detection' },
  applications: { title: 'Application Manager', subtitle: 'Installed software inventory and uninstaller interface' },
  diagnostics: { title: 'System Diagnostics', subtitle: 'Operating system health checks and error inspection' },
  maintenance: { title: 'Maintenance Center', subtitle: 'Actionable, non-destructive tuning recommendations' },
  history: { title: 'Activity History', subtitle: 'Audit log of past scans, cleanups, and quarantine items' },
  settings: { title: 'Application Settings', subtitle: 'Configure safety thresholds, quarantine, and appearance' },
};

export const Header: React.FC<HeaderProps> = ({ currentSection, metrics, onQuickRefresh, isRefreshing }) => {
  const sectionMeta = titles[currentSection] || { title: 'NEXORA', subtitle: 'Your system. Under control.' };

  const memoryPct = metrics
    ? Math.round((metrics.used_memory_bytes / metrics.total_memory_bytes) * 100)
    : 0;

  return (
    <header className="h-16 bg-[#08090D] border-b border-[#1D2230] px-6 flex items-center justify-between select-none">
      <div>
        <h2 className="text-sm font-semibold text-[#F5F7FA]">{sectionMeta.title}</h2>
        <p className="text-[11px] text-[#969BAA]">{sectionMeta.subtitle}</p>
      </div>

      <div className="flex items-center gap-5">
        {/* Real-time Telemetry Pill */}
        {metrics && (
          <div className="flex items-center gap-4 bg-[#11131A] border border-[#232838] px-3.5 py-1.5 rounded-full text-xs">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#02FEDC]" />
              <span className="text-[#969BAA]">CPU:</span>
              <span className="font-mono text-[#F5F7FA] font-medium">{Math.round(metrics.cpu_usage_pct)}%</span>
            </div>
            <div className="w-[1px] h-3 bg-[#232838]" />
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-[#5A5CFF]" />
              <span className="text-[#969BAA]">RAM:</span>
              <span className="font-mono text-[#F5F7FA] font-medium">{memoryPct}%</span>
            </div>
          </div>
        )}

        {/* Refresh Action */}
        <button
          onClick={onQuickRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-lg bg-[#11131A] hover:bg-[#171A23] text-[#969BAA] hover:text-[#F5F7FA] border border-[#232838] transition-all"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#02FEDC]' : ''}`} />
        </button>
      </div>
    </header>
  );
};
