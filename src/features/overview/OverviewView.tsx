import React from 'react';
import {
  Sparkles,
  Cpu,
  HardDrive,
  Clock,
  ShieldCheck,
  Server,
  ArrowRight,
  ChevronRight,
  Gamepad2,
} from 'lucide-react';
import { RealtimeMetrics, SystemOverview } from '../../types';

interface OverviewViewProps {
  overview: SystemOverview | null;
  metrics: RealtimeMetrics | null;
  onNavigateToCleaner: () => void;
  onNavigateToSection: (section: any) => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  return `${hours}h ${minutes}m`;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  overview,
  metrics,
  onNavigateToCleaner,
  onNavigateToSection,
}) => {
  const primaryDrive = overview?.drives[0];
  const diskUsedPct = primaryDrive
    ? Math.round(((primaryDrive.total_bytes - primaryDrive.available_bytes) / primaryDrive.total_bytes) * 100)
    : 0;

  const ramUsedPct = metrics
    ? Math.round((metrics.used_memory_bytes / metrics.total_memory_bytes) * 100)
    : overview
    ? Math.round((overview.used_memory_bytes / overview.total_memory_bytes) * 100)
    : 0;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
      {/* Hero Banner with Primary Smart Scan Action */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#0E1119] via-[#141824] to-[#171A26] border border-[#232838] p-8 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#02FEDC]/10 via-[#5A5CFF]/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#02FEDC]/10 border border-[#02FEDC]/20 text-[#02FEDC] text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>NEXORA Protection Engine Active</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#F5F7FA]">
              Keep your PC fast, clean, and private.
            </h1>
            <p className="text-sm text-[#969BAA] leading-relaxed">
              Safe, transparent, and non-destructive maintenance. Zero registry bloatware, zero background battery drain, 100% user control.
            </p>
          </div>

          <button
            onClick={onNavigateToCleaner}
            className="group relative inline-flex items-center gap-3 px-7 py-4 rounded-xl gradient-brand text-[#08090D] font-bold text-sm shadow-xl shadow-[#02FEDC]/20 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-5 h-5 text-[#08090D] animate-bounce" />
            <span>Start Smart Scan</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Real-time Hardware Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* CPU Card */}
        <div className="p-5 rounded-xl bg-[#11131A] border border-[#232838] space-y-3">
          <div className="flex items-center justify-between text-xs text-[#969BAA]">
            <span className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#02FEDC]" />
              Processor
            </span>
            <span className="font-mono text-[#02FEDC] font-semibold">
              {metrics ? Math.round(metrics.cpu_usage_pct) : Math.round(overview?.cpu_usage_pct || 0)}%
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-[#F5F7FA] truncate">
              {overview?.cpu_model || 'Detecting Processor...'}
            </p>
            <p className="text-xs text-[#969BAA]">{overview?.cpu_cores || 8} Logical Cores</p>
          </div>
          <div className="w-full h-1.5 bg-[#171A23] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#02FEDC] to-[#5A5CFF] transition-all duration-300"
              style={{ width: `${metrics ? metrics.cpu_usage_pct : overview?.cpu_usage_pct || 0}%` }}
            />
          </div>
        </div>

        {/* Memory Card */}
        <div className="p-5 rounded-xl bg-[#11131A] border border-[#232838] space-y-3">
          <div className="flex items-center justify-between text-xs text-[#969BAA]">
            <span className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#5A5CFF]" />
              Memory (RAM)
            </span>
            <span className="font-mono text-[#5A5CFF] font-semibold">{ramUsedPct}%</span>
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-[#F5F7FA]">
              {formatBytes(metrics?.used_memory_bytes || overview?.used_memory_bytes || 0)}
              <span className="text-xs text-[#969BAA] font-normal"> / {formatBytes(overview?.total_memory_bytes || 0)}</span>
            </p>
            <p className="text-xs text-[#969BAA]">
              {overview ? `${formatBytes(overview.total_memory_bytes - (metrics?.used_memory_bytes || overview.used_memory_bytes))} Available` : 'Calculating...'}
            </p>
          </div>
          <div className="w-full h-1.5 bg-[#171A23] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#5A5CFF] to-[#F502FD] transition-all duration-300"
              style={{ width: `${ramUsedPct}%` }}
            />
          </div>
        </div>

        {/* System Storage Card */}
        <div className="p-5 rounded-xl bg-[#11131A] border border-[#232838] space-y-3">
          <div className="flex items-center justify-between text-xs text-[#969BAA]">
            <span className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#00E699]" />
              System Disk ({primaryDrive?.mount_point || 'C:'})
            </span>
            <span className="font-mono text-[#00E699] font-semibold">{diskUsedPct}%</span>
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-[#F5F7FA]">
              {primaryDrive ? formatBytes(primaryDrive.total_bytes - primaryDrive.available_bytes) : '0 GB'}
              <span className="text-xs text-[#969BAA] font-normal"> / {primaryDrive ? formatBytes(primaryDrive.total_bytes) : '0 GB'}</span>
            </p>
            <p className="text-xs text-[#969BAA]">
              {primaryDrive ? `${formatBytes(primaryDrive.available_bytes)} Free Space` : 'Examining Drive...'}
            </p>
          </div>
          <div className="w-full h-1.5 bg-[#171A23] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00E699] to-[#02FEDC] transition-all duration-300"
              style={{ width: `${diskUsedPct}%` }}
            />
          </div>
        </div>

        {/* System Health / Uptime Card */}
        <div className="p-5 rounded-xl bg-[#11131A] border border-[#232838] space-y-3">
          <div className="flex items-center justify-between text-xs text-[#969BAA]">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FFB800]" />
              System Uptime
            </span>
            <span className="font-mono text-[#969BAA]">{overview?.os_name || 'Windows'}</span>
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-[#F5F7FA]">
              {overview ? formatUptime(overview.uptime_seconds) : '0h 0m'}
            </p>
            <p className="text-xs text-[#969BAA] truncate">
              {overview ? `${overview.computer_name} (${overview.os_version})` : 'PC Telemetry'}
            </p>
          </div>
          <div className="w-full h-1.5 bg-[#171A23] rounded-full overflow-hidden">
            <div className="h-full bg-[#FFB800] w-full opacity-60" />
          </div>
        </div>
      </div>

      {/* Quick Action Modules & Transparent Health Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Drive Storage Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-[#11131A] border border-[#232838] space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#F5F7FA]">Storage Health & Capacity</h3>
              <p className="text-xs text-[#969BAA]">Verified partition metrics across local drives</p>
            </div>
            <button
              onClick={() => onNavigateToSection('disk-analyzer')}
              className="text-xs text-[#02FEDC] hover:underline flex items-center gap-1 font-medium"
            >
              Analyze Disks <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {overview?.drives.map((drive) => {
              const used = drive.total_bytes - drive.available_bytes;
              const pct = Math.round((used / drive.total_bytes) * 100);
              return (
                <div key={drive.mount_point} className="p-4 rounded-lg bg-[#171A23] border border-[#232838] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#F5F7FA]">
                      {drive.name || 'Local Disk'} ({drive.mount_point})
                      <span className="ml-2 text-[10px] text-[#969BAA] font-mono px-1.5 py-0.5 rounded bg-[#11131A]">
                        {drive.file_system}
                      </span>
                    </span>
                    <span className="text-[#969BAA]">
                      {formatBytes(used)} used of {formatBytes(drive.total_bytes)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#11131A] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        pct > 85 ? 'bg-[#FF4757]' : pct > 70 ? 'bg-[#FFB800]' : 'bg-[#02FEDC]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Maintenance Recommendations */}
        <div className="p-6 rounded-xl bg-[#11131A] border border-[#232838] space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-[#F5F7FA]">System Integrity Tips</h3>
            <p className="text-xs text-[#969BAA]">Objective, non-alarmist observations</p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-[#171A23] border border-[#232838] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-medium text-[#02FEDC]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Temporary Cache Build-Up</span>
              </div>
              <p className="text-xs text-[#969BAA] leading-relaxed">
                Applications generate temporary logs and cache during daily workflows that can be safely reclaimed.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#171A23] border border-[#232838] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-medium text-[#5A5CFF]">
                <Cpu className="w-3.5 h-3.5" />
                <span>Startup Impact</span>
              </div>
              <p className="text-xs text-[#969BAA] leading-relaxed">
                Review applications running silently in the background when Windows boots up to save RAM.
              </p>
            </div>

            <div
              className="p-3.5 rounded-lg bg-[#171A23] border border-[#232838] space-y-1.5 cursor-pointer hover:border-[#02FEDC]/40 transition-colors"
              onClick={() => onNavigateToSection('gaming')}
            >
              <div className="flex items-center justify-between text-xs font-medium text-[#02FEDC]">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Gaming Mode Ready</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#969BAA]" />
              </div>
              <p className="text-xs text-[#969BAA] leading-relaxed">
                Reversibly elevate game thread priority and orchestrate high-performance power plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
