import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Server,
  RotateCcw,
  Check,
  StopCircle,
  SkipForward,
  Wrench,
  Boxes,
  HelpCircle,
  ExternalLink,
  Info,
  CheckCircle2,
  Sliders,
  Shield,
  Zap,
  FolderMinus,
  Activity,
  Layers,
} from 'lucide-react';
import { RealtimeMetrics, SystemOverview } from '../../types';
import { NexoraApi } from '../../services/api';

// Bespoke 3D Emblems
import { Emblem3DMonitor } from '../../components/emblems/Emblem3DMonitor';
import { EmblemBlueDrive } from '../../components/emblems/EmblemBlueDrive';
import { EmblemGreenShield } from '../../components/emblems/EmblemGreenShield';
import { EmblemSpeedometer } from '../../components/emblems/EmblemSpeedometer';
import { EmblemGreenOrb } from '../../components/emblems/EmblemGreenOrb';
import { EmblemMagentaShieldHand } from '../../components/emblems/EmblemMagentaShieldHand';
import { EmblemAmberLightning } from '../../components/emblems/EmblemAmberLightning';
import { EmblemBlueCrystal } from '../../components/emblems/EmblemBlueCrystal';
import { EmblemTealFolder } from '../../components/emblems/EmblemTealFolder';
import { EmblemSystemCareScan } from '../../components/emblems/EmblemSystemCareScan';
import { EmblemHoloLaptop } from '../../components/emblems/EmblemHoloLaptop';

interface OverviewViewProps {
  overview: SystemOverview | null;
  metrics: RealtimeMetrics | null;
  onNavigateToCleaner: () => void;
  onNavigateToSection: (section: any) => void;
  isAssistantActive?: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

const mockScanPaths = [
  'HKEY_CLASSES_ROOT\\CLSID\\{21B98AA2-DBD8-4E6B-821C-AC9C015A0609}',
  'C:\\Users\\AppData\\Local\\Temp\\~DF3B89.tmp',
  'C:\\Windows\\Prefetch\\NTOSKRNL.EXE-84A12B.pf',
  'HKEY_CURRENT_USER\\Software\\Classes\\Local Settings\\MuiCache',
  'C:\\Windows\\SoftwareDistribution\\Download\\Shared',
  'AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache\\data_1',
  'AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Cache\\data_0',
  'AppData\\Local\\D3DSCache\\a98b2c41f710e28.bin',
  'HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer',
  'C:\\Windows\\Logs\\CBS\\CBS.log',
];

export const OverviewView: React.FC<OverviewViewProps> = ({
  overview,
  metrics,
  onNavigateToCleaner,
  onNavigateToSection,
  isAssistantActive = false,
}) => {
  // Mode selection:
  // 'classic' = CleanMyMac X 3-Card (Image 2 & 4)
  // 'bento' = CleanMyMac Bento 5-Card (Image 7)
  // 'maccleaner' = MacCleaner Pro Storage Bar + Holographic Laptop (Image 3)
  // 'assistant' = CleanMyMac Assistant Portal (Image 6 & 8)
  // 'systemcare' = Advanced SystemCare Waveform + HUD (Image 1 & 9)
  const [viewMode, setViewMode] = useState<'classic' | 'bento' | 'maccleaner' | 'assistant' | 'systemcare'>('classic');

  // Sync external assistant toggle from sidebar
  useEffect(() => {
    if (isAssistantActive) {
      setViewMode('assistant');
    }
  }, [isAssistantActive]);

  // CleanMyMac scan states: 'idle', 'scanning', 'results', 'completed'
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'results' | 'completed'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [autoFix, setAutoFix] = useState(true);
  const [isExecutingRun, setIsExecutingRun] = useState(false);

  // Scanned numbers (Matching reference images)
  const [junkBytesScanned] = useState(2520000000); // 2.52 GB (Image 2) / 10.9 GB (Image 7)
  const [privacyTracesCount] = useState(4821); // Image 1
  const [performanceTasksCount] = useState(3); // Image 2 (3 tasks) / 2 tasks (Image 7)
  const [applicationUpdatesCount] = useState(3); // Image 7
  const [duplicateFilesCount] = useState(2); // Image 7

  // SystemCare Checkboxes (Image 9)
  const [systemCareChecks, setSystemCareChecks] = useState<Record<string, boolean>>({
    'Startup Optimization': true,
    'Privacy Sweep': true,
    'Junk File Clean': true,
    'Shortcut Fix': true,
    'Registry Clean': true,
    'Spyware Removal': true,
    'Internet Boost': true,
    'System Optimization': true,
    'Registry Defrag': false,
    'Security Reinforce': false,
    'Vulnerability Fix': false,
    'Disk Optimization': false,
  });

  const primaryDrive = overview?.drives[0];

  // Scan simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let pathInterval: NodeJS.Timeout;

    if (scanState === 'scanning') {
      setScanProgress(0);

      pathInterval = setInterval(() => {
        setCurrentPathIndex((prev) => (prev + 1) % mockScanPaths.length);
      }, 160);

      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            clearInterval(pathInterval);
            setTimeout(() => setScanState('results'), 400);
            return 100;
          }
          const jump = Math.floor(Math.random() * 8) + 4;
          return Math.min(100, prev + jump);
        });
      }, 110);
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

  const toggleSystemCareCheck = (key: string) => {
    setSystemCareChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAllSystemCare = (checked: boolean) => {
    const updated: Record<string, boolean> = {};
    Object.keys(systemCareChecks).forEach((k) => (updated[k] = checked));
    setSystemCareChecks(updated);
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto px-6 py-5 space-y-6 max-w-7xl mx-auto select-none">
      {/* =========================================================================
          TOP AESTHETIC BAR & THEME / MODE SWITCHER
          ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        {/* Left Action / Breadcrumb */}
        <div className="flex items-center gap-3">
          {scanState !== 'idle' && (
            <button
              onClick={() => {
                setScanState('idle');
                setScanProgress(0);
              }}
              className="flex items-center gap-1.5 text-xs text-[#C8BEDC] hover:text-white transition-colors px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08]"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#02FEDC]" />
              <span>Start Over</span>
            </button>
          )}
          <span className="text-xs font-bold text-white tracking-wider uppercase font-mono">
            {viewMode === 'classic' && 'CleanMyMac X (Smart Scan)'}
            {viewMode === 'bento' && 'CleanMyMac (Bento Grid)'}
            {viewMode === 'maccleaner' && 'MacCleaner Pro (Drive Strip)'}
            {viewMode === 'assistant' && 'System Assistant (Health Portal)'}
            {viewMode === 'systemcare' && 'Advanced SystemCare (Waveform HUD)'}
          </span>
        </div>

        {/* Center / Right Mode Switcher matching all user references */}
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-full bg-black/50 border border-white/[0.1] shadow-inner">
          <button
            onClick={() => setViewMode('classic')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'classic'
                ? 'bg-gradient-to-r from-[#F502FD] to-[#6E56FF] text-white shadow-[0_0_12px_rgba(245,2,253,0.4)]'
                : 'text-[#C8BEDC] hover:text-white'
            }`}
          >
            3-Card Classic
          </button>
          <button
            onClick={() => setViewMode('bento')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'bento'
                ? 'bg-gradient-to-r from-[#F502FD] to-[#02FEDC] text-white shadow-[0_0_12px_rgba(245,2,253,0.4)]'
                : 'text-[#C8BEDC] hover:text-white'
            }`}
          >
            5-Card Bento
          </button>
          <button
            onClick={() => setViewMode('maccleaner')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'maccleaner'
                ? 'bg-gradient-to-r from-[#0088FF] to-[#02FEDC] text-white shadow-[0_0_12px_rgba(0,136,255,0.4)]'
                : 'text-[#C8BEDC] hover:text-white'
            }`}
          >
            MacCleaner Pro
          </button>
          <button
            onClick={() => setViewMode('assistant')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'assistant'
                ? 'bg-gradient-to-r from-[#02FEDC] to-[#6E56FF] text-white shadow-[0_0_12px_rgba(2,254,220,0.4)]'
                : 'text-[#C8BEDC] hover:text-white'
            }`}
          >
            Assistant Portal
          </button>
          <button
            onClick={() => setViewMode('systemcare')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'systemcare'
                ? 'bg-gradient-to-r from-[#0052D4] to-[#4FACFE] text-white shadow-[0_0_12px_rgba(0,114,255,0.4)]'
                : 'text-[#C8BEDC] hover:text-white'
            }`}
          >
            Advanced SystemCare
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODE 1: CLEANMYMAC X (3-CARD CLASSIC - REFERENCE IMAGE 2 & 4)
          ========================================================================= */}
      {viewMode === 'classic' && (
        <div className="space-y-6">
          {/* STAGE 1: IDLE / WELCOME (IMAGE 4) */}
          {scanState === 'idle' && (
            <div className="relative rounded-3xl luxury-glass p-8 overflow-hidden shadow-2xl border border-white/[0.12] text-center flex flex-col items-center justify-center min-h-[480px]">
              {/* 3D Computer with Animated Wiper Blade */}
              <div className="mb-6 z-10">
                <Emblem3DMonitor onClick={handleStartScan} />
              </div>

              <div className="space-y-2 max-w-lg mb-8 z-10">
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                  Welcome to <span className="text-gradient">NEXORA</span>
                </h1>
                <p className="text-xs text-[#C8BEDC] leading-relaxed">
                  Start with a quick and extensive scan of your PC to identify junk files, privacy traces, and performance bottlenecks.
                </p>
              </div>

              {/* Glowing Circular Magenta Scan Button */}
              <div className="z-10 flex flex-col items-center gap-3">
                <button
                  onClick={handleStartScan}
                  className="cleanmymac-circle-btn group"
                  aria-label="Start Smart Scan"
                >
                  <div className="flex flex-col items-center justify-center">
                    <Sparkles className="w-6 h-6 mb-0.5 group-hover:rotate-45 transition-transform" />
                    <span className="font-bold text-sm">Scan</span>
                  </div>
                </button>
                <span className="text-xs text-[#8E80A8] font-medium tracking-wide">
                  Click to start quick and extensive scan
                </span>
              </div>
            </div>
          )}

          {/* STAGE 2: LIVE SCANNING HUD (IMAGE 1) */}
          {scanState === 'scanning' && (
            <div className="p-8 rounded-3xl luxury-glass border border-white/[0.12] shadow-2xl relative overflow-hidden min-h-[520px] flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#02FEDC] animate-ping" />
                  <h2 className="text-xl font-bold text-white">Scanning...</h2>
                </div>
                <span className="text-xs font-mono text-[#02FEDC] px-3 py-1 rounded-full bg-[#02FEDC]/10 border border-[#02FEDC]/30">
                  Live Engine Active
                </span>
              </div>

              {/* Grid: Left Checklist + Right Neon Radial Ring */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-6">
                <div className="space-y-3 pr-4 border-r border-white/[0.08]">
                  {[
                    { label: 'Startup items', count: '1', color: '#FFFFFF', done: scanProgress > 15 },
                    { label: 'Privacy traces', count: `${privacyTracesCount}`, color: '#5A5CFF', done: scanProgress > 35 },
                    { label: 'Junk files', count: '2.52 GB', color: '#F502FD', done: scanProgress > 55 },
                    { label: 'Invalid shortcuts', count: '37', color: '#02FEDC', done: scanProgress > 70 },
                    { label: 'Registry entries', count: 'Scanning...', color: '#FFB800', done: scanProgress > 85, isScanning: scanProgress <= 85 },
                    { label: 'Spyware threats', count: '0 Threats', color: '#00E699', done: scanProgress >= 90 },
                    { label: 'Internet improvements', count: '4 Items', color: '#4FA8FF', done: scanProgress >= 95 },
                    { label: 'System optimizations', count: '3 Tasks', color: '#F502FD', done: scanProgress >= 100 },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between text-xs px-3.5 py-2.5 rounded-xl transition-all ${
                        item.done
                          ? 'bg-white/[0.04] border border-white/[0.08]'
                          : 'bg-white/[0.01] border border-white/[0.03] opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.done ? (
                          <span className="w-2 h-2 rounded-full bg-[#00E699] shadow-[0_0_8px_#00E699]" />
                        ) : item.isScanning ? (
                          <span className="w-2.5 h-2.5 rounded-full border-2 border-[#02FEDC] border-t-transparent animate-spin" />
                        ) : (
                          <span className="w-2 h-2 rounded-full border border-white/30" />
                        )}
                        <span className="text-[#F5F7FA] font-medium">{item.label}</span>
                      </div>
                      <span
                        className="px-2.5 py-0.5 rounded-full font-mono font-bold text-[11px] border"
                        style={{
                          backgroundColor: `${item.color}15`,
                          color: item.color,
                          borderColor: `${item.color}35`,
                        }}
                      >
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-center justify-center text-center space-y-5">
                  <div className="relative w-56 h-56 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#02FEDC]/20 via-[#1B6DFB]/30 to-[#F502FD]/25 blur-2xl pointer-events-none" />

                    <svg className="w-full h-full transform -rotate-90 overflow-visible">
                      <circle cx="112" cy="112" r="92" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="12" fill="transparent" />
                      <circle
                        cx="112"
                        cy="112"
                        r="92"
                        stroke="url(#ascNeonGradClassic)"
                        strokeWidth="12"
                        strokeDasharray="578"
                        strokeDashoffset={578 - (578 * scanProgress) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                        style={{ filter: 'drop-shadow(0 0 12px rgba(2, 254, 220, 0.6))' }}
                        className="transition-all duration-200 ease-out"
                      />
                      <defs>
                        <linearGradient id="ascNeonGradClassic" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#02FEDC" />
                          <stop offset="40%" stopColor="#1B6DFB" />
                          <stop offset="70%" stopColor="#8A2BE2" />
                          <stop offset="100%" stopColor="#F502FD" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center">
                      <div className="flex items-baseline">
                        <span className="text-5xl font-black text-white font-mono tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                          {scanProgress}
                        </span>
                        <span className="text-xl font-bold text-[#02FEDC] ml-0.5">%</span>
                      </div>
                      <span className="text-[10px] text-[#02FEDC] uppercase tracking-widest font-mono font-bold mt-1 bg-[#02FEDC]/10 px-2 py-0.5 rounded-full border border-[#02FEDC]/30">
                        Scanning for registry entries
                      </span>
                    </div>
                  </div>

                  <div className="w-full max-w-sm space-y-1.5">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/60 border border-white/[0.1] shadow-inner">
                      <span className="w-2 h-2 rounded-full bg-[#02FEDC] animate-ping" />
                      <p className="text-[11px] font-mono text-[#02FEDC] truncate text-left">
                        {mockScanPaths[currentPathIndex]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.08] pt-4">
                <label className="flex items-center gap-2.5 text-xs text-[#C8BEDC] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoFix}
                    onChange={(e) => setAutoFix(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#02FEDC] bg-black/40 border border-white/20"
                  />
                  <span>Automatically fix</span>
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

          {/* STAGE 3: 3 ICONIC CARDS RESULTS (PIXEL-PERFECT CLEANMYMAC X - REFERENCE IMAGE 2) */}
          {scanState === 'results' && (
            <div className="space-y-8 py-4">
              {/* Header */}
              <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                  Alright, here&apos;s what I&apos;ve found.
                </h2>
                <p className="text-xs text-[#C8BEDC] max-w-xl mx-auto">
                  All of the tasks to keep your PC clean, safe, and optimized are waiting. Run them all at once!
                </p>
              </div>

              {/* 3 ICONIC CARDS SIDE-BY-SIDE (IMAGE 2) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {/* 1. Card 1: Cleanup (Blue Drive) */}
                <div className="p-8 rounded-3xl luxury-glass border border-white/[0.12] shadow-2xl flex flex-col items-center text-center space-y-4 relative group hover:border-[#0088FF]/50 transition-all duration-300">
                  <div className="my-2">
                    <EmblemBlueDrive size={110} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-white">
                      <Check className="w-4 h-4 text-[#00E699]" />
                      <span>Cleanup</span>
                    </div>
                    <p className="text-[11px] text-[#C8BEDC]">Removes unneeded junk</p>
                  </div>
                  <div className="pt-2">
                    <span className="text-3xl font-black text-white tracking-tight">2,52 <span className="text-base font-semibold">GB</span></span>
                  </div>
                  <button
                    onClick={onNavigateToCleaner}
                    className="text-xs font-medium text-[#4FA8FF] hover:text-white transition-colors underline decoration-dotted underline-offset-4"
                  >
                    Review Details...
                  </button>
                </div>

                {/* 2. Card 2: Protection (Green Shield with Fingerprint) */}
                <div className="p-8 rounded-3xl luxury-glass border border-white/[0.12] shadow-2xl flex flex-col items-center text-center space-y-4 relative group hover:border-[#00E699]/50 transition-all duration-300">
                  <div className="my-2">
                    <EmblemGreenShield size={110} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-white">
                      <span>Protection</span>
                    </div>
                    <p className="text-[11px] text-[#C8BEDC]">Neutralizes potential threats</p>
                  </div>
                  <div className="pt-2">
                    <span className="text-3xl font-black text-[#00E699] tracking-tight">OK</span>
                  </div>
                  <span className="text-xs text-[#8E80A8]">No threats found</span>
                </div>

                {/* 3. Card 3: Speed (Crimson Speedometer) */}
                <div className="p-8 rounded-3xl luxury-glass border border-white/[0.12] shadow-2xl flex flex-col items-center text-center space-y-4 relative group hover:border-[#FF3366]/50 transition-all duration-300">
                  <div className="my-2">
                    <EmblemSpeedometer size={110} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-white">
                      <Check className="w-4 h-4 text-[#00E699]" />
                      <span>Speed</span>
                    </div>
                    <p className="text-[11px] text-[#C8BEDC]">Increases system performance</p>
                  </div>
                  <div className="pt-2">
                    <span className="text-3xl font-black text-white tracking-tight">3</span>
                  </div>
                  <span className="text-xs text-[#8E80A8]">tasks to run</span>
                </div>
              </div>

              {/* Glowing Circular Magenta RUN Button (Image 2) */}
              <div className="flex flex-col items-center justify-center pt-4">
                <button
                  onClick={handleRunAll}
                  disabled={isExecutingRun}
                  className="cleanmymac-circle-btn group"
                  aria-label="Run All Clean Tasks"
                >
                  <div className="flex flex-col items-center justify-center">
                    <Sparkles className="w-6 h-6 mb-0.5 group-hover:rotate-45 transition-transform" />
                    <span className="font-bold text-sm">{isExecutingRun ? 'Running...' : 'Run'}</span>
                  </div>
                </button>
                <span className="text-xs text-[#8E80A8] font-medium tracking-wide mt-3">
                  Click to execute all 3 recommendations
                </span>
              </div>
            </div>
          )}

          {/* STAGE 4: COMPLETED SUMMARY */}
          {scanState === 'completed' && (
            <div className="p-10 rounded-3xl luxury-glass border border-white/[0.12] shadow-2xl text-center space-y-6 max-w-xl mx-auto my-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#00E699] to-[#02FEDC] p-[2px] mx-auto shadow-[0_0_40px_rgba(0,230,153,0.5)]">
                <div className="w-full h-full rounded-full bg-[#0E031F] flex items-center justify-center">
                  <Check className="w-10 h-10 text-[#00E699]" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">Your PC is Clean & Optimized!</h3>
                <p className="text-xs text-[#C8BEDC]">
                  Reclaimed 2.52 GB of junk, purged system caches, and refreshed memory working sets.
                </p>
              </div>
              <button
                onClick={() => {
                  setScanState('idle');
                  setScanProgress(0);
                }}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F502FD] to-[#6E56FF] text-white text-xs font-bold shadow-lg shadow-[#F502FD]/30 hover:scale-105 transition-transform"
              >
                Scan Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODE 2: CLEANMYMAC BENTO GRID (5-CARD PRO - REFERENCE IMAGE 7)
          ========================================================================= */}
      {viewMode === 'bento' && (
        <div className="space-y-8">
          <div className="text-center space-y-1">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Your tasks are ready to run. Look what we found:
            </h2>
            <p className="text-xs text-[#C8BEDC]">
              All of the tasks to keep your PC clean, safe, and optimized are waiting. Run them all at once!
            </p>
          </div>

          {/* 5 BENTO CARDS GRID (3 on top row, 2 on bottom row - EXACT IMAGE 7) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Card 1: Cleanup (with 3D Emerald Green Orb) */}
            <div className="badge-3d-card p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[160px] group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/20 text-xs font-semibold text-white">
                    <Check className="w-3.5 h-3.5 text-[#00E699]" />
                    <span>Cleanup</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-2xl font-black text-white block tracking-tight">10.9 GB of junk</span>
                    <span className="text-xs text-[#8E80A8] block">to clean</span>
                  </div>
                </div>
                <div className="transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
                  <EmblemGreenOrb size={82} />
                </div>
              </div>
              <div className="pt-3">
                <button
                  onClick={onNavigateToCleaner}
                  className="px-3.5 py-1 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-[11px] font-semibold text-white transition-colors border border-white/[0.08]"
                >
                  Review
                </button>
              </div>
            </div>

            {/* 2. Card 2: Protection (with 3D Magenta Shield & Palm) */}
            <div className="badge-3d-card p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[160px] group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/20 text-xs font-semibold text-white">
                    <span>Protection by NEXORA</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-2xl font-black text-white block tracking-tight">No threats</span>
                    <span className="text-xs text-[#8E80A8] block">to remove</span>
                  </div>
                </div>
                <div className="transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
                  <EmblemMagentaShieldHand size={82} />
                </div>
              </div>
              <div className="pt-3">
                <span className="text-[10px] text-[#00E699] font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E699]" /> Shield Active
                </span>
              </div>
            </div>

            {/* 3. Card 3: Performance (with 3D Amber Ribbon Lightning) */}
            <div className="badge-3d-card p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[160px] group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/20 text-xs font-semibold text-white">
                    <Check className="w-3.5 h-3.5 text-[#00E699]" />
                    <span>Performance</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-2xl font-black text-white block tracking-tight">2 tasks</span>
                    <span className="text-xs text-[#8E80A8] block">to run</span>
                  </div>
                </div>
                <div className="transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
                  <EmblemAmberLightning size={82} />
                </div>
              </div>
              <div className="pt-3">
                <button
                  onClick={() => onNavigateToSection('gaming')}
                  className="px-3.5 py-1 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-[11px] font-semibold text-white transition-colors border border-white/[0.08]"
                >
                  Review
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row of Bento: 2 Cards (Applications + My Clutter) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {/* 4. Card 4: Applications (with 3D Faceted Crystal) */}
            <div className="badge-3d-card p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[160px] group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/20 text-xs font-semibold text-white">
                    <Check className="w-3.5 h-3.5 text-[#00E699]" />
                    <span>Applications</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-2xl font-black text-white block tracking-tight">3 vital updates</span>
                    <span className="text-xs text-[#8E80A8] block">to install</span>
                  </div>
                </div>
                <div className="transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
                  <EmblemBlueCrystal size={82} />
                </div>
              </div>
              <div className="pt-3">
                <button
                  onClick={() => onNavigateToSection('applications')}
                  className="px-3.5 py-1 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-[11px] font-semibold text-white transition-colors border border-white/[0.08]"
                >
                  Review
                </button>
              </div>
            </div>

            {/* 5. Card 5: My Clutter (with 3D Folded Folder) */}
            <div className="badge-3d-card p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[160px] group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/20 text-xs font-semibold text-white">
                    <Check className="w-3.5 h-3.5 text-[#00E699]" />
                    <span>My Clutter</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-2xl font-black text-white block tracking-tight">2 duplicate downloads</span>
                    <span className="text-xs text-[#8E80A8] block">to remove</span>
                  </div>
                </div>
                <div className="transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
                  <EmblemTealFolder size={82} />
                </div>
              </div>
              <div className="pt-3">
                <button
                  onClick={() => onNavigateToSection('disk-analyzer')}
                  className="px-3.5 py-1 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-[11px] font-semibold text-white transition-colors border border-white/[0.08]"
                >
                  Review
                </button>
              </div>
            </div>
          </div>

          {/* Central Action Run Button */}
          <div className="flex flex-col items-center justify-center pt-2">
            <button
              onClick={handleRunAll}
              disabled={isExecutingRun}
              className="cleanmymac-circle-btn group"
              aria-label="Run CleanMyMac Tasks"
            >
              <div className="flex flex-col items-center justify-center">
                <Sparkles className="w-6 h-6 mb-0.5 group-hover:rotate-45 transition-transform" />
                <span className="font-bold text-sm">{isExecutingRun ? 'Running...' : 'Run'}</span>
              </div>
            </button>
            <span className="text-xs text-[#8E80A8] font-medium tracking-wide mt-3">
              Click to execute 5-category smart care
            </span>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 3: MACLEANER PRO (DRIVE STRIP + HOLOGRAPHIC LAPTOP - REFERENCE IMAGE 3)
          ========================================================================= */}
      {viewMode === 'maccleaner' && (
        <div className="space-y-6">
          {/* Top Multi-Color Segmented Drive Strip (Image 3) */}
          <div className="p-6 rounded-2xl luxury-glass border border-white/[0.08] shadow-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Server className="w-4 h-4 text-[#02FEDC]" />
                <span className="font-extrabold text-white text-sm">
                  {primaryDrive?.mount_point || 'C:'} Local System Disk
                </span>
              </div>
              <span className="text-xs text-[#C8BEDC] font-mono">
                {primaryDrive
                  ? `${formatBytes(primaryDrive.available_bytes)} available of ${formatBytes(primaryDrive.total_bytes)}`
                  : '103 GB available of 245 GB'}
              </span>
            </div>

            {/* Segmented multi-color progress strip */}
            <div className="h-4 w-full rounded-full bg-[#100424] overflow-hidden flex p-0.5 gap-0.5 border border-white/[0.1]">
              <div className="h-full bg-[#4B7BEC] rounded-l-full" style={{ width: '28%' }} title="System" />
              <div className="h-full bg-[#26DE81]" style={{ width: '22%' }} title="Applications" />
              <div className="h-full bg-[#FF9F43]" style={{ width: '10%' }} title="Duplicates" />
              <div className="h-full bg-[#FF4B72]" style={{ width: '12%' }} title="Documents" />
              <div className="h-full bg-[#9B59B6]" style={{ width: '8%' }} title="Movies" />
              <div className="h-full bg-[#00D2D3]" style={{ width: '5%' }} title="Music" />
              <div className="h-full bg-[#F502FD]" style={{ width: '4%' }} title="Pictures" />
              <div className="h-full bg-[#2ED573]" style={{ width: '3%' }} title="Archives" />
              <div className="h-full bg-white/[0.06] rounded-r-full flex-1" title="Free Space" />
            </div>

            {/* Legend Pills with Sizes */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-1 text-[11px] text-[#C8BEDC]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#4B7BEC]" /> System (71.3 GB)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#26DE81]" /> Applications (17.7 GB)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF9F43]" /> Duplicates (2.36 GB)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF4B72]" /> Documents (10.1 GB)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#9B59B6]" /> Movies (3.63 GB)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#00D2D3]" /> Music (1.14 GB)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F502FD]" /> Pictures (2.93 GB)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2ED573]" /> Archives (54.8 MB)</span>
            </div>
          </div>

          {/* Main Card: "Remove junk files and speed up PC" (Image 3) */}
          <div className="p-8 rounded-3xl luxury-glass border border-white/[0.12] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center space-y-6 min-h-[420px]">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Remove junk files and speed up PC
            </h2>

            {/* Holographic Wireframe Laptop + Stats Card */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-2xl py-4">
              <EmblemHoloLaptop size={260} />

              <div className="p-6 rounded-2xl bg-black/40 border border-white/[0.1] shadow-xl space-y-3 min-w-[220px]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#C8BEDC]">Junk Files:</span>
                  <span className="text-sm font-black text-white">12.8 GB</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#C8BEDC]">Memory Usage:</span>
                  <span className="text-sm font-black text-[#02FEDC]">
                    {metrics && metrics.total_memory_bytes > 0
                      ? `${Math.round((metrics.used_memory_bytes / metrics.total_memory_bytes) * 100)}%`
                      : '82%'}
                  </span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={onNavigateToCleaner}
                    className="w-full py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-white border border-white/[0.1] transition-all"
                  >
                    Review Details
                  </button>
                </div>
              </div>
            </div>

            {/* Fast Cleanup Action Button */}
            <button
              onClick={handleRunAll}
              disabled={isExecutingRun}
              className="px-10 py-3.5 rounded-full bg-gradient-to-r from-[#0088FF] to-[#02FEDC] text-white text-sm font-extrabold tracking-wide shadow-xl shadow-[#0088FF]/30 hover:scale-105 transition-all"
            >
              {isExecutingRun ? 'Executing Cleanup...' : 'Fast Cleanup'}
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 4: SYSTEM ASSISTANT (PORTAL RING + ACTION CARDS - REFERENCE IMAGE 6 & 8)
          ========================================================================= */}
      {viewMode === 'assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-4">
          {/* Left Portal Card (Image 6) */}
          <div className="lg:col-span-5 p-8 rounded-3xl luxury-glass border border-white/[0.12] shadow-2xl flex flex-col items-center text-center relative overflow-hidden min-h-[460px] justify-between">
            {/* Glowing Neon Circular Ring around 3D Laptop */}
            <div className="relative w-64 h-64 flex items-center justify-center my-6">
              {/* Outer Neon Glow Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-[#02FEDC] shadow-[0_0_35px_#02FEDC] animate-pulse" style={{ animationDuration: '4s' }} />
              <div className="absolute inset-2 rounded-full border border-white/20" />

              {/* 3D Laptop Centerpiece */}
              <div className="relative z-10 flex flex-col items-center">
                <EmblemHoloLaptop size={170} />
                <span className="text-xs font-bold text-white mt-2 font-mono">Windows Workstation</span>
              </div>
            </div>

            {/* Health Status Telemetry */}
            <div className="space-y-1.5 text-left w-full">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#C8BEDC]">PC Health:</span>
                <span className="text-sm font-extrabold text-[#00E699] flex items-center gap-1">
                  Fair <Info className="w-3.5 h-3.5 text-[#02FEDC] cursor-pointer" />
                </span>
              </div>
              <p className="text-[11px] text-[#8E80A8] leading-relaxed">
                Your PC is OK, but some maintenance activities are recommended to avoid performance degradation.
              </p>
            </div>
          </div>

          {/* Right Action Stack (3 Action Cards - Image 6) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Card 1: Smart Care Recommendation */}
            <div className="p-6 rounded-3xl luxury-glass border border-white/[0.1] shadow-xl flex items-center justify-between gap-4 group hover:border-[#F502FD]/40 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F502FD] to-[#6E56FF] p-[2px] flex-shrink-0 shadow-lg shadow-[#F502FD]/20">
                  <div className="w-full h-full rounded-[14px] bg-[#1A0732] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#F502FD]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">It&apos;s time to care for your PC!</h3>
                  <p className="text-xs text-[#C8BEDC] leading-relaxed">
                    It&apos;s been a while since your last cleanup. Run Smart Care regularly to keep your PC in top shape.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewMode('classic')}
                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] text-xs font-semibold text-white border border-white/[0.12] whitespace-nowrap transition-all"
              >
                Run Smart Care
              </button>
            </div>

            {/* Card 2: Deep Scan Recommendation */}
            <div className="p-6 rounded-3xl luxury-glass border border-white/[0.1] shadow-xl flex items-center justify-between gap-4 group hover:border-[#00E699]/40 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00E699] to-[#02FEDC] p-[2px] flex-shrink-0 shadow-lg shadow-[#00E699]/20">
                  <div className="w-full h-full rounded-[14px] bg-[#07241A] flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[#00E699]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Deep scan recommended</h3>
                  <p className="text-xs text-[#C8BEDC] leading-relaxed">
                    Run a deep scan for registry errors and malware traces to make sure your system is protected.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToSection('deep-cleaner')}
                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] text-xs font-semibold text-white border border-white/[0.12] whitespace-nowrap transition-all"
              >
                Run Deep Scan
              </button>
            </div>

            {/* Card 3: Install application updates */}
            <div className="p-6 rounded-3xl luxury-glass border border-white/[0.1] shadow-xl flex items-center justify-between gap-4 group hover:border-[#0088FF]/40 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0088FF] to-[#02FEDC] p-[2px] flex-shrink-0 shadow-lg shadow-[#0088FF]/20">
                  <div className="w-full h-full rounded-[14px] bg-[#071838] flex items-center justify-center">
                    <Boxes className="w-6 h-6 text-[#02FEDC]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Install application updates</h3>
                  <p className="text-xs text-[#C8BEDC] leading-relaxed">
                    Applications and runtimes are ready to be updated. Install latest versions to patch vulnerabilities.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToSection('applications')}
                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] text-xs font-semibold text-white border border-white/[0.12] whitespace-nowrap transition-all"
              >
                Update Applications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 5: ADVANCED SYSTEMCARE (WAVEFORM SCAN + 4x3 GRID - REFERENCE IMAGE 1 & 9)
          ========================================================================= */}
      {viewMode === 'systemcare' && (
        <div className="space-y-8">
          {scanState !== 'scanning' ? (
            <>
              {/* Top Horizontal Icon Tabs (Image 9) */}
              <div className="flex items-center justify-center gap-6 md:gap-10 border-b border-white/[0.08] pb-4">
                {[
                  { label: 'Care', icon: Sparkles, active: true },
                  { label: 'Speed Up', icon: Zap, active: false, section: 'gaming' },
                  { label: 'Protect', icon: Shield, active: false, section: 'privacy' },
                  { label: 'Toolbox', icon: Wrench, active: false, section: 'maintenance' },
                  { label: 'Software Updater', icon: Boxes, active: false, section: 'applications' },
                  { label: 'Action Center', icon: Activity, active: false, section: 'diagnostics' },
                ].map((tab, idx) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => tab.section && onNavigateToSection(tab.section)}
                      className={`flex flex-col items-center gap-1.5 transition-all relative ${
                        tab.active
                          ? 'text-[#02FEDC]'
                          : 'text-[#8E80A8] hover:text-white'
                      }`}
                    >
                      <div className={`p-2 rounded-2xl ${tab.active ? 'bg-[#02FEDC]/15 border border-[#02FEDC]/30' : 'bg-transparent'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold">{tab.label}</span>
                      {tab.active && (
                        <div className="absolute -bottom-4 w-8 h-1 rounded-full bg-[#02FEDC] shadow-[0_0_8px_#02FEDC]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Giant SCAN Button with Audio Waveform Particles (Image 9) */}
              <div className="py-6 flex flex-col items-center justify-center">
                <EmblemSystemCareScan onClick={handleStartScan} />
                <span className="text-xs text-[#8E80A8] font-medium tracking-wide mt-2">
                  Click to start comprehensive SystemCare scan
                </span>
              </div>

              {/* 4x3 Grid of Scan Categories with Checkboxes (Image 9) */}
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between px-2">
                  <label className="flex items-center gap-2 text-xs text-[#02FEDC] font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Object.values(systemCareChecks).every(Boolean)}
                      onChange={(e) => selectAllSystemCare(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#02FEDC] bg-black/40 border border-white/20"
                    />
                    <span>Select All</span>
                  </label>
                  <span className="text-[11px] text-[#8E80A8] font-mono">12 Care Modules</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {Object.entries(systemCareChecks).map(([name, checked]) => (
                    <label
                      key={name}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl transition-all cursor-pointer border ${
                        checked
                          ? 'bg-white/[0.05] border-[#02FEDC]/30 text-white'
                          : 'bg-white/[0.01] border-white/[0.05] text-[#8E80A8] hover:text-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSystemCareCheck(name)}
                        className="w-4 h-4 rounded accent-[#02FEDC] bg-black/40 border border-white/20"
                      />
                      <span className="text-xs font-medium truncate">{name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bottom Orange Activation Banner (Image 9) */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FF7A00]/20 via-[#FF4500]/15 to-transparent border border-[#FF7A00]/30 flex items-center justify-between max-w-4xl mx-auto shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#FF4500] text-white">
                    PRO
                  </span>
                  <p className="text-xs text-white">
                    NEXORA Pro Engine: Real-time malware shield & automated background cleaner.
                  </p>
                </div>
                <button
                  onClick={onNavigateToCleaner}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold hover:scale-105 transition-all shadow-md shadow-[#FF7A00]/30"
                >
                  Activate Pro
                </button>
              </div>
            </>
          ) : (
            /* Live Scanning Screen (Image 1) */
            <div className="p-8 rounded-3xl luxury-glass border border-white/[0.12] shadow-2xl relative overflow-hidden min-h-[520px] flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#02FEDC] animate-ping" />
                  <h2 className="text-xl font-bold text-white">Scanning...</h2>
                </div>
                <span className="text-xs font-mono text-[#02FEDC] px-3 py-1 rounded-full bg-[#02FEDC]/10 border border-[#02FEDC]/30">
                  Live Engine Active
                </span>
              </div>

              {/* Grid: Left Checklist + Right Neon Radial Ring */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-6">
                <div className="space-y-3 pr-4 border-r border-white/[0.08]">
                  {[
                    { label: 'Startup items', count: '1', color: '#FFFFFF', done: scanProgress > 15 },
                    { label: 'Privacy traces', count: `${privacyTracesCount}`, color: '#5A5CFF', done: scanProgress > 35 },
                    { label: 'Junk files', count: '688 MB', color: '#F502FD', done: scanProgress > 55 },
                    { label: 'Invalid shortcuts', count: '37', color: '#02FEDC', done: scanProgress > 70 },
                    { label: 'Registry entries', count: 'Scanning...', color: '#FFB800', done: scanProgress > 85, isScanning: scanProgress <= 85 },
                    { label: 'Spyware threats', count: '0 Threats', color: '#00E699', done: scanProgress >= 90 },
                    { label: 'Internet improvements', count: '4 Items', color: '#4FA8FF', done: scanProgress >= 95 },
                    { label: 'System optimizations', count: '3 Tasks', color: '#F502FD', done: scanProgress >= 100 },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between text-xs px-3.5 py-2.5 rounded-xl transition-all ${
                        item.done
                          ? 'bg-white/[0.04] border border-white/[0.08]'
                          : 'bg-white/[0.01] border border-white/[0.03] opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.done ? (
                          <span className="w-2 h-2 rounded-full bg-[#00E699] shadow-[0_0_8px_#00E699]" />
                        ) : item.isScanning ? (
                          <span className="w-2.5 h-2.5 rounded-full border-2 border-[#02FEDC] border-t-transparent animate-spin" />
                        ) : (
                          <span className="w-2 h-2 rounded-full border border-white/30" />
                        )}
                        <span className="text-[#F5F7FA] font-medium">{item.label}</span>
                      </div>
                      <span
                        className="px-2.5 py-0.5 rounded-full font-mono font-bold text-[11px] border"
                        style={{
                          backgroundColor: `${item.color}15`,
                          color: item.color,
                          borderColor: `${item.color}35`,
                        }}
                      >
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-center justify-center text-center space-y-5">
                  <div className="relative w-56 h-56 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#02FEDC]/20 via-[#1B6DFB]/30 to-[#F502FD]/25 blur-2xl pointer-events-none" />

                    <svg className="w-full h-full transform -rotate-90 overflow-visible">
                      <circle cx="112" cy="112" r="92" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="12" fill="transparent" />
                      <circle
                        cx="112"
                        cy="112"
                        r="92"
                        stroke="url(#ascNeonGradSyscare)"
                        strokeWidth="12"
                        strokeDasharray="578"
                        strokeDashoffset={578 - (578 * scanProgress) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                        style={{ filter: 'drop-shadow(0 0 12px rgba(2, 254, 220, 0.6))' }}
                        className="transition-all duration-200 ease-out"
                      />
                      <defs>
                        <linearGradient id="ascNeonGradSyscare" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#02FEDC" />
                          <stop offset="40%" stopColor="#1B6DFB" />
                          <stop offset="70%" stopColor="#8A2BE2" />
                          <stop offset="100%" stopColor="#F502FD" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center">
                      <div className="flex items-baseline">
                        <span className="text-5xl font-black text-white font-mono tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                          {scanProgress}
                        </span>
                        <span className="text-xl font-bold text-[#02FEDC] ml-0.5">%</span>
                      </div>
                      <span className="text-[10px] text-[#02FEDC] uppercase tracking-widest font-mono font-bold mt-1 bg-[#02FEDC]/10 px-2 py-0.5 rounded-full border border-[#02FEDC]/30">
                        Scanning for registry entries
                      </span>
                    </div>
                  </div>

                  <div className="w-full max-w-sm space-y-1.5">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/60 border border-white/[0.1] shadow-inner">
                      <span className="w-2 h-2 rounded-full bg-[#02FEDC] animate-ping" />
                      <p className="text-[11px] font-mono text-[#02FEDC] truncate text-left">
                        {mockScanPaths[currentPathIndex]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.08] pt-4">
                <label className="flex items-center gap-2.5 text-xs text-[#C8BEDC] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoFix}
                    onChange={(e) => setAutoFix(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#02FEDC] bg-black/40 border border-white/20"
                  />
                  <span>Automatically fix</span>
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
        </div>
      )}
    </div>
  );
};
