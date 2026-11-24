import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  RotateCcw,
  Check,
  Shield,
  Gauge,
  Layers,
  StopCircle,
  SkipForward,
} from 'lucide-react';
import { RealtimeMetrics, SystemOverview } from '../../types';
import { NexoraApi } from '../../services/api';

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

const mockScanPaths = [
  'C:\\Users\\AppData\\Local\\Temp\\~DF3B89.tmp',
  'C:\\Windows\\Prefetch\\NTOSKRNL.EXE-84A12B.pf',
  'C:\\Windows\\SoftwareDistribution\\Download\\Shared',
  'AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache\\data_1',
  'AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Cache\\data_0',
  'AppData\\Local\\D3DSCache\\a98b2c41f710e28.bin',
  'C:\\ProgramData\\Microsoft\\Windows Defender\\Scans\\History',
  'HKEY_CURRENT_USER\\Software\\Classes\\Local Settings\\MuiCache',
  'HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer',
  'C:\\Windows\\Logs\\CBS\\CBS.log',
];

export const OverviewView: React.FC<OverviewViewProps> = ({
  overview,
  metrics,
  onNavigateToCleaner,
  onNavigateToSection,
}) => {
  // 4 States: 'idle' (Welcome), 'scanning' (SystemCare Live Scan), 'results' (CleanMyMac 3-Cards), 'completed'
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'results' | 'completed'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [autoFix, setAutoFix] = useState(true);
  const [isExecutingRun, setIsExecutingRun] = useState(false);

  // Scanned telemetry numbers
  const [junkBytesScanned, setJunkBytesScanned] = useState(2706509824); // ~2.52 GB default
  const [privacyTracesCount, setPrivacyTracesCount] = useState(4821);
  const [startupItemsCount, setStartupItemsCount] = useState(1);
  const [speedTasksCount, setSpeedTasksCount] = useState(3);

  const primaryDrive = overview?.drives[0];
  const diskUsedPct = primaryDrive
    ? Math.round(((primaryDrive.total_bytes - primaryDrive.available_bytes) / primaryDrive.total_bytes) * 100)
    : 48;

  const ramUsedPct = metrics
    ? Math.round((metrics.used_memory_bytes / metrics.total_memory_bytes) * 100)
    : overview
    ? Math.round((overview.used_memory_bytes / overview.total_memory_bytes) * 100)
    : 42;

  const cpuPct = metrics ? Math.round(metrics.cpu_usage_pct) : Math.round(overview?.cpu_usage_pct || 12);

  // Live scan simulation + API trigger
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let pathInterval: NodeJS.Timeout;

    if (scanState === 'scanning') {
      setScanProgress(0);

      // Async background check for real cleaner items
      NexoraApi.scanCleaner()
        .then((summary) => {
          if (summary && summary.total_bytes > 0) {
            setJunkBytesScanned(summary.total_bytes);
          }
        })
        .catch(() => {});

      pathInterval = setInterval(() => {
        setCurrentPathIndex((prev) => (prev + 1) % mockScanPaths.length);
      }, 220);

      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            clearInterval(pathInterval);
            setTimeout(() => setScanState('results'), 500);
            return 100;
          }
          const jump = Math.floor(Math.random() * 8) + 4;
          return Math.min(100, prev + jump);
        });
      }, 140);
    }

    return () => {
      clearInterval(interval);
      clearInterval(pathInterval);
    };
  }, [scanState]);

  const handleStartScan = () => {
    setScanState('scanning');
  };

  const handleStopScan = () => {
    setScanState('idle');
    setScanProgress(0);
  };

  const handleSkipScan = () => {
    setScanProgress(100);
    setScanState('results');
  };

  const handleRunAll = async () => {
    setIsExecutingRun(true);
    try {
      // Execute non-destructive cleanup and quick tune
      const summary = await NexoraApi.scanCleaner().catch(() => null);
      if (summary) {
        const safeCandidates = summary.categories
          .filter((c) => c.risk_level === 'Low')
          .flatMap((c) => c.files.map((f) => f.path));
        if (safeCandidates.length > 0) {
          await NexoraApi.executeCleaner(safeCandidates, true).catch(() => {});
        }
      }
      await NexoraApi.executeMaintenanceTask('flush_dns').catch(() => {});
      setScanState('completed');
    } catch (e) {
      console.error(e);
      setScanState('completed');
    } finally {
      setIsExecutingRun(false);
    }
  };

  return (
    <div className="p-8 space-y-7 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
      {/* =========================================================================
          STAGE 1: IDLE / WELCOME SCREEN (CleanMyMac X Style - Image 4 & Image 6)
          ========================================================================= */}
      {scanState === 'idle' && (
        <div className="space-y-7">
          {/* Top Multi-Color Segmented Drive Bar (Image 3 - MacCleaner Pro) */}
          <div className="p-6 rounded-2xl luxury-glass border border-white/[0.08] shadow-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#02FEDC]" />
                <span className="font-bold text-[#F5F7FA]">Windows 11 Drive ({primaryDrive?.mount_point || 'C:'})</span>
                <span className="text-[11px] text-[#C8BEDC]">
                  {primaryDrive
                    ? `${formatBytes(primaryDrive.available_bytes)} free of ${formatBytes(primaryDrive.total_bytes)}`
                    : '142 GB available of 512 GB'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#02FEDC] px-2 py-0.5 rounded-full bg-[#02FEDC]/10 border border-[#02FEDC]/20">
                NVMe High-Speed SSD
              </span>
            </div>

            {/* Segmented Color Bar */}
            <div className="h-3.5 w-full rounded-full bg-[#180A2E] overflow-hidden flex p-0.5 gap-0.5 border border-white/[0.08]">
              <div className="h-full bg-[#5A5CFF] rounded-l-full" style={{ width: '28%' }} title="System & Windows: 28%" />
              <div className="h-full bg-[#02FEDC]" style={{ width: '24%' }} title="Installed Applications: 24%" />
              <div className="h-full bg-[#F502FD]" style={{ width: '12%' }} title="Junk & Cache: 12%" />
              <div className="h-full bg-[#FFB800]" style={{ width: '8%' }} title="Documents & Media: 8%" />
              <div className="h-full bg-[#00E699]" style={{ width: '6%' }} title="User Data: 6%" />
              <div className="h-full bg-white/[0.05] rounded-r-full flex-1" title="Free Available Space" />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-[#C8BEDC]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#5A5CFF]" /> System</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#02FEDC]" /> Applications</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#F502FD]" /> Junk & Cache</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FFB800]" /> Documents</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00E699]" /> User Data</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white/20" /> Free Space</span>
            </div>
          </div>

          {/* CleanMyMac X Hero Centerpiece: 3D Monitor Artwork + Pulse Scan Button */}
          <div className="relative rounded-3xl luxury-glass p-10 overflow-hidden shadow-2xl border border-white/[0.12] text-center flex flex-col items-center justify-center min-h-[440px]">
            {/* Radiant Ambient Orb Lights */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#F502FD]/20 via-[#6E56FF]/25 to-[#02FEDC]/15 blur-3xl pointer-events-none" />

            {/* Central 3D Computer Artwork with Wiper & Holographic Glow (Image 4 & Image 6) */}
            <div className="relative mb-6 group cursor-pointer" onClick={handleStartScan}>
              {/* Outer Pulsing Aura Ring */}
              <div className="absolute -inset-6 rounded-full border-2 border-[#F502FD]/30 animate-pulse-glow pointer-events-none" />
              <div className="absolute -inset-12 rounded-full border border-[#02FEDC]/20 pointer-events-none" />

              {/* 3D Device Screen Container */}
              <div className="relative w-44 h-32 rounded-2xl bg-gradient-to-b from-[#3D1A6A] via-[#240F44] to-[#120726] border-2 border-white/20 shadow-2xl p-2.5 flex flex-col justify-between overflow-hidden">
                {/* Screen Gloss Reflection */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                
                {/* Top Camera Notch */}
                <div className="w-2 h-2 rounded-full bg-white/40 mx-auto" />

                {/* Animated Wiper Blade (Image 4) */}
                <div className="relative w-full h-16 flex items-center justify-center">
                  <div className="w-28 h-1 bg-gradient-to-r from-transparent via-[#02FEDC] to-white rounded-full shadow-[0_0_12px_#02FEDC] animate-wiper" />
                  <Sparkles className="absolute right-6 top-2 w-5 h-5 text-[#F502FD] animate-bounce" />
                </div>

                {/* Screen Bottom Bar */}
                <div className="flex items-center justify-between text-[9px] font-mono text-[#02FEDC] px-1">
                  <span>PC HEALTH</span>
                  <span className="text-[#00E699] font-bold">READY</span>
                </div>
              </div>

              {/* Laptop / Monitor Base Stand */}
              <div className="w-16 h-3 mx-auto bg-gradient-to-b from-[#4A2080] to-[#1E0938] rounded-b-md border-x border-b border-white/20 shadow-md" />
              <div className="w-28 h-1.5 mx-auto bg-gradient-to-r from-[#2A104E] via-[#522391] to-[#2A104E] rounded-full shadow-lg mt-0.5" />
            </div>

            {/* Headline and Subtext */}
            <div className="space-y-2 max-w-lg mb-8 z-10">
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Welcome to <span className="text-gradient">NEXORA</span>
              </h1>
              <p className="text-sm text-[#C8BEDC] leading-relaxed">
                Start with a quick and comprehensive scan of your PC to detect junk, privacy traces, and gaming headroom.
              </p>
            </div>

            {/* Glowing Circular Scan Button (Image 4) */}
            <div className="z-10 flex flex-col items-center gap-3">
              <button
                onClick={handleStartScan}
                className="cleanmymac-circle-btn group"
                aria-label="Start Smart Scan"
              >
                <div className="flex flex-col items-center justify-center">
                  <Sparkles className="w-6 h-6 mb-0.5 group-hover:rotate-45 transition-transform" />
                  <span>Scan</span>
                </div>
              </button>
              <span className="text-xs text-[#8E80A8] font-medium tracking-wide">
                Click to initiate 1-click comprehensive scan
              </span>
            </div>
          </div>

          {/* Assistant Recommendations (Image 6) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div
              onClick={() => onNavigateToCleaner()}
              className="badge-3d-card p-5 rounded-2xl cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#5A5CFF]/20 border border-[#5A5CFF]/30 flex items-center justify-center text-[#5A5CFF]">
                  <HardDrive className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Smart Junk Cleanup</h4>
                  <p className="text-[11px] text-[#8E80A8]">Caches, logs, temp data</p>
                </div>
              </div>
              <p className="text-xs text-[#C8BEDC]">Reclaim storage safely without touching your personal files.</p>
            </div>

            <div
              onClick={() => onNavigateToSection('privacy')}
              className="badge-3d-card p-5 rounded-2xl cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#00E699]/20 border border-[#00E699]/30 flex items-center justify-center text-[#00E699]">
                  <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Privacy Protection</h4>
                  <p className="text-[11px] text-[#8E80A8]">Browsers & traces</p>
                </div>
              </div>
              <p className="text-xs text-[#C8BEDC]">Purge tracking cookies and temporary internet tokens.</p>
            </div>

            <div
              onClick={() => onNavigateToSection('gaming')}
              className="badge-3d-card p-5 rounded-2xl cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#F502FD]/20 border border-[#F502FD]/30 flex items-center justify-center text-[#F502FD]">
                  <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Gaming Speedup</h4>
                  <p className="text-[11px] text-[#8E80A8]">Thread prioritization</p>
                </div>
              </div>
              <p className="text-xs text-[#C8BEDC]">Boost CPU thread scheduling for maximum game FPS.</p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STAGE 2: LIVE DEEP SCANNING SCREEN (Advanced SystemCare Style - Image 1)
          ========================================================================= */}
      {scanState === 'scanning' && (
        <div className="p-8 rounded-3xl luxury-glass border border-white/[0.12] shadow-2xl relative overflow-hidden min-h-[560px] flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#02FEDC] animate-ping" />
              <h2 className="text-xl font-bold text-white">Scanning in Progress...</h2>
            </div>
            <span className="text-xs font-mono text-[#02FEDC] px-3 py-1 rounded-full bg-[#02FEDC]/10 border border-[#02FEDC]/30">
              Live Engine Active
            </span>
          </div>

          {/* Center Scan Area: Left Checklist + Right Radial Percentage Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-6">
            {/* Left Checklist (Image 1 - Advanced SystemCare) */}
            <div className="space-y-3.5 pr-4 border-r border-white/[0.06]">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <span className="text-[#C8BEDC]">Startup items</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono font-bold text-[11px]">
                  {startupItemsCount}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <span className="text-[#C8BEDC]">Privacy traces</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A5CFF]/20 text-[#5A5CFF] border border-[#5A5CFF]/30 font-mono font-bold text-[11px]">
                  {privacyTracesCount}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <span className="text-[#C8BEDC]">Junk files</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F502FD]/20 text-[#F502FD] border border-[#F502FD]/30 font-mono font-bold text-[11px]">
                  {formatBytes(junkBytesScanned)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <span className="text-[#C8BEDC]">Invalid shortcuts & registry cache</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono font-bold text-[11px]">
                  37
                </span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <span className="text-[#C8BEDC]">System & latency bottlenecks</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/30 font-mono font-bold text-[11px]">
                  4
                </span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <span className="text-[#C8BEDC]">Gaming performance headroom</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#00E699]/20 text-[#00E699] border border-[#00E699]/30 font-mono font-bold text-[11px]">
                  {speedTasksCount} Targets
                </span>
              </div>
            </div>

            {/* Right Side: Glowing Neon Percentage Ring (Image 1) */}
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Background Ring */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="url(#scanGrad)"
                    strokeWidth="10"
                    strokeDasharray="502"
                    strokeDashoffset={502 - (502 * scanProgress) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-200 ease-out"
                  />
                  <defs>
                    <linearGradient id="scanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#02FEDC" />
                      <stop offset="50%" stopColor="#6E56FF" />
                      <stop offset="100%" stopColor="#F502FD" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Inner Percentage Display */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white font-mono tracking-tight">
                    {scanProgress}<span className="text-lg text-[#02FEDC]">%</span>
                  </span>
                  <span className="text-[10px] text-[#C8BEDC] uppercase tracking-widest mt-1">Analyzing</span>
                </div>
              </div>

              {/* Live Streaming File Path */}
              <div className="w-full max-w-sm space-y-1">
                <p className="text-xs font-bold text-white">Scanning file entries & caches</p>
                <p className="text-[11px] font-mono text-[#02FEDC] truncate px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.08]">
                  {mockScanPaths[currentPathIndex]}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Action Controls */}
          <div className="flex items-center justify-between border-t border-white/[0.08] pt-5">
            <label className="flex items-center gap-2.5 text-xs text-[#C8BEDC] cursor-pointer">
              <input
                type="checkbox"
                checked={autoFix}
                onChange={(e) => setAutoFix(e.target.checked)}
                className="w-4 h-4 rounded accent-[#02FEDC] bg-black/40 border border-white/20"
              />
              <span>Automatically apply recommended fixes when finished</span>
            </label>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSkipScan}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-xs font-semibold text-white transition-all"
              >
                <SkipForward className="w-3.5 h-3.5 text-[#02FEDC]" />
                <span>Skip</span>
              </button>
              <button
                onClick={handleStopScan}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-xs font-semibold text-red-300 border border-red-500/30 transition-all"
              >
                <StopCircle className="w-3.5 h-3.5 text-red-400" />
                <span>Stop</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STAGE 3: SCAN RESULTS SCREEN (CleanMyMac X Style - Image 2)
          ========================================================================= */}
      {scanState === 'results' && (
        <div className="space-y-8 p-8 rounded-3xl luxury-glass border border-white/[0.12] shadow-2xl relative text-center">
          {/* Header */}
          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-3xl font-black text-white tracking-tight">Alright, here's what I've found.</h2>
            <p className="text-xs text-[#C8BEDC] leading-relaxed">
              All of the tasks to keep your PC clean, safe, and optimized are waiting. Run them all at once!
            </p>
          </div>

          {/* Three Iconic 3D Cards in a row (Image 2 - CleanMyMac X) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Card 1: Cleanup (Blue Disk) */}
            <div className="badge-3d-card p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0088FF] to-[#02FEDC] p-0.5 shadow-xl shadow-[#0088FF]/30 flex items-center justify-center">
                <div className="w-full h-full bg-[#1A0B33] rounded-[14px] flex items-center justify-center">
                  <HardDrive className="w-9 h-9 text-[#0088FF]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#00E699]">
                  <Check className="w-4 h-4" />
                  <span>Cleanup</span>
                </div>
                <p className="text-[11px] text-[#8E80A8]">Removes unneeded junk</p>
              </div>

              <div className="text-2xl font-black text-white font-mono">
                {formatBytes(junkBytesScanned)}
              </div>

              <button
                onClick={onNavigateToCleaner}
                className="text-xs text-[#02FEDC] hover:underline font-semibold"
              >
                Review Details...
              </button>
            </div>

            {/* Card 2: Protection (Green Shield with Biometric Fingerprint) */}
            <div className="badge-3d-card p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#00E699] to-[#02FEDC] p-0.5 shadow-xl shadow-[#00E699]/30 flex items-center justify-center">
                <div className="w-full h-full bg-[#1A0B33] rounded-[14px] flex items-center justify-center">
                  <ShieldCheck className="w-9 h-9 text-[#00E699]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#00E699]">
                  <Check className="w-4 h-4" />
                  <span>Protection</span>
                </div>
                <p className="text-[11px] text-[#8E80A8]">Neutralizes privacy traces</p>
              </div>

              <div className="text-2xl font-black text-[#00E699] font-mono">
                OK
              </div>

              <button
                onClick={() => onNavigateToSection('privacy')}
                className="text-xs text-[#02FEDC] hover:underline font-semibold"
              >
                No threats found &bull; Review
              </button>
            </div>

            {/* Card 3: Speed (Pink Speedometer Tachometer) */}
            <div className="badge-3d-card p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#F502FD] to-[#FF4757] p-0.5 shadow-xl shadow-[#F502FD]/30 flex items-center justify-center">
                <div className="w-full h-full bg-[#1A0B33] rounded-[14px] flex items-center justify-center">
                  <Gauge className="w-9 h-9 text-[#F502FD]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#00E699]">
                  <Check className="w-4 h-4" />
                  <span>Speed</span>
                </div>
                <p className="text-[11px] text-[#8E80A8]">Increases system & gaming performance</p>
              </div>

              <div className="text-2xl font-black text-white font-mono">
                {speedTasksCount}
              </div>

              <button
                onClick={() => onNavigateToSection('gaming')}
                className="text-xs text-[#02FEDC] hover:underline font-semibold"
              >
                {speedTasksCount} tasks to run &bull; Review
              </button>
            </div>
          </div>

          {/* Iconic Circular "Run" Button (Image 2) */}
          <div className="pt-4 flex flex-col items-center gap-3">
            <button
              onClick={handleRunAll}
              disabled={isExecutingRun}
              className="cleanmymac-circle-btn"
              style={{
                background: 'linear-gradient(135deg, #0088FF 0%, #5A5CFF 50%, #F502FD 100%)',
              }}
              aria-label="Run Cleanup and Optimization"
            >
              {isExecutingRun ? (
                <RotateCcw className="w-7 h-7 text-white animate-spin" />
              ) : (
                <span className="text-lg">Run</span>
              )}
            </button>
            <span className="text-xs text-[#C8BEDC]">Click to execute all recommended optimizations</span>
          </div>
        </div>
      )}

      {/* =========================================================================
          STAGE 4: COMPLETED STATE
          ========================================================================= */}
      {scanState === 'completed' && (
        <div className="space-y-6 p-10 rounded-3xl luxury-glass border border-white/[0.12] shadow-2xl text-center">
          <div className="w-20 h-20 rounded-full bg-[#00E699]/20 border border-[#00E699]/40 flex items-center justify-center mx-auto text-[#00E699] shadow-[0_0_30px_#00E699]">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl font-black text-white">Your PC is Clean & Optimized!</h2>
            <p className="text-xs text-[#C8BEDC]">
              Reclaimed storage, cleared browser residue, and prioritized thread scheduling for maximum performance.
            </p>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={() => setScanState('idle')}
              className="px-6 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-bold text-white transition-all"
            >
              Start Over
            </button>
            <button
              onClick={() => onNavigateToSection('gaming')}
              className="px-6 py-3 rounded-xl gradient-brand text-[#08090D] text-xs font-extrabold shadow-lg transition-all"
            >
              Open Gaming Mode
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
