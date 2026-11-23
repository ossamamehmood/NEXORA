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
  Zap,
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

  const cpuPct = metrics ? Math.round(metrics.cpu_usage_pct) : Math.round(overview?.cpu_usage_pct || 0);

  return (
    <div className="p-8 space-y-7 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
      {/* Hero Showcase Centerpiece (CleanMyMac X & Raycast Luxury Style) */}
      <div className="relative rounded-2xl luxury-glass p-8 overflow-hidden shadow-2xl border border-white/[0.08] group">
        {/* Ambient Radial Backlight Glow */}
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-[#02FEDC]/15 via-[#5A5CFF]/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-[#F502FD]/10 via-[#5A5CFF]/5 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#02FEDC]/10 border border-[#02FEDC]/25 text-[#02FEDC] text-xs font-semibold shadow-[0_0_12px_rgba(2,254,220,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#02FEDC] animate-pulse" />
              <span>NEXORA Protection Engine Active</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#F5F7FA] leading-tight">
              Your system. <span className="text-gradient">Under control.</span>
            </h1>
            <p className="text-sm text-[#8E95A8] leading-relaxed">
              Safe, transparent, and non-destructive Windows performance. Built in native Rust with zero background battery drain, zero registry tampering, and 100% user control.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={onNavigateToCleaner}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl gradient-brand text-[#08090D] font-extrabold text-sm shadow-xl shadow-[#02FEDC]/25 hover:shadow-[#02FEDC]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-5 h-5 text-[#08090D] group-hover:rotate-12 transition-transform" />
                <span>Start Smart Scan</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateToSection('gaming')}
                className="inline-flex items-center gap-2 px-5 py-4 rounded-xl bg-[#141824] hover:bg-[#1B2132] border border-[#232A3D] text-[#E2E8F0] font-semibold text-sm transition-all hover:border-[#02FEDC]/40"
              >
                <Gamepad2 className="w-4 h-4 text-[#02FEDC]" />
                <span>Gaming Mode</span>
              </button>
            </div>
          </div>

          {/* Interactive Circular Radial System Arc Gauge */}
          <div className="relative flex items-center justify-center p-4">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="78"
                stroke="#171C2B"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="96"
                cy="96"
                r="78"
                stroke="url(#arcGradient)"
                strokeWidth="10"
                strokeDasharray="490"
                strokeDashoffset={490 - (490 * Math.max(15, 100 - cpuPct)) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#02FEDC" />
                  <stop offset="50%" stopColor="#5A5CFF" />
                  <stop offset="100%" stopColor="#F502FD" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Ring Stats */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E95A8]">Health State</span>
              <span className="text-2xl font-black text-[#F5F7FA] font-mono tracking-tight mt-0.5">OPTIMAL</span>
              <span className="text-[10px] text-[#00E699] font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E699] animate-pulse" />
                Clean & Tuned
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Hardware Telemetry Cards (Luxury Glassmorphic 4-Column Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* CPU Card */}
        <div className="luxury-card p-5 rounded-2xl border border-white/[0.06] space-y-3.5 group">
          <div className="flex items-center justify-between text-xs text-[#8E95A8]">
            <span className="flex items-center gap-2 font-medium">
              <Cpu className="w-4 h-4 text-[#02FEDC] group-hover:scale-110 transition-transform" />
              Processor (CPU)
            </span>
            <span className="font-mono text-[#02FEDC] font-bold text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#02FEDC] animate-pulse" />
              {cpuPct}%
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#F5F7FA] truncate" title={overview?.cpu_model}>
              {overview?.cpu_model || 'Detecting Processor...'}
            </p>
            <p className="text-xs text-[#71788E]">{overview?.cpu_cores || 8} Logical Cores &bull; Win32 Kernel</p>
          </div>
          <div className="w-full h-1.5 bg-[#171C2B] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#02FEDC] to-[#5A5CFF] transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, Math.max(5, cpuPct))}%` }}
            />
          </div>
        </div>

        {/* Memory Card */}
        <div className="luxury-card p-5 rounded-2xl border border-white/[0.06] space-y-3.5 group">
          <div className="flex items-center justify-between text-xs text-[#8E95A8]">
            <span className="flex items-center gap-2 font-medium">
              <HardDrive className="w-4 h-4 text-[#5A5CFF] group-hover:scale-110 transition-transform" />
              Memory (RAM)
            </span>
            <span className="font-mono text-[#5A5CFF] font-bold text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5A5CFF] animate-pulse" />
              {ramUsedPct}%
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#F5F7FA]">
              {formatBytes(metrics?.used_memory_bytes || overview?.used_memory_bytes || 0)}
              <span className="text-xs text-[#71788E] font-normal"> / {formatBytes(overview?.total_memory_bytes || 0)}</span>
            </p>
            <p className="text-xs text-[#71788E]">
              {overview ? `${formatBytes(overview.total_memory_bytes - (metrics?.used_memory_bytes || overview.used_memory_bytes))} Available Headroom` : 'Calculating...'}
            </p>
          </div>
          <div className="w-full h-1.5 bg-[#171C2B] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#5A5CFF] to-[#F502FD] transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, Math.max(5, ramUsedPct))}%` }}
            />
          </div>
        </div>

        {/* System Storage Card */}
        <div className="luxury-card p-5 rounded-2xl border border-white/[0.06] space-y-3.5 group">
          <div className="flex items-center justify-between text-xs text-[#8E95A8]">
            <span className="flex items-center gap-2 font-medium">
              <Server className="w-4 h-4 text-[#00E699] group-hover:scale-110 transition-transform" />
              Primary Drive ({primaryDrive?.mount_point || 'C:'})
            </span>
            <span className="font-mono text-[#00E699] font-bold text-xs">{diskUsedPct}%</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#F5F7FA]">
              {primaryDrive ? formatBytes(primaryDrive.total_bytes - primaryDrive.available_bytes) : '0 GB'}
              <span className="text-xs text-[#71788E] font-normal"> / {primaryDrive ? formatBytes(primaryDrive.total_bytes) : '0 GB'}</span>
            </p>
            <p className="text-xs text-[#71788E]">
              {primaryDrive ? `${formatBytes(primaryDrive.available_bytes)} Free Space` : 'Examining Drive...'}
            </p>
          </div>
          <div className="w-full h-1.5 bg-[#171C2B] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00E699] to-[#02FEDC] transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, Math.max(5, diskUsedPct))}%` }}
            />
          </div>
        </div>

        {/* System Uptime Card */}
        <div className="luxury-card p-5 rounded-2xl border border-white/[0.06] space-y-3.5 group">
          <div className="flex items-center justify-between text-xs text-[#8E95A8]">
            <span className="flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4 text-[#FFB800] group-hover:scale-110 transition-transform" />
              System Uptime
            </span>
            <span className="font-mono text-[#8E95A8] text-xs">{overview?.os_name || 'Windows'}</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#F5F7FA]">
              {overview ? formatUptime(overview.uptime_seconds) : '0h 0m'}
            </p>
            <p className="text-xs text-[#71788E] truncate" title={overview?.computer_name}>
              {overview ? `${overview.computer_name}` : 'PC Telemetry'}
            </p>
          </div>
          <div className="w-full h-1.5 bg-[#171C2B] rounded-full overflow-hidden">
            <div className="h-full bg-[#FFB800] w-full opacity-60 rounded-full" />
          </div>
        </div>
      </div>

      {/* Quick Action Modules & Storage Partition Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Partition Storage Health */}
        <div className="lg:col-span-2 p-6 rounded-2xl luxury-card border border-white/[0.06] space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#F5F7FA]">Storage Health & Capacity</h3>
              <p className="text-xs text-[#8E95A8]">Verified volume allocation across local partitions</p>
            </div>
            <button
              onClick={() => onNavigateToSection('disk-analyzer')}
              className="text-xs text-[#02FEDC] hover:underline flex items-center gap-1 font-semibold"
            >
              Interactive Treemap <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {overview?.drives.map((drive) => {
              const used = drive.total_bytes - drive.available_bytes;
              const pct = Math.round((used / drive.total_bytes) * 100);
              return (
                <div key={drive.mount_point} className="p-4 rounded-xl bg-[#141824]/60 border border-[#232A3D] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#F5F7FA] flex items-center gap-2">
                      {drive.name || 'Local Partition'} ({drive.mount_point})
                      <span className="text-[10px] text-[#02FEDC] font-mono px-2 py-0.5 rounded bg-[#02FEDC]/10 border border-[#02FEDC]/20">
                        {drive.file_system}
                      </span>
                    </span>
                    <span className="text-[#8E95A8] font-mono">
                      {formatBytes(used)} / {formatBytes(drive.total_bytes)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#0E121B] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct > 85 ? 'bg-gradient-to-r from-[#FF4757] to-[#F502FD]' : pct > 70 ? 'bg-gradient-to-r from-[#FFB800] to-[#FF4757]' : 'bg-gradient-to-r from-[#02FEDC] to-[#5A5CFF]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Navigation Tiles */}
        <div className="p-6 rounded-2xl luxury-card border border-white/[0.06] space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#F5F7FA]">Quick Maintenance</h3>
            <p className="text-xs text-[#8E95A8]">One-click navigation to core tools</p>
          </div>

          <div className="space-y-2.5">
            <div
              className="p-3 rounded-xl bg-[#141824]/60 hover:bg-[#1A2030] border border-[#232A3D] hover:border-[#02FEDC]/40 transition-all cursor-pointer flex items-center justify-between group"
              onClick={onNavigateToCleaner}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#02FEDC]/10 border border-[#02FEDC]/20 flex items-center justify-center text-[#02FEDC]">
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F5F7FA]">Smart Cache Cleaner</h4>
                  <p className="text-[11px] text-[#71788E]">Reclaim gigabytes of app junk</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#71788E] group-hover:translate-x-1 group-hover:text-[#02FEDC] transition-all" />
            </div>

            <div
              className="p-3 rounded-xl bg-[#141824]/60 hover:bg-[#1A2030] border border-[#232A3D] hover:border-[#5A5CFF]/40 transition-all cursor-pointer flex items-center justify-between group"
              onClick={() => onNavigateToSection('privacy')}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#5A5CFF]/10 border border-[#5A5CFF]/20 flex items-center justify-center text-[#5A5CFF]">
                  <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F5F7FA]">Privacy Center</h4>
                  <p className="text-[11px] text-[#71788E]">Clear tracking & browser tokens</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#71788E] group-hover:translate-x-1 group-hover:text-[#5A5CFF] transition-all" />
            </div>

            <div
              className="p-3 rounded-xl bg-[#141824]/60 hover:bg-[#1A2030] border border-[#232A3D] hover:border-[#02FEDC]/40 transition-all cursor-pointer flex items-center justify-between group"
              onClick={() => onNavigateToSection('gaming')}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#02FEDC]/10 border border-[#02FEDC]/20 flex items-center justify-center text-[#02FEDC]">
                  <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F5F7FA]">Gaming Accelerator</h4>
                  <p className="text-[11px] text-[#71788E]">Thread tuning & latency reduction</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#71788E] group-hover:translate-x-1 group-hover:text-[#02FEDC] transition-all" />
            </div>

            <div
              className="p-3 rounded-xl bg-[#141824]/60 hover:bg-[#1A2030] border border-[#232A3D] hover:border-[#FFB800]/40 transition-all cursor-pointer flex items-center justify-between group"
              onClick={() => onNavigateToSection('startup')}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFB800]/10 border border-[#FFB800]/20 flex items-center justify-center text-[#FFB800]">
                  <Clock className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F5F7FA]">Startup Manager</h4>
                  <p className="text-[11px] text-[#71788E]">Disable slow boot applications</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#71788E] group-hover:translate-x-1 group-hover:text-[#FFB800] transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
